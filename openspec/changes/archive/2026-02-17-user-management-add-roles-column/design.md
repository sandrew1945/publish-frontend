# Design: User Management - Add Roles Column

## Context

The User Management feature currently lists users but does not display their assigned roles. This information is critical for administrators. The backend API (`userManagerPageQuery`) already includes role information in its response, so no backend changes are needed.

## Goals / Non-Goals

**Goals:**
- Display a "Roles" column in the User Management list view.
- Ensure the Roles column fits visually within the existing table layout.
- Handle cases where a user has multiple roles (e.g., comma-separated or badges).
- Handle cases where a user has no roles (e.g., display a dash or empty state).

**Non-Goals:**
- Modifying the role assignment workflow.
- Filtering or sorting by the new Roles column (unless already supported by backend, which is out of scope for this specific task).
- Changing backend API logic.

## Decisions

### 1. Column Placement
- Insert the "Roles" column after the "User Name" or "User Code" column, or before the "Status" column.
- **Decision**: Place it before "Status" to keep identity fields (Code, Name) grouped and status/actions at the end.

### 2. Data Display Format
- **Option A**: Comma-separated strings (e.g., "Admin, Editor")
- **Option B**: Badges/Tags (e.g., [Admin] [Editor])
- **Decision**: Use **Badges/Tags**. This aligns with the "premium" and "modern" design aesthetic of the application, improving readability and visual hierarchy.

### 3. Handling Multiple Roles
- If a user has many roles, the row height could expand or the column width could become excessive.
- **Decision**: Wrap roles within the column. If there are too many (e.g., > 3), consider showing the first few and a "+N" indicator, or just let them wrap if the average case is small. Given typical use cases, wrapping or a maximum of 3 badges is likely sufficient. For now, we will display all roles as badges, allowing them to wrap naturally.

## Risks / Trade-offs

- **Table Horizontal Space**: Adding a column consumes horizontal space. On smaller screens, this might cause scrolling or cramping.
  - *Mitigation*: Ensure the table is responsive or scrollable. The roles column should have a reasonable min-width.
- **Data Availability**: Relying on `userManagerPageQuery` returning roles. If the API response structure is different than expected, frontend adjustments will be needed.
  - *Mitigation*: Verify API response structure during implementation.
