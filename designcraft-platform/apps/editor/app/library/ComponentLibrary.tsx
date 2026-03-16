'use client';

import React from 'react';

interface ComponentLibraryProps {
  onInsert: (nodeType: string) => void;
}

export function ComponentLibrary({ onInsert }: ComponentLibraryProps) {
  const components = [
    { type: 'Text', name: 'Text', icon: '📝' },
    { type: 'Image', name: 'Image', icon: '🖼️' },
    { type: 'Button', name: 'Button', icon: '🔘' },
    { type: 'Container', name: 'Container', icon: '📦' },
    { type: 'Input', name: 'Input', icon: '🔤' },
    { type: 'Card', name: 'Card', icon: '🃏' }
  ];

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Components</h3>
          <div className="grid grid-cols-2 gap-2">
            {components.map((component) => (
              <button
                key={component.type}
                onClick={() => onInsert(component.type)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{component.icon}</span>
                  <span className="font-medium">{component.name}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Drag and drop to canvas
                </p>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">AI Components</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🤖</span>
                <span className="font-medium">AI Generated</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Generate components with AI
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}