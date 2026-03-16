# DesignCraft Platform - Repository Structure

## Overview

This document provides a comprehensive overview of the organized repository structure for the DesignCraft website builder platform.

## 📁 Complete File Structure

```
designcraft-platform/
├── 📄 README.md                    # Main repository documentation
├── 📄 ARCHITECTURE_SUMMARY.md      # Architecture implementation summary
├── 📄 turbo.json                   # Turborepo pipeline configuration
├── 📄 package.json                 # Root package configuration
├── 📁 apps/                        # Application packages
│   ├── 🎨 editor/                  # Visual editor application
│   │   ├── 📄 package.json         # Editor dependencies
│   │   ├── 📄 next.config.js       # Next.js configuration
│   │   ├── 📄 tsconfig.json        # TypeScript configuration
│   │   ├── 📄 next-env.d.ts        # Next.js type definitions
│   │   └── 📁 app/                 # Editor application code
│   │       ├── 📄 page.tsx         # Main editor page
│   │       └── 📄 Editor.tsx       # Main editor component
│   │
│   └── 🖼️ renderer/                # Preview/export application
│       ├── 📄 package.json         # Renderer dependencies
│       ├── 📄 next.config.js       # Next.js configuration
│       ├── 📄 tsconfig.json        # TypeScript configuration
│       ├── 📄 next-env.d.ts        # Next.js type definitions
│       └── 📁 app/                 # Renderer application code
│           ├── 📄 page.tsx         # Main page with sample document
│           └── 📄 Renderer.tsx     # Recursive renderer component
│
└── 📁 packages/                    # Shared packages
    ├── 📋 types/                   # Shared types and interfaces
    │   ├── 📄 package.json         # Types package configuration
    │   ├── 📄 tsconfig.json        # TypeScript configuration
    │   └── 📁 src/                 # Type definitions
    │       └── 📄 index.ts         # Core interfaces and types
    │
    ├── ⚙️ builder-engine/          # Document state management
    │   ├── 📄 package.json         # Builder engine dependencies
    │   ├── 📄 tsconfig.json        # TypeScript configuration
    │   └── 📁 src/                 # Engine implementation
    │       ├── 📄 engine.ts        # Main Zustand store
    │       ├── 📄 node.ts          # Node management class
    │       ├── 📄 tree.ts          # Tree traversal utilities
    │       ├── 📄 types.ts         # Engine-specific types
    │       └── 📁 utils/           # Utility functions
    │           └── 📄 snapshots.ts # Undo/redo functionality
    │
    ├── 🧩 component-registry/      # Component mapping and schemas
    │   ├── 📄 package.json         # Component registry dependencies
    │   ├── 📄 tsconfig.json        # TypeScript configuration
    │   └── 📁 src/                 # Component registry implementation
    │       ├── 📄 registry.ts      # Component registry map
    │       ├── 📄 types.ts         # Registry types
    │       └── 📁 components/      # React components
    │           ├── 📄 Text.tsx     # Text component
    │           ├── 📄 Image.tsx    # Image component
    │           └── 📄 Button.tsx   # Button component
    │
    ├── 🤖 ai-engine/               # AI prompt processing
    │   ├── 📄 package.json         # AI engine dependencies
    │   ├── 📄 tsconfig.json        # TypeScript configuration
    │   └── 📁 src/                 # AI engine implementation
    │       ├── 📄 aiClient.ts      # Claude API integration
    │       ├── 📄 operationGenerator.ts # Operation generation
    │       └── 📄 types.ts         # AI engine types
    │
    └── 💾 storage/                 # Database and asset storage
        ├── 📄 package.json         # Storage dependencies
        ├── 📄 tsconfig.json        # TypeScript configuration
        └── 📁 src/                 # Storage implementation
            ├── 📄 dbClient.ts      # PostgreSQL client
            └── 📄 assets.ts        # S3/Cloudinary asset management
```

## 🏗️ Architecture Layers

### Layer 0 - Shared Types (`packages/types/`)
**Purpose**: Single source of truth for document schema and shared interfaces
**Status**: ✅ Complete
**Key Files**:
- `packages/types/src/index.ts` - Core interfaces (Document, Node, Operation, etc.)

### Layer 1 - Editor (`apps/editor/`)
**Purpose**: Visual interface for designers with drag-and-drop canvas
**Status**: ✅ Complete
**Key Files**:
- `apps/editor/app/Editor.tsx` - Main editor component
- `apps/editor/app/page.tsx` - Editor page wrapper

