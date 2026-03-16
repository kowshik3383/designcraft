# DesignCraft Platform

A comprehensive website builder platform with AI-assisted design capabilities, built as a monorepo using Turborepo and pnpm workspaces.

## 🏗️ Architecture Overview

This platform follows a layered architecture with clear separation of concerns:

```
designcraft-platform/
├── apps/
│   ├── editor/          # Visual editor application (Layer 1)
│   └── renderer/        # Preview/export application (Layer 4a)
└── packages/
    ├── types/           # Shared types and interfaces (Layer 0)
    ├── builder-engine/  # Document state management (Layer 2)
    ├── component-registry/ # Component mapping and schemas (Layer 3b)
    ├── ai-engine/       # AI prompt processing (Layer 3a)
    └── storage/         # Database and asset storage (Layer 4b)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation
```bash
# Clone and install dependencies
cd designcraft-platform
pnpm install

# Start development servers
pnpm dev

# Start individual applications
pnpm --filter=editor dev    # Editor interface
pnpm --filter=renderer dev  # Preview/export

# Build all packages
pnpm build
```

## 📦 Repository Structure

### Apps

#### 🎨 Editor (`apps/editor/`)
**Purpose**: Visual interface for designers with drag-and-drop canvas
**Tech Stack**: Next.js 14, React, Zustand, dnd-kit, shadcn/ui, Tailwind CSS

**Key Features**:
- Drag-and-drop canvas
- Component library sidebar
- Property inspector
- Toolbar with actions
- AI-powered design assistance

**Files**:
```
apps/editor/
├── app/
│   ├── page.tsx          # Main editor page
│   └── Editor.tsx        # Main editor component
├── toolbar/              # Toolbar components
├── canvas/               # Canvas and drag-drop logic
├── inspector/            # Property inspector
└── library/              # Component library
```

#### 🖼️ Renderer (`apps/renderer/`)
**Purpose**: Recursively renders node tree for preview and static export
**Tech Stack**: Next.js 14, React, Tailwind CSS

**Key Features**:
- Recursive node tree rendering
- Component resolution via registry
- Preview and export modes
- Static site generation

**Files**:
```
apps/renderer/
├── app/
│   ├── page.tsx          # Main page with sample document
│   └── Renderer.tsx      # Recursive renderer component
└── components/           # Shared renderer components
```

### Packages

#### 📋 Types (`packages/types/`)
**Purpose**: Single source of truth for document schema and shared interfaces
**Tech Stack**: TypeScript

**Key Interfaces**:
- `Document` - Root document structure
- `Node` - Individual component nodes
- `Operation` - Builder engine operations
- `ComponentSchema` - Component registration schema
- `Project`, `Page`, `PageVersion` - Storage interfaces

#### ⚙️ Builder Engine (`packages/builder-engine/`)
**Purpose**: Pure engine managing document tree state
**Tech Stack**: TypeScript, Zustand

**Key Features**:
- Framework-agnostic state management
- Node CRUD operations (insert, delete, move, update)
- Snapshot-based undo/redo system
- Tree traversal utilities

**Files**:
```
packages/builder-engine/
├── src/
│   ├── engine.ts         # Main Zustand store
│   ├── node.ts           # Node management class
│   ├── tree.ts           # Tree traversal utilities
│   ├── types.ts          # Engine-specific types
│   └── utils/
│       └── snapshots.ts  # Undo/redo functionality
```

#### 🧩 Component Registry (`packages/component-registry/`)
**Purpose**: Centralized type → React component mapping and prop schema
**Tech Stack**: TypeScript, React

**Key Features**:
- Component schema definitions
- Prop validation and defaults
- Dynamic component resolution
- Inspector control generation

**Components**:
- `Text` - Text content component
- `Image` - Image display component  
- `Button` - Interactive button component

#### 🤖 AI Engine (`packages/ai-engine/`)
**Purpose**: Translates natural language prompts into builder engine operations
**Tech Stack**: TypeScript, Axios

**Key Features**:
- Claude API integration (claude-sonnet-4)
- Natural language to operations conversion
- Keyword-based operation generation
- JSON Schema validation

**Files**:
```
packages/ai-engine/
├── src/
│   ├── aiClient.ts       # Claude API integration
│   ├── operationGenerator.ts # Operation generation
│   └── types.ts          # AI engine types
```

#### 💾 Storage (`packages/storage/`)
**Purpose**: Persistent storage for projects, pages, versions, assets, and fonts
**Tech Stack**: TypeScript, PostgreSQL, AWS SDK

**Key Features**:
- PostgreSQL database operations
- Page version management
- Asset upload/download
- S3/Cloudinary integration

**Files**:
```
packages/storage/
├── src/
│   ├── dbClient.ts       # PostgreSQL client
│   └── assets.ts         # S3/Cloudinary asset management
```

## 🏗️ Architecture Principles

### ✅ Document Schema as Single Source of Truth
- All layers depend on the shared types package
- Strict TypeScript interfaces ensure consistency
- JSON Schema validation for operations

### ✅ Separation of Concerns
- **Editor**: Visual interface only, no data mutations
- **Builder Engine**: Pure state machine
- **AI Engine**: Operation generator
- **Renderer**: Presentation only

### ✅ Type Safety Everywhere
- Strict TypeScript configuration
- Interface definitions for all data structures
- Compile-time validation

### ✅ Operations, Not HTML/JSX
- AI output = operations applied to node tree
- No raw JSX/HTML generation
- Consistent state management

## 🛠️ Development

### Building the Project
```bash
# Build all packages and apps
pnpm build

