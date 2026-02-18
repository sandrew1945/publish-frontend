# User Management Specification (Delta)

## ADDED Requirements

### Requirement: User List Roles Display

The system SHALL display the assigned roles for each user in the list view.

#### Scenario: Roles Column Rendering

- **WHEN** the user list renders a row
- **THEN** a "Roles" column is displayed before the "Status" column
- **AND** the column shows the user's roles as distinct badges
- **AND** multiple roles are allowed to wrap within the column
