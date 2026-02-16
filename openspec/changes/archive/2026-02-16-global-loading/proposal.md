# Proposal: Global Loading Indicator

## Why

Users currently lack visual feedback during data fetching or long-running operations, which can lead to confusion or unintended double-clicks. A global loading indicator will improve user experience by providing clear feedback and preventing interaction during critical async tasks.

## What Changes

We will introduce a global loading system that:
1.  Displays a semi-transparent overlay to block user interaction during critical operations.
2.  Shows a progress bar (nprogress style) at the top of the page for route transitions and data loading.
3.  Intercepts navigation and button clicks to trigger the loading state where appropriate.

## Capabilities

### New Capabilities

- `global-loading`: Provides a centralized mechanism to trigger and display loading states (overlay and progress bar) across the application.

### Modified Capabilities

<!-- No existing capabilities are modified at the spec level. -->

## Impact

- **UX**: Improved responsiveness perception and prevention of race conditions from double-clicks.
- **Components**: New `GlobalLoadingProvider` and `GlobalLoadingOverlay` components.
- **Routing**: Integration with Next.js router events.
