## Context

The repository list page (`/repositories`) currently uses a basic data table to display API repositories. The design team has provided a new aesthetic for this page to enhance its premium feel, usability, and alignment with modern web standards. The UI needs to be updated to incorporate better visual hierarchy, status indicators, avatar stacks for collaborators, and inline action buttons. The search and filter area also requires restructuring to match the new horizontal layout.

## Goals / Non-Goals

**Goals:**
- Implement the exact visual design from the provided mockup for the `/repositories` page.
- Update the table component (`RepositoryTable`) to support new columns (Description, Owner with Avatar, Collaborators with Avatar Stack, styled Status badge).
- Create or update a horizontal search and filter bar component above the table.
- Style the pagination component to match the new dark theme design.
- Ensure all interactive elements (buttons, inputs, dropdowns) have appropriate hover and focus states consistent with the design system.

**Non-Goals:**
- Modifying backend API endpoints (changes are purely frontend presentation, assuming data for avatars/descriptions is either available or can be mocked/handled gracefully if missing).
- Implementing new core features (like adding completely new business logic); this is strictly a UI optimization task.
- Responsive design for mobile (assuming the primary focus is the desktop dashboard view as per the mockup, though basic responsiveness should be considered if easy).

## Decisions

1.  **Component Architecture:**
    - The main `RepositoriesPage` (`src/app/(dashboard)/repositories/page.tsx`) will be refactored to use the new layout.
    - We will update the `RepositoryTable` component to accept the new data structure and render the specialized cells (Avatar, Badge, Icon Buttons).
    - The filter section will be extracted into a `RepositoryFilters` component for better code organization, assuming it grows in complexity.

2.  **Styling Approach:**
    - Use Tailwind CSS for all new styling to match the provided mockup.
    - Define custom colors in `tailwind.config.ts` or `globals.css` if the specific dark theme colors (e.g., the specific background shades of grey/blue) aren't already present in the project's theme.
    - Use Lucide React or similar existing icon libraries for the action icons (folder, edit, trash).

3.  **Avatar and Status Rendering:**
    - Create a reusable `AvatarStack` component if one doesn't exist, specifically for the 'Collaborators' column.
    - Update the status rendering logic to emit specific classes (e.g., `text-emerald-500 bg-emerald-500/10` for 'Active') based on the status value.

## Risks / Trade-offs

-   [Risk] The backend might not currently return all the rich data shown in the mockup (e.g., descriptions, specific collaborator avatars).
    -   *Mitigation*: We will use optional chaining and render sensible fallbacks (e.g., generic initials for avatars, "No description" text) while updating the UI to support the full data structure once available.
-   [Risk] The specific font or exact color hex codes might not be explicitly documented outside the image.
    -   *Mitigation*: We will use our best judgment to sample colors from the image and rely on the project's existing design tokens where possible to ensure consistency.
