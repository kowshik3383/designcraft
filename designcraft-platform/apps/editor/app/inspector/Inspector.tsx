'use client';

import React, { useState } from 'react';

interface InspectorProps {
  nodeId: string | null;
  onUpdateProps: (props: any) => void;
}

export function Inspector({ nodeId, onUpdateProps }: InspectorProps) {
  const [props, setProps] = useState({
    text: 'Sample text',
    fontSize: 16,
    color: '#000000',
    variant: 'primary',
    size: 'md'
  });

  if (!nodeId) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          <p>Select a component to edit its properties</p>
          <p className="text-sm mt-2">Properties will appear here</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...props, [key]: value };
    setProps(newProps);
    onUpdateProps(newProps);
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Properties</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <input
                type="text"
                value={props.text}
                onChange={(e) => handlePropChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={props.fontSize}
                onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={props.color}
                onChange={(e) => handlePropChange('color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant
              </label>
              <select
                value={props.variant}
                onChange={(e) => handlePropChange('variant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={props.size}
                onChange={(e) => handlePropChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Duplicate
            </button>
            <button className="w-full px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}