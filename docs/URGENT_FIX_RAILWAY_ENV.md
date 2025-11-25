# 🚨 URGENT: Railway Environment Variable Fix

**Issue:** Application crashes at runtime - DATABASE_URL not found
**Status:** ⚠️ REQUIRES IMMEDIATE ACTION FROM TRAVIS
**Date:** November 2, 2025

---

## ❌ **Current Problem**

The application deployed successfully but crashes immediately because:
- PostgreSQL database exists in Railway ✅
- But the **web service** doesn't have the DATABASE_URL environment variable ❌
- Prisma can't connect to the database
- Application crashes on startup

**Error:**
```
Error: Environment variable not found: DATABASE_URL
```

---

## ✅ **IMMEDIATE FIX - Travis Action Required**

### Step 1: Login to Railway Dashboard
1. Go to https://railway.app
2. Login with your account
3. Open the `localbusinessdirectory` project

### Step 2: Verify Services
You should see TWO services:
- 📦 **Web Service** (Next.js app)
- 🗄️ **PostgreSQL** (Database)

### Step 3: Add DATABASE_URL to Web Service

**Click on the Web Service (not PostgreSQL):**

1. Click on the **Web Service** card
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add the following:

**Variable Name:**
```
DATABASE_URL
```

**Variable Value (OPTION A - Recommended):**
```
${{Postgres.DATABASE_URL}}
```

This references the PostgreSQL service automatically.

**OR Variable Value (OPTION B - Manual):**
If Option A doesn't work, use the connection string from the PostgreSQL service:
```
postgresql://postgres:[YOUR_PASSWORD]@postgres.railway.internal:5432/railway
```

### Step 4: Save and Redeploy

1. Click **"Add Variable"** or **"Save"**
2. Railway will automatically **redeploy** the web service
3. Wait 2-3 minutes for redeployment

---

## 🔍 **How to Get the Correct DATABASE_URL**

If you need to manually copy the DATABASE_URL:

1. Click on the **PostgreSQL service** (not web service)
2. Go to **"Connect"** or **"Variables"** tab
3. Look for **DATABASE_URL** or **DATABASE_PRIVATE_URL**
4. Copy the full connection string
5. It should look like:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/railway
   ```
6. Go back to **Web Service** → **Variables**
7. Add it as DATABASE_URL

---

## ✅ **Verification After Fix**

Once you've added the DATABASE_URL:

1. **Wait 2-3 minutes** for automatic redeployment
2. **Check Deployment Logs:**
   - Click on Web Service
   - Go to "Deployments" tab
   - Click latest deployment
   - Should see:
     ```
     ✓ Prisma schema loaded
     ✓ Database connected
     ✓ Server started
     ```

3. **Visit Staging URL:**
   ```
   https://stunning-perfection-production-1cd6.up.railway.app
   ```
   - Should load successfully ✅
   - Should show "Local Business Directory" page ✅

---

## 🎯 **Complete Environment Variables Checklist**

**Required in Web Service Variables:**

- [ ] `DATABASE_URL` - PostgreSQL connection (MISSING - ADD THIS NOW)
- [ ] `NEXTAUTH_URL` - Should be `https://stunning-perfection-production-1cd6.up.railway.app`
- [ ] `NEXTAUTH_SECRET` - Random secret (already set?)
- [ ] `GOOGLE_CLIENT_ID` - OAuth credential (already set?)
- [ ] `GOOGLE_CLIENT_SECRET` - OAuth credential (already set?)
- [ ] `FACEBOOK_APP_ID` - OAuth credential (already set?)
- [ ] `FACEBOOK_APP_SECRET` - OAuth credential (already set?)

**Optional (can add later):**
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`

---

## 📋 **Why This Happened**

1. PostgreSQL service created ✅
2. PostgreSQL has its own DATABASE_URL ✅
3. **BUT:** Web service needs to be told about it ❌
4. Railway services are isolated by default
5. We must explicitly add DATABASE_URL to the web service
6. This is a one-time configuration step

---

## 🔧 **Alternative: Railway Service Connection**

If the `${{Postgres.DATABASE_URL}}` syntax doesn't work, you can also:

1. In Railway project view, look for a "Connect" option
2. Connect the PostgreSQL service to the Web service
3. Railway should automatically inject DATABASE_URL
4. This creates a service dependency

---

## ⚡ **Quick Reference**

**What Travis needs to do RIGHT NOW:**

```
1. Railway.app → Login
2. Open project: localbusinessdirectory
3. Click: Web Service (NOT PostgreSQL)
4. Click: Variables tab
5. Click: + New Variable
6. Name: DATABASE_URL
7. Value: ${{Postgres.DATABASE_URL}}
8. Click: Add Variable
9. Wait: 2-3 minutes for redeploy
10. Verify: Visit staging URL
```

---

## 📞 **After You Add DATABASE_URL**

**Please confirm in chat:**
- ✅ "Added DATABASE_URL to web service"
- ✅ "Redeployment triggered"
- ✅ "Staging URL loads successfully"

Then we can:
- Mark TASK-001 as complete
- Move to QA/Staging
- Unblock TASK-002, TASK-003, TASK-004

---

## 🎓 **For Team Understanding**

**This is NOT a code issue** - it's a Railway configuration issue.

Railway requires explicit environment variable configuration for each service. Even though we created a PostgreSQL service, the web service needs to be explicitly told how to connect to it.

Think of it like:
- PostgreSQL = "Here's a database"
- Web Service = "I don't know where the database is"
- DATABASE_URL = "Here's how to find it"

---

## 🚀 **What Happens After Fix**

Once DATABASE_URL is added:

1. Railway auto-redeploys ✅
2. Prisma connects to PostgreSQL ✅
3. `prisma db push` creates all 6 tables ✅
4. Next.js server starts ✅
5. Application goes live ✅
6. TASK-001 COMPLETE ✅

---

**Status:** ⏳ WAITING FOR TRAVIS TO ADD DATABASE_URL

**[Flow]** - Ready to verify once environment variable is added
