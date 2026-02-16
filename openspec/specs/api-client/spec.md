## ADDED Requirements

### Requirement: Type-safe API Client

Implement a robust HTTP client for interacting with the backend API.

#### Scenario: Swagger Integration

- **WHEN** the project is built
- **THEN** TypeScript interfaces are generated from the backend Swagger definition
- **AND** the API client uses these types for request and response payloads

#### Scenario: Global Error Handling

- **WHEN** an API request fails with a 4xx or 5xx error
- **THEN** the client intercepts the error
- **AND** displays a user-friendly notification (toast/alert)
- **AND** logs the error details for debugging

### Requirement: Authentication Support

Ensure secure communication with the backend.

#### Scenario: Token Injection

- **WHEN** a protected API endpoint is called
- **THEN** the client automatically attaches the current user's session ID to the `sid` header
- **AND** handles 401 Unauthorized responses by redirecting to the login page
