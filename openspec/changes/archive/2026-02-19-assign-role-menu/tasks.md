# Tasks: Assign Role Menu

## 1. Setup & Type Definitions

- [x] 1.1 Update `src/types/backend-types.ts` to ensure `FunctionsParam` and `TreeNode` interfaces are correct and available. <!-- id: 8 -->
- [x] 1.2 Verify `RoleManagerApi` and `MenuManagerApi` methods in `src/services/role-management-service.ts` and `src/services/menu-service.ts`. <!-- id: 9 -->

## 2. Frontend Components

- [x] 2.1 Create `src/components/role-management/assign-menu-dialog.tsx`. <!-- id: 10 -->
  - [x] Implement `Modal` structure. <!-- id: 11 -->
  - [x] Implement `Tree` component integration (using `antd` or similar). <!-- id: 12 -->
  - [x] Add state for `checkedKeys` and `expandedKeys`. <!-- id: 13 -->
- [x] 2.2 Implement data fetching in `AssignMenuDialog`. <!-- id: 14 -->
  - [x] Fetch menu tree using `menuService.getMenuTree`. <!-- id: 15 -->
  - [x] Fetch role permissions using `roleService.getCheckedPremission`. <!-- id: 16 -->
- [x] 2.3 Implement save logic in `AssignMenuDialog`. <!-- id: 17 -->
  - [x] Map checked keys to `FunctionsParam`. <!-- id: 18 -->
  - [x] Call `roleService.saveSelectedFunc`. <!-- id: 19 -->
- [x] 2.4 Update `src/components/role-management/role-table.tsx`. <!-- id: 20 -->
  - [x] Add "Assign Menu" button to the actions column. <!-- id: 21 -->
  - [x] Integrate `AssignMenuDialog` and handle open state. <!-- id: 22 -->

## 3. Verification

- [x] 3.1 Verify component rendering. <!-- id: 25 -->
  - [x] Check if "Assign Menu" button appears in `RoleTable`. <!-- id: 26 -->
  - [x] Check if `AssignMenuDialog` opens correctly. <!-- id: 27 -->
- [x] 3.2 Verify data fetching. <!-- id: 28 -->
  - [x] Verify menu tree is loaded. <!-- id: 29 -->
  - [x] Verify existing role permissions are checked. <!-- id: 30 -->
- [x] 3.3 Verify saving. <!-- id: 31 -->
  - [x] Verify `saveSelectedFunc` is called with correct data. <!-- id: 32 -->
  - [x] Verify success message and dialog close. <!-- id: 33 -->
