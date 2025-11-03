# Theme System Documentation

## Overview

The Local Business Directory uses a **3-Color Palette Architecture** with CSS variables, making it easy to update the entire theme from a single file (`/app/globals.css`).

## Color Palette

### Primary Color: Professional Blue
**Brand Identity** - Trustworthy, professional

```css
--color-primary-600: #003d82  /* Base color */
--color-primary-500: #0055b3  /* Light variant */
--color-primary-700: #002f63  /* Dark variant */
```

**Usage:** Headers, navigation, professional elements

### Secondary Color: Energy Orange
**Call-to-Action** - Energetic, attention-grabbing

```css
--color-secondary-500: #e67e22  /* Base color */
--color-secondary-400: #f39c12  /* Light variant */
--color-secondary-600: #d35400  /* Dark variant */
```

**Usage:** Buttons, CTAs, important actions, highlights

### Neutral Colors: Slate Gray
**Foundation** - Backgrounds, text, borders

```css
--color-neutral-50:  #f8fafc  /* Lightest */
--color-neutral-900: #0f172a  /* Darkest */
```

**Usage:** Backgrounds, text, cards, borders

## How to Change the Theme

### Method 1: Update CSS Variables (Recommended)

Edit `/app/globals.css` and change the color values:

```css
:root {
  /* Change primary blue to purple */
  --color-primary-600: #7c3aed;
  --color-primary-500: #8b5cf6;

  /* Change secondary orange to green */
  --color-secondary-500: #10b981;
  --color-secondary-400: #34d399;

  /* Entire site updates automatically! */
}
```

### Method 2: Swap Color Sets

Replace entire color palettes for a complete rebrand:

```css
/* Example: Swap to Tech Startup Theme */
:root {
  /* Primary: Teal */
  --color-primary-600: #0d9488;
  --color-primary-500: #14b8a6;

  /* Secondary: Pink */
  --color-secondary-500: #ec4899;
  --color-secondary-400: #f472b6;
}
```

## Component Classes

Pre-built components using the theme system:

### Buttons

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline">Outline Button</button>
```

### Cards

```html
<div class="card">Light card</div>
<div class="card-dark">Dark card with glass effect</div>
```

### Inputs

```html
<input class="input" placeholder="Light input" />
<input class="input-dark" placeholder="Dark input" />
```

### Status Badges

```html
<span class="badge badge-success">Approved</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Rejected</span>
<span class="badge badge-info">Info</span>
```

## Gradients

Predefined gradient backgrounds:

```html
<div class="bg-gradient-primary">Blue gradient</div>
<div class="bg-gradient-secondary">Orange gradient</div>
<div class="bg-gradient-dark">Dark gradient</div>
<div class="bg-gradient-dark-blue">Dark blue gradient</div>
```

## Semantic Tokens

Use semantic tokens for consistent theming:

```css
--color-text-primary    /* Main text color */
--color-text-secondary  /* Secondary text */
--color-text-muted      /* Muted text */
--color-text-inverse    /* Light text on dark backgrounds */

--color-bg-primary      /* Main background */
--color-bg-secondary    /* Secondary background */
--color-bg-dark         /* Dark background */

--color-border          /* Default border */
--color-border-light    /* Light border */
--color-border-dark     /* Dark border */
```

## Shadows

Custom shadows for brand consistency:

```css
--shadow-sm            /* Small shadow */
--shadow-md            /* Medium shadow */
--shadow-lg            /* Large shadow */
--shadow-xl            /* Extra large shadow */
--shadow-primary       /* Blue-tinted shadow */
--shadow-secondary     /* Orange-tinted shadow */
```

Usage:
```html
<div class="shadow-primary">Blue shadow</div>
<div class="shadow-secondary">Orange shadow</div>
```

## Using with Tailwind

The theme system works alongside Tailwind CSS:

```jsx
{/* Direct CSS variable usage */}
<div style={{ backgroundColor: 'var(--color-primary-600)' }}>
  Primary background
</div>

{/* Tailwind classes still work */}
<div className="bg-slate-900 text-orange-500">
  Tailwind classes
</div>

{/* Theme utility classes */}
<div className="bg-gradient-secondary shadow-secondary">
  Custom theme classes
</div>
```

## Spacing & Layout

Consistent spacing scale:

```css
--spacing-xs:  0.25rem  /* 4px */
--spacing-sm:  0.5rem   /* 8px */
--spacing-md:  1rem     /* 16px */
--spacing-lg:  1.5rem   /* 24px */
--spacing-xl:  2rem     /* 32px */
--spacing-2xl: 3rem     /* 48px */
```

## Border Radius

Consistent border radius:

```css
--radius-sm:   0.375rem  /* Small */
--radius-md:   0.5rem    /* Medium */
--radius-lg:   0.75rem   /* Large */
--radius-xl:   1rem      /* Extra large */
--radius-full: 9999px    /* Full circle */
```

## Transitions

Consistent animation timing:

```css
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
--transition-slow: 300ms ease-in-out
```

## Status Colors

Consistent status indication:

```css
--color-success: #10b981  /* Green - Success, approved */
--color-warning: #f59e0b  /* Yellow - Warning, pending */
--color-error:   #ef4444  /* Red - Error, rejected */
--color-info:    #3b82f6  /* Blue - Information */
```

## Best Practices

### ✅ DO
- Use CSS variables for colors whenever possible
- Use semantic tokens (e.g., `--color-text-primary`) over specific colors
- Use component classes (`.btn`, `.card`) for consistency
- Test theme changes across all pages

### ❌ DON'T
- Hardcode hex colors in components
- Mix theme systems (stick to one approach)
- Override theme colors with inline styles
- Create duplicate color variables

## Migration Guide

To migrate existing components to use the theme system:

### Before (Hardcoded):
```jsx
<button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg">
  Click me
</button>
```

### After (Theme System):
```jsx
<button className="btn btn-primary">
  Click me
</button>
```

## Theme Examples

### Corporate Professional
```css
--color-primary-600: #1e40af;    /* Navy blue */
--color-secondary-500: #0891b2;  /* Cyan */
```

### Creative Agency
```css
--color-primary-600: #7c3aed;    /* Purple */
--color-secondary-500: #ec4899;  /* Pink */
```

### Eco/Health
```css
--color-primary-600: #059669;    /* Green */
--color-secondary-500: #06b6d4;  /* Light blue */
```

### Tech Startup
```css
--color-primary-600: #0d9488;    /* Teal */
--color-secondary-500: #f59e0b;  /* Amber */
```

## Questions?

For questions about the theme system, contact:
- **Frontend Lead**: Aesthetica
- **Design System**: `/app/globals.css`
- **Components**: `/app/components/`

---

**Last Updated**: 2025-11-03
**Version**: 1.0
**Maintained by**: [Aesthetica] Frontend & UI/UX Team
