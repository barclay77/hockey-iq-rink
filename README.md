# Hockey IQ Rink

An interactive hockey situations trainer for a Squirt / U10 player. Ten situations,
nineteen variations, spoken coaching, a quiz, and a play builder.

---

## Read this first: do not open the HTML file from the Files app

If you download `index.html` to a phone and tap it, iOS opens it in a **preview
window** (the Files app, or a mail or chat preview). Those previews do not run the
app - you get the title and a couple of buttons and nothing responds. The app now
detects that and tells you so on screen.

Two ways to run it properly:

- **Best:** publish it (section 2 below) and open the web address in **Safari** or
  **Chrome**, then add it to your Home Screen.
- Quick check: from the Files app tap **Share** and choose **Open in Safari**.

---

## The short answer: no package, no build step

This is one self-contained HTML file. Plain HTML, CSS and JavaScript - no npm, no
React, no bundler, no server code. Nothing to compile and nothing to install.

- `index.html` - the whole app
- `manifest.webmanifest` - lets phones and tablets install it to the home screen
- `sw.js` - service worker, so it works with no signal
- `icons/` - app icons

You only need extra tooling if you decide to put it in the Apple App Store or
Google Play. That is section 5.

---

## 1. Run it right now

**On a computer:** double-click `index.html`. Done.

**On a phone or tablet, on your own network:** from this folder run

```bash
python3 -m http.server 8000
```

then open `http://<your-computer-ip>:8000` on the device. Good enough for testing,
but home-screen install and offline mode need HTTPS, so for real use put it online.

---

## 2. Put it in a repo and publish it (this is what you want)

This folder is a complete, ready-to-push repo. It already contains
`.github/workflows/pages.yml`, so GitHub publishes it for you on every push.

1. On GitHub click **New repository**. Name it `hockey-iq-rink`. It can be public
   or private, but **GitHub Pages needs a public repo on the free plan**.
2. Upload these files to the repo root. Either drag them into the web uploader
   (**Add file** > **Upload files**, then drag the whole folder in), or from a
   terminal in this folder:

   ```bash
   git init -b main
   git add .
   git commit -m "Hockey IQ Rink"
   git remote add origin https://github.com/<your-username>/hockey-iq-rink.git
   git push -u origin main
   ```

3. In the repo go to **Settings** > **Pages**. Under *Build and deployment*, set
   **Source** to **GitHub Actions**. Save.
4. Watch the **Actions** tab. When the run goes green, your address is

   ```
   https://<your-username>.github.io/hockey-iq-rink/
   ```

5. Open that address on the iPad or phone and follow section 3 to install it.

From then on, any change you push republishes itself in about a minute. Remember to
bump the `CACHE` name in `sw.js` when you change files (section 7), or devices keep
serving the copy they cached.

### What each file is for

| File | Why it is there |
|---|---|
| `index.html` | the entire app |
| `manifest.webmanifest` | makes it installable to the Home Screen |
| `sw.js` | offline cache |
| `icons/` | the app icon at the sizes iOS and Android want |
| `.nojekyll` | stops GitHub Pages from post-processing the files |
| `.github/workflows/pages.yml` | publishes on push |

---

## 2b. Other free hosts (drag and drop, no git)

Any static host works. **Cloudflare Pages** has the most generous free tier for
this kind of app - static file requests are unlimited and there is no bandwidth
charge.

### Cloudflare Pages (recommended)

1. Sign in at `dash.cloudflare.com` and go to **Workers & Pages** > **Create** >
   **Pages** > **Upload assets**.
2. Drag this whole folder in. Name the project, hit **Deploy**.
3. You get a URL like `https://hockey-iq.pages.dev`. That is your app.

### Netlify or Vercel

Both work by dragging the folder into their dashboard. Two cautions: Netlify's free
tier is now credit-based (300 credits a month, and deploys and traffic share the
pool), and Vercel's Hobby plan is **personal, non-commercial use only** per their
terms - fine for your kid's team, not for selling.

HTTPS is automatic on all of these. That matters: the service worker and home-screen
install only work over HTTPS.

---

## 3. Install it on each device

Once it is at a URL:

**iPad and iPhone** - open the link in **Safari**, tap **Share** (the square with
the up arrow), scroll down, tap **Add to Home Screen**. It then launches full
screen with its own icon and works offline. It has to be Safari for the install
itself; after that it runs on its own.

**Android** - open in **Chrome**. It will offer **Install**, or use the three-dot
menu > **Add to Home screen**. The app also shows an **Install on this device**
button on its own menu screen when Android offers it.

**Any computer** - Chrome and Edge show an install icon in the address bar.

