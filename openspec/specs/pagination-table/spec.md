# PaginationTable Component Specifications

## Purpose
This document defines the requirements and scenarios for the generic `PaginationTable` and `TablePagination` components, which provide standardized data display, loading states, and pagination across the application.

## Requirements

### Requirement: Column definition schema
The `PaginationTable` component SHALL accept a `columns` prop — an array of column definition objects. Each column definition SHALL specify at minimum: `name` (string, unique key), `label` (string, header text), `field` (string, data record key), and `type` (discriminated union of supported render types). Optional props include `width` (CSS string), `align` (`left` | `center` | `right`), and `sortable` (boolean, reserved for future use).

#### Scenario: Column renders with label in header
- **WHEN** `columns` contains `{ name: 'userCode', label: '账号', field: 'userCode', type: 'data' }`
- **THEN** the table header SHALL display "账号" in that column position

#### Scenario: Column type `data` renders plain value
- **WHEN** a column has `type: 'data'` and the record has a matching `field`
- **THEN** the cell SHALL render `record[field]` as a plain string/number

#### Scenario: Column type `fixcode` renders translated description
- **WHEN** a column has `type: 'fixcode'` and a `codeTypeId` prop
- **THEN** the cell SHALL call `getCodeDesc(codeTypeId, record[field])` and render the result

#### Scenario: Column type `index` renders sequential row number
- **WHEN** a column has `type: 'index'`
- **THEN** the cell SHALL render the 1-based row index, offset by `(page - 1) * pageSize`

#### Scenario: Column type `rate` renders star rating
- **WHEN** a column has `type: 'rate'` and a `colors` array prop
- **THEN** the cell SHALL render filled star icons (1-5) using the colour from `colors[starIndex]` based on `record[field]`

#### Scenario: Column type `selection` renders a checkbox
- **WHEN** a column has `type: 'selection'`
- **THEN** the cell SHALL render a checkbox; its checked state SHALL be determined by whether the row's key is in the `selectedKeys` set provided by the parent

#### Scenario: Column type `slot` renders custom content
- **WHEN** a column has `type: 'slot'` and a `render` function prop `(record: T) => ReactNode`
- **THEN** the cell SHALL render the result of calling `render(record)`

---

### Requirement: Skeleton loading state
The `PaginationTable` component SHALL accept an `isLoading` boolean prop. When `isLoading` is `true`, the component SHALL render placeholder skeleton rows instead of real data rows.

#### Scenario: Skeleton shown while loading
- **WHEN** `isLoading` is `true`
- **THEN** the table body SHALL render `skeletonRows` rows (defaulting to `pageSize`, minimum 5), each cell showing an animated shimmer placeholder

#### Scenario: Real data shown when loaded
- **WHEN** `isLoading` is `false`
- **THEN** the table body SHALL render the actual `data` records

#### Scenario: Empty state when no data
- **WHEN** `isLoading` is `false` and `data` is an empty array
- **THEN** the table SHALL render a single full-width "No data found" row

---

### Requirement: Pagination sub-component (`TablePagination`)
The system SHALL provide a standalone `TablePagination` component that renders a page-size selector and page-navigation controls.

#### Scenario: Page size change resets to page 1
- **WHEN** the user selects a new page size from the size selector
- **THEN** `onPageSizeChange(newSize)` SHALL be called AND `onPageChange(1)` SHALL be called

#### Scenario: Previous/Next buttons respect boundaries
- **WHEN** the current page is 1
- **THEN** the "Previous" button SHALL be disabled
- **WHEN** the current page equals the last page
- **THEN** the "Next" button SHALL be disabled

#### Scenario: Ellipsis for large page counts
- **WHEN** total pages exceed 9
- **THEN** the pagination SHALL show at most 9 page slots (first, last, current ±4, and `…` placeholders) to prevent unbounded button lists

---

### Requirement: Query callback
The `PaginationTable` component SHALL accept an optional `query` prop of type `() => void`. When the pagination state changes (page or page size), the component SHALL call `query()` if provided.

#### Scenario: Query called on page change
- **WHEN** the user clicks a page number or Previous/Next button inside the table
- **THEN** `query()` SHALL be called after the internal page state updates

#### Scenario: Query prop is optional
- **WHEN** `query` is not provided
- **THEN** the component SHALL not throw an error; pagination controls still work via parent `useEffect`
