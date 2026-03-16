'use client';

import React from 'react';
import { 
  PlusIcon, 
  DocumentDuplicateIcon, 
  EyeIcon, 
  MagnifyingGlassIcon,
  SparklesIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface ToolbarProps {
  onCreateDocument: () => void;
}

export function Toolbar({ onCreateDocument }: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Canvas</h2>
          <div className="flex space-x-2">
            <button 
              onClick={onCreateDocument}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Document</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <DocumentDuplicateIcon className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <EyeIcon className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search components..."
              className="input-field pl-10"
            />
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4" />
            <span>AI Generate</span>
          </button>
          <button className="btn-ghost flex items-center space-x-2">
            <PlayIcon className="w-4 h-4" />
            <span>Run Story</span>
          </button>
        </div>
      </div>
    </div>
  );
}
