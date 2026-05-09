# 🔥 Firebase Admin Panel Setup

This guide walks you through activating the admin panel at `https://mamun441998.github.io/admin/`.

**Time required:** ~10 minutes
**Cost:** Free (Firebase free tier covers ~50,000 reads/day, 20,000 writes/day)

---

## Step 1 — Create your Firebase project

1. Go to **https://console.firebase.google.com/**
2. Click **"Add project"**
3. Name it something like `mamunur-portfolio` (any name works)
4. **Disable Google Analytics** when asked (not needed for this).
5. Click **Create project**, wait ~30 seconds, click **Continue**

---

## Step 2 — Register a Web App

1. On the project home page, click the **`</>`** (Web) icon
2. Nickname: `Portfolio Web`
3. **Do NOT** check "Set up Firebase Hosting" (we use GitHub Pages)
4. Click **Register app**
5. You'll see a code block that looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "mamunur-portfolio.firebaseapp.com",
  projectId: "mamunur-portfolio",
  storageBucket: "mamunur-portfolio.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123..."
};
```

6. **Copy these values.** Open `admin/firebase-config.js` and paste them in.
7. Click **Continue to console**

---

## Step 3 — Enable Authentication

1. In the left sidebar, click **Build → Authentication**
2. Click **Get started**
3. Choose **Email/Password** → toggle ON **Email/Password** (first option)
4. Click **Save**

### Add yourself as the admin user
5. Go to the **Users** tab → click **Add user**
6. Email: `mamun441998@gmail.com` (must match `ADMIN_EMAIL` in firebase-config.js)
7. Password: Set a strong password (at least 8 characters)
8. Click **Add user**

✅ You can now log in at `/admin/login.html` with these credentials.

---

## Step 4 — Enable Firestore Database

1. Sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll set rules in step 5)
4. Pick a location (default `us-central` is fine, or `asia-south1` for Bangladesh — closer = faster)
5. Click **Enable**

---

## Step 5 — Configure Firestore Security Rules ⚠️ IMPORTANT

This is the **MOST IMPORTANT** step. Without proper rules, anyone could edit your portfolio.

1. In Firestore, click the **Rules** tab
2. Replace the entire content with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 'site/content' = public read, only admin can write
    match /site/content {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == "mamun441998@gmail.com"
                   && request.auth.token.email_verified == true;
    }

    // Lock everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

> **What this does:**
> - Anyone (visitors) can READ your site content (so the homepage can fetch it)
> - Only the user logged in as `mamun441998@gmail.com` can WRITE changes
> - Email must be verified (Firebase auto-verifies on password reset, or you can verify manually)

### ✅ Verify your email
After your first login, Firebase may not consider your email "verified".
- Open the admin → click **Forgot password** → request a reset
- Check your inbox → click the reset link → set a new password
- This auto-verifies your email

OR in Firebase Console → Authentication → Users → click the menu next to your user → **Send email verification**

---

## Step 6 — Authorize the GitHub Pages domain

By default, Firebase only allows requests from `localhost`. We need to add your live domain.

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain**
3. Add: `mamun441998.github.io`
4. (Optional) If you ever buy a custom domain, add it too.

---

## Step 7 — Customize email templates (optional but nice)

1. Authentication → **Templates** tab
2. Click **Password reset**
3. Customize the sender name to `Mamunur Rashid Admin` (or whatever you like)
4. Save

---

## Step 8 — Push to GitHub & test

```powershell
git add .
git commit -m "Add Firebase admin panel"
git push
```

Wait ~1 minute, then test:
- 🌐 Visit `https://mamun441998.github.io/admin/login.html`
- 🔐 Log in with `mamun441998@gmail.com` and your password
- ✏️ Edit any field on the dashboard
- 💾 Click **Save all changes**
- 🔄 Visit `https://mamun441998.github.io/` — your changes should appear after ~5 seconds

### Test password reset
- On login page, click **Forgot password?**
- Enter `mamun441998@gmail.com`
- Check inbox → reset link arrives within ~1 minute (also check Spam)

---

## 🎯 What the admin panel can edit

| Section | What you can change |
|---------|---------------------|
| **Hero** | Badge text, title, subtitle, skills line, all 4 stats (value + label) |
| **About** | Section label, title, both paragraphs, profile image URL, 3 highlight items |
| **Services** | Add/edit/delete service cards (title, description, features) |
| **Portfolio** | Add/edit/delete projects (title, category, image URL, descriptions, features, results) |
| **Why Me** | Section text + 3 reason cards (each with title, description, points) |
| **Contact** | Email, phone, location, all social media URLs |

---

## 🖼️ How to upload images

The admin panel uses **image URLs**, not file uploads (keeps things simple and free). You have 3 free options:

### Option A: ImgBB (easiest)
1. Go to https://imgbb.com/ → upload your image → copy the **direct link**
2. Paste into the project's "Image URL" field

### Option B: Cloudinary (best quality, free tier)
1. Sign up at https://cloudinary.com/ (free)
2. Upload via their dashboard → copy the URL
3. Paste in admin

### Option C: GitHub repo
1. Drop image into your repo (e.g., `images/project1.jpg`)
2. After push, use URL: `https://mamun441998.github.io/images/project1.jpg`

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| "Firebase init failed" on login | Check `admin/firebase-config.js` values match Firebase console |
| Can log in but "Save failed" | Firestore Rules not set correctly. Re-paste the rules from Step 5 and **Publish**. |
| Reset email not arriving | Check Spam. If still missing, in Firebase Console → Authentication → Templates → make sure Password reset is enabled. |
| "Permission denied" when editing | Email may not be verified. Use Forgot Password flow to verify, or manually verify in Firebase console. |
| Changes not showing on live site | Hard refresh browser (Ctrl+Shift+R). Firestore data caches briefly. |

---

## 🔒 Security notes

- Your Firebase config values (`apiKey`, etc.) are **safe to expose publicly**. Firebase keys are not secrets — security comes from Firestore Rules.
- The admin panel is at `/admin/`. Anyone can VIEW the URL, but only `mamun441998@gmail.com` can log in.
- Rate limiting is built into Firebase Auth (after 5 failed logins it blocks attempts for 1 hour).
- Robots.txt blocks the `/admin/` folder from being indexed by Google.

---

## 💡 Future enhancements

When you're ready to grow:
- Connect a custom domain (`mamunurrashid.com`) — Firebase Auth supports it
- Add direct image upload via Firebase Storage (paid above 5 GB free)
- Add multiple admin users (just add them to Firestore rules)
- Add draft/publish workflow (currently saves are instant/live)
- Add Google Analytics 4 to track admin sessions
