## Why

Multiple pages (repository list, user management, etc.) each implement their own table + pagination logic from scratch, leading to duplicated code, inconsistent loading states, and growing maintenance cost. A shared `PaginationTable` component will standardize how paginated data is displayed across the entire system.

## What Changes

- **New** `PaginationTable` component — a generic, column-definition-driven table with built-in Skeleton loading, multiple column render types (`data`, `fixcode`, `index`, `rate`, `selection`, `slot`), and a `Pagination` sub-component.
- **New** `Pagination` component — reusable page-size selector + page navigation bar, extracted from the ad-hoc pagination code in `repositories/page.tsx`.
- **Refactor** `repository-table.tsx` and `repositories/page.tsx` — replaced by `PaginationTable` with a declarative `columns` definition; bespoke table markup is removed.
- The `UserTable` and any other future tables can adopt `PaginationTable` in a follow-up change.

## Capabilities

### New Capabilities

- `pagination-table`: A generic table component that accepts a `columns` definition array, a `data` array, a `pagination` config/component, and a `query` hook. Renders Skeleton rows while loading. Supports column types: `data`, `fixcode`, `index`, `rate`, `selection`, `slot`.

### Modified Capabilities

- `repository-management`: The repository list page now uses `PaginationTable` instead of its custom `RepositoryTable`; column definitions declared in the page with a `slot` column for action buttons.

## Impact

- **New files**: `src/components/common/pagination-table.tsx`, `src/components/common/table-pagination.tsx`
- **Modified files**: `src/components/repository-management/repository-table.tsx` (removed / replaced), `src/app/(dashboard)/repositories/page.tsx` (integrates `PaginationTable`)
- **No API changes** — this is a purely frontend UI refactor.
- **Dependencies**: Uses existing `fixcode.ts` for `fixcode` column type, no new packages required.
