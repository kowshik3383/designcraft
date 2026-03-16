import { Node, NodeId } from '@designcraft/types';
import { NodeManager } from './node';

export class TreeManager {
  private nodeManager: NodeManager;

  constructor(nodes: Node[] = []) {
    this.nodeManager = new NodeManager(nodes);
  }

  getRootNodes(): Node[] {
    return this.nodeManager.getRootNodes();
  }

  getChildren(parentId: NodeId | null): Node[] {
    return this.nodeManager.getChildren(parentId);
  }

  getNode(id: NodeId): Node | null {
    return this.nodeManager.getNode(id);
  }

  insertNode(node: Node): void {
    this.nodeManager.insertNode(node);
  }

  deleteNode(id: NodeId): void {
    this.nodeManager.deleteNode(id);
  }

  updateNode(id: NodeId, updates: Partial<Node>): void {
    this.nodeManager.updateNode(id, updates);
  }

  moveNode(id: NodeId, newParentId: NodeId | null, newIndex: number): void {
    this.nodeManager.moveNode(id, newParentId, newIndex);
  }

  findNode(predicate: (node: Node) => boolean): Node | null {
    return this.nodeManager.findNode(predicate);
  }

  findNodes(predicate: (node: Node) => boolean): Node[] {
    return this.nodeManager.findNodes(predicate);
  }

  getAllNodes(): Node[] {
    return this.nodeManager.getAllNodes();
  }

  // Tree traversal utilities
  traverseBreadthFirst(callback: (node: Node) => void): void {
    const queue: Node[] = this.getRootNodes();
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      callback(node);
      queue.push(...this.getChildren(node.id));
    }
  }

  traverseDepthFirst(callback: (node: Node) => void): void {
    const stack: Node[] = this.getRootNodes();
    
    while (stack.length > 0) {
      const node = stack.pop()!;
      callback(node);
      
      // Add children in reverse order to maintain order
      const children = this.getChildren(node.id);
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }

  getTreeDepth(): number {
    let maxDepth = 0;
    
    const calculateDepth = (node: Node, currentDepth: number) => {
      maxDepth = Math.max(maxDepth, currentDepth);
      const children = this.getChildren(node.id);
      children.forEach(child => {
        calculateDepth(child, currentDepth + 1);
      });
    };

    this.getRootNodes().forEach(root => {
      calculateDepth(root, 1);
    });

    return maxDepth;
  }

  getNodePath(nodeId: NodeId): NodeId[] {
    const path: NodeId[] = [];
    let current = this.getNode(nodeId);
    
    while (current) {
      path.unshift(current.id);
      if (current.parentId === null) break;
      current = this.getNode(current.parentId);
    }

    return path;
  }

  getSubtree(rootId: NodeId): Node[] {
    const subtree: Node[] = [];
    const queue: Node[] = [this.getNode(rootId)!];
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      subtree.push(node);
      queue.push(...this.getChildren(node.id));
    }

    return subtree;
  }

  cloneSubtree(rootId: NodeId, newParentId: NodeId | null = null): Node[] {
    const originalSubtree = this.getSubtree(rootId);
    const clonedSubtree: Node[] = [];
    const idMap = new Map<NodeId, NodeId>();

    // First pass: clone nodes and create ID mapping
    originalSubtree.forEach(originalNode => {
      const newId = this.generateNodeId();
      idMap.set(originalNode.id, newId);
      
      const clonedNode: Node = {
        ...originalNode,
        id: newId,
        parentId: originalNode.parentId === rootId ? newParentId : idMap.get(originalNode.parentId!) || null
      };
      
      clonedSubtree.push(clonedNode);
    });

    return clonedSubtree;
  }

  private generateNodeId(): NodeId {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}