# Base Structure - Architecture Guide

## Project Overview

This is a scalable TypeScript monorepo built with SST, featuring clean architecture principles and performance-optimized configurations.

## Current File Structure

```
base-structure/
├── tsconfig.json              # Root config (project references only)
├── package.json               # Root workspace configuration
├── biome.json                 # Code formatting and linting
├── .vscode/
│   ├── settings.json          # Shared team settings
│   └── extensions.json        # Recommended extensions
├── apps/                      # Applications
│   ├── frontend/              # React + Vite (bundler resolution)
│   │   ├── tsconfig.json      # Composite: true, references child configs
│   │   ├── tsconfig.app.json  # App-specific config
│   │   └── package.json       # Frontend dependencies
│   ├── backend-api/           # Node.js + Hono (NodeNext resolution)
│   │   ├── tsconfig.json      # Extends @tsconfig/node22, composite: true
│   │   ├── package.json       # Backend dependencies
│   │   └── src/
│   │       ├── api.ts         # Uses .js extensions for imports
│   │       └── subjects.ts
│   └── auth/                  # Authentication service (NodeNext resolution)
│       ├── tsconfig.json      # Extends @tsconfig/node22, composite: true
│       ├── package.json       # Auth dependencies
│       └── src/
│           ├── auth.ts        # Uses .js extensions for imports
│           └── subjects.ts
├── packages/                  # Shared packages
│   └── shared/                # Common utilities and types
│       ├── tsconfig.json      # Bundler resolution, composite: true
│       ├── package.json       # Package configuration
│       └── src/
│           ├── index.ts       # Main barrel file
│           ├── types.ts       # Common types
│           ├── utils.ts       # Utility functions
│           └── schemas.ts     # Zod validation schemas
├── domains/                   # Domain logic (DDD)
│   └── user/                  # User domain
│       ├── entities/
│       ├── repositories/
│       ├── services/
│       └── use-cases/
└── infra/                     # SST infrastructure
    ├── api.ts
    ├── auth.ts
    └── frontend.ts
```

## Recommended Architecture

### TypeScript Configuration Strategy

#### 1. Root tsconfig.json

```json
{
  "compilerOptions": {
    // Basic configuration without paths
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "dist", "build", ".sst"],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./apps/frontend" },
    { "path": "./apps/backend-api" },
  ]
}
```

#### 2. Node.js Apps (backend-api, auth)

```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "composite": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // Only local paths
    }
  },
  "include": ["src/**/*", "*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3. Frontend Apps (React + Vite)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "composite": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // Only local paths
    }
  },
  "include": ["src/**/*"]
}
```

#### 4. Shared Packages

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "strict": true
  },
  "include": ["src/**/*", "*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Import Patterns

#### 1. Node.js ESM Imports (backend-api, auth)

```typescript
// ✅ Correct - Use .js extensions for relative imports
import { subjects } from './subjects.js';
import { api } from './api.js';

// ✅ Correct - Package imports don't need extensions
import { Hono } from 'hono';
import { ApiResponse } from '@base-structure/shared';
```

#### 2. Frontend Imports (React + Vite)

```typescript
// ✅ Correct - Can use .ts/.tsx extensions (bundler handles it)
import { Component } from './Component.tsx';
import { utils } from './utils.ts';

// ✅ Correct - Package imports
import { ApiResponse } from '@base-structure/shared';
```

#### 3. Shared Package Imports

```typescript
// ✅ Main barrel import (recommended)
import { ApiResponse, generateId } from '@base-structure/shared';

// ✅ Feature barrel import (more specific)
import { userSchema } from '@base-structure/shared/schemas';

// ✅ Direct import (best for tree-shaking)
import { formatDate } from '@base-structure/shared/utils/date';
```

### Package Dependencies

#### 1. Workspace Dependencies

```json
{
  "dependencies": {
    "@base-structure/shared": "*",  // ✅ Use "*" for workspace packages
    "hono": "^4.6.18"              // ✅ Use semver for external packages
  }
}
```

#### 2. Avoid Circular Dependencies

```
✅ Good Flow:
packages/shared ← apps/backend-api
               ← apps/frontend
               ← apps/auth

❌ Bad Flow:
packages/shared → apps/backend-api (circular!)
apps/backend-api → packages/shared
```

### Barrel Files Strategy

#### 1. Main Package Barrel (packages/shared/src/index.ts)

```typescript
// Export main APIs
export * from './types';
export * from './utils';
export * from './schemas';

// Don't export internal/private modules
// export * from './internal/private-stuff';  // ❌ Don't do this
```

#### 2. Feature Barrels

```typescript
// packages/shared/src/types/index.ts
export * from './user';
export * from './api';
export * from './common';

// packages/shared/src/utils/index.ts
export * from './date';
export * from './string';
export * from './validation';
```

## Development Scripts

### Dependency Analysis

```bash
# Check for circular dependencies
npm run deps:circular

# Generate dependency graph image
npm run deps:graph

# Generate dependency graph JSON
npm run deps:json
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run lint:fix
npm run format:fix
```

## Performance Considerations

### 1. TypeScript Configuration

- ✅ Use `composite: true` for project references
- ✅ Use `skipLibCheck: true` for faster builds
- ✅ Use appropriate `moduleResolution` per project type
- ❌ Avoid root-level paths (causes circular dependencies)

### 2. Import Optimization

- ✅ Use direct imports for better tree-shaking
- ✅ Use barrel files strategically
- ❌ Avoid deep barrel file nesting
- ❌ Avoid importing entire packages when only using one function

### 3. IDE Performance

- ✅ Exclude build artifacts from search/files
- ✅ Use project references for incremental builds
- ✅ Regular dependency analysis to catch circular deps
- ❌ Avoid too many path mappings

## Best Practices

### ✅ Do's

- Use project references for monorepo structure
- Use explicit file extensions for Node.js ESM
- Keep shared packages dependency-free from apps
- Use workspace dependencies with "*" version
- Create strategic barrel files
- Regular circular dependency checks

### ❌ Don'ts

- Don't use root-level path mapping
- Don't create circular dependencies
- Don't mix different module systems
- Don't over-barrel (too many index files)
- Don't ignore TypeScript project reference errors
- Don't use relative imports across package boundaries

## Troubleshooting

### Common Issues

1. **"Cannot resolve module"** → Check file extensions for Node.js ESM
2. **"Circular dependency detected"** → Run `npm run deps:circular`
3. **"Project must have composite: true"** → Add to referenced tsconfig
4. **Slow IDE performance** → Check for circular deps and path mappings

### Tools

- **Madge**: Dependency graph analysis and circular dependency detection
- **TypeScript**: Type checking and project references
- **Biome**: Fast linting and formatting
- **VS Code**: Optimized settings for monorepo development
