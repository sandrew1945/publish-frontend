## 1. Foundation & Configuration

- [x] 1.1 Create `src/config/fixcode.ts` to centralize system dictionary mappings for Status, Sex, and Yes/No codes.
- [x] 1.2 Create `src/services/user-management-service.ts` to wrap auto-generated API calls and provide clean domain types.

## 2. State & Logic

- [x] 2.1 Create keys and fetcher hooks in `src/hooks/use-user-management.ts` (List, Detail).
- [x] 2.2 Implement mutation hooks in `src/hooks/use-user-management.ts` (Create, Update, Delete) with cache invalidation.
- [x] 2.3 Implement validation hook `useValidateUserCode` with debouncing for uniqueness checks.

## 3. UI Components

- [x] 3.1 Create `src/components/user-management/user-status-badge.tsx` using the design system and `fixcode` helper.
- [x] 3.2 Create `src/components/user-management/user-filter-bar.tsx` with search inputs and status dropdown.
- [x] 3.3 Create `src/components/user-management/user-table.tsx` with custom HTML table styling, sortable headers, and action buttons.
- [x] 3.4 Create `src/components/user-management/user-form-dialog.tsx` to handle both Create (new) and Edit (existing) modes, including client-side validation.
- [x] 3.5 Create `src/components/user-management/user-delete-dialog.tsx` for confirmation.

## 4. Page Assembly

- [x] 4.1 Create `src/components/user-management/user-list-page.tsx` to orchestrate state, filters, table, and dialogs.
- [x] 4.2 Create the page route `src/app/(dashboard)/system/user-management/page.tsx` rendering the list page component.

## 5. Verification

- [x] 5.1 Verify that the User Management page loads and displays the list of users from the backend.
- [x] 5.2 Verify that filtering by code, name, and status works correctly.
- [x] 5.3 Verify that creating a new user works (including code uniqueness validation).
- [x] 5.4 Verify that editing an existing user works (optimistic update or refresh).
- [x] 5.5 Verify that deleting a user works (soft delete).
