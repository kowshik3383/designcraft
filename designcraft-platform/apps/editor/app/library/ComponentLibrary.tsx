'use client';

import React from 'react';
import { 
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ComponentLibraryProps {
  onInsert: (nodeType: string) => void;
}

const components = [
  { type: 'Text', name: 'Text', icon: '📝', color: 'text-blue-600' },
  { type: 'Image', name: 'Image', icon: '🖼️', color: 'text-green-600' },
  { type: 'Button', name: 'Button', icon: '🔘', color: 'text-purple-600' },
  { type: 'Container', name: 'Container', icon: '📦', color: 'text-orange-600' },
  { type: 'Input', name: 'Input', icon: '🔤', color: 'text-red-600' },
  { type: 'Card', name: 'Card', icon: '🃏', color: 'text-teal-600' }
];

export function ComponentLibrary({ onInsert }: ComponentLibraryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="inspector-label mb-3">Components</h3>
        <div className="grid grid-cols-2 gap-3">
          {components.map((component) => (
            <button
              key={component.type}
              onClick={() => onInsert(component.type)}
              className="component-card notion-hover transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{component.icon}</span>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{component.name}</span>
                  <p className="text-xs text-gray-500 mt-1">Drag and drop to canvas</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="inspector-label mb-3">AI Components</h3>
        <div className="space-y-3">
          <button className="w-full component-card notion-hover transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-900">AI Generated</span>
                <p className="text-xs text-gray-500 mt-1">Generate components with AI</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
