'use client';

import React from 'react';

interface CanvasProps {
  onSelectNode: (nodeId: string) => void;
}

export function Canvas({ onSelectNode }: CanvasProps) {
  return (
    <div className="flex-1 overflow-hidden bg-white m-4 rounded-lg border border-gray-200">
      <div className="p-8 text-center text-gray-500">
        <p>Canvas area - Drop components here to build your design</p>
        <div className="mt-4 space-y-2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            <p className="text-sm text-gray-400">Drop component here</p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            <p className="text-sm text-gray-400">Drop component here</p>
          </div>
        </div>
      </div>
    </div>
  );
}