# Fill My Lunch Bag (iPhone app)

The iPhone app for https://buylunch.netlify.app, built with Capacitor and Codemagic.

The app has its own screens in the `www` folder (it does not load the website):
- **Log in** with email and password
- **Lunches**: fill-the-bag goal, last 30 days and all-time totals, who bought you lunch, and a pop-up with a buzz and crunch when a new lunch comes in
- **Share**: your QR code and link
- **Settings**: edit page (opens website), terms, help, log out, delete account

Buying lunch, sign-up and editing your page happen on the website.
Changing the website does NOT change the app. To change the app, edit `www/index.html` and start a new build in Codemagic.
