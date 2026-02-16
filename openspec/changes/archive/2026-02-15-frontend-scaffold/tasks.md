## 1. Project Initialization
 
- [x] 1.1 Initialize Next.js app with TypeScript, ESLint, and App Router
- [x] 1.2 Configure Prettier and ensure it works with ESLint
- [x] 1.3 Setup directory structure (src/components, src/lib, src/types, src/styles)
- [x] 1.4 Commit initial project skeleton
 
## 2. Design System Setup
 
- [x] 2.1 Install and configure Tailwind CSS
- [x] 2.2 Define color palette and design tokens in tailwind.config.ts
- [x] 2.3 Configure custom fonts (Inter/Outfit)
- [x] 2.4 Add `clsx` and `tailwind-merge` for class management
- [x] 2.5 Implement ThemeProvider for dark mode support
 
## 3. Core UI Components
 
- [x] 3.1 Create Button component (variants: primary, secondary, ghost, danger)
- [x] 3.2 Create Input component with error state support
- [x] 3.3 Create Card component for dashboard layout
- [x] 3.4 Create Spinner/Loader component
 
## 4. API Client Implementation
 
- [x] 4.1 Install Axios and TanStack Query
- [x] 4.2 Generate TypeScript interfaces from backend Swagger (manual or script)
- [x] 4.3 Create Axios singleton instance
- [x] 4.4 Implement request interceptor to inject `sid` header
- [x] 4.5 Implement response interceptor for global error handling (401, 5xx)
 
## 5. Role-Based Navigation & Layout
 
- [x] 5.1 Define menu configuration structure (UserRole -> MenuItem[])
- [x] 5.2 Create Sidebar component that renders menu based on role
- [x] 5.3 Implement DashboardLayout wrapping the application
- [x] 5.4 Add middleware to protect routes based on `sid` existence (basic check)
 
## 6. Verification
 
- [x] 6.1 Verify build succeeds locally
- [x] 6.2 Verify linting passes
- [x] 6.3 Verify dark mode toggle works
- [x] 6.4 Verify API client attaches `sid` header to requests
