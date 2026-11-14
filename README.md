# Fill My Lunch Bag (iPhone app)

The iPhone app for https://buylunch.netlify.app, built with Capacitor and Codemagic.

The app has its own screens in the `www` folder (it does not load the website):
- **Log in / Sign up** with Apple, Google or email, plus Forgot password, and **Make your page** (name + link) for new creators
- **Lunches**: "Your lunch bag" with your round logo, total tips for 30 days or all time, a big Show my code button, recent supporters, and a pop-up with a buzz and crunch when a new lunch comes in
- **Posts**: your posts; the + in the middle of the bottom bar writes a new one
- **My code**: your scan code for tipping in person, plus Share and Copy link
- **Messages**: supporter notes with search, Unread and Hidden filters, and Hide / Block / Report on each message
- **Your photo (top left)** opens Account: Edit my page (photo, name, tagline, bio, price, goal, thank-you, weekly), See my page, crunch sound, help, terms, delete account, log out

Buying lunch and connecting a bank (Stripe) happen on the website.
Changing the website does NOT change the app. To change the app, edit `www/index.html` and start a new build in Codemagic.
