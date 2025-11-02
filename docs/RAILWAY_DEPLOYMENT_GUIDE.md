# Railway Deployment Guide

## TASK-001: Setup Railway deployment & PostgreSQL

This guide walks through deploying the Local Business Directory application to Railway.com.

## Prerequisites

- GitHub account with repository access
- Railway.com account (sign up at https://railway.app)
- OAuth credentials (Google & Facebook)

## Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `localbusinessdirectory.app` repository
6. Railway will automatically detect Next.js and configure build settings

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically provision a PostgreSQL instance
3. Copy the `DATABASE_URL` connection string from the PostgreSQL service
4. The format will be: `postgresql://user:password@host:port/database`

## Step 3: Configure Environment Variables

In your Railway project settings, add the following environment variables:

### Required Immediately

```
DATABASE_URL=<from-postgresql-service>
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=<generate-using-command-below>
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### OAuth Credentials (Required for TASK-002)

**Note:** Credentials are configured in Railway. Contact Travis for access.

```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FACEBOOK_APP_ID=<your-facebook-app-id>
FACEBOOK_APP_SECRET=<your-facebook-app-secret>
```

### Optional (Can add later)

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
IPAPI_KEY=<your-ipapi-key>
```

## Step 4: Configure Build Settings

Railway should auto-detect these, but verify:

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm run start
```

**Root Directory:** `/` (root of repository)

**Node Version:** 20.x (should be auto-detected)

## Step 5: Run Database Migrations

After first deployment, you need to run Prisma migrations:

1. In Railway, go to your project
2. Open the service settings
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Open the "Deploy Logs"
6. You should see the build process

To run migrations manually via Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

Alternatively, add this to your `package.json` build script:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

## Step 6: Verify Deployment

1. Check the deployment logs for any errors
2. Visit your Railway URL (found in project settings)
3. You should see the placeholder home page
4. Verify no console errors in browser DevTools

## Step 7: Get Staging URL

1. In Railway project settings, find your public URL
2. It will be in format: `https://your-project-name.railway.app`
3. Share this URL with the team

## Step 8: Setup Custom Domain (Optional)

1. In Railway project settings, go to "Settings" → "Domains"
2. Add your custom domain: `localbusinessdirectory.app`
3. Update DNS records as shown in Railway
4. Update `NEXTAUTH_URL` environment variable to match custom domain

## Auto-Deployment

Railway automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "feat: initial setup"
git push origin main
```

Railway will:
1. Detect the push
2. Pull latest code
3. Run `npm install`
4. Run `npm run build`
5. Deploy the new version
6. Automatically migrate traffic

## Monitoring

**View Logs:**
- Go to Railway project → Select service → "Deployments" → Click deployment → "Deploy Logs"

**View Metrics:**
- Railway provides CPU, Memory, and Network usage graphs
- Found in service settings → "Metrics"

**Database Access:**
- Railway provides a web-based database viewer
- Or use connection string with any PostgreSQL client (TablePlus, DBeaver, etc.)

## Common Issues

### Build Fails

**Issue:** `Cannot find module 'next'`
**Fix:** Ensure `package.json` includes all dependencies

**Issue:** Prisma migrations fail
**Fix:** Run migrations manually first: `railway run npx prisma migrate deploy`

### Environment Variables Not Working

**Issue:** App can't connect to database
**Fix:** Verify `DATABASE_URL` is correctly set and PostgreSQL service is running

**Issue:** OAuth not working
**Fix:** Ensure `NEXTAUTH_URL` matches your Railway domain exactly (including https://)

### Deployment Slow

**Issue:** Builds taking >5 minutes
**Fix:** Railway free tier has limited resources. Consider upgrading for faster builds.

## Definition of Done Checklist

- [ ] Railway project created and linked to Git repo
- [ ] PostgreSQL database provisioned
- [ ] Environment variables configured (DATABASE_URL, NEXTAUTH_URL, etc.)
- [ ] Automatic deployment from main branch verified
- [ ] Database migrations run successfully
- [ ] Team has staging URL access
- [ ] No errors in deployment logs
- [ ] Application loads at staging URL

## Next Steps

After TASK-001 is complete:
- **TASK-002** ([Codey]): Configure NextAuth.js with OAuth credentials
- **TASK-003** ([Syntax]): Database schema & migrations (can start immediately)

## Resources

- Railway Documentation: https://docs.railway.app
- Prisma with Railway: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway
- Next.js on Railway: https://docs.railway.app/guides/nextjs
