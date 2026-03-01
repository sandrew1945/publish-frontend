## Why

The User and Role Management features currently use custom list tables for data display. This leads to inconsistent user experiences across the application, redundant code, and higher maintenance overhead. We recently introduced a common `pagination-table` component that standardizes how paginated data and tables are displayed, complete with skeleton loading states and consistent styling. Migrating these modules to use the generic component will unify the UI, improve maintainability, and ensure that any future table enhancements automatically apply to User and Role Management.

## What Changes

- Replace the custom data tables in the User Management list page (`src/app/dashboard/user/page.tsx`) with the `PaginationTable` component.
- Replace the custom data tables in the Role Management list page (`src/app/dashboard/role/page.tsx`) with the `PaginationTable` component.
- Extract columns definitions for User and Role lists to utilize the generic `ColumnDef` structure expected by `PaginationTable`.
- Remove duplicate pagination logic, skeleton loaders, and table wrapper components in User and Role modules, deferring to the common `pagination-table` implementation.
- Standardize the loading state using the generic table skeleton.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. -->

### Modified Capabilities
- `user-management`: Standardizing the list view UI, loading states, and pagination behavior to match the global application standard.
- `role-management`: Standardizing the list view UI, loading states, and pagination behavior to match the global application standard.

## Impact

- **Affected Code**: User List page, Role List page, related components and styles.
- **Dependencies**: Depends on the existing `PaginationTable` component.
- **System**: Improves frontend rendering consistency. Behavior remains the same, but the underlying component architecture changes significantly.
