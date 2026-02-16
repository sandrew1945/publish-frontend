## ADDED Requirements

### Requirement: Redesigned Sidebar

The sidebar must feel like a professional application navigation.

#### Scenario: Branding Section

- **WHEN** the sidebar renders
- **THEN** it displays an app logo/icon, the app name ("Vibe Publish"), and a version number at the top
- **AND** the branding section is visually separated from the menu items

#### Scenario: User Profile Section

- **WHEN** the sidebar renders
- **THEN** it displays the current user's avatar, name, and role at the bottom
- **AND** a logout icon/button is visible next to the user info

#### Scenario: Active State

- **WHEN** a menu item matches the current route
- **THEN** it is highlighted with a gradient background
- **AND** other items remain in a muted text color with hover transitions

### Requirement: Top Header Bar

The dashboard must include a sticky header bar above the main content.

#### Scenario: Header Content

- **WHEN** a dashboard page is displayed
- **THEN** a sticky header bar shows: breadcrumb navigation (e.g., "Home / Dashboard"), a search input, and a notification bell icon
- **AND** the header uses the card surface color and has a bottom border

### Requirement: Responsive Shell

#### Scenario: Mobile Behavior

- **WHEN** the viewport width is below `md` breakpoint
- **THEN** the sidebar is hidden by default
- **AND** a hamburger menu button appears in the header to toggle the sidebar
