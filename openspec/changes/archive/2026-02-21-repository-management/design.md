## Context
The current administration interface includes modules for User Management, Role Management, and Menu Management. To complete the administrative capabilities for the platform, a "Repository Management" feature is required. This feature will allow administrators to manage code repositories (create, view, update, and logically delete), ensuring that all projects are properly tracked and configured within the system.

## Goals / Non-Goals
**Goals:**
- Provide a responsive UI for listing repositories with search and pagination capabilities.
- Create a form dialog for adding new repositories with Name, Description, Collaborators, and Status fields, including unique name validation.
- Create a form dialog for modifying existing repository configurations.
- Implement a logical deletion mechanism for repositories to preserve historical references if needed.
- Define a frontend-to-backend integration strategy using the existing Swagger-defined endpoints.

**Non-Goals:**
- Direct integration with Git providers (GitHub, GitLab, etc.) for synchronizing code or webhooks.
- Creating an entirely new UI component library (we will use existing project UI patterns).
- Detailed user authorization constraints on a per-repository level (this will be handled by the backend role-based access control, if applicable).

## Decisions
- **UI Framework/Components**: Use the same table and dialog components (e.g., Lucide icons, existing generic Table/Pagination patterns) as the current `UserTable` or `RoleTable` to maintain consistency across the administration dashboard.
- **State Management**: Utilize React hooks (`useState`, `useEffect`) and custom hooks for fetching and managing the repository list state, as seen in other management pages.
- **API Integration**: Create a dedicated `repository-service.ts` to encapsulate all API calls (query, create, update, delete) to the backend. This promotes separation of concerns and reusability.
- **Deletion Strategy**: The UI will trigger a confirmation dialog before sending the delete request. The backend is expected to handle the "logical delete" (e.g., setting a `delFlag` to `1`).

## Risks / Trade-offs
- **[Validation Latency]** -> Mitigation: The unique name validation requires a backend call. Implement debounce on the input field or validate on form submission to avoid excessive API requests.
- **[Pagination Performance]** -> Mitigation: Ensure that the search and listing APIs use server-side pagination rather than fetching all records and paginating on the client.
