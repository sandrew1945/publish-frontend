## ADDED Requirements

### Requirement: Repository Listing
The system SHALL provide a view to list all code repositories. The repository list page SHALL display repository records using the shared `PaginationTable` component with a declarative `columns` definition, replacing the bespoke `RepositoryTable` component. The list MUST support pagination and allow filtering by repository name, owner, and status.

#### Scenario: View repository list on page load
- **WHEN** the user navigates to the Repository Management page
- **THEN** it SHALL provide a `columns` array containing: Repository Name (`data`), Description (`data`), Owner (`slot`), Collaborators (`slot`), Status (`slot`), and Actions (`slot`)
- **AND** the system fetches and displays the first page of repositories

#### Scenario: Skeleton loading on initial fetch
- **WHEN** data is being fetched (loading state is true)
- **THEN** the `PaginationTable` SHALL render skeleton rows matching `pageSize`; no spinner element outside the table SHALL be rendered

#### Scenario: Pagination controls wired correctly
- **WHEN** the user changes page or page size in `TablePagination`
- **THEN** `page` and `pageSize` state SHALL update in the page component and `fetchData` SHALL be called

#### Scenario: Filter repositories by name
- **WHEN** the user enters a specific text into the search bar and submits
- **THEN** the system displays only the repositories that contain the matching text in their names

#### Scenario: Filter repositories by status
- **WHEN** the user selects a specific status from the status dropdown filter
- **THEN** the system displays only the repositories matching the selected status

### Requirement: Create Repository
The system SHALL provide functionality to add a new repository. The repository MUST support setting a Name, Description, assigning Collaborators, and defining Status. The name of the new repository MUST be validated to ensure it is unique within the system.

#### Scenario: Successfully create a new repository
- **WHEN** the user fills out the repository creation form with valid and unique data (including name, description, collaborators, and status), and submits
- **THEN** the system saves the new repository and updates the list view to include it

#### Scenario: Attempt to create a repository with a duplicate name
- **WHEN** the user fills out the repository creation form with a name that already exists, and submits
- **THEN** the system prevents submission and displays an error indicating the name must be unique

### Requirement: Modify Repository
The system SHALL provide functionality to edit the details of an existing repository.

#### Scenario: Successfully update repository details
- **WHEN** the user opens the edit form for a repository, modifies allowable fields, and submits
- **THEN** the system saves the updated configuration and reflects the changes in the list view

### Requirement: Delete Repository (Logical)
The system SHALL provide functionality to logically delete a repository. A deleted repository MUST NOT be completely removed from the database but marked as deleted.

#### Scenario: Successfully delete a repository
- **WHEN** the user triggers the delete action for a repository and confirms the prompt
- **THEN** the system marks the repository as deleted via a backend request and removes it from the active list view
