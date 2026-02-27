## 1. Setup and Types
- [x] 1.1 Add `repository` related types (e.g., `Repository`, `RepositoryQuery`, `RepositoryFormValues`) to the frontend typescript definitions.
- [x] 1.2 Create `src/services/repository-service.ts` to define the API calls (`query`, `create`, `update`, `delete`) matching the swagger endpoints.

## 2. UI Components Construction
- [x] 2.1 Create the `RepositoryFormDialog` component for adding and editing repositories with fields for Name, Description, Collaborators, and Status, including unique name validation logic.
- [x] 2.2 Create the `RepositoryTable` component to display the list of repositories, including columns for Name, Description, Collaborators, Status, and Actions (Edit, Delete).
- [x] 2.3 Create the main `RepositoryManagement` page integrating the search bar, status filter, `RepositoryTable`, and `RepositoryFormDialog` with pagination support.

## 3. Integration & Navigation
- [x] 3.1 Update the application routing/navigation (e.g., Sidebar) to include the new "Repositories" menu item under the root or administrative section.
- [x] 3.2 Wire up the frontend components with the backend API calls ensuring proper error handling and layout updates on data mutation.
