import { Node, NodeId } from '@designcraft/types';

export class NodeManager {
  private nodes: Map<NodeId, Node> = new Map();
  private rootNodes: Set<NodeId> = new Set();

  constructor(nodes: Node[] = []) {
    this.loadNodes(nodes);
  }

  loadNodes(nodes: Node[]): void {
    this.nodes.clear();
    this.rootNodes.clear();
    
    // First pass: add all nodes
    nodes.forEach(node => {
      this.nodes.set(node.id, node);
    });

    // Second pass: identify root nodes
    nodes.forEach(node => {
      if (node.parentId === null) {
        this.rootNodes.add(node.id);
      } else {
        // Ensure parent exists
        if (!this.nodes.has(node.parentId)) {
          console.warn(`Parent node ${node.parentId} not found for node ${node.id}`);
        }
      }
    });
  }

  getNode(id: NodeId): Node | null {
    return this.nodes.get(id) || null;
  }

  getRootNodes(): Node[] {
    return Array.from(this.rootNodes)
      .map(id => this.nodes.get(id))
      .filter((node): node is Node => node !== undefined)
      .sort((a, b) => a.order - b.order);
  }

  getChildren(parentId: NodeId | null): Node[] {
    const children = Array.from(this.nodes.values())
      .filter(node => node.parentId === parentId)
      .sort((a, b) => a.order - b.order);
    return children;
  }

  insertNode(node: Node): void {
    this.nodes.set(node.id, node);
    
    if (node.parentId === null) {
      this.rootNodes.add(node.id);
    } else {
      // Re-sort children of parent
      this.sortChildren(node.parentId);
    }
  }

  deleteNode(id: NodeId): void {
    const node = this.nodes.get(id);
    if (!node) return;

    // Remove from parent's children
    if (node.parentId !== null) {
      this.sortChildren(node.parentId);
    } else {
      this.rootNodes.delete(id);
    }

    // Remove node and all its descendants
    const toDelete = [id];
    const queue = [id];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = this.getChildren(currentId);
      children.forEach(child => {
        toDelete.push(child.id);
        queue.push(child.id);
      });
    }

    toDelete.forEach(id => {
      this.nodes.delete(id);
      this.rootNodes.delete(id);
    });
  }

  updateNode(id: NodeId, updates: Partial<Node>): void {
    const node = this.nodes.get(id);
    if (!node) return;

    const updatedNode = { ...node, ...updates };
    this.nodes.set(id, updatedNode);

    // If parent changed, update parent-child relationships
    if (updates.parentId !== undefined) {
      if (node.parentId !== null) {
        this.sortChildren(node.parentId);
      }
      if (updatedNode.parentId !== null) {
        this.sortChildren(updatedNode.parentId);
      } else {
        this.rootNodes.add(id);
      }
    }
  }

  moveNode(id: NodeId, newParentId: NodeId | null, newIndex: number): void {
    const node = this.nodes.get(id);
    if (!node) return;

    // Remove from current parent
    if (node.parentId !== null) {
      this.sortChildren(node.parentId);
    } else {
      this.rootNodes.delete(id);
    }

    // Update node
    const updatedNode = {
      ...node,
      parentId: newParentId,
      order: newIndex
    };
    this.nodes.set(id, updatedNode);

    // Add to new parent
    if (newParentId !== null) {
      this.sortChildren(newParentId);
    } else {
      this.rootNodes.add(id);
    }
  }

  private sortChildren(parentId: NodeId | null): void {
    const children = this.getChildren(parentId);
    let order = 0;
    
    children.forEach(child => {
      if (child.order !== order) {
        this.updateNode(child.id, { order });
      }
      order++;
    });
  }

  getAllNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  findNode(predicate: (node: Node) => boolean): Node | null {
    for (const node of this.nodes.values()) {
      if (predicate(node)) {
        return node;
      }
    }
    return null;
  }

  findNodes(predicate: (node: Node) => boolean): Node[] {
    return Array.from(this.nodes.values()).filter(predicate);
  }
}