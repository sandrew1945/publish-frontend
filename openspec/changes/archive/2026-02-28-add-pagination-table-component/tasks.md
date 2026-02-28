## 1. TablePagination Component

- [x] 1.1 Create `src/components/common/table-pagination.tsx` with the `TablePaginationProps` interface (`page`, `pageSize`, `total`, `pageSizeOptions?`, `onPageChange`, `onPageSizeChange`)
- [x] 1.2 Implement page-size selector (default options: 10, 20, 50); call `onPageSizeChange` then `onPageChange(1)` on change
- [x] 1.3 Implement page-number button row with first/last buttons, current ±4 window, and `…` ellipsis for pages exceeding 9 slots
- [x] 1.4 Disable "Previous" button when `page === 1`; disable "Next" button when `page >= Math.ceil(total / pageSize)` or `total === 0`
- [x] 1.5 Style matches existing dark-theme design (bg-`[#0d1117]` / `[#14181d]`, `border-white/10`, blue active page highlight)

## 2. Column Type Definitions

- [x] 2.1 Define `ColumnType` discriminated union type in `pagination-table.tsx`: `'data' | 'fixcode' | 'index' | 'rate' | 'selection' | 'slot'`
- [x] 2.2 Define per-type column interfaces (e.g., `FixcodeColumn` with `codeTypeId: number`, `RateColumn` with `colors: string[]`, `SlotColumn` with `render: (record: T) => ReactNode`)
- [x] 2.3 Export a `ColumnDef<T>` union type that callers use to build their `columns` array

## 3. PaginationTable Component

- [x] 3.1 Create `src/components/common/pagination-table.tsx` with generic props `PaginationTableProps<T>`: `data: T[]`, `columns: ColumnDef<T>[]`, `isLoading?: boolean`, `skeletonRows?: number`, `query?: () => void`
- [x] 3.2 Render `<thead>` from `columns` array — use `column.label` as header text, apply `column.width` and `column.align`
- [x] 3.3 Implement skeleton mode: when `isLoading` is `true`, render `skeletonRows` (default: 10, min 5) rows of shimmer cells (`animate-pulse bg-white/5 rounded`)
- [x] 3.4 Implement `data` type cell renderer — plain `record[field]` string/number value
- [x] 3.5 Implement `fixcode` type cell renderer — calls `getCodeDesc(column.codeTypeId, record[field])`
- [x] 3.6 Implement `index` type cell renderer — renders `(page - 1) * pageSize + rowIndex + 1`; requires `page` and `pageSize` props passed via `PaginationTable` or context
- [x] 3.7 Implement `rate` type cell renderer — renders 1–5 star icons with per-star colour from `column.colors[i]`
- [x] 3.8 Implement `selection` type cell renderer — renders a `<input type="checkbox">` bound to `selectedKeys` prop (parent-controlled)
- [x] 3.9 Implement `slot` type cell renderer — calls `column.render(record)` and renders the returned `ReactNode`
- [x] 3.10 Render empty-state row ("No data found") when `!isLoading && data.length === 0`
- [x] 3.11 Integrate `TablePagination` at the bottom of `PaginationTable`; forward pagination props (`page`, `pageSize`, `total`, `onPageChange`, `onPageSizeChange`) and call `query?.()` after page/size change

## 4. Migrate Repository List Page

- [x] 4.1 In `src/app/(dashboard)/repositories/page.tsx`, move `Avatar` and `AvatarStack` local helpers from `repository-table.tsx` into the page file (or a local co-located helper) before deleting the old component
- [x] 4.2 Declare a `columns: ColumnDef<RepoDTO>[]` array in the page: Repository Name (`data`), Description (`data`), Owner (`slot`), Collaborators (`slot`), Status (`slot`), Actions (`slot`)
- [x] 4.3 Replace `<RepositoryTable>` with `<PaginationTable>` — pass `data`, `columns`, `isLoading`, `page`, `pageSize`, `total`, `onPageChange`, `onPageSizeChange`, and `query={fetchData}`
- [x] 4.4 Remove the external spinner (`<RefreshCw animate-spin>`) wrapper that previously guarded `<RepositoryTable>` — skeleton loading is now handled inside `PaginationTable`
- [x] 4.5 Remove the inline pagination markup (page-size selector + page-number loop) from the page — replaced by `TablePagination` inside `PaginationTable`
- [x] 4.6 Delete (or deprecate) `src/components/repository-management/repository-table.tsx`; remove its import from the page

## 5. Verification

- [x] 5.1 Start dev server (`npm run dev`) and navigate to the Repositories list page; confirm table renders with correct columns
- [x] 5.2 Trigger a slow network (browser DevTools throttle) and verify skeleton rows appear while loading, then data rows replace them without layout shift
- [x] 5.3 Verify pagination: change page size, click page buttons, confirm Previous/Next disable at boundaries
- [x] 5.4 Confirm ellipsis (`…`) appears when there are more than 9 total pages (temporarily set `pageSize=1` with enough data to test)
- [x] 5.5 Verify `fixcode` column renders translated description (e.g., Status shows "有效" / "无效" and not raw codes)
- [x] 5.6 Confirm Edit / Delete action buttons in the `slot` Actions column still work correctly
