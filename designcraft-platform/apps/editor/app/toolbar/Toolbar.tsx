'use client';

import React from 'react';
import { 
  PlusIcon, 
  DocumentDuplicateIcon, 
  EyeIcon, 
  SparklesIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline';
import { useBuilderStore } from '@designcraft/builder-engine';
import { OperationGenerator } from '@designcraft/ai-engine';

interface ToolbarProps {
  onCreateDocument: () => void;
}

export function Toolbar({ onCreateDocument }: ToolbarProps) {
  const undo = useBuilderStore((state) => state.undo);
  const redo = useBuilderStore((state) => state.redo);
  const canUndo = useBuilderStore((state) => state.canUndo());
  const canRedo = useBuilderStore((state) => state.canRedo());
  const document = useBuilderStore((state) => state.document);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);
  const applyOperations = useBuilderStore((state) => state.applyOperations);

  const handleAIEnhance = async () => {
    if (!document) return;

    console.log('AI Enhance triggered');
    const generator = new OperationGenerator(['Text', 'Button', 'Image', 'Container']);
    
    // Generate enhancement operations
    const operations = generator.generateOperations('enhance layout', {
      selectedNodeId: selectedNodeId || undefined,
      document: document,
      availableComponents: ['Text', 'Button', 'Image', 'Container']
    });

    if (operations.length > 0) {
      applyOperations(operations);
    }
  };

  return (
    <div className="h-12 bg-[#2C2C2C] border-b border-[#333333] flex items-center justify-between px-4 select-none">
      <div className="flex items-center space-x-2">
        {/* Document Title/Logo */}
        <div className="flex items-center space-x-3 pr-4 border-r border-[#333333]">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">DC</span>
          </div>
          <span className="text-xs font-medium text-gray-300 truncate max-w-[150px]">
            {document?.name || 'Untitled Design'}
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center space-x-1 pl-2">
          <button 
            onClick={onCreateDocument}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="New (Cmd+N)"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            onClick={() => console.log('Save triggered')}
            title="Save (Cmd+S)"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle: Undo/Redo & Zoom are usually on canvas, but let's keep important actions here */}
      <div className="flex items-center space-x-2 bg-[#1E1E1E] rounded-md border border-[#333333] p-0.5">
        <button 
          onClick={undo}
          disabled={!canUndo}
          className={`p-1.5 rounded transition-colors ${!canUndo ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          title="Undo (Cmd+Z)"
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
        </button>
        <button 
          onClick={redo}
          disabled={!canRedo}
          className={`p-1.5 rounded transition-colors ${!canRedo ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          title="Redo (Cmd+Shift+Z)"
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleAIEnhance}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-shadow shadow-lg shadow-blue-500/20"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>Sync AI</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 px-3 py-1.5 border border-[#333333] text-gray-300 hover:text-white hover:bg-white/5 rounded text-xs font-semibold transition-colors"
          onClick={() => window.open('/renderer', '_blank')}
        >
          <EyeIcon className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}
