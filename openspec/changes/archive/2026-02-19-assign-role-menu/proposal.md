# Proposal: Assign Role Menu

## Problem

Currently, administrators cannot assign menus to roles directly from the Role Management interface. There is no visual way to see which menus are accessible to a specific role or to modify these assignments, which limits the ability to manage role-based access control effectively.

## Solution

Add an "Assign Menu" button to the "Actions" column in the Role Management table. When clicked, this button will open a modal (`AssignMenuDialog`) displaying the entire menu structure in a tree view with checkboxes.

- The tree will show which menus are currently assigned to the selected role (checked).
- Users can check/uncheck menus to modify the role's permissions.
- Saving the changes will update the role's menu assignments via the backend API.

## What Changes

### New Capabilities

- `assign-role-menu`: Enables assigning and unassigning menus for a specific role via a UI dialog.

### Modified Capabilities

- `role-management`: Enhanced to include the menu assignment entry point in the role list.

## Capabilities

### New Capabilities

- `assign-role-menu`: Handles the UI and logic for fetching current menu assignments for a role, displaying them in a checkable tree, and saving the updated assignments.

### Modified Capabilities

<!-- No existing spec-level capabilities are changing requirements, just implementation extension -->

## Impact

### Frontend

- **Components**:
  - `src/components/role-management/role-table.tsx`: Add "Assign Menu" button to actions.
  - `src/components/role-management/assign-menu-dialog.tsx` (New): Modal component containing the menu tree.
- **Services**:
  - `src/services/role-management-service.ts`: Add methods to fetch role's menus and save assignments (using `getCheckedPremission` and `saveSelectedFunc`).
- **Types**:
  - `src/types/backend-types.ts`: Ensure `FunctionsParam` and `TreeNode` are correctly used.

### Backend

- Utilizes existing `RoleManagerApi` endpoints:
  - `GET /rolemanager/getCheckedPremission`
  - `POST /rolemanager/saveSelectedFunc`
  - `GET /menumanager/getMenuTree` (via `MenuManagerApi` for the full tree)
