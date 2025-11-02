# Database Seed Data Deployment Guide

**For:** Travis & [Flow]
**Purpose:** Deploy and seed database for TASK-003 & TASK-004
**Railway Project:** Local Business Directory

---

## 🎯 What This Does

This guide will help you:
1. Apply the new database schema to Railway PostgreSQL
2. Seed initial data (locations and service directories)
3. Verify the home page works correctly

---

## ✅ Prerequisites

- ✅ Railway account with database provisioned
- ✅ Latest code deployed (commit `8453ad8` or later)
- ✅ DATABASE_URL environment variable set

---

## 📋 Step-by-Step Deployment

### **Step 1: Verify Railway Deployment**

1. Go to: https://railway.app/
2. Select: **Local Business Directory** project
3. Click: **Deployments** tab
4. Verify latest commit deployed successfully

**Expected:**
- Commit `8453ad8` or later
- Status: "Success" (green checkmark)

---

### **Step 2: Apply Database Schema**

Railway will automatically run this during deployment via `railway.toml`:
```bash
npx prisma db push --accept-data-loss
```

**To verify manually:**

1. In Railway, click **Web Service**
2. Click **Deployments** → Latest deployment → **View Logs**
3. Search for: "Prisma schema loaded"
4. Should see: Tables created successfully

**Expected Tables Created:**
- `locations`
- `directories`
- `users`
- `accounts`
- `sessions`
- `verification_tokens`
- `businesses`
- `business_directories`
- `contacts`

---

### **Step 3: Seed Database with Initial Data**

**Option A: Via Railway Dashboard (Recommended)**

1. In Railway, click **Web Service**
2. Click **Settings** tab
3. Scroll to **Deploy** section
4. Click **Deploy** → Choose **Run a Command**
5. Enter command:
   ```bash
   npm run db:seed
   ```
6. Click **Run**

**Option B: Via Railway CLI**

```bash
railway run npm run db:seed
```

**Expected Output:**
```
🌱 Starting database seed...
📍 Seeding locations...
✅ Location created: Saint Augustine, FL
📂 Seeding service directories...
  ✓ Plumbers
  ✓ Electricians
  ✓ HVAC Services
  ... (15 total)
✅ Created 15 service directories
👤 Creating admin user...
✅ Admin user created: admin@localbusinessdirectory.app
🎉 Database seed completed successfully!

📊 Summary:
   - Locations: 1
   - Directories: 15
   - Users: 1 (admin)
🚀 Your database is ready!
```

---

### **Step 4: Verify Data in Database**

**Connect to Railway PostgreSQL:**

1. In Railway, click **PostgreSQL** service
2. Click **Connect** tab
3. Copy **PSQL Command**
4. Run in terminal:
   ```bash
   # Example (use your actual connection string):
   psql postgresql://postgres:password@host:port/railway
   ```

**Verify Data:**

```sql
-- Check location
SELECT * FROM locations;
-- Expected: 1 row (Saint Augustine, FL)

-- Check directories
SELECT name, slug, display_order FROM directories ORDER BY display_order;
-- Expected: 15 rows (Plumbers, Electricians, etc.)

-- Check admin user
SELECT email, role FROM users WHERE role = 'ADMIN';
-- Expected: 1 row (admin@localbusinessdirectory.app)
```

---

### **Step 5: Test Home Page**

1. Visit: `https://stunning-perfection-production-1cd6.up.railway.app`

**Expected Behavior:**
- ✅ Location selector modal appears
- ✅ Shows "Saint Augustine, FL" as an option
- ✅ Click location → Redirects to `/saint-augustine-fl`
- ✅ Return visit → Auto-redirects (localStorage working)

**If "No Locations Available":**
- Seed script didn't run or failed
- Check deployment logs for errors
- Re-run seed command

---

## 🔧 Troubleshooting

### Problem: Seed command fails with "MODULE_NOT_FOUND"

**Solution:**
```bash
# Run in Railway CLI or deployment command:
npm install
npm run db:seed
```

---

### Problem: "Location already exists" error

**Solution:**
The seed script uses `upsert`, so it's safe to run multiple times. If you see this, the location is already seeded successfully.

---

### Problem: Home page shows "Failed to fetch locations"

**Checklist:**
1. ✅ Seed script ran successfully?
2. ✅ Database tables created?
3. ✅ DATABASE_URL environment variable set?
4. ✅ Prisma client generated? (runs automatically in postinstall)

