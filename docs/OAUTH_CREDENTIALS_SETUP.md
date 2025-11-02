# OAuth Credentials Setup Guide

This guide walks you through obtaining OAuth credentials for Google and Facebook authentication.

---

## Environment Variables Summary

Add these to **Railway Dashboard** → Your Project → Variables:

```bash
NEXTAUTH_SECRET=osvukHDz1Kkg60jbCd4p7A/eOBqbvLLJbEAfe3T0l8s=
NEXTAUTH_URL=https://stunning-perfection-production-1cd6.up.railway.app

# Google OAuth (get from steps below)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Facebook OAuth (get from steps below)
FACEBOOK_APP_ID=<your-facebook-app-id>
FACEBOOK_APP_SECRET=<your-facebook-app-secret>
```

---

## Part 1: Google OAuth Credentials

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create a New Project (or select existing)
1. Click the project dropdown (top left, next to "Google Cloud")
2. Click **"NEW PROJECT"**
3. Enter project name: `Local Business Directory`
4. Click **"CREATE"**
5. Wait for project creation (~30 seconds)
6. Select your new project from the dropdown

### Step 3: Enable Google+ API
1. In the search bar, type: **"Google+ API"** or **"People API"**
2. Click on **"Google+ API"** or **"Google People API"**
3. Click **"ENABLE"**
4. Wait for API to be enabled

### Step 4: Configure OAuth Consent Screen
1. In left sidebar, navigate to: **APIs & Services** → **OAuth consent screen**
2. Select **"External"** user type
3. Click **"CREATE"**

**Fill in the form:**
- **App name:** `Local Business Directory`
- **User support email:** Your email address
- **App logo:** (Optional - skip for now)
- **App domain:**
  - Application home page: `https://stunning-perfection-production-1cd6.up.railway.app`
  - Privacy policy: `https://stunning-perfection-production-1cd6.up.railway.app/privacy`
  - Terms of service: `https://stunning-perfection-production-1cd6.up.railway.app/terms` (optional)
- **Authorized domains:** `up.railway.app`
- **Developer contact email:** Your email address
4. Click **"SAVE AND CONTINUE"**

**Scopes:**
5. Click **"ADD OR REMOVE SCOPES"**
6. Select these scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
7. Click **"UPDATE"**
8. Click **"SAVE AND CONTINUE"**

**Test users:**
9. Click **"ADD USERS"**
10. Add your email address (for testing)
11. Click **"ADD"**
12. Click **"SAVE AND CONTINUE"**
13. Review and click **"BACK TO DASHBOARD"**

### Step 5: Create OAuth Credentials
1. In left sidebar: **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** (top of page)
3. Select **"OAuth client ID"**
4. **Application type:** Web application
5. **Name:** `Local Business Directory Web Client`

**Authorized JavaScript origins:**
6. Click **"+ ADD URI"**
7. Add: `https://stunning-perfection-production-1cd6.up.railway.app`
8. Click **"+ ADD URI"**
9. Add: `http://localhost:3000` (for local testing)

**Authorized redirect URIs:**
10. Click **"+ ADD URI"**
11. Add: `https://stunning-perfection-production-1cd6.up.railway.app/api/auth/callback/google`
12. Click **"+ ADD URI"**
13. Add: `http://localhost:3000/api/auth/callback/google` (for local testing)

14. Click **"CREATE"**

### Step 6: Copy Credentials
1. A popup will appear with your credentials
2. **Copy the Client ID** → Save as `GOOGLE_CLIENT_ID`
3. **Copy the Client Secret** → Save as `GOOGLE_CLIENT_SECRET`
4. Click **"OK"**

✅ **Google OAuth Setup Complete!**

---

## Part 2: Facebook OAuth Credentials

### Step 1: Go to Meta for Developers
Visit: https://developers.facebook.com/

### Step 2: Create a Developer Account (if needed)
1. Click **"Get Started"** (top right)
2. Follow prompts to verify your Facebook account
3. Accept terms and conditions

### Step 3: Create a New App
1. Click **"My Apps"** (top right)
2. Click **"Create App"**
3. Select use case: **"Authenticate and request data from users with Facebook Login"**
4. Click **"Next"**

**App Details:**
- **App name:** `Local Business Directory`
- **App contact email:** Your email address
- **Business account:** (Optional - can skip)
5. Click **"Create app"**
6. Complete security check if prompted

### Step 4: Set Up Facebook Login
1. In your app dashboard, find **"Facebook Login"** product
2. Click **"Set Up"** on Facebook Login
3. Select platform: **"Web"**
4. Enter Site URL: `https://stunning-perfection-production-1cd6.up.railway.app`
5. Click **"Save"**
6. Click **"Continue"**
7. You can skip the quickstart steps

### Step 5: Configure Facebook Login Settings
1. In left sidebar: **Products** → **Facebook Login** → **Settings**

**Valid OAuth Redirect URIs:**
2. Add these URIs (one per line):
```
https://stunning-perfection-production-1cd6.up.railway.app/api/auth/callback/facebook
http://localhost:3000/api/auth/callback/facebook
```
3. Click **"Save Changes"**

