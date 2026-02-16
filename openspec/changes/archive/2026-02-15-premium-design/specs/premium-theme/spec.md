## ADDED Requirements

### Requirement: Dark-First Color Palette

The application must use a dark-themed color palette as the default theme.

#### Scenario: Surface Layering

- **WHEN** the application renders in dark mode (default)
- **THEN** the page background uses a deep navy (`hsl(222 47% 6%)`)
- **AND** cards and sidebar use a slightly lighter surface (`hsl(220 40% 10%)`)
- **AND** elevated elements (popovers, modals) use a third surface level (`hsl(218 35% 14%)`)

#### Scenario: Accent Colors

- **WHEN** interactive elements (buttons, active states) are displayed
- **THEN** the primary accent color is a vibrant blue (`hsl(210 100% 52%)`)
- **AND** success states use green, warning states use amber, destructive states use red
- **AND** gradient accents (`blue-500 → cyan-400`) are used for key highlights

### Requirement: Glassmorphism & Depth

Cards and elevated surfaces must convey visual depth.

#### Scenario: Card Styling

- **WHEN** a card component is rendered
- **THEN** it has a subtle semi-transparent border (`border-white/5` or `border-white/10`)
- **AND** it has a soft background with slight transparency
- **AND** on hover, it displays a subtle glow via `box-shadow`

### Requirement: Gradient Highlights

#### Scenario: Active Sidebar Item

- **WHEN** a sidebar menu item is active
- **THEN** it displays a gradient background (blue-to-cyan) instead of a flat color
- **AND** the text becomes white and bold
