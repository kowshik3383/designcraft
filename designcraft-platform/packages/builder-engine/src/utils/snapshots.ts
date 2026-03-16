import { Operation, Document } from '@designcraft/types';

export interface Snapshot {
  id: string;
  document: Document;
  operations: Operation[];
  timestamp: number;
  description: string;
}

export class SnapshotManager {
  private snapshots: Snapshot[] = [];
  private currentIndex = -1;

  createSnapshot(document: Document, operations: Operation[], description: string): Snapshot {
    const snapshot: Snapshot = {
      id: this.generateId(),
      document,
      operations,
      timestamp: Date.now(),
      description
    };

    // Remove any snapshots after current index (redo history)
    this.snapshots = this.snapshots.slice(0, this.currentIndex + 1);
    
    // Add new snapshot
    this.snapshots.push(snapshot);
    this.currentIndex = this.snapshots.length - 1;

    return snapshot;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.snapshots.length - 1;
  }

  undo(): Snapshot | null {
    if (!this.canUndo()) return null;
    
    this.currentIndex--;
    return this.snapshots[this.currentIndex];
  }

  redo(): Snapshot | null {
    if (!this.canRedo()) return null;
    
    this.currentIndex++;
    return this.snapshots[this.currentIndex];
  }

  getCurrentSnapshot(): Snapshot | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.snapshots.length) {
      return null;
    }
    return this.snapshots[this.currentIndex];
  }

  getHistory(): Snapshot[] {
    return [...this.snapshots];
  }

  clear(): void {
    this.snapshots = [];
    this.currentIndex = -1;
  }

  private generateId(): string {
    return `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}