# Build specific package
pnpm --filter=builder-engine build

# Build specific app
pnpm --filter=editor build
```

### Testing
```bash
# Run tests across all packages
pnpm test

# Run tests for specific package
pnpm --filter=types test
```

### Linting and Formatting
```bash
# Lint all code
pnpm lint

# Format all code
pnpm format
```

### Adding New Components
1. **Define Component Schema** in `packages/component-registry/src/registry.ts`
2. **Create Component** in `packages/component-registry/src/components/`
3. **Add to Registry** in the component registry map
4. **Update Inspector** to handle new component props

### Adding New Operations
1. **Define Operation Type** in `packages/types/src/index.ts`
2. **Implement Operation** in `packages/builder-engine/src/engine.ts`
3. **Add to AI Engine** in `packages/ai-engine/src/operationGenerator.ts`
4. **Update Validation** for new operation type

## 🚀 Deployment

### Editor Application
```bash
cd apps/editor
pnpm build
pnpm start
```

### Renderer Application
```bash
cd apps/renderer
pnpm build
pnpm start
```

### Static Export
The renderer supports static export for production deployment:
```bash
cd apps/renderer
pnpm build
# Static files generated in .next/static/
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/designcraft"

# AI
CLAUDE_API_KEY="your-claude-api-key"
CLAUDE_API_URL="https://api.anthropic.com"

# Storage
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
S3_BUCKET_NAME="designcraft-assets"
```

### Database Schema
```sql
-- Projects table
CREATE TABLE projects (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  user_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pages table
CREATE TABLE pages (
  id VARCHAR PRIMARY KEY,
  project_id VARCHAR REFERENCES projects(id),
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL,
  document_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page versions table
CREATE TABLE page_versions (
  id VARCHAR PRIMARY KEY,
  page_id VARCHAR REFERENCES pages(id),
  document JSONB NOT NULL,
  version INTEGER NOT NULL,
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Turborepo** - For monorepo management
- **Next.js** - For the application framework
- **Zustand** - For state management
- **Claude AI** - For natural language processing
- **shadcn/ui** - For UI components

## 📞 Support

For support and questions, please open an issue in the repository.