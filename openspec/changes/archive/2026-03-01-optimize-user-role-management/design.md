## Context

The User Management and Role Management modules currently implement their own discrete data tables, complete with custom pagination logic, loading skeletons, and state management. Recently, a unified `PaginationTable` component was introduced (under `src/components/common/pagination-table`) to standardize these list views across the application, providing out-of-the-box loading states, consistent styling (matching the project's premium dark theme aesthetic), and simplified data mapping.

Migrating the existing custom tables to the new `PaginationTable` common component will reduce code duplication, standardize the UX, and make future global table updates easier to apply.

## Goals / Non-Goals

**Goals:**
- Replace the custom table implementation in `src/app/dashboard/user/page.tsx` with `PaginationTable`.
- Replace the custom table implementation in `src/app/dashboard/role/page.tsx` with `PaginationTable`.
- Define standard `ColumnDef` arrays for both User and Role lists that map the API responses to the UI correctly, including rendering action buttons (Edit, Assign Menu, Delete, etc.).
- Ensure loading states utilize the built-in skeleton of `PaginationTable`.

**Non-Goals:**
- Modifying the underlying backend APIs or data structures for User and Role management.
- Changing the existing form dialogs (Create/Edit User, Create/Edit Role, Assign Menu). The actions triggered by the table rows will remain unchanged.
- Adding new features to the User or Role management modules beyond standardizing the table display.

## Decisions

1. **Component Replacement**:
   - **Decision**: Directly swap out the current native `<Table>` (from shadcn/ui or custom implementation) wrappers and their associated custom pagination footers with the `<PaginationTable>` component in both `page.tsx` files.
   - **Rationale**: `PaginationTable` encapsulates the table structure, the map iteration for rows, and the pagination controls. This significantly reduces the boilerplate in the page components.

2. **Column Definition Extraction**:
   - **Decision**: Define the `columns` array (of type `ColumnDef<UserDTO>` and `ColumnDef<RoleDTO>`) either at the top of the `page.tsx` file or in a separate `columns.tsx` file within the respective module directory.
   - **Rationale**: The `PaginationTable` expects a rigid `columns` structure. Keeping it separate from the main component render logic keeps the JSX clean. Inline definition within the page component is preferred for simplicity unless the column logic becomes inherently complex (e.g., lots of complex cell renderers). Given the actions required (Edit, Delete, Assign Menu), inline definition within the component or closely co-located is best to easily pass down action handlers.

3. **Loading State Handling**:
   - **Decision**: Use the `isLoading` prop of the `PaginationTable` to handle the skeleton state automatically, removing any custom manual `Skeleton` wrappers currently present in the User and Role pages.
   - **Rationale**: Centralizing the loading state ensures visual consistency across the app whenever a list is fetching data.

## Risks / Trade-offs

- **[Risk]**: Action button handlers (Edit, Delete, Assign Menu) might lose scope or context when moved into a generic `columns` definition array if not handled carefully.
  - **Mitigation**: Define the `columns` array inside the main React component body using `useMemo` so it has closure access to the component's state and handler functions (e.g., `handleEdit`, `handleDelete`).

- **[Risk]**: The `PaginationTable` might not perfectly align with some custom aesthetic tweaks originally made in the User or Role tables.
  - **Mitigation**: Verify the rendered output against the target aesthetic. The `PaginationTable` was designed to be the standard, so adopting its look is the goal. Minor css tweaks can be passed via `className` props if strictly necessary.
