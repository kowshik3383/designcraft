import { Document, Node, Operation, OperationType } from '@designcraft/types';

export interface BuilderState {
  document: Document | null;
  selectedNodeId: string | null;
  clipboard: Node | null;
  history: {
    past: Operation[];
    future: Operation[];
  };
}

export interface BuilderActions {
  // Document operations
  createDocument: (name: string) => void;
  loadDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  
  // Node operations
  insertNode: (nodeType: string, parentId: string | null, index: number, props?: Record<string, any>) => string;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, newParentId: string | null, newIndex: number) => void;
  updateNodeProps: (nodeId: string, props: Record<string, any>) => void;
  
  // Selection
  selectNode: (nodeId: string | null) => void;
  
  // Clipboard
  copyNode: (nodeId: string) => void;
  pasteNode: (parentId: string | null, index: number) => string | null;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  applyOperations: (operations: Operation[]) => void;
  
  // Utilities
  getNode: (nodeId: string) => Node | null;
  getChildren: (parentId: string | null) => Node[];
  getRootNodes: () => Node[];
  findNode: (predicate: (node: Node) => boolean) => Node | null;
}