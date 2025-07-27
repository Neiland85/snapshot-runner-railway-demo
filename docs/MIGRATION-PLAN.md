# 🚀 Next.js Migration Plan - Snapshot Runner

## 🎯 Migration Strategy

### Phase 1: Next.js Setup (1-2 days)

```bash
# Create new Next.js app with TypeScript
npx create-next-app@latest packages/frontend-next --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Copy Railway configurations
cp packages/frontend/tailwind.config.js packages/frontend-next/
cp packages/frontend/src/index.css packages/frontend-next/src/app/globals.css
```

### Phase 2: Component Migration (2-3 days)

```text
📁 Next.js Structure:
packages/frontend-next/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── layout.tsx         # Root layout with Apollo Provider
│   │   ├── page.tsx           # Home page
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── page.tsx       
│   │   │   ├── security/      
│   │   │   └── dependencies/  
│   │   └── globals.css        # Railway CSS variables
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   └── dashboard/        # Dashboard specific
│   ├── lib/                  # Utilities + Apollo setup
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript definitions
├── next.config.js            # Next.js configuration
└── package.json
```

### Phase 3: Apollo Client Setup

```typescript
// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' }
  }
});
```

### Phase 4: Railway Design System Integration

```typescript
// src/app/layout.tsx
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-900 text-dark-50`}>
        <ApolloWrapper>
          <div className="min-h-screen">
            {children}
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
```

## 🔧 Configuration Files

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    GRAPHQL_URL: process.env.GRAPHQL_URL,
  },
};

module.exports = nextConfig;
```

### Apollo Wrapper for Client Components

```typescript
// src/lib/apollo-wrapper.tsx
'use client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo-client';

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
```

## 📦 Package.json Updates

```json
{
  "name": "frontend-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@apollo/client": "^3.8.8",
    "graphql": "^16.8.1",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
```

## 🎨 V0.dev Integration Strategy

### Updated Prompts for Next.js

```text
Create a modern Next.js 14 dashboard component using App Router with Railway design system:

TECHNICAL REQUIREMENTS:
- Next.js 14+ with App Router and TypeScript
- Server Components where possible, Client Components for interactivity
- Tailwind CSS with Railway purple theme (#8b5cf6)
- Framer Motion for animations
- Apollo Client for GraphQL data fetching
- Responsive design with glassmorphism effects

COMPONENT STRUCTURE:
- Use 'use client' directive only when necessary
- Implement proper loading states with Suspense
- Error boundaries for robust error handling
- Accessible components with proper ARIA labels

Create a dashboard overview with metrics cards, charts, and recent activity feed.
```

## 🚀 Migration Benefits

### Performance Improvements

- **50-80% faster** page loads with Server Components
- **Automatic code splitting** per route
- **Built-in image optimization**
- **Static generation** for better SEO

### Developer Experience

- **Hot reload** faster than CRA
- **Built-in TypeScript** support
- **App Router** with layouts
- **Middleware** support

### Production Ready

- **Edge runtime** support
- **Vercel integration** out of the box
- **ISR** for dynamic content
- **API routes** for backend integration

## 📋 Migration Checklist

- [ ] Create Next.js app structure
- [ ] Migrate Railway CSS variables
- [ ] Setup Apollo Client wrapper
- [ ] Convert components to Next.js structure
- [ ] Update V0.dev prompts for Next.js
- [ ] Test routing and navigation
- [ ] Validate GraphQL integration
- [ ] Performance optimization
- [ ] Deploy and test production build

## 🔄 Rollback Plan

If migration fails:

1. Keep current CRA setup as fallback
2. Use feature flags for gradual migration
3. Deploy Next.js to different subdomain initially
4. A/B test between CRA and Next.js versions
