# Production Deployment Checklist - Email System Update

## Pre-Deployment Verification

### Local Testing Status
- [x] Email verification flow tested in MailHog
- [x] Welcome email tested in MailHog
- [x] Forgot password flow tested in MailHog
- [x] Reset password flow tested in MailHog
- [x] All frontend pages responsive and functional
- [x] All API endpoints returning correct responses

### Code Status
- [x] All changes committed to git
- [x] No console errors or warnings
- [x] TypeScript compilation successful
- [x] Production build tested locally

## Railway Production Setup

### 1. Environment Variables Configuration

Required environment variables on Railway (from `.env.production.example`):

```bash
# Database (Already configured in Railway)
DATABASE_URL="<railway-postgres-connection-string>"

# NextAuth.js
NEXTAUTH_URL="https://localbusinessdirectory.app"
NEXTAUTH_SECRET="<generate-new-production-secret>"

# Cloudinary (Already configured)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<cloud-name>"
CLOUDINARY_API_KEY="<api-key>"
CLOUDINARY_API_SECRET="<api-secret>"

# Resend (Email service - PRODUCTION)
RESEND_API_KEY="<production-resend-api-key>"
EMAIL_PROVIDER="resend"

# App Configuration
NEXT_PUBLIC_APP_URL="https://localbusinessdirectory.app"
```

**NEW Variables to Add:**
1. `RESEND_API_KEY` - Get from https://resend.com/api-keys
2. `EMAIL_PROVIDER` - Set to "resend"

**Verify Existing Variables:**
- Confirm `NEXT_PUBLIC_APP_URL` is set correctly
- Confirm `NEXTAUTH_URL` is set correctly

### 2. Resend Configuration

#### Account Setup:
1. Login to Resend dashboard: https://resend.com
2. Navigate to API Keys section
3. Create new production API key
4. Add API key to Railway environment variables

#### Domain Verification (IMPORTANT):
1. In Resend dashboard, go to Domains
2. Add domain: `localbusinessdirectory.app`
3. Add DNS records to domain provider:
   - TXT record for domain verification
   - DKIM records for email authentication
4. Wait for verification (can take up to 48 hours)
5. Update email "from" addresses in code if needed

**Note:** Until domain is verified, emails will be sent from `onboarding@resend.dev` (Resend's domain)

### 3. Database Migration Check

Verify database schema includes required fields:
- [x] `verification_tokens` table exists
- [x] `users.passwordHash` field exists
- [x] `users.emailVerified` field exists

No new migrations required for this deployment.

### 4. Code Deployment

#### Git Workflow:
```bash
# Ensure all changes are committed
git status

# Push to main branch (Railway auto-deploys from main)
git push origin main
```

#### Railway Auto-Deploy:
- Railway will detect push to main
- Automatic build will trigger
- Deployment will complete in ~3-5 minutes

### 5. Post-Deployment Verification

#### Immediate Checks:
1. [ ] Visit https://localbusinessdirectory.app - site loads
2. [ ] Check Railway logs for any startup errors
3. [ ] Verify no 500 errors in browser console

#### Email System QA:
1. [ ] **Registration Flow:**
   - Register new test account
   - Verify verification email received
   - Click verification link
   - Verify welcome email received
   - Confirm can login

2. [ ] **Forgot Password Flow:**
   - Navigate to login page
   - Click "Forgot password?" link
   - Enter email address
   - Verify reset email received
   - Click reset link
   - Set new password
   - Confirm can login with new password

3. [ ] **Email Content Verification:**
   - Check all emails have proper branding
   - Verify links are using production URL
   - Confirm no localhost references
   - Check email formatting (HTML rendering)

#### Security Checks:
1. [ ] Verify password reset tokens expire after 1 hour
2. [ ] Confirm cannot use same reset token twice
3. [ ] Check email enumeration protection (always returns success)
4. [ ] Verify HTTPS on all email links

## Rollback Plan

If issues are detected:

### Critical Issues (rollback immediately):
- Email sending completely failing
- Database connection errors
- Authentication broken
- Site down

### Non-Critical Issues (fix forward):
- Email formatting issues
- Minor UI bugs
- Missing translations

### Rollback Process:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Railway will auto-deploy previous version
```

## Production Monitoring

### Week 1 Post-Deployment:
- Monitor Railway logs daily for errors
- Check Resend dashboard for delivery rates
- Review user feedback/support tickets
- Monitor email bounce rates

### Key Metrics:
- Email delivery success rate (target: >95%)
- Password reset completion rate
- Email verification completion rate
- Average time from registration to verification

## Team Responsibilities

- **[Flow]**: Execute deployment, monitor Railway
- **[Sentinal]**: Security verification, token expiry testing
- **[Verity]**: Comprehensive QA on production
- **[Syntax]**: Stand by for any code fixes
- **[Codey]**: Coordinate team, track metrics

## Notes

- **Email Deliverability:** First few emails may be slower while Resend warms up IP reputation
- **Rate Limits:** Resend free tier allows 3,000 emails/month, 100 emails/day
- **Support:** If issues arise, check Resend status page: https://status.resend.com

## Completion Checklist

- [ ] All environment variables configured in Railway
- [ ] Code pushed to main branch
- [ ] Railway deployment successful
- [ ] All post-deployment QA checks passed
- [ ] Team notified of deployment completion
- [ ] Monitoring plan activated

---
**Deployment Date:** _____________________
**Deployed By:** [Flow]
**Verified By:** [Verity]
**Approved By:** [Codey]
