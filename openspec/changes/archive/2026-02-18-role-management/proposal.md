## Why

The system currently lacks a dedicated interface and functionality to manage user roles. Administrators need a way to define, update, and remove roles to control user permissions effectively.

## What Changes

Add a new "Role Management" module to the system to support comprehensive role administration. This includes:

- **Role List View**: Display all roles with support for querying by role code, role name, and status (valid/invalid).
- **Create Role**: Functionality to add new roles with validation to ensure role codes are unique.
- **Modify Role**: Ability to update existing role information.
- **Delete Role**: Support for logical deletion of roles.

## Capabilities

### New Capabilities

- `role-management`: Comprehensive management of user roles including listing, creation, modification, and logical deletion.

### Modified Capabilities

<!-- No existing capabilities are being modified at the spec level. -->

## Impact

### Frontend

- New Role Management page under System menu.
- new API service for role management.
- Reusable components for role forms and lists.

### Backend

- Implementation or integration of Role Management APIs as defined in Swagger (http://localhost:8080/v3/api-docs).
- Database schema updates if necessary (though likely existing given "Backend APIs" reference).
