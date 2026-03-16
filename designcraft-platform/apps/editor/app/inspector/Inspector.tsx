'use client';

import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  DocumentDuplicateIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { useBuilderStore } from '@designcraft/builder-engine';

interface InspectorProps {
  nodeId: string | null;
  onUpdateProps: (props: any) => void;
}

interface ComponentSchema {
  type: string;
  properties: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'color' | 'select';
    label: string;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
  }[];
}

export function Inspector({ nodeId, onUpdateProps }: InspectorProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'style', 'layout']);
  const [activeTab, setActiveTab] = useState<'properties' | 'style' | 'layout'>('properties');
  
  const node = useBuilderStore((state) => 
    nodeId ? state.document?.nodes.find(n => n.id === nodeId) : null
  );

  if (!nodeId || !node) {
    return (
      <div className="notion-card h-full">
        <div className="p-6">
          <div className="text-center text-gray-500 py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <PencilIcon className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Select a component</h3>
            <p className="text-sm text-gray-600">Properties will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  const componentSchemas: Record<string, ComponentSchema> = {
    Text: {
      type: 'Text',
      properties: [
        { name: 'content', type: 'string', label: 'Text Content' },
        { name: 'fontSize', type: 'number', label: 'Font Size', min: 10, max: 72, step: 1 },
        { name: 'color', type: 'color', label: 'Text Color' },
        { name: 'fontWeight', type: 'select', label: 'Font Weight', options: ['normal', 'bold', 'lighter', 'bolder'] },
        { name: 'textAlign', type: 'select', label: 'Text Align', options: ['left', 'center', 'right', 'justify'] }
      ]
    },
    Button: {
      type: 'Button',
      properties: [
        { name: 'content', type: 'string', label: 'Button Text' },
        { name: 'variant', type: 'select', label: 'Variant', options: ['primary', 'secondary', 'outline', 'ghost'] },
        { name: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'] },
        { name: 'color', type: 'color', label: 'Background Color' },
        { name: 'textColor', type: 'color', label: 'Text Color' }
      ]
    },
    Image: {
      type: 'Image',
      properties: [
        { name: 'src', type: 'string', label: 'Image URL' },
        { name: 'alt', type: 'string', label: 'Alt Text' },
        { name: 'width', type: 'number', label: 'Width', min: 0, max: 1000, step: 1 },
        { name: 'height', type: 'number', label: 'Height', min: 0, max: 1000, step: 1 },
        { name: 'objectFit', type: 'select', label: 'Object Fit', options: ['cover', 'contain', 'fill', 'scale-down'] }
      ]
    }
  };

  const schema = componentSchemas[node.type] || componentSchemas.Text;
  const [localProps, setLocalProps] = useState(node.props || {});

  useEffect(() => {
    setLocalProps(node.props || {});
  }, [nodeId, node.props]);

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    onUpdateProps(newProps);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderProperty = (property: any) => {
    const value = localProps[property.name] || '';
    
    switch (property.type) {
      case 'string':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropChange(property.name, e.target.value)}
            className="input-field"
            placeholder={property.label}
          />
        );
      
      case 'number':
        return (
          <div className="space-y-2">
            <input
              type="number"
              value={value}
              onChange={(e) => handlePropChange(property.name, parseInt(e.target.value))}
              className="input-field"
              min={property.min}
              max={property.max}
              step={property.step}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{property.min || 0}</span>
              <span>{property.max || 100}</span>
            </div>
          </div>
        );
      
      case 'boolean':
        return (
          <button
            onClick={() => handlePropChange(property.name, !value)}
            className={`w-full p-2 rounded-md text-left ${
              value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {value ? 'Enabled' : 'Disabled'}
          </button>
        );
      
      case 'color':
        return (
          <div className="flex space-x-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handlePropChange(property.name, e.target.value)}
              className="w-10 h-10 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={value || '#000000'}
              onChange={(e) => handlePropChange(property.name, e.target.value)}
              className="flex-1 input-field"
            />
          </div>
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handlePropChange(property.name, e.target.value)}
            className="input-field"
          >
        {property.options?.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="notion-card h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{node.type}</h3>
            <p className="text-sm text-gray-600 mt-1">Component Inspector</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <DocumentDuplicateIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-red-50 rounded-md transition-colors">
              <TrashIcon className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['properties', 'style', 'layout'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {schema.properties.map((property) => (
          <div key={property.name} className="notion-card p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                {property.label}
              </label>
              <span className="text-xs text-gray-500 capitalize">{property.type}</span>
            </div>
            {renderProperty(property)}
          </div>
        ))}
      </div>

      {/* Advanced Settings */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Visibility</span>
            <button
              onClick={() => handlePropChange('visible', !localProps.visible)}
              className={`p-2 rounded-md ${
                localProps.visible !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {localProps.visible !== false ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localProps.opacity || 1}
              onChange={(e) => handlePropChange('opacity', parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
