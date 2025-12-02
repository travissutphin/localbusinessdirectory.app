# SEO Enhancement Plan for Business Directory

**Prepared by:** [Codey] (TPM) with [Bran] (SEO), [Syntax] (Engineering), [Echo] (Content)
**Date:** November 2025
**Status:** PHASE 1 IMPLEMENTED

---

## Executive Summary

Current business URLs use UUIDs which are not SEO-friendly:
```
/saint-augustine-fl/digital-tech-services/c6e765bf-545b-4f01-8141-f72f2ff2dc7e
```

Proposed SEO-friendly URL structure:
```
/saint-augustine-fl/digital-tech-services/joes-computer-repair
```

This plan outlines a phased approach to enhance SEO across all business listings.

---

## Phase 1: SEO-Friendly URLs (Priority: HIGH)

### 1.1 Add `slug` Field to Business Model

**Schema Change:**
```prisma
model Business {
  // ... existing fields
  slug    String?   // Auto-generated from business name

  @@unique([locationId, directoryId, slug])  // Ensure unique within location/directory
}
```

**Slug Generation Logic:**
- Convert business name to lowercase
- Replace spaces with hyphens
- Remove special characters
- Add numeric suffix if duplicate exists (e.g., `joes-plumbing-2`)

**Example:**
| Business Name | Generated Slug |
|--------------|----------------|
| Joe's Computer Repair | joes-computer-repair |
| ABC Cleaning Services | abc-cleaning-services |
| 24/7 Emergency Plumber | 24-7-emergency-plumber |

### 1.2 URL Routing Update

**Current:** `/[location]/[directory]/[business]` (uses UUID)
**New:** `/[location]/[directory]/[slug]` (uses slug)

**Backward Compatibility:**
- Keep UUID lookup as fallback for existing bookmarks
- 301 redirect from UUID URLs to slug URLs

---

## Phase 2: Dynamic Metadata (Priority: HIGH)

### 2.1 Business Page Metadata

**File:** `app/[location]/[directory]/[business]/page.tsx`

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const business = await getBusinessData(params.business)

  return {
    title: `${business.name} | ${business.directory.name} in ${business.location.name}`,
    description: business.description.slice(0, 160),
    openGraph: {
      title: business.name,
      description: business.description,
      images: business.imageUrl ? [business.imageUrl] : [],
      type: 'business.business',
    },
  }
}
```

**Example Output:**
- **Title:** "Joe's Computer Repair | Digital Tech Services in Saint Augustine, FL"
- **Description:** First 160 characters of business description

### 2.2 Directory Page Metadata

**File:** `app/[location]/[directory]/page.tsx`

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `${directory.name} in ${location.name} | Local Business Directory`,
    description: `Find the best ${directory.name.toLowerCase()} businesses in ${location.name}. Browse verified local home-based businesses.`,
  }
}
```

### 2.3 Location Page Metadata

**File:** `app/[location]/page.tsx`

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Local Businesses in ${location.name} | Home Business Directory`,
    description: `Discover home-based businesses in ${location.name}. Browse by category to find local services.`,
  }
}
```

---

## Phase 3: Structured Data / JSON-LD (Priority: HIGH)

### 3.1 LocalBusiness Schema

Add to business detail pages:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Joe's Computer Repair",
  "description": "Professional computer repair services...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Saint Augustine",
    "addressRegion": "FL",
    "postalCode": "32084"
  },
  "telephone": "+1-904-555-0123",
  "email": "joe@example.com",
  "url": "https://frontdoordirectory.com/saint-augustine-fl/digital-tech-services/joes-computer-repair",
  "image": "https://frontdoordirectory.com/uploads/business-image.jpg",
  "priceRange": "$$",
  "openingHoursSpecification": [...]
}
```

### 3.2 BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://frontdoordirectory.com" },
    { "@type": "ListItem", "position": 2, "name": "Saint Augustine, FL", "item": "https://frontdoordirectory.com/saint-augustine-fl" },
    { "@type": "ListItem", "position": 3, "name": "Digital Tech Services", "item": "https://frontdoordirectory.com/saint-augustine-fl/digital-tech-services" },
    { "@type": "ListItem", "position": 4, "name": "Joe's Computer Repair" }
  ]
}
```

