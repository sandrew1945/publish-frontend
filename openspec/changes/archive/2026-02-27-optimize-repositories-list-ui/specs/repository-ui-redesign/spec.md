## ADDED Requirements

### Requirement: Redesigned Repository List Header
The system SHALL display a modernized header for the repository list page.

#### Scenario: Viewing the page header
- **WHEN** the user navigates to the repositories page
- **THEN** the system displays the title "API Repositories", the subtitle "Manage and organize your API collections and services." and a primary "Create Repository" button with a plus icon.

### Requirement: Horizontal Search and Filter Bar
The system SHALL provide a search and filter bar aligned horizontally.

#### Scenario: Viewing the filter bar
- **WHEN** the user views the repositories list
- **THEN** they see in a single row: a search input, an "All Owners" dropdown, an "All Status" dropdown, and a primary "Search" button.

### Requirement: Modernized Repository Data Table
The system SHALL display the list of repositories in a modernized data table matching the new design system.

#### Scenario: Viewing repository columns
- **WHEN** repositories are listed
- **THEN** the table displays columns: "REPOSITORY NAME", "DESCRIPTION", "OWNER", "COLLABORATORS", "STATUS", and "ACTIONS".

#### Scenario: Viewing the Owner column
- **WHEN** a repository has an owner
- **THEN** the owner column shows the owner's avatar and their full name.

#### Scenario: Viewing the Collaborators column
- **WHEN** a repository has multiple collaborators
- **THEN** the system displays their avatars in an overlapping stack, optionally with a count (e.g., "+2") if there are many.

#### Scenario: Viewing the Status badge
- **WHEN** a repository has a status (e.g., Active, Inactive)
- **THEN** the status is displayed as a pill-shaped badge with a colored dot and text indicating the state.

#### Scenario: Viewing the Actions column
- **WHEN** a repository is listed in a row
- **THEN** the actions column displays three icon buttons: Folder (View/Manage), Edit, and Trash (Delete).

### Requirement: Styled Pagination Component
The system SHALL provide a pagination control styled for the dark theme.

#### Scenario: Viewing pagination controls
- **WHEN** the user scrolls to the bottom of the list
- **THEN** the system displays "Show [10] per page" selector on the left, and styled pagination buttons ("Previous", page numbers, "Next") on the right.
