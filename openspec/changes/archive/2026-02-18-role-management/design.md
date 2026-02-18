# Design: Role Management

## Architecture

The Role Management feature will follow the existing frontend architecture:

- **Framework**: Next.js 14 (App Router)
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS + Shadcn UI (inferred from `card.tsx` and `button` usage in context)
- **API Client**: Axios instance with interceptors (`src/lib/api-client.ts`)

The feature will be implemented as a new module under the System section.

## Backend API

Based on the Swagger documentation, the following endpoints will be used:

| Operation     | Method | Endpoint                            | Description                 |
| ------------- | ------ | ----------------------------------- | --------------------------- |
| List Roles    | POST   | `/rolemanager/roleManagerPageQuery` | Paginated list with filters |
| Get Role      | GET    | `/rolemanager/getRoleInfoById`      | Get details by ID           |
| Create Role   | POST   | `/rolemanager/createRole`           | Create a new role           |
| Update Role   | POST   | `/rolemanager/updateRole`           | Update existing role        |
| Delete Role   | POST   | `/rolemanager/deleteRole`           | Logic delete a role         |
| Validate Code | GET    | `/rolemanager/roleValidate`         | Check code uniqueness       |

## Data Model

```typescript
// src/services/role-management-service.ts

export interface Role {
  roleId: number;
  roleCode: string;
  roleName: string;
  roleType?: number; // 1: Admin, 2: User, etc. (if applicable)
  roleStatus: number; // 1: Valid, 0: Invalid
  description?: string; // If supported by backend (not in Swagger PO but common)
  createDate?: string;
  updateDate?: string;
}

export interface RoleFilter {
  roleCode?: string;
  roleName?: string;
  roleStatus?: number;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export interface RolePageResult {
  records: Role[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
```

## Frontend Components

The component structure will mirror the `user-management` module for consistency.

### Directory Structure

```
src/
  app/
    (dashboard)/
      system/
        role-management/
          page.tsx              # Main entry point, Server Component
  components/
    role-management/
      role-list-page.tsx        # Client Component, manages state
      role-filter-bar.tsx       # Search and filter inputs
      role-table.tsx            # Data display
      role-form-dialog.tsx      # Create/Edit modal
      role-delete-dialog.tsx    # Delete confirmation
      role-status-badge.tsx     # Status indicator
  hooks/
    use-role-management.ts      # React Query hooks
  services/
    role-management-service.ts  # API service layer
```

### Component Responsibilities

1.  **`page.tsx`**: Renders the `RoleListPage` component.
2.  **`RoleListPage`**:
    - Manages `filter` and `pageParams` state.
    - Uses `useRoleList` hook to fetch data.
    - Renders `RoleFilterBar` and `RoleTable`.
    - Handles "Create Role" button click.
3.  **`RoleFilterBar`**:
    - Inputs for Role Code, Role Name.
    - Select for Status.
    - Updates parent state on search/reset.
4.  **`RoleTable`**:
    - Displays role data in a table.
    - actions column: "Edit", "Delete".
    - Uses `RoleStatusBadge` for status column.
5.  **`RoleFormDialog`**:
    - Validates inputs (Role Code uniqueness, required fields).
    - Uses `useCreateRole` or `useUpdateRole` based on mode.
6.  **`RoleDeleteDialog`**:
    - Shows generic warning.
    - Uses `useDeleteRole`.

## State Management (Hooks)

`src/hooks/use-role-management.ts` will define query keys and hooks:

```typescript
export const ROLE_QUERY_KEYS = {
  all: ['roles'] as const,
  lists: () => [...ROLE_QUERY_KEYS.all, 'list'] as const,
  list: (filter, pageParams) => [...ROLE_QUERY_KEYS.lists(), { filter, pageParams }] as const,
  details: () => [...ROLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id) => [...ROLE_QUERY_KEYS.details(), id] as const,
};

// Hooks: useRoleList, useRoleDetail, useCreateRole, useUpdateRole, useDeleteRole, useValidateRoleCode
```

## Implementation Plan

1.  **Service Layer**: Create specific service for role management.
2.  **Hooks**: Implement React Query hooks.
3.  **Components**: Build UI components starting from leaf nodes (Badge, Dialogs) up to Page.
4.  **Integration**: Assemble in `page.tsx` and test against backend.