### 3.3 ItemList Schema (Directory Pages)

For category listing pages showing multiple businesses.

---

## Phase 4: Sitemap & Robots.txt (Priority: MEDIUM)

### 4.1 Dynamic Sitemap

**File:** `app/sitemap.ts`

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = await prisma.business.findMany({
    where: { status: 'APPROVED', isActive: true },
    include: { location: true, directory: true }
  })

  return [
    { url: 'https://frontdoordirectory.com', lastModified: new Date() },
    ...businesses.map(b => ({
      url: `https://frontdoordirectory.com/${b.location.slug}/${b.directory.slug}/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8
    }))
  ]
}
```

### 4.2 Robots.txt

**File:** `app/robots.ts`

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/dashboard/'] },
    sitemap: 'https://frontdoordirectory.com/sitemap.xml',
  }
}
```

---

## Phase 5: Additional SEO Enhancements (Priority: MEDIUM)

### 5.1 Canonical URLs

Prevent duplicate content issues:
```html
<link rel="canonical" href="https://frontdoordirectory.com/saint-augustine-fl/digital-tech-services/joes-computer-repair" />
```

### 5.2 Social Media Optimization

**Open Graph Tags:**
- og:title, og:description, og:image, og:url
- og:type: "business.business"

**Twitter Cards:**
- twitter:card: "summary_large_image"
- twitter:title, twitter:description, twitter:image

### 5.3 Image Optimization

- Add `alt` attributes with business name + service type
- Use Next.js Image component with proper sizing
- Consider WebP format for faster loading

### 5.4 Internal Linking

- "Related businesses" section on business pages
- "Other services in this area" links
- Category cross-linking

---

## Implementation Priority

| Phase | Task | Priority | Effort | SEO Impact |
|-------|------|----------|--------|------------|
| 1 | SEO-Friendly URLs (slugs) | HIGH | Medium | ⭐⭐⭐⭐⭐ |
| 2 | Dynamic Metadata | HIGH | Low | ⭐⭐⭐⭐⭐ |
| 3 | JSON-LD Structured Data | HIGH | Medium | ⭐⭐⭐⭐ |
| 4 | Sitemap & Robots.txt | MEDIUM | Low | ⭐⭐⭐⭐ |
| 5 | Social & Additional | MEDIUM | Low | ⭐⭐⭐ |

---

## Migration Plan for Existing Businesses

1. **Generate slugs** for all existing approved businesses
2. **Keep UUID support** temporarily for backward compatibility
3. **Implement 301 redirects** from old UUID URLs to new slug URLs
4. **Update sitemap** after migration
5. **Submit to Google Search Console** for re-indexing

---

## Success Metrics

- [ ] All business pages have unique, descriptive titles
- [ ] Business pages appear in Google Search with rich snippets
- [ ] Sitemap successfully indexed by search engines
- [ ] No duplicate content warnings in Search Console
- [ ] Improved click-through rates from search results

---

## Questions for Review

1. **Slug Format:** Should we include location in slug?
   - Option A: `/saint-augustine-fl/tech/joes-repair` (current plan)
   - Option B: `/saint-augustine-fl/tech/joes-repair-saint-augustine`

2. **Duplicate Business Names:** How to handle two "Joe's Plumbing" in same directory?
   - Option A: Add number suffix (`joes-plumbing-2`)
   - Option B: Add identifier (`joes-plumbing-main-st`)

3. **URL Length:** Maximum slug length? (Recommend: 50 characters)

---

**Next Steps:**
1. [Travis] Review and approve plan
2. [Syntax] Implement Phase 1 (slug field + URL routing)
3. [Bran] Prepare metadata templates
4. [Verity] Test SEO implementation

