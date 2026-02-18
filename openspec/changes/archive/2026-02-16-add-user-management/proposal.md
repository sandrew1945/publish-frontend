## Why

The system currently has no frontend interface for managing users. Admins need the ability to view, create, edit, and delete users directly from the dashboard. The backend APIs already exist (`/usermanager/*`), so this change builds the frontend UI to consume them under the **System Management → User Management** menu path.

## What Changes

- Add a **User Management** page under the System Management section, accessible via the sidebar menu.
- Implement a **paginated user list** with search/filter support (by user code, user name, user status).
- Implement a **Create User** dialog/form with user code uniqueness validation.
- Implement an **Edit User** dialog/form for updating user information.
- Implement **Delete User** with confirmation dialog (soft-delete).
- Implement a **User Detail** view to retrieve a single user's information.
- Add API client functions for all User Management backend endpoints.

## Capabilities

### New Capabilities

- `user-management`: Full user CRUD UI — list with pagination & filters, create/edit/delete operations, detail view, user code validation. Integrates with the existing `/usermanager/*` backend endpoints.

### Modified Capabilities

- `api-client`: Add typed API functions for user management endpoints (page query, create, update, delete, get by ID, validate code).

## Impact

- **Frontend routes**: New route(s) under the System Management section (e.g., `/dashboard/system/user-management`).
- **API client layer**: New request functions and TypeScript types for `UserManagerDTO` and related response shapes.
- **Sidebar/menu**: The menu item is driven by the backend role-based menu system — no hardcoded menu changes needed, but the `path` must match the registered menu entry.
- **Design system**: Reuses existing components (Button, Input, Card) and may introduce a Table/DataGrid component for the user list.
