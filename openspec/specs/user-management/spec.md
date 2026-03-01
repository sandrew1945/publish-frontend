# Spec: User Management

## Purpose
TBD - Manage user accounts and lists within the system.

## Requirements

### Requirement: View User List

Administrators should be able to view a paginated list of all users in the system. The list MUST use the standard `PaginationTable` component for consistent UI and loading behavior.

#### Scenario: List users with consistent UI

- **WHEN** Admin navigates to User Management page
- **AND** The data is loading
- **THEN** The system displays the standard `PaginationTable` skeleton loader
- **WHEN** The data finishes loading
- **THEN** System displays list of users matching the criteria using the `PaginationTable` component
- **AND** Shows columns matching the standard `ColumnDef` structure (Avatar, UserCode, UserName, Status, CreateTime, UpdateTime, Action)
