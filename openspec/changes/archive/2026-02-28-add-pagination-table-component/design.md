## Context

Currently, several list pages across the system (repositories, user management, role management, etc.) each implement their own `<table>` markup, loading state, pagination controls, and column rendering logic. This causes:

- Duplicated HTML structure and styling across modules
- Inconsistent UX patterns (e.g., spinner vs. loading text vs. no state)
- Each page manually re-implements page-size selector and page-number navigation

The `PaginationTable` initiative aims to extract a single, flexible table component that all list pages can adopt.

**Scope for this change:** Only the repository list page is migrated; other pages are follow-up work.

---

## Goals / Non-Goals

**Goals:**
- Create a generic `PaginationTable` component driven by a `columns` definition array
- Support the following column render types: `data`, `fixcode`, `index`, `rate`, `selection`, `slot`
- Show Skeleton placeholder rows while data is loading (replaces spinner)
- Create a standalone `TablePagination` component (page-size selector + page navigation)
- Expose a `query` callback prop, so the table knows how to refresh its data
- Migrate the repository list page to use `PaginationTable`

**Non-Goals:**
- Server-side sort support (columns may be marked `sortable` for future use; no sort logic in this change)
- Migrating user management, role management, or menu management tables (follow-up)
- Virtual scrolling or infinite scroll

---

## Decisions

### 1. Column definition schema

**Decision:** Each column is an object: `{ name, label, field, width?, align?, sortable?, type, ...typeSpecificFields }`.

The `type` field drives how a cell is rendered:

| type | render |
|---|---|
| `data` | Plain `record[field]` string/number value |
| `fixcode` | `getCodeDesc(codeTypeId, record[field])` — `codeTypeId` must be passed as extra column prop |
| `index` | Sequential row number starting at 1 (respects pagination offset) |
| `rate` | Star rating (1-5). Extra prop `colors: string[]` sets per-star colour |
| `selection` | Checkbox bound to `selectedKeys` state managed by the parent or the table |
| `slot` | Caller-provided render function: `render: (record) => ReactNode` |

**Rationale:** Declarative column configs are common in enterprise UI frameworks (Ant Design, Quasar Table). Using a discriminated type union (`type` field) keeps the component API clean while still being extensible.

**Alternatives considered:**
- *Render-prop per column (all slots):* Too verbose for simple `data` columns, forces ceremony on callers.
- *Separate prop arrays per type:* Splits config, makes columns hard to reorder.

---

### 2. Skeleton loading

**Decision:** While `isLoading` is `true`, render `skeletonRows` (default: `pageSize`, min 5) rows where each cell shows a `<div>` with an animated shimmer (`animate-pulse`). The skeleton mirrors the real column structure so layout does not shift when data arrives.

**Rationale:** A shimmer skeleton provides a better perceived-performance UX than a full-page spinner, and is consistent with modern dashboards. It avoids the layout jump caused by replacing a spinner with a full table.

**Alternatives considered:**
- *Spinner:* Already used in repositories page; feels dated and causes layout shift.
- *Opacity fade of stale data:* Requires keeping previous data in state — more complex.

---

### 3. Pagination component (`TablePagination`)

**Decision:** Extract a `TablePagination` component with props:
```ts
interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];      // default [10, 20, 50]
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

Page number buttons show at most 9 slots (first, last, current ±4, with `…` ellipsis), preventing unbounded button lists for large datasets.

**Rationale:** The existing repository page renders all page buttons in an unbounded loop, which breaks for 100+ pages.

---

### 4. `query` prop

**Decision:** `PaginationTable` accepts a `query?: () => void` prop. This is called internally when the user changes page or page size, in addition to the parent's own `useEffect`. The parent still owns all state (page, pageSize, filter); the table only calls `query` when pagination controls are used.

**Rationale:** Keeps state in the page component (single source of truth) while letting the table trigger refreshes without the parent needing to add `onChange` listeners on each individual control.

**Alternatives considered:**
- *Table owns all pagination state:* Harder to sync with external filters and reset on search.
- *No `query` prop, parent-only effect:* Works but requires the parent to listen to `page`/`pageSize` via `useEffect`, which is already the current pattern — so no regression.

---

### 5. File structure

```
src/components/common/
  pagination-table.tsx   ← PaginationTable component + column type definitions
  table-pagination.tsx   ← TablePagination component
```

`repository-table.tsx` is deleted; its bespoke markup is replaced by a `columns` definition in the page file.

---

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| `slot` render functions leak complex JSX into page files | Acceptable trade-off; keeps the common component generic. Document the pattern. |
| Skeleton row count mismatch (looks wrong at first paint) | Default `skeletonRows` to `pageSize` prop so it always matches. |
| Existing `Avatar` / `AvatarStack` code in `repository-table.tsx` is deleted | Move these to a shared location or inline in the slot render function in the page file before deleting the old table. |
| Column type union may not cover all future needs | `slot` type is the safety valve — any custom rendering goes there. |

---

## Migration Plan

1. Create `table-pagination.tsx`
2. Create `pagination-table.tsx` with full column type support
3. Update `repositories/page.tsx` — add `columns` definition (with `slot` for actions), replace `<RepositoryTable>` with `<PaginationTable>`, wire `TablePagination`
4. Delete `repository-table.tsx` (or keep with a deprecation comment for reference during review)
5. Verify repository list renders correctly with Skeleton and pagination

**Rollback:** Revert to `repository-table.tsx` usage; changes are isolated to the repository module.

---

## Open Questions

- Should `selection` column manage its checked state internally (controlled by `PaginationTable`) or always be fully-controlled by the parent via a `selectedKeys` prop? → Recommend fully-controlled by parent for this iteration; add internal state management later if needed.
- Should `Avatar` / `AvatarStack` helpers be moved to `src/components/common/` as shared utilities? → Likely yes, but out of scope for this change; inline in repository page's slot for now.
