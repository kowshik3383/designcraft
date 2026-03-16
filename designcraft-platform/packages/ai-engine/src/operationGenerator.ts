import { Operation, OperationType, InsertNodeOperation, DeleteNodeOperation, MoveNodeOperation, UpdateNodePropsOperation } from '@designcraft/types';
import { PromptContext } from './types';

export class OperationGenerator {
  private availableComponents: string[];

  constructor(availableComponents: string[]) {
    this.availableComponents = availableComponents;
  }

  generateOperations(prompt: string, context: PromptContext): Operation[] {
    const operations: Operation[] = [];
    const timestamp = Date.now();

    // Simple keyword-based parsing for demo purposes
    const lowerPrompt = prompt.toLowerCase();

    // Handle insert operations
    if (lowerPrompt.includes('add') || lowerPrompt.includes('create')) {
      if (lowerPrompt.includes('text') || lowerPrompt.includes('paragraph')) {
        const op: Operation = {
          type: 'INSERT_NODE',
          payload: {
            nodeType: 'Text',
            parentId: context.selectedNodeId || null,
            index: 0,
            props: {
              text: 'New text content',
              fontSize: 16,
              color: '#000000'
            }
          },
          timestamp
        };
        operations.push(op);
      }

      if (lowerPrompt.includes('button')) {
        const op: Operation = {
          type: 'INSERT_NODE',
          payload: {
            nodeType: 'Button',
            parentId: context.selectedNodeId || null,
            index: 0,
            props: {
              text: 'New Button',
              variant: 'primary',
              size: 'md'
            }
          },
          timestamp
        };
        operations.push(op);
      }

      if (lowerPrompt.includes('image') || lowerPrompt.includes('picture')) {
        const op: Operation = {
          type: 'INSERT_NODE',
          payload: {
            nodeType: 'Image',
            parentId: context.selectedNodeId || null,
            index: 0,
            props: {
              src: 'https://via.placeholder.com/300x150',
              alt: 'New image',
              width: '100%',
              height: 'auto'
            }
          },
          timestamp
        };
        operations.push(op);
      }
    }

    // Handle update operations
    if (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('modify')) {
      if (context.selectedNodeId) {
        const op: Operation = {
          type: 'UPDATE_NODE_PROPS',
          payload: {
            nodeId: context.selectedNodeId,
            props: {
              text: 'Updated text',
              fontSize: 20,
              color: '#333333'
            }
          },
          timestamp
        };
        operations.push(op);
      }
    }

    // Handle delete operations
    if (lowerPrompt.includes('delete') || lowerPrompt.includes('remove')) {
      if (context.selectedNodeId) {
        const op: Operation = {
          type: 'DELETE_NODE',
          payload: {
            nodeId: context.selectedNodeId
          },
          timestamp
        };
        operations.push(op);
      }
    }

    // Handle move operations
    if (lowerPrompt.includes('move') || lowerPrompt.includes('reposition')) {
      if (context.selectedNodeId) {
        const op: Operation = {
          type: 'MOVE_NODE',
          payload: {
            nodeId: context.selectedNodeId,
            newParentId: null,
            newIndex: 0
          },
          timestamp
        };
        operations.push(op);
      }
    }

    return operations;
  }
}