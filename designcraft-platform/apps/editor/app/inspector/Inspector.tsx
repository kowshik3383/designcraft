'use client';

import React, { useState } from 'react';
import { 
  PencilIcon, 
  DocumentDuplicateIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

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
    size: 'md',
    visible: true
  });

  if (!nodeId) {
    return (
      <div className="inspector-section">
        <div className="text-center text-gray-500 py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <PencilIcon className="w-6 h-6" />
          </div>
          <p className="font-medium">Select a component</p>
          <p className="text-sm text-gray-400 mt-1">Properties will appear here</p>
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
    <div className="space-y-6">
      <div className="inspector-section">
        <h3 className="inspector-label">Properties</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Text Content
            </label>
            <input
              type="text"
              value={props.text}
              onChange={(e) => handlePropChange('text', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Font Size
            </label>
            <input
              type="number"
              value={props.fontSize}
              onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={props.color}
                onChange={(e) => handlePropChange('color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={props.color}
                onChange={(e) => handlePropChange('color', e.target.value)}
                className="flex-1 input-field"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Variant
            </label>
            <select
              value={props.variant}
              onChange={(e) => handlePropChange('variant', e.target.value)}
              className="input-field"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Size
            </label>
            <select
              value={props.size}
              onChange={(e) => handlePropChange('size', e.target.value)}
              className="input-field"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="inspector-section">
        <h3 className="inspector-label">Actions</h3>
        <div className="space-y-2">
          <button className="w-full btn-secondary flex items-center space-x-3">
            <DocumentDuplicateIcon className="w-4 h-4" />
            <span>Duplicate Component</span>
          </button>
          <button className="w-full btn-ghost flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50">
            <TrashIcon className="w-4 h-4" />
            <span>Delete Component</span>
          </button>
        </div>
      </div>
      
      <div className="inspector-section">
        <h3 className="inspector-label">Visibility</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Show on canvas</span>
          <button
            onClick={() => handlePropChange('visible', !props.visible)}
            className={`p-2 rounded-md ${
              props.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {props.visible ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeSlashIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
