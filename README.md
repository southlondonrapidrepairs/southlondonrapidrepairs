# South London Rapid Repairs – static website

## Setup
1. Drop the folder on any static host (Netlify, GitHub Pages, Firebase Hosting, etc.).
2. Put your `logo.png` inside `assets/` (200×60 px works best).
3. Edit `js/lead-capture.js` – swap the `alert()` for real EmailJS / Zapier / backend code.
4. Replace phone number and email in HTML files if they ever change.

## Customise
- Colours: edit `:root` variables in `css/main.css`.
- Copy: change text directly in HTML files.
- Add new service page: duplicate `emergency-roofing.html`, rename, tweak content.

## SEO & tracking
- Meta titles/descriptions are already unique per page.
- Add your GA4 / Facebook-Pixel scripts before the closing `&lt;/head&gt;` on each page.
- Connect to Google Search Console & Google Business Profile.

Done — entire site is editable with any code editor (VS Code, Sublime, etc.).