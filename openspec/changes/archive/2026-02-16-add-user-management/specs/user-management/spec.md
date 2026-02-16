## ADDED Requirements

### Requirement: User List View
The system SHALL display a paginated list of users with filtering capabilities.

#### Scenario: Default List View
- **WHEN** a user navigates to the User Management page
- **THEN** the system displays a loading state
- **AND** fetches the first page of users (limit 10)
- **AND** renders a table with columns: User Code, User Name, Sex, Phone/Mobile, Email, Status, and Actions
- **AND** displays pagination controls at the bottom

#### Scenario: Filtering Users
- **WHEN** a user enters text in the search input or selects a status from the dropdown
- **THEN** the user list refreshes with the filtered results
- **AND** pagination resets to page 1

### Requirement: User Creation
The system SHALL allow authorized users to create new user accounts.

#### Scenario: Open Create Dialog
- **WHEN** the user clicks the "Create User" button
- **THEN** a modal dialog opens with an empty form
- **AND** the "Status" field defaults to "Active"

#### Scenario: Unique Code Validation
- **WHEN** the user enters a User Code
- **THEN** the system asynchronously validates checking uniqueness against the backend
- **AND** displays an error message if the code already exists

#### Scenario: Successful Creation
- **WHEN** the user submits a valid form
- **THEN** the dialog closes
- **AND** the user list refreshes to include the new user
- **AND** a success notification is shown

### Requirement: User Update
The system SHALL allow authorized users to modify existing user information.

#### Scenario: Open Edit Dialog
- **WHEN** the user clicks the "Edit" action on a user row
- **THEN** the modal dialog opens pre-filled with the user's current information
- **AND** the User Code field is read-only (identity field)

#### Scenario: Successful Update
- **WHEN** the user submits changes
- **THEN** the dialog closes
- **AND** the user list refreshes to show updated data
- **AND** a success notification is shown

### Requirement: User Deletion
The system SHALL allow authorized users to soft-delete user accounts.

#### Scenario: Delete Confirmation
- **WHEN** the user clicks the "Delete" action on a row
- **THEN** a confirmation dialog appears warning about the action

#### Scenario: Confirmed Deletion
- **WHEN** the user confirms deletion
- **THEN** the system sends a delete request
- **AND** removes the user from the list upon success
- **AND** displays a success notification

### Requirement: User Status Display
The system SHALL display user status using strict system dictionary definitions.

#### Scenario: Status Rendering
- **WHEN** the user list renders a row
- **THEN** the Status column displays a badge with label "Active" (Effective) for code `10011001` or "Inactive" (Invalid) for code `10011002`
- **AND** uses the `fixcode` configuration for strictly mapped labels
