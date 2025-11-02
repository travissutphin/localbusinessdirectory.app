# TASK-002 Railway Deployment Checklist

**Commit:** `cbc10c7` - Complete TASK-002: Implement NextAuth.js authentication

## Database Migration Required ⚠️

The Prisma schema has been updated with NextAuth.js tables. Railway needs to apply these changes.

### New Tables Added:
- `accounts` - OAuth provider account linking
- `sessions` - User session management
- `verification_tokens` - Email verification tokens

### Modified Tables:
- `users`:
  - `emailVerified`: Changed from Boolean to DateTime?
  - `profileImage` renamed to `image`
  - Added relations: `accounts[]`, `sessions[]`

## Environment Variables Checklist

### Required (from TASK-001):
- [x] `DATABASE_URL` - Already configured

### New Required for TASK-002:
- [ ] `NEXTAUTH_URL` = `https://stunning-perfection-production-1cd6.up.railway.app`
- [ ] `NEXTAUTH_SECRET` = Generate with `openssl rand -base64 32` (32+ chars)
- [ ] `GOOGLE_CLIENT_ID` = Get from Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` = Get from Google Cloud Console
- [ ] `FACEBOOK_APP_ID` = Get from Meta for Developers
- [ ] `FACEBOOK_APP_SECRET` = Get from Meta for Developers

## Deployment Steps

1. **Verify Railway Auto-Deploy**
   - Check Railway dashboard for deployment of commit `cbc10c7`
   - Review build logs for errors

2. **Apply Database Migration**
   Railway will automatically run via `railway.toml` startCommand:
   ```bash
   npx prisma db push --accept-data-loss && npm run start
   ```

3. **Verify Database Schema**
   Connect to Railway PostgreSQL and verify tables:
   ```sql
   \dt  -- List all tables
   -- Should see: accounts, sessions, verification_tokens
   ```

4. **Test Endpoints**
   ```bash
   # Check NextAuth endpoints
   curl https://stunning-perfection-production-1cd6.up.railway.app/api/auth/providers

   # Should return: {"google":..., "facebook":..., "credentials":...}
   ```

5. **Verify Application Health**
   - Visit: https://stunning-perfection-production-1cd6.up.railway.app
   - Check: No 500 errors
   - Verify: Auth routes accessible

## Security Verification

- [ ] `NEXTAUTH_SECRET` is minimum 32 characters
- [ ] `NEXTAUTH_URL` uses HTTPS (not HTTP)
- [ ] OAuth client secrets are NOT committed to Git
- [ ] All environment variables set in Railway dashboard (not code)

## Success Criteria

✅ Deployment Status: SUCCESS
✅ Database Migration: COMPLETE
✅ Environment Variables: CONFIGURED
✅ Health Check: PASSING
✅ Auth Endpoints: ACCESSIBLE

Once complete, notify [Verity] to begin QA testing.

---

**Status:** Awaiting Travis confirmation
**Assigned:** [Flow] with [Travis]
**Next:** [Verity] QA Testing
