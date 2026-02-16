## ADDED Requirements

### Requirement: Tailwind CSS Configuration

Configure Tailwind CSS to match the premium design aesthetic.

#### Scenario: Design Tokens

- **WHEN** the project is initialized
- **THEN** Tailwind CSS is configured with a custom color palette (primary, secondary, neutral, success, warning, error)
- **AND** Custom font families (Inter/Outfit) are configured
- **AND** Border radius and spacing tokens are defined for consistency

### Requirement: Dark Mode Support

Ensure the application supports both light and dark modes.

#### Scenario: Theme Toggling

- **WHEN** a user toggles the theme
- **THEN** the application UI updates immediately without a page reload
- **AND** the preference is persisted in local storage
- **AND** system preference is respected by default

### Requirement: Core UI Components

Implement a set of base UI components using the design system.

#### Scenario: Button Component

- **WHEN** the Button component is used
- **THEN** it supports variants (primary, secondary, ghost, dange) and sizes (sm, md, lg)
- **AND** it handles loading states and disabled states properly

#### Scenario: Input Component

- **WHEN** the Input component is used
- **THEN** it supports standard HTML input attributes
- **AND** it displays validation error messages when provided
- **AND** it has focus and hover states consistent with the design system
