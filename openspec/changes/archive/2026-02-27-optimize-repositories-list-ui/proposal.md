## Why

The current repository list UI needs to be updated to match the new design specifications. The new design improves user experience by providing a cleaner layout, better visual hierarchy, and more intuitive filtering and action controls. This modernization is necessary to keep the application consistent with the latest design system and to enhance overall usability for managing API collections and services.

## What Changes

- Update the page title and subtitle to "API Repositories" and "Manage and organize your API collections and services." respectively.
- Redesign the search and filter bar to align horizontally, including "Search repositories...", "All Owners" dropdown, "All Status" dropdown, and a "Search" button.
- Overhaul the data table presentation:
  - Add/Update columns: Repository Name, Description, Owner (with avatar), Collaborators (with stacked avatars), Status (with colorful badges), and Actions.
  - Implement a modern row styling with sufficient padding and typography.
- Update the actions column to use icons for View/Manage, Edit, and Delete.
- Restyle the pagination component to match the provided mockup (showing items per page selector and page numbers).
- Apply the new premium dark theme aesthetics, including specific background colors, border styles, and text colors.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `repository-ui-redesign`: Revamping the visual design of the repository list page including table, filters, and pagination.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- Frontend UI components related to the Repository list (`src/app/(dashboard)/repositories/page.tsx`, `src/components/repository-management/repository-table.tsx`, etc.).
- Potential minor tweaks to backend data fetching if new fields like explicitly formatted status or complex avatar references are required (though mostly UI changes are expected).
- Design system tokens and globals (`src/app/globals.css`).
