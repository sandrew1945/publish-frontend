## Why

The current UI uses bare-minimum Tailwind defaults — flat colors, no depth, no visual hierarchy, and a bland light-mode-only feel. A premium CMS platform needs to look and feel professional from the first glance. The reference design demonstrates what users expect: a rich dark palette, glassmorphism cards, meaningful iconography, gradient accents, and micro-animations that bring the interface to life.

## What Changes

- **Complete color palette overhaul**: Replace generic light-mode defaults with a polished dark-first theme using deep navy/slate backgrounds, vibrant accent colors, and layered card surfaces
- **Sidebar redesign**: Gradient active state, app logo/version branding, user avatar section at bottom, collapsible behavior
- **Dashboard page redesign**: Stats cards with icons and trend indicators, data visualization placeholder, system health panel, recent activity feed
- **Landing page redesign**: Modern hero section with gradient text, animated CTA, and feature highlights
- **Header/Topbar**: Breadcrumb navigation, search bar, notification bell
- **Micro-animations**: Framer Motion transitions for page loads, card hover effects, sidebar interactions
- **Typography upgrade**: Better heading hierarchy using Outfit font, improved spacing and line heights

## Capabilities

### New Capabilities
- `premium-theme`: Dark-first color system with layered surfaces, gradient accents, and glassmorphism effects
- `dashboard-ui`: Rich dashboard layout with stats cards, charts placeholder, activity feed, and system health panel
- `app-shell`: Header with breadcrumbs/search, redesigned sidebar with branding and avatar, responsive shell

### Modified Capabilities
- `design-system`: Color tokens updated to dark-first palette; new CSS variables for surface layers, gradients, and glow effects

## Impact

- **Files changed**: `globals.css`, `tailwind.config.ts`, `sidebar.tsx`, `dashboard-layout.tsx`, `page.tsx` (landing), `(dashboard)/dashboard/page.tsx`, new header component
- **Dependencies**: No new dependencies (leverages existing `framer-motion`, `lucide-react`)
- **Visual**: Entire app appearance changes — this is a visual-breaking change for anyone used to the current look
