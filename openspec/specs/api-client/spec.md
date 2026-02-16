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

### Requirement: User Management API Support
The API client SHALL provide typed methods for all user management operations, interacting with the `/usermanager` endpoints.

#### Scenario: User Operations Coverage
- **WHEN** the application initializes the API client
- **THEN** it exposes methods for `userManagerPageQuery`, `createUserInfo`, `updateUserInfo`, `deleteUserInfo`, `getUserInfoById`, and `userValidate`
- **AND** these methods utilize the generated TypeScript interfaces for request and response correctness

