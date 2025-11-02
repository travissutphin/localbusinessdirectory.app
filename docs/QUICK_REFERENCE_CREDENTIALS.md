# Quick Reference: TASK-002 Credentials

## ✅ Ready to Use (Copy & Paste)

### NEXTAUTH_SECRET
```
osvukHDz1Kkg60jbCd4p7A/eOBqbvLLJbEAfe3T0l8s=
```

### NEXTAUTH_URL (Production)
```
https://stunning-perfection-production-1cd6.up.railway.app
```

---

## ⏳ Need to Obtain (Follow Guide)

### Google OAuth Credentials
📖 **Follow:** `/docs/OAUTH_CREDENTIALS_SETUP.md` → Part 1

**Quick Link:** https://console.cloud.google.com/

**What you'll get:**
- `GOOGLE_CLIENT_ID` (format: `xxxxx.apps.googleusercontent.com`)
- `GOOGLE_CLIENT_SECRET` (format: `GOCSPX-xxxxx`)

**Time:** ~10 minutes

---

### Facebook OAuth Credentials
📖 **Follow:** `/docs/OAUTH_CREDENTIALS_SETUP.md` → Part 2

**Quick Link:** https://developers.facebook.com/

**What you'll get:**
- `FACEBOOK_APP_ID` (numeric ID)
- `FACEBOOK_APP_SECRET` (alphanumeric string)

**Time:** ~10 minutes

---

## Railway Dashboard Setup

Once you have all credentials:

1. Go to: https://railway.app/
2. Select project: **Local Business Directory**
3. Click: **Web Service** (not PostgreSQL)
4. Click: **Variables** tab
5. Add these variables:

```bash
NEXTAUTH_SECRET=osvukHDz1Kkg60jbCd4p7A/eOBqbvLLJbEAfe3T0l8s=
NEXTAUTH_URL=https://stunning-perfection-production-1cd6.up.railway.app
GOOGLE_CLIENT_ID=<paste-from-google-console>
GOOGLE_CLIENT_SECRET=<paste-from-google-console>
FACEBOOK_APP_ID=<paste-from-facebook>
FACEBOOK_APP_SECRET=<paste-from-facebook>
```

6. Save and wait for automatic redeployment (~2 minutes)

---

## Verification

After deployment, test:

```bash
curl https://stunning-perfection-production-1cd6.up.railway.app/api/auth/providers
```

**Expected:** Should return JSON with `google`, `facebook`, and `credentials` providers

✅ **Success!** Ready for [Verity] to begin QA testing

---

## Troubleshooting

**Problem:** Google OAuth not working
- ✅ Check redirect URI: `.../api/auth/callback/google`
- ✅ Verify OAuth consent screen configured
- ✅ Enable Google+ API or People API

**Problem:** Facebook OAuth not working
- ✅ App must be in **Live** mode (not Development)
- ✅ Check redirect URI: `.../api/auth/callback/facebook`
- ✅ Verify app domains include `up.railway.app`

**Problem:** Railway deployment failed
- ✅ Check deployment logs
- ✅ Verify all variables set correctly
- ✅ Ensure no typos in variable names

---

**Need Help?** See full guide: `/docs/OAUTH_CREDENTIALS_SETUP.md`
