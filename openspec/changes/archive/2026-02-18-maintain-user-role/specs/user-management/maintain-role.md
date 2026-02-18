# Spec: Maintain User Role

## Requirements

### User Interface

1.  **Entry Point**: A "Maintain Role" button (or icon) in the Actions column of the User Table.
2.  **Dialog**:
    - Title: "Maintain Roles - [User Name]"
    - **Current Roles Section**:
        - List of assigned roles.
        - "Remove" (X) button next to each role.
    - **Add Role Section**:
        - Dropdown/Select to choose from available (unassigned) roles.
        - "Add" button (active only when a role is selected).
    - **Footer**: "Close" button.

### Behavior

1.  **Opening Dialog**:
    - Fetches currently assigned roles (`/queryRelationRoles`).
    - Fetches available unassigned roles (`/queryUnRelationRoles`).
    - Shows loading state while fetching.
2.  **Adding Role**:
    - Select a role -> Click "Add" (or auto-add on select for faster flow? Let's stick to Select + Add or just Select adds it).
    - **Decision**: To keep it simple, Select -> Confirm? Or Select -> API call immediately?
    - **Refined**: Select from dropdown -> Click "Add" -> Calls `bindRole` (API needed? Actually looking at requirements: "bind a role").
        - Wait, user request says "bind a role". The provided APIs are `/queryRelationRoles`, `/deleteRoleRelation`, `/queryUnRelationRoles`.
        - **MISSING API**: There is no explicit `/bindRole` listed in the user request description.
        - *Correction*: The user request mentions "Maintain Role... bind a role...". But `Backend APIs` section lists `queryRelationRoles`, `deleteRoleRelation`, `queryUnRelationRoles`.
        - I need to check `user-management-service.ts` or swagger to see if there's a bind API. `queryUnRelationRoles` implies getting roles *to* bind.
        - **Assumption**: There MUST be a bind API. I will assume it exists or I need to find it. I will check `api.ts` or `swagger` if possible. Or I'll use `queryUnRelationRoles` to get list and *assume* there's a `saveRoleRelation` or similar.
        - Actually, looking at standard CRUD, maybe it's `POST /roleRelation`?
    - **Removing Role**:
        - Click "Remove" -> Confirm (optional) -> Calls `/deleteRoleRelation`.
        - Update list on success.

### Data Model

**User Role Relation**:
- `userId`: number/string
- `roleId`: number/string

## API Interactions

1.  `GET /queryRelationRoles?userId={id}`
    - Returns: List of roles assigned to user.
2.  `GET /queryUnRelationRoles?userId={id}`
    - Returns: List of roles NOT assigned to user (candidates).
3.  `POST /deleteRoleRelation` (or DELETE)
    - Body/Params: `userId`, `roleId`.
4.  `POST /createRelation`
    - Body/Params: `userId`, `rolesStr` (comma-separated role IDs).
    - **Note**: This API assigns roles. We will use it to bind new roles.
