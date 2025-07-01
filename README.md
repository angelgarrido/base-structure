# Base Structure

A scalable, performant monorepo base project built with SST, TypeScript, and modern tooling.

## 🚀 Features

- **Monorepo Architecture**: Organized with npm workspaces
- **Infrastructure as Code**: SST for AWS deployment
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Performance Optimized**: Fast builds and IDE performance
- **Domain-Driven Design**: Clean separation of concerns
- **Modern Tooling**: Biome for linting/formatting, Vite for frontend

## 📁 Project Structure

```
base-structure/
├── apps/                    # Applications
│   ├── frontend/           # React + Vite frontend
│   ├── backend-api/        # Hono-based API
│   └── auth/              # Authentication service
├── domains/                # Domain logic
│   └── user/              # User domain
├── packages/               # Shared packages
│   └── shared/            # Common utilities and types
├── infra/                  # SST infrastructure
└── docs/                   # Documentation
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- AWS CLI configured
- SST CLI installed

### Setup

```bash
# Install dependencies
npm install

# Start development environment
npm run dev

# Build all packages
npm run build

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format
```

### Available Scripts

- `npm run dev` - Start SST development environment
- `npm run build` - Build SST infrastructure
- `npm run deploy` - Deploy to AWS
- `npm run remove` - Remove AWS resources
- `npm run console` - Open SST console
- `npm run lint` - Run Biome linter
- `npm run format` - Run Biome formatter
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean and reinstall dependencies

## 🏗️ Architecture

### Domain-Driven Design

The project follows DDD principles with clear separation between:

- **Entities**: Core business objects
- **Use Cases**: Business logic implementation
- **Services**: Domain services
- **Repositories**: Data access layer
- **Schemas**: Input/output validation

### Infrastructure

- **SST**: Infrastructure as code with AWS
- **Hono**: Fast web framework for APIs
- **Drizzle ORM**: Type-safe database operations
- **OpenAuth**: Authentication framework

## 🔧 Configuration

### TypeScript

- Strict type checking enabled
- Project references for fast builds
- Path mapping for clean imports
- Composite builds for monorepo performance

### Biome

- Consistent code formatting
- Strict linting rules
- Performance optimizations
- Ignore patterns for build artifacts

## 📦 Packages

### Shared Package

Common utilities and types used across the monorepo:

- Type definitions
- Validation schemas
- Utility functions
- API response types

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run deploy
```

## 🤝 Contributing

1. Follow the established code style (Biome)
2. Add tests for new features
3. Update documentation as needed
4. Use conventional commits

## 📄 License

UNLICENSED - Private project
