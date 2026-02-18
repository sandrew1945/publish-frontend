# Spec: Role Management

## ADDED Requirements

### Requirement: View Role List

Administrators should be able to view a paginated list of all roles in the system.

#### Scenario: List roles with filters

- **WHEN** Admin navigates to Role Management page
- **AND** Enters filter criteria (Role Code, Role Name, or Status)
- **THEN** System displays list of roles matching the criteria
- **AND** Shows columns: Role Code, Role Name, Status, Create Time, Update Time

### Requirement: Create Role

Administrators should be able to create a new role.

#### Scenario: Create new role successfully

- **WHEN** Admin clicks "Create Role" button
- **AND** Fills in Role Code, Role Name, and Description
- **AND** Clicks "Confirm"
- **THEN** System validates Role Code is unique
- **AND** System creates the new role
- **AND** Role list is refreshed to show the new role

#### Scenario: Create role with duplicate code

- **WHEN** Admin attempts to create a role with an existing Role Code
- **THEN** System shows an error message "Role Code already exists"
- **AND** Role is not created

### Requirement: Modify Role

Administrators should be able to update existing role information.

#### Scenario: Update role details

- **WHEN** Admin clicks "Edit" on a role
- **AND** Modifies Role Name or Description (Role Code is usually immutable or requires special handling, assuming mutable for now unless constrained)
- **AND** Clicks "Confirm"
- **THEN** System updates the role information
- **AND** Role list reflects the changes

### Requirement: Delete Role

Administrators should be able to remove a role from the system (logical delete).

#### Scenario: Delete a role

- **WHEN** Admin clicks "Delete" on a role
- **AND** Confirms the deletion prompt
- **THEN** System marks the role as deleted (status invalid or deleted flag)
- **AND** Role is removed from the active list (or shown as invalid depending on implementation, prompt said "logic delete", assuming removed from default view)
