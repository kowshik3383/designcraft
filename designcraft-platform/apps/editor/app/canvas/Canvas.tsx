'use client';

import React from 'react';
import { 
  PlusIcon, 
  CursorArrowRaysIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface CanvasProps {
  onSelectNode: (nodeId: string) => void;
}

export function Canvas({ onSelectNode }: CanvasProps) {
  return (
    <div className="canvas-container m-4 rounded-lg border border-gray-200">
      <div className="relative">
        {/* Canvas Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CursorArrowRaysIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Design Canvas</span>
              <span className="text-sm text-gray-500">Drag components from sidebar</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                <span>Add Section</span>
              </button>
              <button className="btn-ghost flex items-center space-x-2">
                <DocumentTextIcon className="w-4 h-4" />
                <span>Clear Canvas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="bg-white rounded-b-lg min-h-96">
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Start Building Your Design</h3>
            <p className="text-sm text-gray-500 mb-6">
              Drag and drop components from the sidebar to begin creating your website
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => onSelectNode('placeholder')}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-md mx-auto mb-3 flex items-center justify-center">
                  <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Text Section</p>
                <p className="text-xs text-gray-400 mt-1">Add heading or paragraph</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-green-100 rounded-md mx-auto mb-3 flex items-center justify-center">
                  <PlusIcon className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Image Section</p>
                <p className="text-xs text-gray-400 mt-1">Add visual content</p>
              </div>
            </div>
            
            <div className="mt-8 text-xs text-gray-400">
              Tip: You can also use the Story Mode for guided design creation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
