# Design: Global Loading Infrastructure

## Context
Currently, the application relies on component-level loading states which can be inconsistent and allow double-submissions or navigation while operations are pending.

## Goals / Non-Goals
**Goals:**
- Provide a unified, application-wide loading state manager.
- Display a blocking overlay to prevent interactions during critical operations.
- Display a progress bar for navigation and long-running tasks.
- Ensure all major user actions (Search, Create, Update, Delete) trigger these indicators.

**Non-Goals:**
- Replacing all skeletal loading states (some local loading is still useful).

## Decisions
1.  **Context-Based State**: Use a React Context (`GlobalLoadingContext`) to manage `isLoading` state globally.
2.  **Portal Overlay**: Render the overlay at the root level (in `layout.tsx`) using a high z-index to ensure it blocks all interaction.
3.  **Manual & Automatic Triggers**:
    -   **Manual**: Expose `startLoading()` and `stopLoading()` for async operations (e.g., inside event handlers).
    -   **Automatic**: Use `useEffect` on `usePathname` and `useSearchParams` to automatically stop loading on navigation completion.
4.  **Click Interception**: While "click any button" was requested, intercepting all clicks globally is invasive and error-prone. We will strategically wrap critical action handlers instead.

## Risks / Trade-offs
-   **User Annoyance**: Blocking the UI too frequently can be frustrating. We must ensure `stopLoading` is always called (using `finally` blocks).
-   **Performance**: The overlay must be lightweight to avoid rendering penalties.
