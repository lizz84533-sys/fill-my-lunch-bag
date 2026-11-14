// Fill My Lunch Bag: "You got a tip!" iPhone alert
//
// A Supabase Database Webhook calls this function every time a new row is added
// to lunch_supporters (a new tip). It looks up the creator's phone(s) in
// lunch_push_tokens and sends an alert through Apple (APNs).
//
// Secrets this function needs (Supabase > Edge Functions > Secrets):
//   APNS_KEY        the whole text of the .p8 key file from Apple (including the BEGIN/END lines)
//   APNS_KEY_ID     the 10-character Key ID of that key
//   APNS_TEAM_ID    your 10-character Apple Team ID
//   PUSH_HOOK_SECRET a made-up password; the webhook sends it so strangers can't call this
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are already there on Supabase.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BUNDLE_ID = "com.lizrodriguez.fillmylunchbag";
const APNS_HOST = "https://api.push.apple.com"; // TestFlight + App Store builds use this one

function b64url(bytes: Uint8Array | string): string {
  const b = typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;
  let s = "";
  b.forEach((x) => (s += String.fromCharCode(x)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

let cachedJwt: { token: string; made: number } | null = null;
async function appleJwt(): Promise<string> {
  // Apple wants a fresh sign-in token at least every hour; reuse one for 40 minutes
  if (cachedJwt && Date.now() - cachedJwt.made < 40 * 60 * 1000) return cachedJwt.token;
  const pem = (Deno.env.get("APNS_KEY") || "").replace(/\\n/g, "\n");
  const body = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const head = b64url(JSON.stringify({ alg: "ES256", kid: Deno.env.get("APNS_KEY_ID") }));
  const claims = b64url(JSON.stringify({ iss: Deno.env.get("APNS_TEAM_ID"), iat: Math.floor(Date.now() / 1000) }));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(head + "." + claims)));
  const token = head + "." + claims + "." + b64url(sig);
  cachedJwt = { token, made: Date.now() };
  return token;
}

function money(n: number): string {
  const v = Math.round((Number(n) || 0) * 100) / 100;
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

Deno.serve(async (req) => {
  if (req.headers.get("x-push-secret") !== Deno.env.get("PUSH_HOOK_SECRET")) {
    return new Response("not allowed", { status: 401 });
  }
  let payload: any;
  try { payload = await req.json(); } catch { return new Response("bad request", { status: 400 }); }
  const tip = payload && payload.record;
  if (!tip || !tip.creator_id) return new Response("no tip", { status: 200 });

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: phones } = await db.from("lunch_push_tokens").select("token").eq("creator_id", tip.creator_id);
  if (!phones || !phones.length) return new Response("no phones", { status: 200 });

  const qty = Number(tip.qty) || 1;
  const who = (tip.name && String(tip.name).trim()) || "Someone";
  const amount = Number(tip.amount) > 0 ? " (+$" + money(tip.amount) + ")" : "";
  const alert = {
    aps: {
      alert: { title: "You got a tip! 🍎", body: who + " tipped you " + qty + (qty === 1 ? " lunch" : " lunches") + amount },
      sound: "default",
    },
  };

  const jwt = await appleJwt();
  const results = await Promise.all(phones.map(async (p: { token: string }) => {
    const r = await fetch(APNS_HOST + "/3/device/" + p.token, {
      method: "POST",
      headers: {
        authorization: "bearer " + jwt,
        "apns-topic": BUNDLE_ID,
        "apns-push-type": "alert",
        "apns-priority": "10",
        "content-type": "application/json",
      },
      body: JSON.stringify(alert),
    });
    let reason = "";
    if (r.status !== 200) { try { reason = (await r.json()).reason || ""; } catch { /* no body */ } }
    // Phone uninstalled the app or the token is old: forget it
    if (r.status === 410 || reason === "BadDeviceToken" || reason === "Unregistered") {
      await db.from("lunch_push_tokens").delete().eq("token", p.token);
    }
    return { status: r.status, reason };
  }));
  console.log("tip-push", tip.creator_id, JSON.stringify(results));
  return new Response(JSON.stringify(results), { status: 200, headers: { "content-type": "application/json" } });
});
