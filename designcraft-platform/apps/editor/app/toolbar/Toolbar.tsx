'use client';

import React from 'react';

interface ToolbarProps {
  onCreateDocument: () => void;
}

export function Toolbar({ onCreateDocument }: ToolbarProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Canvas</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onCreateDocument}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Document
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Save
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Preview
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          placeholder="Search components..."
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          AI Generate
        </button>
      </div>
    </div>
  );
}