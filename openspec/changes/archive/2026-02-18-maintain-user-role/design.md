# Design: Maintain User Role

## Context

Current User Management system displays users but lacks role management directly in the list view. To manage roles, administrators must navigate to a separate page or use APIs directly (hypothetically, as current flow is missing). We are adding inline role management.

## Goals

### User Experience

- Open a modal/dialog from the User List to manage roles.
- Load current roles on dialog open.
- Allow selecting new roles from a dropdown.
- Allow removing existing roles.
- Reflect changes immediately or upon successful API response.

### Technical Implementation

- Reuse existing API client structure.
- Interact with `UserController` endpoints: `/queryRelationRoles`, `/deleteRoleRelation`, `/queryUnRelationRoles`.
- Prioritize clean separation of concerns (UI vs Data fetching).

## Non-Goals

- Refactoring the entire User Management module.
- Managing Role definitions (permissions, names).

## Decisions

### Component Structure

We will create a specific `MaintainRoleDialog` component rather than adding complexity to `UserFormDialog` (which is for valid user creation/edition).

- **`MaintainRoleDialog`**: Handles the logic for fetching and updating roles.
- **`UserTable`**: Adds the trigger button.

### State Management

State will be managed locally within `MaintainRoleDialog` using React `useState` and `useEffect` (or `useQuery`/`useMutation` if TanStack Query is available/preferred in the project). Given `user-management-service.ts` exists, we'll extend it.

### Error Handling

Standard try-catch blocks with toast notifications for success/failure feedback.

## Risks / Trade-offs

- **Risk**: Role list might be large.
- **Mitigation**: The API response for `queryUnRelationRoles` might need pagination, but for now we assume a manageable number of roles. If it grows, we might need a search/autocomplete combo box.
