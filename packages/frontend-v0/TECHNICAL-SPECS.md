# 🔧 Technical Specifications for V0.dev Frontend

## 📋 Project Setup Information

### Stack Recommendations for V0.dev

- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Apollo Client + React Query
- **Icons:** Lucide React or Heroicons
- **Charts:** Recharts or Chart.js
- **Build Tool:** Vite (recommended over Create React App)

## 🌐 API Integration Details

### GraphQL Endpoint

```text
http://localhost:4000/graphql
```

### Sample API Responses

#### Audits Query Response

```json
{
  "data": {
    "audits": [
      {
        "id": "1753536361715",
        "type": "PORT_SCAN",
        "status": "COMPLETED",
        "target": "github.com",
        "language": null,
        "containerId": "container_12345",
        "results": {
          "summary": "Port scan completed successfully",
          "details": "Found 3 open ports",
          "vulnerabilities": [
            {
              "id": "vuln_001",
              "severity": "HIGH",
              "title": "Open SSH Port",
              "description": "SSH port 22 is exposed"
            }
          ],
          "ports": [
            {
              "number": 22,
              "protocol": "TCP",
              "state": "open",
              "service": "ssh"
            },
            {
              "number": 80,
              "protocol": "TCP", 
              "state": "open",
              "service": "http"
            }
          ]
        },
        "createdAt": "2025-07-26T10:30:00Z",
        "updatedAt": "2025-07-26T10:35:00Z",
        "completedAt": "2025-07-26T10:35:00Z"
      }
    ]
  }
}
```

#### Containers Query Response

```json
{
  "data": {
    "activeContainers": [
      {
        "id": "container_12345",
        "status": "RUNNING",
        "auditId": "1753536361715",
        "image": "nmap:latest",
        "createdAt": "2025-07-26T10:30:00Z"
      }
    ]
  }
}
```

## 🎨 Design System Values

### Colors (Tailwind Classes)

```css
/* Primary Background */
bg-slate-900 (#0f172a)
bg-slate-800 (#1e293b)

/* Card Backgrounds */
bg-slate-800 (#1e293b)
bg-slate-700 (#334155)

/* Status Colors */
.status-completed { @apply bg-green-500 text-green-100; }
.status-running { @apply bg-blue-500 text-blue-100; }
.status-pending { @apply bg-orange-500 text-orange-100; }
.status-failed { @apply bg-red-500 text-red-100; }

/* Severity Colors */
.severity-critical { @apply bg-red-600 text-red-100; }
.severity-high { @apply bg-orange-500 text-orange-100; }
.severity-medium { @apply bg-yellow-500 text-yellow-100; }
.severity-low { @apply bg-green-500 text-green-100; }
```

### Typography

```css
/* Headers */
.header-1 { @apply text-2xl font-bold text-white; }
.header-2 { @apply text-xl font-semibold text-gray-100; }
.header-3 { @apply text-lg font-medium text-gray-200; }

/* Body Text */
.body-text { @apply text-gray-300; }
.body-small { @apply text-sm text-gray-400; }
```

## 📱 Component Specifications

### Dashboard Cards

- **Size:** w-full sm:w-1/2 lg:w-1/4
- **Padding:** p-6
- **Border:** border border-slate-700
- **Shadow:** shadow-lg
- **Hover:** hover:shadow-xl transition-shadow

### Data Tables

- **Header:** bg-slate-700 text-gray-200
- **Rows:** even:bg-slate-800 odd:bg-slate-900
- **Text:** text-gray-300
- **Borders:** border-slate-600

### Buttons

- **Primary:** bg-blue-600 hover:bg-blue-700 text-white
- **Secondary:** bg-slate-700 hover:bg-slate-600 text-gray-200
- **Danger:** bg-red-600 hover:bg-red-700 text-white
- **Success:** bg-green-600 hover:bg-green-700 text-white

## 🔍 Interactive Elements

### Status Badges

```tsx
const statusConfig = {
  COMPLETED: { color: 'green', icon: 'CheckCircle' },
  RUNNING: { color: 'blue', icon: 'Clock' },
  PENDING: { color: 'orange', icon: 'Timer' },
  FAILED: { color: 'red', icon: 'XCircle' },
  CANCELLED: { color: 'gray', icon: 'Minus' }
}
```

### Severity Indicators

```tsx
const severityConfig = {
  CRITICAL: { color: 'red', priority: 4 },
  HIGH: { color: 'orange', priority: 3 },
  MEDIUM: { color: 'yellow', priority: 2 },
  LOW: { color: 'green', priority: 1 }
}
```

## 📋 Data Structures for Components

### Audit Object

```typescript
interface Audit {
  id: string;
  type: 'PORT_SCAN' | 'DEPENDENCY_SCAN';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  target: string;
  language?: string;
  containerId?: string;
  results?: AuditResults;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### Container Object

```typescript
interface Container {
  id: string;
  status: 'CREATING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'TERMINATED';
  auditId: string;
  image: string;
  createdAt: string;
}
```

This technical specification will help ensure consistency when implementing the V0.dev generated components!
