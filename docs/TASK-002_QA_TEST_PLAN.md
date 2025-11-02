# TASK-002 QA Test Plan - NextAuth.js Authentication

**Assigned:** [Verity] (QA)
**Environment:** Staging - https://stunning-perfection-production-1cd6.up.railway.app
**Prerequisites:** Deployment checklist completed, all environment variables set

## Test Scope

- Email/Password Registration & Login
- Google OAuth Authentication
- Facebook OAuth Authentication
- Session Management
- Role-Based Access Control
- Error Handling

---

## Test Suite 1: Email/Password Authentication

### TC-001: User Registration - Happy Path
**Priority:** P0
**Steps:**
1. Navigate to registration page
2. Enter valid email: `test@example.com`
3. Enter valid password: `Test123456`
4. Enter name: `Test User`
5. Submit registration form

**Expected Result:**
- ✅ HTTP 201 status
- ✅ Response: `{ "message": "User created successfully", "user": {...} }`
- ✅ User created with role "OWNER"
- ✅ Password not returned in response
- ✅ `passwordHash` stored in database

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-002: User Registration - Duplicate Email
**Priority:** P0
**Steps:**
1. Register user with email: `test@example.com` (reuse from TC-001)
2. Attempt to register again with same email

**Expected Result:**
- ✅ HTTP 400 status
- ✅ Error: "User with this email already exists"

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-003: User Registration - Weak Password
**Priority:** P1
**Steps:**
1. Attempt registration with password: `test123` (no uppercase)
2. Attempt registration with password: `Test` (too short)
3. Attempt registration with password: `TestTest` (no number)

**Expected Result:**
- ✅ HTTP 400 status
- ✅ Error: "Password must be at least 8 characters with 1 uppercase letter and 1 number"

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-004: User Registration - Invalid Email
**Priority:** P1
**Steps:**
1. Attempt registration with email: `invalid-email`
2. Attempt registration with email: `test@`

**Expected Result:**
- ✅ HTTP 400 status
- ✅ Error: "Invalid email format"

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-005: Email/Password Login - Success
**Priority:** P0
**Steps:**
1. Navigate to sign-in page
2. Enter email: `test@example.com`
3. Enter password: `Test123456`
4. Submit login form

**Expected Result:**
- ✅ User authenticated successfully
- ✅ Session created (JWT token)
- ✅ Redirected to dashboard or home page
- ✅ User role displayed in session

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-006: Email/Password Login - Invalid Credentials
**Priority:** P0
**Steps:**
1. Attempt login with email: `test@example.com`
2. Enter wrong password: `WrongPassword123`

**Expected Result:**
- ✅ Authentication fails
- ✅ Error message displayed (generic, not revealing which field is wrong)
- ✅ No session created

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

## Test Suite 2: Google OAuth Authentication

### TC-007: Google OAuth - First Time Sign-In
**Priority:** P0
**Prerequisites:** Valid Google account not previously used

**Steps:**
1. Click "Sign in with Google"
2. Complete Google OAuth consent flow
3. Authorize application

**Expected Result:**
- ✅ User redirected to Google OAuth
- ✅ New user account created automatically
- ✅ User role set to "OWNER"
- ✅ `authProvider` set to "google"
- ✅ User redirected back to application
- ✅ Session active

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-008: Google OAuth - Returning User
**Priority:** P0
**Prerequisites:** Google account used in TC-007

**Steps:**
1. Logout from current session
2. Click "Sign in with Google"
3. Select same Google account

**Expected Result:**
- ✅ User authenticated without creating duplicate account
- ✅ Session restored with existing user data
- ✅ User role maintained

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

## Test Suite 3: Facebook OAuth Authentication

### TC-009: Facebook OAuth - First Time Sign-In
**Priority:** P0
**Prerequisites:** Valid Facebook account not previously used

**Steps:**
1. Click "Sign in with Facebook"
2. Complete Facebook OAuth consent flow
3. Authorize application

**Expected Result:**
- ✅ User redirected to Facebook OAuth
- ✅ New user account created automatically
- ✅ User role set to "OWNER"
- ✅ `authProvider` set to "facebook"
- ✅ User redirected back to application
- ✅ Session active

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-010: Facebook OAuth - Returning User
**Priority:** P0
**Prerequisites:** Facebook account used in TC-009

