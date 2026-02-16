## Architecture

No architectural changes. This is a visual/UI-layer change only. The existing component structure, API client, and routing remain unchanged.

## Design Decisions

### Dark-First Theme Strategy
The color system switches to a dark-first approach. The `:root` selector now defines the dark palette, with `.light` as the override. This matches modern SaaS conventions and reduces eye strain for power users.

**Surface layering** (3 levels):
| Token | Purpose | Example HSL |
|-------|---------|-------------|
| `--background` | Page background | `222 47% 6%` (near-black navy) |
| `--card` | Card / sidebar surface | `220 40% 10%` (dark slate) |
| `--popover` | Elevated popover / modal | `218 35% 14%` (lighter slate) |

### Accent & Gradient System
- Primary accent: Vibrant blue (`210 100% 52%`) for CTAs and active states
- Success/Warning/Destructive: Semantic colors for status indicators
- Gradient: `from-blue-500 to-cyan-400` for sidebar active states and hero text

### Component Design Language
- **Cards**: Subtle border (`border-white/5`), soft glow on hover via `box-shadow`
- **Sidebar**: Fixed left, dark surface, gradient highlight on active item, user avatar at bottom
- **Header**: Sticky top with breadcrumbs, search input, notification icon
- **Stats cards**: Icon badge (colored circle), large number, trend indicator with arrow

### Animation Strategy
Using Framer Motion (already installed):
- `fadeInUp` for card entrance on page load
- `scale` on card hover (1.00 → 1.02)
- `sidebar item` slide-in on mount

## Risks

- **Accessibility**: Dark themes must maintain WCAG AA contrast ratios (4.5:1 for text). Muted foreground color needs to be at least `hsl(215, 20%, 65%)`.
- **Light mode**: Keeping a workable light mode as secondary. Not the focus but should not break.

## Open Questions

None — the reference design provides clear direction.
