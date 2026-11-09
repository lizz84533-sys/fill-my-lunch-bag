# Fill My Lunch Bag (iPhone app)

The iPhone app for https://buylunch.netlify.app, built with Capacitor and Codemagic.

The app has its own screens in the `www` folder (it does not load the website):
- **Log in** with email and password
- **Lunches**: fill-the-bag goal, last 30 days and all-time totals, who bought you lunch, and a pop-up with a buzz and crunch when a new lunch comes in
- **Posts**: write a post for your supporters, see and delete your posts
- **Messages**: notes supporters left with their lunch, with search, an Unread filter and a red badge
- **Share**: your QR code and link
- **Settings**: edit my page inside the app (photo, name, tagline, about, price, goal, thank-you message, weekly lunches), terms, help, log out, delete account

Buying lunch, sign-up and connecting a bank (Stripe) happen on the website.
Changing the website does NOT change the app. To change the app, edit `www/index.html` and start a new build in Codemagic.