### Step 6: Get Your App Credentials
1. In left sidebar, click **Settings** → **Basic**
2. **App ID** → Copy this as `FACEBOOK_APP_ID`
3. **App Secret** → Click **"Show"**, enter password, copy as `FACEBOOK_APP_SECRET`

### Step 7: Configure App Domains
1. Still in **Settings** → **Basic**
2. Scroll to **App Domains**
3. Add: `up.railway.app`
4. Add: `localhost` (for local testing)
5. Click **"Save Changes"**

### Step 8: Make App Live (Important!)
1. At top of page, you'll see **"App Mode: Development"**
2. Toggle the switch to make it **"Live"**
3. If prompted, complete any required steps:
   - Add privacy policy URL: `https://stunning-perfection-production-1cd6.up.railway.app/privacy`
   - Add terms of service URL (if required)
   - Select a category: `Business and Pages`
4. Confirm and make app live

✅ **Facebook OAuth Setup Complete!**

---

## Part 3: Add Credentials to Railway

### Method 1: Railway Dashboard (Recommended)
1. Go to: https://railway.app/
2. Navigate to your project: **Local Business Directory**
3. Click on your **Web Service** (not the PostgreSQL)
4. Click **"Variables"** tab
5. Click **"+ New Variable"**
6. Add each variable:

```bash
NEXTAUTH_SECRET=osvukHDz1Kkg60jbCd4p7A/eOBqbvLLJbEAfe3T0l8s=
NEXTAUTH_URL=https://stunning-perfection-production-1cd6.up.railway.app
GOOGLE_CLIENT_ID=<paste-your-google-client-id>
GOOGLE_CLIENT_SECRET=<paste-your-google-client-secret>
FACEBOOK_APP_ID=<paste-your-facebook-app-id>
FACEBOOK_APP_SECRET=<paste-your-facebook-app-secret>
```

7. Railway will automatically redeploy after adding variables

### Method 2: Railway CLI
```bash
railway variables set NEXTAUTH_SECRET="osvukHDz1Kkg60jbCd4p7A/eOBqbvLLJbEAfe3T0l8s="
railway variables set NEXTAUTH_URL="https://stunning-perfection-production-1cd6.up.railway.app"
railway variables set GOOGLE_CLIENT_ID="<your-value>"
railway variables set GOOGLE_CLIENT_SECRET="<your-value>"
railway variables set FACEBOOK_APP_ID="<your-value>"
railway variables set FACEBOOK_APP_SECRET="<your-value>"
```

---

## Part 4: Local Development Setup

For local testing, create `.env.local` file:

```bash
# Database
DATABASE_URL="<your-railway-postgres-connection-string>"

# NextAuth
NEXTAUTH_SECRET="osvukHDz1Kkg60jbCd4p7A/eOBqbvLLJbEAfe3T0l8s="
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"

# Facebook OAuth
FACEBOOK_APP_ID="<your-facebook-app-id>"
FACEBOOK_APP_SECRET="<your-facebook-app-secret>"
```

⚠️ **IMPORTANT:** Never commit `.env.local` to Git!

---

## Part 5: Verify Setup

### Test Authentication Endpoints:

**1. Check Providers Available:**
```bash
curl https://stunning-perfection-production-1cd6.up.railway.app/api/auth/providers
```

**Expected Response:**
```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "...",
    "callbackUrl": "..."
  },
  "facebook": {
    "id": "facebook",
    "name": "Facebook",
    "type": "oauth",
    "signinUrl": "...",
    "callbackUrl": "..."
  },
  "credentials": {
    "id": "credentials",
    "name": "credentials",
    "type": "credentials",
    "signinUrl": "...",
    "callbackUrl": "..."
  }
}
```

**2. Test Sign-In Page:**
Visit: `https://stunning-perfection-production-1cd6.up.railway.app/api/auth/signin`

You should see buttons for:
- Sign in with Google
- Sign in with Facebook
- Sign in with Email/Password

---

## Troubleshooting

### Google OAuth Not Working:
- Verify redirect URI exactly matches: `/api/auth/callback/google`
- Check OAuth consent screen is configured
- Ensure Google+ API or People API is enabled
- For testing, add your email to "Test users"

### Facebook OAuth Not Working:
- Verify app is in **"Live"** mode (not Development)
- Check redirect URI exactly matches: `/api/auth/callback/facebook`
- Ensure Facebook Login product is added
- Verify app domains include `up.railway.app`

### Railway Deployment Issues:
- Check deployment logs for errors
- Verify all environment variables are set
- Ensure DATABASE_URL is connected
- Run `npx prisma db push` if database schema not updated

---

## Security Checklist

- [x] NEXTAUTH_SECRET is 32+ characters
- [x] NEXTAUTH_URL uses HTTPS (not HTTP) in production
- [x] OAuth secrets never committed to Git
- [x] Railway environment variables encrypted
- [x] Redirect URIs use HTTPS in production
- [x] OAuth apps set to production/live mode

---

## Next Steps

Once all credentials are added to Railway:

1. ✅ Verify deployment succeeded
2. ✅ Test `/api/auth/providers` endpoint
3. ✅ Notify [Verity] to begin QA testing
4. ✅ Execute test plan: `/docs/TASK-002_QA_TEST_PLAN.md`

---

**Questions?** Contact [Codey] (TPM) or check Railway deployment logs.