### Layer 2 - Builder Engine (`packages/builder-engine/`)
**Purpose**: Pure engine managing document tree state
**Status**: ✅ Complete
**Key Files**:
- `packages/builder-engine/src/engine.ts` - Zustand store with all operations
- `packages/builder-engine/src/node.ts` - Node management
- `packages/builder-engine/src/tree.ts` - Tree traversal utilities

### Layer 3a - AI Engine (`packages/ai-engine/`)
**Purpose**: Translates natural language prompts into builder engine operations
**Status**: ✅ Complete
**Key Files**:
- `packages/ai-engine/src/aiClient.ts` - Claude API integration
- `packages/ai-engine/src/operationGenerator.ts` - Operation generation

### Layer 3b - Component Registry (`packages/component-registry/`)
**Purpose**: Centralized type → React component mapping and prop schema
**Status**: ✅ Complete
**Key Files**:
- `packages/component-registry/src/registry.ts` - Component registry map
- `packages/component-registry/src/components/` - React components

### Layer 4a - Renderer (`apps/renderer/`)
**Purpose**: Recursively renders node tree for preview and static export
**Status**: ✅ Complete
**Key Files**:
- `apps/renderer/app/Renderer.tsx` - Recursive renderer component
- `apps/renderer/app/page.tsx` - Sample document page

### Layer 4b - Storage (`packages/storage/`)
**Purpose**: Persistent storage for projects, pages, versions, assets, and fonts
**Status**: ✅ Complete
**Key Files**:
- `packages/storage/src/dbClient.ts` - PostgreSQL operations
- `packages/storage/src/assets.ts` - Asset management

## 📦 Package Dependencies

### Core Dependencies
- **TypeScript**: Strict type checking across all packages
- **Zustand**: State management for builder engine
- **React**: UI framework for editor and renderer
- **Next.js**: Application framework for editor and renderer

### Editor Dependencies
- **dnd-kit**: Drag and drop functionality
- **shadcn/ui**: UI component library
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Styling framework

### Backend Dependencies
- **PostgreSQL**: Database with pg library
- **AWS SDK**: Asset storage integration
- **Axios**: HTTP client for AI API

## 🚀 Development Workflow

### Monorepo Commands
```bash
# Install all dependencies
pnpm install

# Start all development servers
pnpm dev

# Build all packages and apps
pnpm build

# Run tests across all packages
pnpm test

# Lint all code
pnpm lint

# Format all code
pnpm format
```

### Individual Package Commands
```bash
# Build specific package
pnpm --filter=builder-engine build

# Start specific app
pnpm --filter=editor dev

# Run tests for specific package
pnpm --filter=types test
```

## 🔄 Build Pipeline

The `turbo.json` configuration defines the build pipeline:

1. **Build**: All packages depend on each other, building in dependency order
2. **Test**: Runs after build completion
3. **Lint**: Independent of build process
4. **Typecheck**: Independent type checking
5. **Clean**: Removes build artifacts

## 📋 Development Guidelines

### Adding New Components
1. Create component in `packages/component-registry/src/components/`
2. Define schema in `packages/component-registry/src/registry.ts`
3. Add to registry map
4. Update inspector controls

### Adding New Operations
1. Define operation type in `packages/types/src/index.ts`
2. Implement in `packages/builder-engine/src/engine.ts`
3. Add to AI engine generator
4. Update validation

### Adding New Features
1. Identify appropriate layer for the feature
2. Follow existing patterns and conventions
3. Add comprehensive TypeScript types
4. Include proper error handling
5. Update documentation

## 🎯 Key Features Implemented

### ✅ Complete Features
- **Monorepo Structure**: Turborepo + pnpm workspaces
- **Layered Architecture**: Clear separation of concerns
- **Type Safety**: Comprehensive TypeScript coverage
- **State Management**: Zustand-based document state
- **Component System**: Registry-based component mapping
- **AI Integration**: Claude API for natural language processing
- **Storage Layer**: PostgreSQL + asset management
- **Rendering Engine**: Recursive node tree rendering
- **Editor Interface**: Visual drag-and-drop interface

### 🔄 Future Enhancements
- **Drag & Drop**: Complete dnd-kit integration
- **Inspector UI**: Dynamic property controls
- **Toolbar Features**: Advanced editing tools
- **Asset Upload**: File upload and management
- **Database Migrations**: Schema management
- **Testing**: Unit and integration tests
- **Documentation**: API documentation



This repository structure provides a solid foundation for a production-ready website builder platform with AI assistance, following modern development practices and architectural patterns.