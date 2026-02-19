## Context

Currently, the system menu is statically defined in `src/config/menu.ts`. This rigidity requires code changes and deployments for any menu updates. We need to transition to a dynamic menu system where the menu structure is fetched from the backend and can be managed (created, updated, deleted) via a new "Menu Management" interface.

## Goals / Non-Goals

**Goals:**

- Implement a "Menu Management" page to visualize and manipulate the menu hierarchy.
- Enable Create, Read, Update, and Delete (CRUD) operations for menu items.
- Ensure menu changes are reflected in the application sidebar in real-time (or on refresh).
- maintain consistent styling with the existing dashboard and sidebar.

**Non-Goals:**

- Role-based access control (RBAC) _granularity_ updates (we will use existing role definitions).
- Backend implementation details (we assume the backend API exists or is being built separately, though we will define the expected interface).

## Decisions

### 1. Frontend-Centric Management with Backend Persistence

The frontend will provide the UI for tree manipulation.

- **Rationale**: Interactive tree management is detailed UI work.
- **Alternative**: Server-side rendering of the tree (less interactive).

### 2. Recursive Component for Tree View

We will create a `MenuTreeItem` component that recursively renders itself for children.

- **Rationale**: Handles arbitrary depth of the menu hierarchy elegantly.

### 3. Zod for Validation

Use Zod schemas to validate menu item forms (name uniqueness, required fields).

- **Rationale**: Consistent with modern React/Next.js practices and ensures data integrity before sending to the backend.

### 4. React Query for State Management

Use React Query (TanStack Query) for fetching and mutating menu data.

- **Rationale**: Efficient caching, background updates, and handling of loading/error states.

## Risks / Trade-offs

- **[Risk] Sync with Sidebar**: verification that the sidebar updates immediately after a menu change might be tricky if the sidebar uses a different cache or static file.
  - **Mitigation**: The Sidebar component will need to be refactored to fetch data from the same source (API) as the Menu Management page, rather than importing `menuItems` from `config/menu.ts`.
- **[Risk] Infinite Recursion**: Malformed tree data could cause crashes.
  - **Mitigation**: Ensure the backend prevents circular references, and add a depth limit or error boundary in the recursive component.

## Open Questions

- Is the backend API ready? We will mock it if not.
- Are there specific icons required, or can we pick from the existing Lucide library? (Assumed Lucide).
