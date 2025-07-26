# 🎨 V0.dev Prompts - Snapshot Runner Frontend

## 📋 Copy-Paste Prompts for V0.dev

### 🏠 Prompt 1: Main Dashboard

```text
Create a modern cybersecurity dashboard for "Snapshot Runner" security audit platform with:

LAYOUT:
- Dark theme with navy blue (#0f172a) background
- Header with logo, navigation menu, and user profile
- 4 metric cards in grid: "Active Audits", "Completed Scans", "Vulnerabilities Found", "Running Containers"
- Recent audits table below with 5 rows
- Quick action buttons: "Start Port Scan" and "Start Dependency Scan"

DESIGN:
- Cards with subtle shadows and green/red accent colors for metrics
- Status badges: green (COMPLETED), blue (RUNNING), orange (PENDING), red (FAILED)
- Modern icons (shield, scan, alert, container)
- Responsive grid layout
- Tailwind CSS styling

CONTENT:
- Sample data: 12 active audits, 156 completed scans, 23 vulnerabilities, 3 running containers
- Recent audits: mix of PORT_SCAN and DEPENDENCY_SCAN with different statuses
- Professional cybersecurity aesthetics
```

### 📊 Prompt 2: Audit Management Table

```text
Design an audit management interface for cybersecurity platform:

FEATURES:
- Data table with columns: ID, Type, Target, Status, Created Date, Actions
- Filter bar: Type dropdown (PORT_SCAN, DEPENDENCY_SCAN), Status filter, Date range picker
- Search input for target/ID
- Pagination (showing "1-10 of 45 results")
- Action buttons per row: View Details, Stop, Restart, Delete

STYLING:
- Dark theme with #1e293b background
- Table with alternating row colors
- Status badges with appropriate colors
- Hover effects on rows
- Modern button designs
- Responsive layout that stacks on mobile

DATA:
- Sample 10 rows with mixed audit types
- Various statuses and realistic targets (github.com, app.example.com, etc.)
- Recent timestamps
- Action buttons styled as icons
```

### 🔍 Prompt 3: Audit Detail View

```text
Create a detailed audit results page for security scanning:

LAYOUT:
- Breadcrumb: Home > Audits > Audit #12345
- Header section: Audit metadata (ID, type, target, status, timestamps)
- Tab navigation: Overview, Vulnerabilities, Network Ports, Dependencies
- Main content area with cards and charts

CONTENT SECTIONS:
- Overview: Summary stats, progress indicator, audit timeline
- Vulnerabilities: Cards with severity levels (CRITICAL, HIGH, MEDIUM, LOW)
- Network Ports: Table with port, protocol, state, service columns
- Dependencies: List of packages with vulnerability indicators

DESIGN:
- Dark cybersecurity theme
- Color-coded severity indicators (red, orange, yellow, green)
- Charts for vulnerability distribution
- Export button
- Professional security dashboard feel
- Responsive cards that stack on mobile
```

### 🐳 Prompt 4: Container Monitoring

```text
Design a Docker container monitoring dashboard:

FEATURES:
- Grid of container cards (3-4 per row)
- Each card shows: Container ID (truncated), Status, Docker Image, Audit ID, Uptime
- Status indicators with colors: CREATING (blue), RUNNING (green), COMPLETED (gray), FAILED (red), TERMINATED (orange)
- Action buttons per container: Stop, Restart, View Logs
- Filter dropdown for status
- Search by container ID or image

STYLING:
- Dark theme consistent with security platform
- Cards with subtle borders and shadows
- Status dots/badges prominently displayed
- Monospace font for container IDs
- Hover effects and animations
- Grid responsive layout

CONTENT:
- 6-8 container cards with various statuses
- Realistic Docker image names (node:18-alpine, python:3.9-slim)
- Uptime indicators (2h 34m, 15m, etc.)
- Clean, professional appearance
```
