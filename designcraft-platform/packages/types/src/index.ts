// Document Schema - Single Source of Truth
export interface Document {
  id: string;
  name: string;
  version: string;
  nodes: Node[];
  createdAt: string;
  updatedAt: string;
}

export interface Node {
  id: string;
  type: string;
  props: Record<string, any>;
  children: string[];
  parentId: string | null;
  order: number;
}

// Builder Engine Operations
export type OperationType = 'INSERT_NODE' | 'DELETE_NODE' | 'MOVE_NODE' | 'UPDATE_NODE_PROPS';

export interface Operation {
  type: OperationType;
  payload: any;
  timestamp: number;
  nodeId?: string;
}

export interface InsertNodeOperation {
  type: 'INSERT_NODE';
  payload: {
    nodeType: string;
    parentId: string | null;
    index: number;
    props: Record<string, any>;
  };
}

export interface DeleteNodeOperation {
  type: 'DELETE_NODE';
  payload: {
    nodeId: string;
  };
}

export interface MoveNodeOperation {
  type: 'MOVE_NODE';
  payload: {
    nodeId: string;
    newParentId: string | null;
    newIndex: number;
  };
}

export interface UpdateNodePropsOperation {
  type: 'UPDATE_NODE_PROPS';
  payload: {
    nodeId: string;
    props: Record<string, any>;
  };
}

// Component Registry
export interface ComponentSchema {
  type: string;
  displayName: string;
  category: string;
  props: PropSchema[];
  defaultProps: Record<string, any>;
}

export interface PropSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'enum';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For enum type
  description?: string;
}

// AI Engine
export interface AIPrompt {
  text: string;
  context?: {
    selectedNodeId?: string;
    pageContext?: string;
  };
}

export interface AIResponse {
  operations: Operation[];
  explanation: string;
}

// Storage
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Page {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageVersion {
  id: string;
  pageId: string;
  document: Document;
  version: number;
  createdAt: string;
  createdBy: string;
}

// Renderer
export interface RenderContext {
  mode: 'preview' | 'export';
  pageId?: string;
  projectId?: string;
}

// Shared utilities
export type NodeId = string;
export type ComponentType = string;