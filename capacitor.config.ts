import type { CapacitorConfig } from '@capacitor/cli';

// The iPhone app opens the live Fill My Lunch Bag website.
// Any Stripe page (checkout, bank setup, weekly lunch settings) opens in Safari,
// because only buylunch.netlify.app is allowed to stay inside the app.
const config: CapacitorConfig = {
  appId: 'com.lizrodriguez.fillmylunchbag',
  appName: 'Fill My Lunch Bag',
  webDir: 'www',
  appendUserAgent: 'FillMyLunchBagApp',
  backgroundColor: '#FAF3E6',
  server: {
    url: 'https://buylunch.netlify.app',
    cleartext: false
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#FAF3E6'
  }
};

export default config;
