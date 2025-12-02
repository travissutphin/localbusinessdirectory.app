# Admin Business Management Enhancements Plan

**Prepared by:** [Codey] (TPM) with [Syntax] (Engineering), [Bran] (SEO)
**Date:** November 2025
**Status:** PENDING REVIEW

---

## Overview

Three key enhancements requested:
1. **Admin Status Control** - Allow admin to change business status at any time
2. **Email Notifications** - Notify owners when status changes to PENDING or REJECTED
3. **Duplicate Detection** - Fuzzy search for potential duplicates with admin flagging

---

## Feature 1: Admin Status Control

### Current State
- Admin can only: Approve (PENDING→APPROVED), Reject (PENDING→REJECTED), Toggle Active
- Cannot change status once approved/rejected (except toggle active)

### Proposed Changes

**UI Change:** Add status dropdown on admin business cards allowing:
- PENDING ↔ APPROVED ↔ REJECTED (any direction)

**New API Endpoint:** `PUT /api/admin/businesses/[id]/status`
```typescript
// Request body
{
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  rejectionReason?: string  // Required if status = REJECTED
}

// Response
{
  business: Business,
  previousStatus: string,
  emailSent: boolean
}
```

**Business Logic:**
- When changing to APPROVED: set approvedAt, approvedBy, clear rejectionReason
- When changing to REJECTED: require rejectionReason, clear approvedAt
- When changing to PENDING: clear both approvedAt and rejectionReason
- Send email notification for PENDING and REJECTED status changes

---

## Feature 2: Email Notifications for Status Changes

### Email Templates Needed

#### 1. Business Status Changed to PENDING
**Subject:** "Your business listing requires review"
**Trigger:** Admin sets status to PENDING (e.g., from APPROVED)
**Content:**
- Business name
- Reason: "Changes detected" or admin note
- What to expect next
- Link to dashboard

#### 2. Business Rejected
**Subject:** "Your business listing was not approved"
**Trigger:** Admin rejects business
**Content:**
- Business name
- Rejection reason (required)
- How to fix and resubmit
- Link to edit business
- Contact support option

#### 3. Business Approved (optional enhancement)
**Subject:** "Congratulations! Your business is now live"
**Trigger:** Admin approves business
**Content:**
- Business name
- Link to public listing
- Tips for success

### Implementation

**File:** `lib/email-templates.ts` (add new templates)
```typescript
export function getBusinessStatusPendingEmailHtml(businessName: string, dashboardUrl: string): string
export function getBusinessStatusPendingEmailText(businessName: string, dashboardUrl: string): string

export function getBusinessRejectedEmailHtml(businessName: string, reason: string, editUrl: string): string
export function getBusinessRejectedEmailText(businessName: string, reason: string, editUrl: string): string

export function getBusinessApprovedEmailHtml(businessName: string, publicUrl: string): string
export function getBusinessApprovedEmailText(businessName: string, publicUrl: string): string
```

**File:** `lib/email.ts` (add new functions)
```typescript
export async function sendBusinessStatusEmail(
  email: string,
  businessName: string,
  newStatus: 'PENDING' | 'APPROVED' | 'REJECTED',
  options?: {
    rejectionReason?: string,
    publicUrl?: string,
    editUrl?: string
  }
): Promise<void>
```

---

## Feature 3: Duplicate Detection & Admin Flagging

### Fuzzy Search Implementation

**When:** On business creation/edit, before save
**What:** Search for similar business names within same location

**Algorithm:**
1. Normalize business name (lowercase, remove punctuation)
2. Search for businesses in same location with:
   - Exact name match (different owner)
   - Levenshtein distance ≤ 3 (similar names)
   - Contains search (partial match)
3. Return potential matches with similarity score

**New Utility:** `lib/duplicate-detection.ts`
```typescript
interface DuplicateMatch {
  businessId: string
  businessName: string
  ownerEmail: string
  similarity: number  // 0-100
  matchType: 'exact' | 'similar' | 'partial'
}

export async function findPotentialDuplicates(
  name: string,
  locationId: string,
  excludeBusinessId?: string
): Promise<DuplicateMatch[]>
```

### Database Schema Change

**Add to Business model:**
```prisma
model Business {
  // ... existing fields
  duplicateFlag       Boolean   @default(false) @map("duplicate_flag")
  duplicateNotes      String?   @map("duplicate_notes")
  potentialDuplicates String[]  @map("potential_duplicates")  // Array of business IDs
}
```

### UI Changes

#### Owner Dashboard (Create/Edit Form)
- On save, check for duplicates
- If found, show warning modal:
  ```
  "We found similar businesses in this area:
   - Joe's Plumbing (95% match)
   - Joe's Plumbing Services (78% match)

  Is this a new business? [Yes, Submit] [No, Cancel]"
  ```
- If user confirms, flag business for admin review

#### Admin Panel
- Show duplicate warning badge on flagged businesses
- Expandable section showing:
  - Potential duplicate business links
  - Similarity scores
  - Admin can add notes
  - Admin can clear flag after review

---

## Implementation Priority

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| 1.1 | HIGH | Low | Create unified status change API endpoint |
| 1.2 | HIGH | Low | Update admin UI with status dropdown |
| 2.1 | HIGH | Medium | Create email templates for status changes |
| 2.2 | HIGH | Low | Integrate email sending into status API |
| 3.1 | MEDIUM | Medium | Implement fuzzy duplicate search utility |
| 3.2 | MEDIUM | Low | Add duplicate fields to schema |
| 3.3 | MEDIUM | Medium | Add duplicate warning to owner forms |
| 3.4 | MEDIUM | Medium | Add duplicate section to admin panel |

---

## API Changes Summary

| Endpoint | Method | Change |
|----------|--------|--------|
| `/api/admin/businesses/[id]/status` | PUT | NEW - unified status change |
| `/api/businesses` | POST | Add duplicate detection |
| `/api/businesses/[id]` | PUT | Add duplicate detection |
| `/api/businesses/duplicates` | POST | NEW - check for duplicates |

---

## Files to Create/Modify

### New Files
- `lib/email-templates.ts` - Add business status email templates
- `lib/duplicate-detection.ts` - Fuzzy search logic

### Modified Files
- `prisma/schema.prisma` - Add duplicate fields
- `app/api/admin/businesses/[id]/status/route.ts` - New unified endpoint
- `app/admin/businesses/page.tsx` - Status dropdown, duplicate badge
- `app/dashboard/businesses/new/page.tsx` - Duplicate warning
- `app/dashboard/businesses/[id]/edit/page.tsx` - Duplicate warning
- `lib/email.ts` - Add sendBusinessStatusEmail function

---

## Questions for Review

1. **Email frequency:** Should we also send email when status changes to APPROVED?
   - Recommended: Yes, owners want to know when their business goes live

2. **Duplicate threshold:** What similarity percentage should trigger a warning?
   - Recommended: 70% or higher

3. **Duplicate scope:** Check duplicates across all locations or just same location?
   - Recommended: Same location only (different areas may have same business names legitimately)

4. **Admin notes:** Should admin be able to add notes when changing status?
   - Recommended: Yes, helpful for tracking decisions

---

**Next Steps:**
1. [Travis] Review and approve plan
2. [Syntax] Implement Features 1 & 2 (status control + emails)
3. [Syntax] Implement Feature 3 (duplicate detection)
4. [Verity] Test all workflows