**Fix:**
```bash
# In Railway, run:
npx prisma generate
npm run db:seed
```

---

### Problem: "Cannot read property 'slug' of undefined"

**Solution:**
No locations in database. Run seed script:
```bash
npm run db:seed
```

---

## 📊 What Data Gets Seeded

### **1 Location:**
- **Saint Augustine, FL**
  - ZIP: 32080
  - Slug: `saint-augustine-fl`
  - Status: Active

### **15 Service Directories:**

| # | Name | Slug | Icon |
|---|------|------|------|
| 1 | Plumbers | plumbers | Wrench |
| 2 | Electricians | electricians | Zap |
| 3 | HVAC Services | hvac-services | Wind |
| 4 | Landscaping | landscaping | Trees |
| 5 | Cleaning Services | cleaning-services | Sparkles |
| 6 | Pest Control | pest-control | Bug |
| 7 | Roofing | roofing | Home |
| 8 | Painting | painting | Paintbrush |
| 9 | Handyman Services | handyman-services | Hammer |
| 10 | Home Security | home-security | Shield |
| 11 | Flooring | flooring | Layers |
| 12 | Moving Services | moving-services | Truck |
| 13 | Pool Services | pool-services | Droplets |
| 14 | Window Services | window-services | Square |
| 15 | Garage Door Services | garage-door-services | DoorOpen |

### **1 Admin User:**
- **Email:** `admin@localbusinessdirectory.app`
- **Role:** ADMIN
- **Password:** Not set (use NextAuth registration to set)

---

## 🚀 Post-Deployment Verification

### **Quick Test Checklist:**

1. ✅ Home page loads without errors
2. ✅ Location selector shows Saint Augustine, FL
3. ✅ Can select location and be redirected
4. ✅ localStorage saves preference
5. ✅ Return visit auto-redirects
6. ✅ `/api/locations` returns location data

**Test API Endpoint:**
```bash
curl https://stunning-perfection-production-1cd6.up.railway.app/api/locations
```

**Expected Response:**
```json
{
  "locations": [
    {
      "id": "uuid-here",
      "name": "Saint Augustine, FL",
      "slug": "saint-augustine-fl",
      "zipCode": "32080"
    }
  ],
  "count": 1
}
```

---

## 📝 Manual Seed (Alternative)

If automated seeding fails, you can manually insert data:

```sql
-- Insert location
INSERT INTO locations (id, name, zip_code, slug, region, description, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Saint Augustine, FL',
  '32080',
  'saint-augustine-fl',
  'Northeast Florida',
  'America''s oldest city, known for historic charm and coastal beauty',
  true,
  NOW(),
  NOW()
);

-- Get location ID for directories
SELECT id, name FROM locations WHERE slug = 'saint-augustine-fl';

-- Insert directories (replace <location-id> with actual UUID from above)
INSERT INTO directories (id, location_id, name, slug, description, icon, display_order, is_active, created_at, updated_at)
VALUES
  (gen_random_uuid(), '<location-id>', 'Plumbers', 'plumbers', 'Professional plumbing services', 'Wrench', 1, true, NOW(), NOW()),
  (gen_random_uuid(), '<location-id>', 'Electricians', 'electricians', 'Licensed electrical contractors', 'Zap', 2, true, NOW(), NOW()),
  (gen_random_uuid(), '<location-id>', 'HVAC Services', 'hvac-services', 'Heating and air conditioning', 'Wind', 3, true, NOW(), NOW());
  -- ... (add remaining 12 directories)
```

---

## ✅ Success Criteria

**TASK-003 (Database Schema):**
- ✅ All 9 tables created in Railway PostgreSQL
- ✅ Indexes applied successfully
- ✅ Foreign keys working

**TASK-004 (Home Page):**
- ✅ Home page accessible
- ✅ Location selector displays seeded location
- ✅ User can select location
- ✅ localStorage persistence working
- ✅ Auto-redirect on return visits

---

## 🎯 Next Steps After Seeding

1. ✅ Verify both TASK-003 and TASK-004 working
2. ✅ Move tasks to QA/Staging on kanban
3. ✅ Proceed with TASK-005 through TASK-010
4. ✅ Begin testing business creation workflow

---

**Questions?** Contact [Codey] (TPM) or [Flow] (DevOps)