There is no app store, no sign-up, and no download. The app remembers the voice
choice and any plays you build, per device.

---

## 4. Share it

Send the link. That is the whole distribution story, and it is the reason to start
here rather than with the app stores.

If you want the plays you built to travel with it, open **Settings** >
**Save my plays to a file** and send that `hockey-plays.json` alongside; the other
person uses **Load plays from a file**. Do this anyway as a backup - phones clear
browser storage when they run low on space, and built plays live in that storage.

---

## 5. If you really want it in the App Store and Google Play

The package you asked about is **Capacitor**. It wraps this exact folder in a
native shell. Current major version is 8.

```bash
# in a folder containing package.json and this app inside www/
npm init -y
mkdir www && cp -r index.html manifest.webmanifest sw.js icons www/

npm i @capacitor/core
npm i -D @capacitor/cli
npx cap init            # app name, bundle id, and set webDir to "www"

npm i @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios

npx cap sync            # run this after every change to the web files
npx cap open ios        # opens Xcode
npx cap open android    # opens Android Studio
```

**What you need on the machine**

- Node.js 22 or newer.
- **iOS: a Mac with Xcode 26 or newer.** There is no way around the Mac.
- Android: Android Studio 2025.2.1 or newer. Any OS.
- If you keep the microphone feature, add `NSSpeechRecognitionUsageDescription`
  and `NSMicrophoneUsageDescription` to the iOS `Info.plist`, or dictation will
  fail silently inside the native web view.

**What it costs**

- Apple Developer Program: **99 USD per year**.
- Google Play: **25 USD one time**, plus identity verification with a government
  ID and a credit card in your own name.

**Read this before you spend the money.** Two real obstacles:

1. **Apple review guideline 4.2** says an app must be more than a repackaged
   website, and 4.2.2 explicitly calls out "web clippings". A thin wrapper around
   a web page is the classic rejection. Odds improve a lot if the app uses real
   native capability rather than just displaying the page.
2. **Google Play**, for personal developer accounts created after November 2023,
   requires a closed test with **at least 12 testers opted in continuously for 14
   days** before you can apply for production access. A solo developer on a new
   personal account is realistically three or more weeks and twelve real humans
   away from a public listing.

There is a middle option: **PWABuilder** (`pwabuilder.com`) takes a hosted PWA URL
and generates a packaged Android app (a Trusted Web Activity) and an Xcode project.
Android through this route is well trodden; their iOS path is labelled
experimental with no promise of App Store approval. If you go the Android TWA way
you must publish `assetlinks.json` at `/.well-known/assetlinks.json` on your
domain and update it with the signing key Play gives you, or the app shows a
browser address bar or crashes.

**Honest recommendation:** ship the hosted version and send people the link. Only
reach for Capacitor if you hit one of the specific limits below.

---

## 6. Platform limits worth knowing

These are properties of the browsers, not of this app.

- **Voices on iPhone and iPad.** iOS only exposes its basic voices to web pages.
  The good Siri and Enhanced voices are not available to any website. The
  narration will sound noticeably better on Android, and best in Microsoft Edge on
  a computer, which has free neural "Natural" voices. A native build could use
  the system voices directly. This is the single biggest reason to consider
  Capacitor.
- **The iPhone mute switch silences speech** with no error. If a kid hears
  nothing, check the side switch first.
- **Dictation** (the microphone on the coach prompt) is the least reliable piece
  on mobile. Safari on iOS is known to return one result and then go quiet, so the
  app watches for that and closes the recording itself. Chrome on Android ignores
  continuous mode entirely. Audio is sent to a server for recognition on both, so
  it does not work offline. Typing always works.
- **Storage can be evicted.** iOS clears site storage under space pressure or long
  disuse. The app asks for persistent storage, but the browser can say no. Export
  your plays if they matter.
- **No orientation lock and no true full screen on iOS.** Home-screen web apps run
  in "standalone", which keeps the status bar, and Safari does not honour an
  orientation lock. The layout handles portrait and landscape either way. If you
  need a forced orientation, that requires a native build.
- **No install prompt on iOS.** You have to tell people about Share > Add to Home
  Screen; iOS gives no automatic banner.

---

## 7. Changing it later

Everything is in `index.html`. The situation data, coaching text and video links
are in the first `<script>` block; the rink engine is in the second; the coach
prompt and play builder are in the third.

After you change any file, **bump the `CACHE` name at the top of `sw.js`**
(`hockey-iq-v1` to `hockey-iq-v2` and so on) and redeploy. Otherwise devices keep
serving the copy they already cached.
