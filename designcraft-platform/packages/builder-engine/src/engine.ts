import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Document, Node, NodeId, Operation, OperationType } from '@designcraft/types';
import { TreeManager } from './tree';
import { SnapshotManager } from './utils/snapshots';
import { BuilderState, BuilderActions } from './types';

export const useBuilderStore = create<BuilderState & BuilderActions>()(
  immer((set, get) => ({
    // State
    document: null,
    selectedNodeId: null,
    clipboard: null,
    history: {
      past: [],
      future: []
    },

    applyOperations: (operations: Operation[]) => {
      operations.forEach(op => {
        const state = useBuilderStore.getState();
        switch (op.type) {
          case 'INSERT_NODE':
            state.insertNode(op.payload.nodeType, op.payload.parentId, op.payload.index, op.payload.props);
            break;
          case 'DELETE_NODE':
            state.deleteNode(op.payload.nodeId);
            break;
          case 'MOVE_NODE':
            state.moveNode(op.payload.nodeId, op.payload.newParentId, op.payload.newIndex);
            break;
          case 'UPDATE_NODE_PROPS':
            state.updateNodeProps(op.payload.nodeId, op.payload.props);
            break;
        }
      });
    },

    // Actions
    createDocument: (name: string) => {
      const newDocument: Document = {
        id: `doc_${Date.now()}`,
        name,
        version: '1.0.0',
        nodes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      set(state => {
        state.document = newDocument;
        state.selectedNodeId = null;
        state.clipboard = null;
        state.history.past = [];
        state.history.future = [];
      });
    },

    loadDocument: (document: Document) => {
      set(state => {
        state.document = document;
        state.selectedNodeId = null;
        state.clipboard = null;
        state.history.past = [];
        state.history.future = [];
      });
    },

    updateDocument: (document: Document) => {
      set(state => {
        state.document = document;
        state.document!.updatedAt = new Date().toISOString();
      });
    },

    insertNode: (nodeType: string, parentId: NodeId | null, index: number, props: Record<string, any> = {}) => {
      const state = get();
      if (!state.document) return '';

      const newNode: Node = {
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: nodeType,
        props,
        children: [],
        parentId,
        order: index
      };

      // Update document
      set(state => {
        if (!state.document) return;
        
        // Add new node
        state.document.nodes.push(newNode);
        
        // Update parent's children array
        if (parentId) {
          const parent = state.document.nodes.find(n => n.id === parentId);
          if (parent) {
            parent.children.push(newNode.id);
            // Re-sort children
            parent.children.sort((a, b) => {
              const nodeA = state.document!.nodes.find(n => n.id === a);
              const nodeB = state.document!.nodes.find(n => n.id === b);
              return (nodeA?.order || 0) - (nodeB?.order || 0);
            });
          }
        }

        state.document.updatedAt = new Date().toISOString();
      });

      // Create operation for history
      const operation: Operation = {
        type: 'INSERT_NODE' as OperationType,
        payload: {
          nodeType,
          parentId,
          index,
          props,
          newNodeId: newNode.id // Store the ID for undo
        },
        timestamp: Date.now(),
        nodeId: newNode.id
      };

      set(state => {
        state.history.past.push(operation);
        state.history.future = []; // Clear redo history
      });

      return newNode.id;
    },

    deleteNode: (nodeId: NodeId) => {
      const state = get();
      if (!state.document) return;

      // Get node to create operation
      const nodeToDelete = state.document.nodes.find(n => n.id === nodeId);
      if (!nodeToDelete) return;

      // Create operation for history
      const operation: Operation = {
        type: 'DELETE_NODE' as OperationType,
        payload: { 
          nodeId,
          oldNode: { ...nodeToDelete } // Store old node for undo
        },
        timestamp: Date.now()
      };

      set(state => {
        if (!state.document) return;

        // Remove node and all its descendants
        const nodesToRemove = [nodeId];
        const queue = [nodeId];
        
        while (queue.length > 0) {
          const currentId = queue.shift()!;
          const children = state.document!.nodes
            .filter(n => n.parentId === currentId)
            .map(n => n.id);
          queue.push(...children);
          nodesToRemove.push(...children);
        }

        // Remove nodes
        state.document.nodes = state.document.nodes.filter(n => !nodesToRemove.includes(n.id));
        
        // Update parent's children array
        if (nodeToDelete.parentId) {
          const parent = state.document.nodes.find(n => n.id === nodeToDelete.parentId);
          if (parent) {
            parent.children = parent.children.filter(id => !nodesToRemove.includes(id));
          }
        }

        state.document.updatedAt = new Date().toISOString();
      });

      set(state => {
        state.history.past.push(operation);
        state.history.future = []; // Clear redo history
      });
    },

    moveNode: (nodeId: NodeId, newParentId: NodeId | null, newIndex: number) => {
      const state = get();
      if (!state.document) return;

      const node = state.document.nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Create operation for history
      const operation: Operation = {
        type: 'MOVE_NODE' as OperationType,
        payload: {
          nodeId,
          newParentId,
          newIndex,
          oldParentId: node.parentId,
          oldIndex: node.order
        },
        timestamp: Date.now()
      };

      set(state => {
        if (!state.document) return;

        // Update node
        const nodeToUpdate = state.document!.nodes.find(n => n.id === nodeId);
        if (nodeToUpdate) {
          nodeToUpdate.parentId = newParentId;
          nodeToUpdate.order = newIndex;
        }

        // Update old parent's children
        if (node.parentId) {
          const oldParent = state.document!.nodes.find(n => n.id === node.parentId);
          if (oldParent) {
            oldParent.children = oldParent.children.filter(id => id !== nodeId);
          }
        }

        // Update new parent's children
        if (newParentId) {
          const newParent = state.document!.nodes.find(n => n.id === newParentId);
          if (newParent) {
            if (!newParent.children.includes(nodeId)) {
              newParent.children.push(nodeId);
            }
            // Re-sort children
            newParent.children.sort((a, b) => {
              const nodeA = state.document!.nodes.find(n => n.id === a);
              const nodeB = state.document!.nodes.find(n => n.id === b);
              return (nodeA?.order || 0) - (nodeB?.order || 0);
            });
          }
        }

        state.document.updatedAt = new Date().toISOString();
      });

      set(state => {
        state.history.past.push(operation);
        state.history.future = []; // Clear redo history
      });
    },

    updateNodeProps: (nodeId: NodeId, props: Record<string, any>) => {
      const state = get();
      if (!state.document) return;

      const node = state.document.nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Create operation for history
      const operation: Operation = {
        type: 'UPDATE_NODE_PROPS' as OperationType,
        payload: {
          nodeId,
          props,
          oldProps: { ...node.props }
        },
        timestamp: Date.now()
      };

      set(state => {
        if (!state.document) return;

        const nodeToUpdate = state.document.nodes.find(n => n.id === nodeId);
        if (nodeToUpdate) {
          nodeToUpdate.props = { ...nodeToUpdate.props, ...props };
          state.document.updatedAt = new Date().toISOString();
        }
      });

      set(state => {
        state.history.past.push(operation);
        state.history.future = []; // Clear redo history
      });
    },

    selectNode: (nodeId: NodeId | null) => {
      set(state => {
        state.selectedNodeId = nodeId;
      });
    },

    copyNode: (nodeId: NodeId) => {
      const state = get();
      if (!state.document) return;

      const node = state.document.nodes.find(n => n.id === nodeId);
      if (!node) return;

      set(state => {
        state.clipboard = { ...node };
      });
    },

    pasteNode: (parentId: NodeId | null, index: number) => {
      const state = get();
      if (!state.document || !state.clipboard) return null;

      const newNode: Node = {
        ...state.clipboard,
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        parentId,
        order: index
      };

      set(state => {
        if (!state.document) return;

        state.document.nodes.push(newNode);
        
        if (parentId) {
          const parent = state.document.nodes.find(n => n.id === parentId);
          if (parent) {
            parent.children.push(newNode.id);
          }
        }

        state.document.updatedAt = new Date().toISOString();
      });

      return newNode.id;
    },

    undo: () => {
      const state = get();
      if (state.history.past.length === 0) return;

      const operation = state.history.past[state.history.past.length - 1];
      
      set(state => {
        if (!state.document) return;

        switch (operation.type) {
          case 'INSERT_NODE':
            // Reverse of insert is delete
            state.document.nodes = state.document.nodes.filter(n => n.id !== operation.payload.newNodeId);
            if (operation.payload.parentId) {
              const parent = state.document.nodes.find(n => n.id === operation.payload.parentId);
              if (parent) {
                parent.children = parent.children.filter(id => id !== operation.payload.newNodeId);
              }
            }
            break;
          case 'DELETE_NODE':
            // Reverse of delete is insert
            state.document.nodes.push(operation.payload.oldNode);
            if (operation.payload.oldNode.parentId) {
              const parent = state.document.nodes.find(n => n.id === operation.payload.oldNode.parentId);
              if (parent) {
                parent.children.push(operation.payload.oldNode.id);
              }
            }
            break;
          case 'MOVE_NODE':
            // Reverse of move is move back
            const node = state.document.nodes.find(n => n.id === operation.payload.nodeId);
            if (node) {
              // Update parents
              if (node.parentId) {
                const currentParent = state.document.nodes.find(n => n.id === node.parentId);
                if (currentParent) currentParent.children = currentParent.children.filter(id => id !== node.id);
              }
              node.parentId = operation.payload.oldParentId;
              node.order = operation.payload.oldIndex;
              if (node.parentId) {
                const oldParent = state.document.nodes.find(n => n.id === node.parentId);
                if (oldParent) oldParent.children.push(node.id);
              }
            }
            break;
          case 'UPDATE_NODE_PROPS':
            const nodeToUpdate = state.document.nodes.find(n => n.id === operation.payload.nodeId);
            if (nodeToUpdate) {
              nodeToUpdate.props = operation.payload.oldProps;
            }
            break;
        }

        state.history.future.unshift(state.history.past.pop()!);
        state.document.updatedAt = new Date().toISOString();
      });
    },

    redo: () => {
      const state = get();
      if (state.history.future.length === 0) return;

      const operation = state.history.future[0];

      set(state => {
        if (!state.document) return;

        switch (operation.type) {
          case 'INSERT_NODE':
            const newNode: Node = {
              id: operation.payload.newNodeId,
              type: operation.payload.nodeType,
              props: operation.payload.props,
              children: [],
              parentId: operation.payload.parentId,
              order: operation.payload.index
            };
            state.document.nodes.push(newNode);
            if (newNode.parentId) {
              const parent = state.document.nodes.find(n => n.id === newNode.parentId);
              if (parent) parent.children.push(newNode.id);
            }
            break;
          case 'DELETE_NODE':
            state.document.nodes = state.document.nodes.filter(n => n.id !== operation.payload.nodeId);
            break;
          case 'MOVE_NODE':
            const node = state.document.nodes.find(n => n.id === operation.payload.nodeId);
            if (node) {
              if (node.parentId) {
                const currentParent = state.document.nodes.find(n => n.id === node.parentId);
                if (currentParent) currentParent.children = currentParent.children.filter(id => id !== node.id);
              }
              node.parentId = operation.payload.newParentId;
              node.order = operation.payload.newIndex;
              if (node.parentId) {
                const newParent = state.document.nodes.find(n => n.id === node.parentId);
                if (newParent) newParent.children.push(node.id);
              }
            }
            break;
          case 'UPDATE_NODE_PROPS':
            const nodeToUpdate = state.document.nodes.find(n => n.id === operation.payload.nodeId);
            if (nodeToUpdate) {
              nodeToUpdate.props = operation.payload.props;
            }
            break;
        }

        state.history.past.push(state.history.future.shift()!);
        state.document.updatedAt = new Date().toISOString();
      });
    },

    canUndo: () => {
      return get().history.past.length > 0;
    },

    canRedo: () => {
      return get().history.future.length > 0;
    },

    getNode: (nodeId: NodeId) => {
      const state = get();
      return state.document?.nodes.find(n => n.id === nodeId) || null;
    },

    getChildren: (parentId: NodeId | null) => {
      const state = get();
      if (!state.document) return [];
      
      return state.document.nodes
        .filter(n => n.parentId === parentId)
        .sort((a, b) => a.order - b.order);
    },

    getRootNodes: () => {
      const state = get();
      if (!state.document) return [];
      
      return state.document.nodes
        .filter(n => n.parentId === null)
        .sort((a, b) => a.order - b.order);
    },

    findNode: (predicate: (node: Node) => boolean) => {
      const state = get();
      return state.document?.nodes.find(predicate) || null;
    }
  }))
);