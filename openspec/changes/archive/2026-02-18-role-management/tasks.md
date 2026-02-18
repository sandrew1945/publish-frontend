# Tasks: Role Management

## 1. Service & Hooks Layer

- [x] 1.1 Create `src/services/role-management-service.ts` with types and API calls matching Swagger
- [x] 1.2 Create `src/hooks/use-role-management.ts` with React Query hooks for list, detail, create, update, delete, and validation

## 2. Shared Components

- [x] 2.1 Create `src/components/role-management/role-status-badge.tsx` (or reuse/refactor existing if appropriate, but design called for a new one)
- [x] 2.2 Create `src/components/role-management/role-delete-dialog.tsx`

## 3. Role List Features

- [x] 3.1 Create `src/components/role-management/role-filter-bar.tsx`
- [x] 3.2 Create `src/components/role-management/role-table.tsx` including columns for Code, Name, Status, and Actions
- [x] 3.3 Create `src/components/role-management/role-list-page.tsx` as the main client component

## 4. Role Form Feature

- [x] 4.1 Create `src/components/role-management/role-form-dialog.tsx` supporting both Create and Edit modes
- [x] 4.2 Implement validation logic (especially role code uniqueness)

## 5. Integration & Routing

- [x] 5.1 Create `src/app/(dashboard)/system/role-management/page.tsx` and integrate `RoleListPage`
- [x] 5.2 Verify route access and navigation from System menu

## 6. Verification

- [x] 6.1 Verify Role List display and filtering
- [x] 6.2 Verify Role Creation with unique code check
- [x] 6.3 Verify Role Modification
- [x] 6.4 Verify Role Deletion
