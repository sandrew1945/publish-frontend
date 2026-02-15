## ADDED Requirements

### Requirement: Dynamic Menu Rendering
The application sidebar/navigation must render menu items dynamically based on the current user's role.

#### Scenario: Admin User Menu
- **GIVEN** a user with 'ADMIN' role is logged in
- **WHEN** the dashboard loads
- **THEN** the navigation menu shows all system modules including 'User Management', 'Role Management', and 'System Settings'

#### Scenario: Editor User Menu
- **GIVEN** a user with 'EDITOR' role is logged in
- **WHEN** the dashboard loads
- **THEN** the navigation menu shows 'Content Management' and 'Profile'
- **BUT** does NOT show 'User Management' or 'System Settings'

### Requirement: Role-Menu Assignment
Admins must be able to configure which menus are visible for each role.

#### Scenario: Assign Menu to Role
- **GIVEN** I am an Admin on the Role Management page
- **WHEN** I select a Role and a set of Menu Items
- **AND** I save the configuration
- **THEN** users with that Role immediately see the updated menu structure upon next login/refresh
