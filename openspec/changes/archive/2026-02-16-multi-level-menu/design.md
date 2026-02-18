# Design: Multi-Level Menu Support

## Context

The current `Sidebar` component assumes a flat list of menu items. To support nested navigation (e.g., System -> User Management), we need a recursive or nested rendering strategy.

## Goals / Non-Goals

**Goals:**

- Support infinite nesting depth (though practically 2-3 levels is enough).
- Smooth expand/collapse animations.
- Auto-expand parent when a child route is active.
- Maintain accessibility (ARIA attributes).

**Non-Goals:**

- Drag-and-drop menu reordering.

## Decisions

1.  **Data Structure**: extending `MenuItem` interface to include optional `items?: MenuItem[]`.
2.  **Recursive Component**: Create a `SidebarItem` component that can render itself or a `SidebarGroup` for parents.
3.  **State Management**:
    - Use local state for expand/collapse.
    - Initialize state based on `usePathname()` to auto-expand active parents.
4.  **UI Library**: Use `Collapsible` from `radix-ui` (or shadcn/ui generic) for smooth animations.

## Risks / Trade-offs

- **Complexity**: Recursive components can be harder to debug.
- **Mobile**: Nested menus on mobile drawers need careful styling to avoid cramping.
