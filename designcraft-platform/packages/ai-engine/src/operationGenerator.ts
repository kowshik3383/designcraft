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
    const lowerPrompt = prompt.toLowerCase();

    // 1. Handle "Enhance" / "Fix Layout" / "Figma Import"
    if (lowerPrompt.includes('enhance') || lowerPrompt.includes('fix') || lowerPrompt.includes('layout') || lowerPrompt.includes('figma')) {
      return this.generateEnhancementOperations(context);
    }

    // 2. Handle insertion operations (existing logic)
    if (lowerPrompt.includes('add') || lowerPrompt.includes('create')) {
      if (lowerPrompt.includes('text') || lowerPrompt.includes('paragraph')) {
        operations.push({
          type: 'INSERT_NODE',
          payload: {
            nodeType: 'Text',
            parentId: context.selectedNodeId || null,
            index: 0,
            props: {
              text: 'New AI Text',
              fontSize: 16,
              color: '#FFFFFF',
              position: { x: 100, y: 100 }
            }
          },
          timestamp
        });
      }

      if (lowerPrompt.includes('button')) {
        operations.push({
          type: 'INSERT_NODE',
          payload: {
            nodeType: 'Button',
            parentId: context.selectedNodeId || null,
            index: 0,
            props: {
              text: 'AI Button',
              variant: 'primary',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              position: { x: 150, y: 150 }
            }
          },
          timestamp
        });
      }
    }

    // 3. Handle specific positioning commands
    if (lowerPrompt.includes('center')) {
      const nodes = context.document?.nodes || [];
      const selectedId = context.selectedNodeId;
      
      if (selectedId) {
        operations.push({
          type: 'UPDATE_NODE_PROPS',
          payload: {
            nodeId: selectedId,
            props: {
              position: { x: 500, y: 350 } // Assuming canvas center
            }
          },
          timestamp
        });
      }
    }

    return operations;
  }

  private generateEnhancementOperations(context: PromptContext): Operation[] {
    const operations: Operation[] = [];
    const nodes = context.document?.nodes || [];
    const timestamp = Date.now();

    // Logic: If there are multiple nodes, try to align them or group them
    if (nodes.length > 1) {
      // Simple alignment logic: Align all nodes to the same X if they are close
      let startX = nodes[0].props.position?.x || 100;
      nodes.forEach((node, index) => {
        operations.push({
          type: 'UPDATE_NODE_PROPS',
          payload: {
            nodeId: node.id,
            props: {
              position: { 
                x: startX, 
                y: 100 + (index * 120) // Vertical stack with 20px spacing
              },
              width: 400,
              borderRadius: 8,
              backgroundColor: node.type === 'Container' ? '#2C2C2C' : node.props.backgroundColor
            }
          },
          timestamp
        });
      });
    } else if (nodes.length === 1) {
      // Single node enhancement
      operations.push({
        type: 'UPDATE_NODE_PROPS',
        payload: {
          nodeId: nodes[0].id,
          props: {
            width: 600,
            height: 400,
            backgroundColor: '#1E1E1E',
            borderRadius: 16,
            position: { x: 300, y: 200 }
          }
        },
        timestamp
      });
    }

    return operations;
  }
}