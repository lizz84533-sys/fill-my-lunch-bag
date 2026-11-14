import type { CapacitorConfig } from '@capacitor/cli';

// The iPhone app has its own screens (in the www folder): log in, see your
// lunches and goal bag, share your QR code, and settings.
// It no longer loads the website. Anything on the website (editing your page,
// terms, buying lunch) opens in Safari.
//
// hostname is set to the website's name so the "Verify you are human" check
// (Cloudflare Turnstile) accepts the app, the same as on the website.
const config: CapacitorConfig = {
  appId: 'com.lizrodriguez.fillmylunchbag',
  appName: 'Fill My Lunch Bag',
  webDir: 'www',
  backgroundColor: '#FAF3E6',
  server: {
    hostname: 'buylunch.netlify.app',
    iosScheme: 'capacitor'
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#FAF3E6'
  },
  plugins: {
    // Tip alerts: when the app is open, the app shows its own "You got a tip!"
    // pop-up (with the crunch), so iPhone only plays the sound here.
    PushNotifications: {
      presentationOptions: ['sound']
    }
  }
};

export default config;
