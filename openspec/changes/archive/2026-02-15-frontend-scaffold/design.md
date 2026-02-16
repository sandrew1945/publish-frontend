## Context

The `vibe-publish-frontend` workspace is currently empty and needs a modern, scalable foundation to interact with the existing `vibe-publish-backend`. The goal is to build a high-quality, aesthetically pleasing web application using React and Next.js that supports role-based access control and integrates seamlessly with the backend.

## Goals / Non-Goals

**Goals:**

- Initialize a Next.js 14+ application with App Router and TypeScript.
- Implement a premium design system using Tailwind CSS, supporting dark mode and responsive layouts.
- Create a robust API client layer that consumes the backend Swagger API with type safety.
- Implement a dynamic, role-based menu system that configures navigation based on user permissions.
- Ensure strict code quality with ESLint and Prettier.

**Non-Goals:**

- Implementing the full feature set of the backend (this is just the scaffold and core integration).
- Mobile native app development (web responsive only).
- Server-side rendering (SSR) of complex dynamic data sets (initial focus on Client Component data fetching via TanStack Query for dashboard interactivity).

## Decisions

### Framework & Build Tool

- **Decision**: Use **Next.js 14 (App Router)** with **TypeScript**.
- **Rationale**: Next.js provides the best developer experience, performance optimizations (image optimization, code splitting), and a standard directory structure. App Router allows for robust layouts and nested routing, which is essential for a dashboard application.

### Styling Strategy

- **Decision**: **Tailwind CSS** with a custom configuration.
- **Rationale**: User requested a premium, modern aesthetic. Tailwind allows for rapid UI development and easy customization of design tokens (colors, spacing, typography). We will define a semantic color palette in `tailwind.config.ts` to support theming.
- **Animation**: Use **Framer Motion** for micro-interactions and smooth page transitions to achieve the "wow" factor.

### State Management

- **Decision**: **TanStack Query (React Query)** for server state; **React Context** for global UI state.
- **Rationale**: Most state in a dashboard is remote data. TanStack Query handles caching, deduplication, and loading states out of the box. For simple global UI state (e.g., sidebar toggle, theme preference), React Context is sufficient and avoids the complexity of Redux/Zustand for this scope.

### API Layer

- **Decision**: **Axios** with a central singleton instance.
- **Rationale**: Axios provides better control over interceptors for request/response handling (essential for injecting the `sid` header and 401 handling) compared to the native `fetch` API. We will generate TypeScript interfaces from the backend Swagger definition to ensure strict type safety.

### Role-Based Access Control (RBAC)

- **Decision**: Client-side filtering for menus + Middleware for route protection.
- **Rationale**:
  - **Menu**: A `Sidebar` component will accept a configuration object mapping roles to menu items. It will filter this list based on the authenticated user's role stored in the auth context.
  - **Routing**: Next.js Middleware will inspect the `sid` cookie (stored in HttpOnly cookies ideally, or localStorage if stateless) to protect `/admin` or other sensitive routes.

## Risks / Trade-offs

- **Risk**: Swagger-generated types might drift from actual API response if backend changes without notification.
  - **Mitigation**: Add a script to regenerate types as part of the build process or pre-commit hook.
- **Risk**: Tailwind class pollution can make code hard to read.
  - **Mitigation**: Use `class-variance-authority` (CVA) or `clsx` for reusable component variants to keep JSX clean.
- **Risk**: "Premium" animations can impact performance on lower-end devices.
  - **Mitigation**: Use `framer-motion`'s `LayoutGroup` sparingly and respect `prefers-reduced-motion`.

## Migration Plan

N/A - This is a greenfield project.

## Open Questions

- Specific color brand guidelines? (Will use a default "premium" palette for now).
- Preferred icon set? (Will use `lucide-react` for modern, clean icons).
