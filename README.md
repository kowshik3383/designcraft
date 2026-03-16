# 🏗️ Website Builder Platform Architecture

This document outlines the layered architecture, tech stack, and file/folder structure for a web-based design/editor platform that supports drag-and-drop design, AI-assisted editing, and static site export. It also includes ownership boundaries and key decisions.

## Table of Contents

- [Overview](#overview)
- [Layer 1 — Editor](#layer-1--editor-appseditor)
- [Layer 2 — Builder Engine](#layer-2--builder-engine-packagesbuilder-engine)
- [Layer 3a — AI Engine](#layer-3a--ai-engine-packagesai-engine)
- [Layer 3b — Component Registry](#layer-3b--component-registry-packagescomponent-registry)
- [Layer 4a — Renderer](#layer-4a--renderer-appsrenderer)
- [Layer 4b — Storage](#layer-4b--storage-packagesstorage)
- [Full Tech Stack](#full-tech-stack)
- [Key Architectural Decisions](#key-architectural-decisions)

## Overview

This platform is a modular website builder with AI-assisted design capabilities.
It uses a monorepo approach (Turborepo + pnpm workspaces) with explicit ownership per layer.

**Core principle:**

The document schema is the single source of truth. Everything — editor, AI, renderer, storage — depends on this schema.

## Layer 1 — Editor (apps/editor)

**Purpose:** Visual interface for designers. Provides drag-and-drop canvas, property inspector, component library, and toolbar.

**Key features:**

- Only manipulates node IDs.
- Does not touch DOM directly.
- Handles local editor state with Zustand.
- Drag-and-drop via dnd-kit.
- Inspector uses Radix + shadcn/ui to render controls.

**Folder/File Structure:**

```bash
apps/editor/
├── app/
│   ├── page.tsx             # Main editor page
│   ├── canvas/
│   │   ├── Canvas.tsx        # Render the canvas and nodes
│   │   ├── NodeRenderer.tsx  # Renders nodes via component registry
│   │   └── DragLayer.tsx     # Handles drag preview
│   ├── toolbar/
│   │   ├── Toolbar.tsx
│   │   └── ToolbarButton.tsx
│   ├── inspector/
│   │   ├── Inspector.tsx     # Reads node props and generates controls
│   │   └── Controls.tsx
│   └── library/
│       └── ComponentLibrary.tsx  # Lists available components
├── stores/
│   └── editorStore.ts       # Zustand store for local editor state
└── types/
    └── nodes.ts             # Node types, prop interfaces
```

**Notes:**

- Local undo/redo can be implemented here via snapshots from builder engine.
- Any AI suggestions are applied as operations, not raw JSX.

## Layer 2 — Builder Engine (packages/builder-engine)

**Purpose:** Pure engine managing document tree state. Central source of truth for all node operations.

**Responsibilities:**

- CRUD on nodes (insertNode, deleteNode, moveNode, updateNodeProps).
- Produce snapshots for undo/redo.
- Framework-agnostic (can be used by editor or AI engine).
- State management via Zustand.

**Folder/File Structure:**

```bash
packages/builder-engine/
├── src/
│   ├── engine.ts            # Main engine: handles operations & snapshots
│   ├── node.ts              # Node class & helpers
│   ├── tree.ts              # Functions for tree traversal/manipulation
│   └── types.ts             # Node schema & operation types
├── stores/
│   └── builderStore.ts      # Zustand store for document state
└── utils/
    └── snapshots.ts         # Undo/redo helpers
```

**Notes:**

- No React-specific code here.
- Operations are strictly typed for TypeScript safety.

## Layer 3a — AI Engine (packages/ai-engine)

**Purpose:** Translates natural language prompts into builder engine operations.

**Key details:**

- Communicates with Claude API (claude-sonnet-4).
- Never manipulates DOM.
- Output = list of operations, ready to apply to builder engine.

**Folder/File Structure:**

```bash
packages/ai-engine/
├── src/
│   ├── aiClient.ts          # API integration with Claude
│   ├── promptParser.ts      # Convert text into operations
│   ├── operationGenerator.ts # Generate insert/move/update ops
│   └── types.ts             # Types for AI operations
└── utils/
    └── validators.ts        # Ensures operations conform to node schema
```

**Notes:**

- Operations must pass JSON Schema validation.
- No JSX or HTML is produced directly.

## Layer 3b — Component Registry (packages/component-registry)

**Purpose:** Centralized type → React component mapping and prop schema.

**Responsibilities:**

- Resolves node types in renderer.
- Generates inspector controls dynamically.
- Adding a component = registering here only.

**Folder/File Structure:**

```bash
packages/component-registry/
├── src/
│   ├── index.ts             # Exports registry map
│   ├── registry.ts          # Map type → component + schema
│   └── types.ts             # Component prop schemas
└── components/
    ├── Text.tsx
    ├── Image.tsx
    └── Button.tsx
```

**Notes:**

- No business logic; purely maps types to React + prop schema.

## Layer 4a — Renderer (apps/renderer)

**Purpose:** Recursively walks node tree, resolves components, and renders React for preview or static export.

**Key features:**

- Supports live preview.
- Used for static export → CDN.

**Folder/File Structure:**

```bash
apps/renderer/
├── app/
│   ├── page.tsx             # Main render entry
│   └── Renderer.tsx         # Recursively render nodes
├── components/
│   └── NodeRenderer.tsx     # Uses component registry
├── stores/
│   └── renderStore.ts       # Optional preview state
└── types/
    └── nodes.ts             # Shared node types
```

## Layer 4b — Storage (packages/storage)

**Purpose:** Persistent storage for projects, pages, versions, assets, and fonts.

**Responsibilities:**

- Postgres: projects, pages, page_versions (full JSON per version).
- S3 / R2 / Cloudinary: store images/videos.
- Fonts per project, referenced in node props.

**Folder/File Structure:**

```bash
packages/storage/
├── src/
│   ├── dbClient.ts          # Postgres client
│   ├── models/
│   │   ├── Project.ts
│   │   ├── Page.ts
│   │   └── PageVersion.ts
│   └── assets.ts            # Upload/download helpers (S3/Cloudinary)
└── types/
    └── storage.ts           # DB & asset types
```

## Full Tech Stack

| Concern | Choice |
|---------|--------|
| App framework | Next.js 14 (App Router) |
| UI components | React + shadcn/ui + Radix |
| Styling | Tailwind CSS |
| State | Zustand (editor + engine) |
| Drag and drop | dnd-kit |
| AI | Claude API (claude-sonnet-4) |
| Database | Postgres (Neon or Supabase) |
| Assets | Cloudinary or S3/R2 |
| Monorepo | Turborepo + pnpm workspaces |
| Type safety | TypeScript throughout |
| Publishing | Next.js static export → Cloudflare Pages |

## Key Architectural Decisions

### Lock down the document schema first
Everything — editor, AI engine, renderer, storage — depends on it. Changing it later = massive refactor.

### Separation of concerns

- **Editor:** visual interface only, no data mutations.
- **Builder engine:** pure state machine.
- **AI engine:** operation generator.
- **Renderer:** presentation only.

### Type safety everywhere
Strict TypeScript + JSON schema validation at every layer ensures consistency.

### Operations, not HTML/JSX
AI output = operations applied to node tree, never raw JSX/HTML.

This setup ensures your platform is scalable, maintainable, and AI-friendly, with clear boundaries between UI, engine, and persistence.
