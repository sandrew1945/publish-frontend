# Frontend Codemap

## Overview
This document maps the key components and logic flows of the frontend application.

## 1. Authentication & Security

### Key Files
- `src/lib/auth-service.ts`: Core service for login, logout, and token validation.
- `src/lib/auth-context.tsx`: React Context provider for global auth state.
- `src/middleware.ts`: Edge middleware for protecting routes using cookies.
- `src/lib/api-client.ts`: Axios instance with interceptors for token injection and 401 handling.
- `src/app/login/page.tsx`: The login page component.

### Flow
- **Login**: `LoginForm` -> `useAuth().login()` -> `authService.login()` -> API Call + `setSession()` (Cookie + LocalStorage).
- **Check**: `AuthProvider` (on mount) -> `authService.validateToken()` / `getCurrentUser()`.
- **Protect**: `middleware` checks `sid` cookie. Redirects if missing on protected routes.

## 2. Layout & Navigation

### Key Files
- `src/app/layout.tsx`: Root layout, wraps app in `AuthProvider` and `ThemeProvider`.
- `src/components/dashboard-layout.tsx`: Layout for authenticated pages (Sidebar + Header), handles sidebar resizing.
- `src/components/sidebar.tsx`: Navigation sidebar with role-based link filtering and collapse toggle.
- `src/lib/sidebar-context.tsx`: Context for managing sidebar collapse and resize state.
- `src/config/menu.ts`: Configuration for menu items and roles.

## 3. API Integration

### Key Files
- `src/lib/api.ts`: Auto-generated Swagger/OpenAPI client (do not edit manually).
- `src/lib/api-client.ts`: Custom Axios instance configuration.

## 4. UI Components

### Key Files
- `src/components/ui/*`: (Future) Shadcn/UI or base components.
- `src/components/*`: Feature-specific components (e.g., `stat-card.tsx`, `activity-feed.tsx`).

## 5. Styling

### Configuration
- `tailwind.config.ts`: Tailwind configuration, theme colors, and animations.
- `src/app/globals.css`: Global CSS variables and styles.
