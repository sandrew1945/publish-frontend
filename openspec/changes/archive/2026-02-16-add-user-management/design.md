## Context

The Vibe Publish frontend is a Next.js (App Router) application with a premium dark-themed design system. The backend already exposes a full set of User Management REST endpoints under `/usermanager/*`, and the auto-generated `Api` class in `src/lib/api.ts` provides typed methods for all of them. The project uses React Query for server-state management and has an existing dashboard shell with sidebar, header, and breadcrumbs.

Currently there is no page or route that renders User Management UI — only the backend APIs and the generated client exist.

## Goals / Non-Goals

**Goals:**
- Build a User Management page at `/system/user-management` with a paginated, filterable data table.
- Provide modal dialogs for Create, Edit, and Delete operations.
- Reuse the auto-generated `Api` class (`api.usermanager.*`) — no duplicate HTTP calls.
- Use React Query hooks for data fetching, mutation, and cache invalidation.
- Follow the existing design system (dark theme, glassmorphism cards, design tokens).

**Non-Goals:**
- Role assignment UI (assign/remove roles from a user) — separate change.
- Password management UI — separate change.
- Modifying the backend API contracts.
- Building a generic/reusable DataTable component library — keep it fit-for-purpose.

## Decisions

### 1. Route structure

**Decision:** Place the page at `src/app/(dashboard)/system/user-management/page.tsx`, producing the route `/system/user-management`.

**Why:** `system` sits at the same level as `dashboard` inside the `(dashboard)` layout group — this is reasonable because "System Management" is a top-level navigation section, not a child of Dashboard. The `(dashboard)` group provides the shared shell (sidebar, header) without adding a URL segment. Future sibling pages (Role Management, Menu Management) go under `system/` as well.

**Alternatives considered:**
- `/dashboard/system/user-management` — nests system under dashboard, which misrepresents the hierarchy since System Management is a peer section.

### 2. API integration layer

**Decision:** Create a thin service file `src/services/user-management-service.ts` that wraps the auto-generated `api.usermanager.*` calls and returns clean domain types.

**Why:** The auto-generated `Api` class is verbose and its response types use `JsonResult` with `data: object`. The service layer casts responses to concrete types, centralizes error handling, and keeps page components free of API plumbing.

**Alternatives considered:**
- Call `api.usermanager.*` directly from hooks — coupling hooks to generated API shape makes refactoring harder.

### 3. State management with React Query

**Decision:** Create custom hooks in `src/hooks/use-user-management.ts`:
- `useUserList(filters, pagination)` — paginated query with `keepPreviousData`.
- `useUserDetail(userId)` — single user fetch.
- `useCreateUser()` — mutation with cache invalidation on user list.
- `useUpdateUser()` — mutation with cache invalidation.
- `useDeleteUser()` — mutation with cache invalidation.
- `useValidateUserCode(code)` — debounced uniqueness check.

**Why:** React Query is already configured in the project. Custom hooks encapsulate query keys, error handling, and cache strategies in one place.

### 4. UI component structure

**Decision:** Build feature-specific components under `src/components/user-management/`:

| Component | Purpose |
|-----------|---------|
| `user-list-page.tsx` | Main page orchestrator — filters bar, table, pagination, dialogs |
| `user-table.tsx` | Table rendering with columns: code, name, phone, email, status, actions |
| `user-filter-bar.tsx` | Search inputs for code/name and status dropdown |
| `user-form-dialog.tsx` | Shared modal form for Create and Edit (mode prop) |
| `user-delete-dialog.tsx` | Confirmation dialog for soft-delete |
| `user-status-badge.tsx` | Status indicator (Active/Inactive) |

**Why:** Small, focused files (200–400 lines each) aligned with the project coding rules. The form dialog is shared between create and edit since the fields are identical.

**Alternatives considered:**
- Single monolithic page component — violates the small-file rule and hurts readability.
- Separate create and edit forms — too much duplication; the only difference is whether `userId` exists.

### 5. Data table approach

**Decision:** Build a custom table component using HTML `<table>` styled with the existing design system (dark glass cards, design tokens). No third-party table library.

**Why:** The user list is straightforward (< 10 columns, server-side pagination). A library like TanStack Table adds unnecessary complexity at this stage. The table cells are simple text/badges — no complex rendering.

**Alternatives considered:**
- TanStack Table — overkill for a simple paginated list; adds a dependency.

### 6. Form validation

**Decision:** Use client-side validation with inline error messages. User code uniqueness is validated via the `userValidate` API with debounce (300ms).

**Why:** The backend doesn't return structured validation errors, so client-side validation provides immediate feedback. Debounced async validation avoids excessive API calls during typing.

### 7. System dictionary (fixcode)

**Decision:** Create a centralized dictionary file `src/config/fixcode.ts` that maps system codes to display labels. All coded fields (status, sex, yes/no) resolve through this dictionary instead of hardcoded mappings.

Dictionary entries:

| Code | Type | Type Desc | Code Desc |
|------|------|-----------|-----------|
| 10011001 | 1001 | 状态 (Status) | 有效 (Active) |
| 10011002 | 1001 | 状态 (Status) | 无效 (Inactive) |
| 10021001 | 1002 | 性别 (Sex) | 男 (Male) |
| 10021002 | 1002 | 性别 (Sex) | 女 (Female) |
| 10021003 | 1002 | 性别 (Sex) | 未知 (Unknown) |
| 10031001 | 1003 | 是否 (Yes/No) | 是 (Yes) |
| 10031002 | 1003 | 是否 (Yes/No) | 否 (No) |

The file exports a `getCodeDesc(typeCode, value)` helper that returns the display label for a given type and value. Components like `user-status-badge.tsx` and the filter bar use this helper instead of inline mappings.

**Why:** Centralizing code-to-label resolution avoids duplication across features (user management, role management, etc.) and matches the backend's system dictionary pattern. Adding new code types later requires only a dictionary update.

## Risks / Trade-offs

- **Auto-generated API types are loose** (`data: object`) → The service layer casts to concrete types, but runtime mismatches won't be caught at compile time. Mitigation: add runtime validation if issues arise.
- **Backend uses query params for POST bodies** (e.g., `updateUserInfo` takes `user` as a query param) → The generated client handles this, but it's unconventional. Mitigation: use `createUserInfoForJsonBody` (JSON body) for create; for update, follow the existing pattern.
- **No optimistic updates** → Mutations wait for server confirmation before updating the UI. This is simpler and safer but slightly slower. Mitigation: acceptable trade-off for an admin tool.
