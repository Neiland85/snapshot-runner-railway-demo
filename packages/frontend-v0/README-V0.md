# 🚀 Snapshot Runner Frontend - V0.dev Generated

## 📋 Project Information

**Project:** Snapshot Runner - Security Audit Management Platform

**Backend API:** <http://localhost:4000/graphql>

**Technology:** React + TypeScript + Tailwind CSS + Apollo Client

## 🎯 Components to Generate in V0.dev

### 1. 🏠 Main Dashboard

- Security audit overview
- Real-time statistics
- Quick actions panel
- Recent activity feed

### 2. 📊 Audit Management

- Audit list/table view
- Filtering and search
- Status management
- Detailed views

### 3. 🔍 Audit Details

- Comprehensive audit results
- Vulnerability breakdown
- Port scan results
- Export functionality

### 4. 🐳 Container Monitoring

- Live container status
- Resource monitoring
- Container management
- Logs viewer

## 🔧 GraphQL Schema Reference

### Available Queries

```graphql
# Get all audits
{
  audits {
    id
    type
    status
    target
    language
    results {
      summary
      vulnerabilities {
        id
        severity
        title
        description
      }
      ports {
        number
        protocol
        state
        service
      }
    }
    createdAt
    updatedAt
    completedAt
  }
}

# Get active containers
{
  activeContainers {
    id
    status
    auditId
    image
    createdAt
  }
}

# Server status
{
  status
}
```

### Available Mutations

```graphql
# Start port scan
mutation StartPortScan($target: String!) {
  startPortScan(input: { target: $target }) {
    id
    type
    status
    target
    containerId
    createdAt
  }
}

# Start dependency scan
mutation StartDependencyScan($language: AuditLanguage!, $projectPath: String!) {
  startDependencyScan(input: { 
    language: $language, 
    projectPath: $projectPath 
  }) {
    id
    type
    status
    target
    language
    containerId
  }
}

# Stop audit
mutation StopAudit($auditId: ID!) {
  stopAudit(id: $auditId)
}
```

## 📚 Design Guidelines

### 🎨 Theme

- **Primary:** Dark theme with cybersecurity aesthetics
- **Colors:** Dark blues, greens for success, reds for critical vulnerabilities
- **Typography:** Modern, readable fonts
- **Icons:** Security-focused iconography

### 🔒 Security Focus

- Vulnerability severity indicators
- Real-time status updates
- Professional security dashboard feel
- Clear action buttons and status states

### 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Accessible design patterns

## 🚀 Next Steps

1. Generate components in V0.dev using the prompts above
2. Download/copy the generated code
3. Set up Vite + React project structure
4. Integrate Apollo Client for GraphQL
5. Connect to backend API
6. Test and refine

## 📝 Notes

- Backend server runs on port 4000
- GraphQL endpoint: <http://localhost:4000/graphql>
- Current playground: <http://localhost:4000/playground>
- Mock data is available for all queries
