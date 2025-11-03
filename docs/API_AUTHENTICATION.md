# Authentication API Documentation

**TASK-005: Authentication Endpoints**
**Status:** Complete
**Base URL:** `https://stunning-perfection-production-1cd6.up.railway.app`

---

## Overview

The application uses **NextAuth.js v5** for authentication with three providers:
1. **Google OAuth**
2. **Facebook OAuth**
3. **Email/Password (Credentials)**

All authentication is session-based using JWT strategy with 7-day expiration.

---

## Endpoints

### 1. User Registration

**POST** `/api/auth/register`

Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "OWNER"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Email already exists
- `400` - Password too weak (min 8 chars)
- `400` - Invalid email format

---

### 2. Get Current User

**GET** `/api/auth/me`

Get currently authenticated user's information.

**Headers:**
- `Cookie: authjs.session-token=...` (automatically sent by browser)

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://...",
    "role": "OWNER"
  }
}
```

**Error Responses:**
- `401` - Not authenticated

---

### 3. Get Session

**GET** `/api/auth/session`

Get full session object (NextAuth built-in endpoint).

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://...",
    "role": "OWNER"
  },
  "expires": "2025-11-09T12:00:00.000Z"
}
```

**Unauthenticated Response (200):**
```json
{}
```

---

### 4. Sign In (Login)

**POST** `/api/auth/signin`

Sign in with email/password or initiate OAuth flow.

**For Email/Password:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "csrfToken": "token-from-providers-endpoint"
}
```

**For OAuth:**
Redirect user to:
- Google: `/api/auth/signin/google`
- Facebook: `/api/auth/signin/facebook`

**Success:**
- Redirects to callback URL
- Sets session cookie

---

### 5. Sign Out (Logout)

**POST** `/api/auth/signout`

Sign out and clear session.

**Request Body:**
```json
{
  "csrfToken": "token-from-providers-endpoint"
}
```

**Success:**
- Clears session cookie
- Redirects to home page

---

### 6. Get Providers

**GET** `/api/auth/providers`

Get list of available authentication providers.

**Success Response (200):**
```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "/api/auth/signin/google",
    "callbackUrl": "/api/auth/callback/google"
  },
  "facebook": {
    "id": "facebook",
    "name": "Facebook",
    "type": "oauth",
    "signinUrl": "/api/auth/signin/facebook",
    "callbackUrl": "/api/auth/callback/facebook"
  },
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    "type": "credentials"
  }
}
```

---

### 7. OAuth Callbacks

**GET** `/api/auth/callback/{provider}`

OAuth providers redirect here after authentication.

**Providers:**
- `/api/auth/callback/google`
- `/api/auth/callback/facebook`

**Behavior:**
- Automatically creates user if doesn't exist
- Sets session cookie
- Redirects to home page or callback URL

---

## User Roles

The system supports three user roles:

| Role | Description | Access Level |
|------|-------------|--------------|
| `OWNER` | Default role for registered users | Can create up to 2 businesses |
| `ADMIN` | System administrator | Full platform access, approval workflow |
| `USER` | Future role for consumers | View-only access |

---

## Authentication Flow

### Email/Password Registration:
1. POST `/api/auth/register` with user details
2. Password hashed with bcrypt (10 rounds)
3. User created with role `OWNER`
4. Return user object (no auto-login)
5. User must POST `/api/auth/signin` to login

### OAuth (Google/Facebook):
1. User clicks "Sign in with Google/Facebook"
2. Redirect to `/api/auth/signin/{provider}`
3. User authorizes on provider site
4. Provider redirects to `/api/auth/callback/{provider}`
5. System auto-creates user if new (or links existing email)
6. Session cookie set
7. Redirect to home page

### Session Verification:
1. Frontend calls GET `/api/auth/me` or `/api/auth/session`
2. Check if user is authenticated
3. Get user role for conditional rendering
4. Redirect to login if 401 error

---

## Security Features

✅ **Password Hashing:** bcrypt with 10 rounds
✅ **Session Expiry:** 7 days
✅ **CSRF Protection:** Built into NextAuth
✅ **Email Validation:** Regex pattern validation
✅ **Password Strength:** Minimum 8 characters
✅ **Duplicate Prevention:** Email uniqueness enforced
✅ **OAuth Auto-Creation:** Secure user provisioning
✅ **Role-Based Access:** JWT includes user role

---

## Testing Endpoints

### Test Registration:
```bash
curl -X POST https://stunning-perfection-production-1cd6.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User"
  }'
```

### Test Get Current User:
```bash
curl https://stunning-perfection-production-1cd6.up.railway.app/api/auth/me \
  -H "Cookie: authjs.session-token=YOUR_SESSION_TOKEN"
```

### Test Get Providers:
```bash
curl https://stunning-perfection-production-1cd6.up.railway.app/api/auth/providers
```

---

## For Frontend Developers

### Check if User is Authenticated:
```typescript
const response = await fetch('/api/auth/me')
if (response.ok) {
  const { user } = await response.json()
  console.log('Logged in as:', user.email)
} else {
  console.log('Not authenticated')
}
```

### Register New User:
```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    name: 'John Doe'
  })
})

if (response.ok) {
  const { user } = await response.json()
  // Redirect to login
} else {
  const { error } = await response.json()
  // Show error message
}
```

### Sign Out:
```typescript
import { signOut } from 'next-auth/react'

await signOut({ callbackUrl: '/' })
```

---

## For Backend Developers (TASK-006+)

### Protect API Routes:
```typescript
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // User is authenticated
  const userId = session.user.id
  const userRole = session.user.role

  // Your business logic here
}
```

### Check Admin Role:
```typescript
const session = await auth()

if (session?.user?.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## Environment Variables Required

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.com
AUTH_TRUST_HOST=true

# Database
DATABASE_URL=postgresql://...

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

---

## TASK-005 Definition of Done

✅ POST /api/auth/register works
✅ POST /api/auth/signin works (via NextAuth)
✅ OAuth callbacks auto-create users
✅ GET /api/auth/session returns current user
✅ GET /api/auth/me returns current user (helper endpoint)
✅ POST /api/auth/signout clears session
✅ All endpoints documented
✅ Error responses follow specification
⏳ All endpoints tested with Postman (pending Travis verification)

---

**Created by:** [Codey] - Technical Program Manager
**Date:** 2025-11-02
**Related Tasks:** TASK-002, TASK-005
