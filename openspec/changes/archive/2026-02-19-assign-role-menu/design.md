# Design: Assign Role Menu

## Context

The goal is to provide a way for administrators to assign menus to roles. Currently, this functionality is missing from the UI, although the backend APIs exist.

## Goals / Non-Goals

**Goals:**

- Add an "Assign Menu" button to the role list.
- Create a dialog (`AssignMenuDialog`) to display the menu tree.
- Fetch and display the current menu assignments for the selected role.
- Allow users to update assignments by checking/unchecking menu items.
- Save the updated assignments to the backend.

**Non-Goals:**

- Changing the menu structure itself (add/edit/delete menus).
- Modifying role details (name, code, etc.).
- Granular permission handling beyond menu assignment (e.g., specific button permissions within a page).

## Decisions

### UI Component Structure

- **Button Location**: The "Assign Menu" button will be placed in the "Actions" column of the `RoleTable` component, alongside existing actions like "Edit" (if any) or "Delete".
- **Dialog Component**: A new component `AssignMenuDialog` will be created. It will be triggered by the "Assign Menu" button and will handle the fetching and saving logic.
- **Tree Component**: We will use the existing `MenuTree` or a similar tree component (likely `antd`'s `Tree` or a custom wrapper if available) to display the hierarchy. The tree must support checkboxes (`checkable` prop in Ant Design).

### Data Handling

- **Fetching Data**:
  - The full menu tree will be fetched using `MenuManagerApi.getMenuTree` (or similar).
  - The role's current assignments will be fetched using `RoleManagerApi.getCheckedPremission`.
  - We need to merge these two data sources: the tree defines the structure, and the checks define the state.
- **State Management**:
  - The dialog will maintain the local state of selected keys (function IDs).
  - `checkedKeys` state will be initialized from `getCheckedPremission`.
  - `onCheck` handler will update `checkedKeys`.
- **Saving Data**:
  - `RoleManagerApi.saveSelectedFunc` expects a `FunctionsParam` object containing `roleId` and a list of `functionIds`.
  - We will map the `checkedKeys` to this format.

### Component Logic

- **AssignMenuDialog**:
  - Props: `visible`, `onCancel`, `onSuccess`, `roleId`.
  - Effects: When `roleId` changes and `visible` is true, fetch the menu tree and the role's checked permissions.
  - Render: A `Modal` containing a `Tree` component.
  - Actions: "Cancel" closes the modal. "Save" calls the update API and then `onSuccess`.

## Risks / Trade-offs

- **Performance**: If the menu tree is very large, rendering might be slow. However, for a typical admin system, the menu size is manageable.
- **Data Consistency**: Accessing the menu assignment while another admin is modifying the menu structure could potential lead to conflicts, but this is an edge case and acceptable for now.
