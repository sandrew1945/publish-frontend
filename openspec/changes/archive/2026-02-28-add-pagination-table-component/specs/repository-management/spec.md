## MODIFIED Requirements

### Requirement: Repository list displays paginated data
The repository list page SHALL display repository records using the shared `PaginationTable` component with a declarative `columns` definition, replacing the bespoke `RepositoryTable` component.

#### Scenario: Columns declared for repository list
- **WHEN** the repository list page mounts
- **THEN** it SHALL provide a `columns` array containing: Repository Name (`data`), Description (`data`), Owner (`slot`), Collaborators (`slot`), Status (`slot`), and Actions (`slot`)

#### Scenario: Skeleton loading on initial fetch
- **WHEN** data is being fetched (loading state is true)
- **THEN** the `PaginationTable` SHALL render skeleton rows matching `pageSize`; no spinner element outside the table SHALL be rendered

#### Scenario: Pagination controls wired correctly
- **WHEN** the user changes page or page size in `TablePagination`
- **THEN** `page` and `pageSize` state SHALL update in the page component and `fetchData` SHALL be called

#### Scenario: RepositoryTable no longer used
- **WHEN** the repository list page is rendered
- **THEN** `RepositoryTable` SHALL NOT be imported or rendered; `PaginationTable` SHALL replace it
