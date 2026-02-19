# Spec: Assign Role Menu

## ADDED Requirements

### Requirement: View Role Menu Assignments

Administrators must be able to view the current menu assignments for a specific role.

#### Scenario: Open Assign Menu Dialog

- **WHEN** the user clicks the "Assign Menu" button for a specific role
- **THEN** a dialog opens displaying the full system menu tree
- **AND** the menus currently assigned to the role are checked
- **AND** menus not assigned to the role are unchecked

### Requirement: Update Role Menu Assignments

Administrators must be able to modify the menu assignments for a role by checking or unchecking items in the menu tree.

#### Scenario: Save Menu Assignments

- **WHEN** the user modifies the checkbox selection in the Assign Menu dialog
- **AND** clicks the "Save" (or "Confirm") button
- **THEN** the application sends the updated list of selected function IDs to the backend
- **AND** a success message is displayed upon successful update
- **AND** the dialog closes

#### Scenario: Cancel Assignment

- **WHEN** the user clicks the "Cancel" button or closes the dialog
- **THEN** the dialog closes without saving any changes
- **AND** the role's menu assignments remain unchanged
