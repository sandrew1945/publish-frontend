## 1. Preparation & Layout Updates

- [x] 1.1 Extract required color tokens and styles into the project's Tailwind config or CSS file, if not already present.
- [x] 1.2 Update the `RepositoriesPage` header to match the new text ("API Repositories", subtitle, and primary button).
- [x] 1.3 Create a new horizontal search and filter row integrating the search input, "All Owners" select, "All Status" select, and "Search" button.

## 2. Table Component Refactoring

- [x] 2.1 Create or import an `Avatar` and `AvatarStack` component for displaying users.
- [x] 2.2 Update `RepositoryTable` schema to reflect the new design (Name, Description, Owner, Collaborators, Status, Actions).
- [x] 2.3 Implement custom cell rendering for the "Owner" column (Avatar + Name).
- [x] 2.4 Implement custom cell rendering for the "Collaborators" column (Avatar Stack with overflow count).
- [x] 2.5 Implement custom cell rendering for the "Status" column (styled pill badge with indicator dot).
- [x] 2.6 Implement custom cell rendering for the "Actions" column (inline icon buttons for View, Edit, Delete).

## 3. Pagination & Polish

- [x] 3.1 Style the data table pagination footer to match the design (e.g., "Show [10] per page" layout, dark themed page buttons).
- [x] 3.2 Verify hover, focus, and active states for all interactive components (buttons, table rows, dropdowns).
- [x] 3.3 Perform a final UI review against the provided mockup to ensure pixel-perfect consistency in spacing and typography.
- [x] 3.4 Test the new UI locally in the browser to ensure all interactions, responsive behaviors, and data displaying correctly.