**Steps:**
1. Logout from current session
2. Click "Sign in with Facebook"
3. Use same Facebook account

**Expected Result:**
- ✅ User authenticated without creating duplicate account
- ✅ Session restored with existing user data
- ✅ User role maintained

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

## Test Suite 4: Session Management

### TC-011: Session Persistence
**Priority:** P0
**Steps:**
1. Login with any method
2. Close browser tab
3. Reopen application in new tab

**Expected Result:**
- ✅ User still authenticated (session persists)
- ✅ User data displayed correctly

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-012: Session Expiration
**Priority:** P1
**Steps:**
1. Login with any method
2. Inspect session token (maxAge: 7 days)
3. Verify expiration timestamp

**Expected Result:**
- ✅ Session token expires in 7 days (604800 seconds)
- ✅ Token includes user ID and role

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-013: Logout
**Priority:** P0
**Steps:**
1. Login with any method
2. Navigate to authenticated area
3. Click "Logout"

**Expected Result:**
- ✅ Session cleared
- ✅ User redirected to sign-in page
- ✅ Cannot access authenticated routes
- ✅ Session cookie removed

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

## Test Suite 5: Role-Based Access Control

### TC-014: OWNER Role Access
**Priority:** P0
**Prerequisites:** User with OWNER role

**Steps:**
1. Login as OWNER
2. Attempt to access owner dashboard
3. Attempt to add business listing

**Expected Result:**
- ✅ Access granted to owner-level routes
- ✅ Can create/edit own business listings
- ✅ Cannot access admin panel

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-015: ADMIN Role Access
**Priority:** P0
**Prerequisites:** User with ADMIN role (create via database)

**Steps:**
1. Create admin user in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
   ```
2. Login as ADMIN
3. Attempt to access admin panel
4. Attempt to access owner dashboard

**Expected Result:**
- ✅ Access granted to admin panel
- ✅ Can approve/reject business listings
- ✅ Can also access owner-level routes (ADMIN > OWNER)

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-016: Unauthorized Access Prevention
**Priority:** P0
**Steps:**
1. Logout (no session)
2. Attempt to access `/api/businesses` (authenticated route)
3. Attempt to access `/api/admin/*` (admin route)

**Expected Result:**
- ✅ HTTP 401 Unauthorized for authenticated routes
- ✅ HTTP 403 Forbidden for admin routes without admin role
- ✅ Proper error messages

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

## Test Suite 6: Security & Edge Cases

### TC-017: CSRF Protection
**Priority:** P1
**Steps:**
1. Inspect NextAuth cookies
2. Verify CSRF token present
3. Attempt request without CSRF token

**Expected Result:**
- ✅ CSRF token included in auth requests
- ✅ Requests without valid CSRF token rejected

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-018: Password Not Exposed
**Priority:** P0
**Steps:**
1. Register new user
2. Inspect network response
3. Query user via API

**Expected Result:**
- ✅ `passwordHash` never returned in API responses
- ✅ Password field never logged in console
- ✅ Sensitive data excluded from responses

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

### TC-019: Database Schema Validation
**Priority:** P0
**Steps:**
1. Connect to Railway PostgreSQL
2. Run: `\dt` to list tables
3. Verify schema

**Expected Result:**
- ✅ Table `accounts` exists
- ✅ Table `sessions` exists
- ✅ Table `verification_tokens` exists
- ✅ Table `users` has `emailVerified` (timestamp), `image` column
- ✅ Foreign key relationships intact

**Actual Result:** _____
**Status:** [ ] PASS [ ] FAIL

---

## Summary Report

**Total Test Cases:** 19
**Passed:** _____
**Failed:** _____
**Blocked:** _____
**Pass Rate:** _____%

### Critical Failures (P0):
- [ ] None

### High Priority Failures (P1):
- [ ] None

### Recommendations:
1.
2.
3.

### Blocker Issues:
- [ ] None - Ready to move to Staging

---

**QA Sign-Off:** [Verity]
**Date:** _____
**Status:** [ ] APPROVED [ ] REJECTED
**Next Step:** Move TASK-002 to Staging column if APPROVED
