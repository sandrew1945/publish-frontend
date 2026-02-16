## ADDED Requirements

### Requirement: Stats Cards

The dashboard must display key metrics in visually rich stat cards.

#### Scenario: Stat Card Display

- **WHEN** the dashboard loads
- **THEN** a row of stat cards is displayed (e.g., Total Projects, Total APIs, Today's Calls, Active Tasks)
- **AND** each card shows: a label, a large number, a trend indicator (percentage + arrow), and a colored icon badge
- **AND** cards use the glassmorphism card style from the premium-theme spec

### Requirement: Activity Feed

The dashboard must show a recent activity feed.

#### Scenario: Activity List

- **WHEN** the dashboard loads
- **THEN** a "Recent Activity" section shows a list of recent events
- **AND** each event includes: an icon, a title, a description, and a relative timestamp
- **AND** the section has a "View All" link

### Requirement: System Health Panel

#### Scenario: Health Indicators

- **WHEN** the dashboard loads
- **THEN** a "System Health" panel shows the status of backend services
- **AND** each service displays: name, status badge (OPERATIONAL / DEGRADED), and a colored progress bar
- **AND** an average latency metric is displayed at the bottom

### Requirement: Dashboard Page Animations

#### Scenario: Card Entrance Animation

- **WHEN** the dashboard page mounts
- **THEN** stat cards animate in with a staggered fade-up effect using Framer Motion
- **AND** each card has a slight delay offset for a cascading reveal
