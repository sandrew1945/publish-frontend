## ADDED Requirements

### Requirement: User Management API Support

The API client SHALL provide typed methods for all user management operations, interacting with the `/usermanager` endpoints.

#### Scenario: User Operations Coverage

- **WHEN** the application initializes the API client
- **THEN** it exposes methods for `userManagerPageQuery`, `createUserInfo`, `updateUserInfo`, `deleteUserInfo`, `getUserInfoById`, and `userValidate`
- **AND** these methods utilize the generated TypeScript interfaces for request and response correctness
