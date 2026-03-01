# Spec: Role Management (Delta)

## MODIFIED Requirements

### Requirement: View Role List

Administrators should be able to view a paginated list of all roles in the system. The list MUST use the standard `PaginationTable` component for consistent UI and loading behavior.

#### Scenario: List roles with consistent UI
- **WHEN** Admin navigates to Role Management page
- **AND** The data is loading
- **THEN** The system displays the standard `PaginationTable` skeleton loader
- **WHEN** The data finishes loading
- **THEN** System displays list of roles matching the criteria using the `PaginationTable` component
- **AND** Shows columns matching the standard `ColumnDef` structure: Role Code, Role Name, Status, Create Time, Update Time, and Action buttons (Edit, Assign Menu, Delete).
