# Vibe Publish Frontend

A premium, modern administration dashboard built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Premium Design**: Custom dark theme, glassmorphism effects, smooth animations
- **Authentication**: Secure login flow with dual-storage session management (HTTP-only cookies + LocalStorage)
- **Role-Based Access**: Role-based menu rendering and route protection
- **Interactive UI**: Animated charts, dynamic data visualization, and responsive layout

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Architecture

### Authentication Flow

1.  **Login**: User enters credentials on `/login`.
2.  **Auth Service**: `auth-service.ts` calls the backend API using `api.ts`.
3.  **Session Storage**:
    *   **Cookie (`sid`)**: Used by Next.js Middleware (`middleware.ts`) for server-side route protection.
    *   **LocalStorage (`sid`)**: Used by Axios (`api-client.ts`) for client-side API requests.
4.  **Route Protection**: Middleware intercepts requests to protected routes (e.g., `/dashboard/*`) and redirects unauthenticated users to `/login`.
5.  **Context**: `AuthContext` provides global user state and handles session validation on app load.

### Directory Structure

- `src/app`: App Router pages and layouts
- `src/components`: Reusable UI components
- `src/lib`: Utilities, API clients, and services
- `src/types`: TypeScript type definitions
- `src/config`: Configuration files (menu, theme, etc.)

## Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request
