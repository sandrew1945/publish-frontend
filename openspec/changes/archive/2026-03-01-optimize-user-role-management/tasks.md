## 1. User Management List Migration

- [x] 1.1 Extract `columns` definition array for `UserDTO` in `src/app/dashboard/user/page.tsx`, ensuring action handlers (edit, config role, delete, reset pwd) are maintained via `useMemo`.
- [x] 1.2 Replace the native `<Table>` and custom pagination `<div className="flex justify-end mt-4">` in `src/app/dashboard/user/page.tsx` with the generic `<PaginationTable>` component.
- [x] 1.3 Remove the manual `Skeleton` loading checks in `user/page.tsx` and pass `isLoading` directly to `PaginationTable`.
- [x] 1.4 Verify that data mapping from the `pageData` state correctly flows into `PaginationTable`'s `data` and `pagination` props.

## 2. Role Management List Migration

- [x] 2.1 Extract `columns` definition array for `RoleDTO` in `src/app/dashboard/role/page.tsx`, ensuring action handlers (edit, config menu, delete) are maintained via `useMemo`.
- [x] 2.2 Replace the native `<Table>` and custom pagination in `src/app/dashboard/role/page.tsx` with the generic `<PaginationTable>` component.
- [x] 2.3 Remove the manual `Skeleton` loading checks in `role/page.tsx` and pass `isLoading` directly to `PaginationTable`.
- [x] 2.4 Verify that data mapping from the `pageData` state correctly flows into `PaginationTable`'s `data` and `pagination` props.

## 3. Cleanup and Verification

- [x] 3.1 Run local frontend build (`npm run build`) to ensure no TypeScript or linter errors were introduced by the stricter `ColumnDef` typing.
- [x] 3.2 Verify both User and Role list pages render correctly with the new `PaginationTable`, including empty states and skeleton loaders.
