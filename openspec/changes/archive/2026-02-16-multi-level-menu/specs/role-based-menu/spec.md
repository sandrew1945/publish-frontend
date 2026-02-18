## ADDED Requirements

### Requirement: Multi-Level Menu Rendering

The system SHALL support rendering of nested menu items up to at least 2 levels (System -> User Management).

#### Scenario: Parent Item Rendering

- **WHEN** a menu item has children
- **THEN** it renders as a collapsible parent item (e.g., using an accordion or dropdown style)
- **AND** it displays an indicator (chevron) showing expanded/collapsed state

#### Scenario: Child Item Navigation

- **WHEN** a parent item is expanded
- **THEN** its children are displayed indented or in a submenu
- **AND** clicking a child item navigates to the corresponding route

#### Scenario: Active State

- **WHEN** the current route matches a child item
- **THEN** the child item is highlighted as active
- **AND** the parent item is automatically expanded and highlighted
