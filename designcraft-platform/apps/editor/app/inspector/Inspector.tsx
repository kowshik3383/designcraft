'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useBuilderStore } from '@designcraft/builder-engine';

interface InspectorProps {
  nodeId: string | null;
  onUpdateProps: (props: any) => void;
}

interface ComponentSchema {
  type: string;
  sections: {
    id: string;
    title: string;
    properties: {
      name: string;
      type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'position' | 'size';
      label: string;
      options?: string[];
      min?: number;
      max?: number;
      step?: number;
    }[];
  }[];
}

export function Inspector({ nodeId, onUpdateProps }: InspectorProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['layout', 'appearance', 'content']);
  
  const node = useBuilderStore((state) => 
    nodeId ? state.document?.nodes.find(n => n.id === nodeId) : null
  );

  const [localProps, setLocalProps] = useState<any>({});

  useEffect(() => {
    if (node) {
      setLocalProps(node.props || {});
    }
  }, [nodeId, node?.props]);

  if (!nodeId || !node) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#2C2C2C]">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-400">Select a layer to view properties</p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    onUpdateProps(newProps);
  };

  const nestedPropChange = (parentKey: string, key: string, value: any) => {
    const parentValue = localProps[parentKey] || {};
    const newParentValue = { ...parentValue, [key]: value };
    handlePropChange(parentKey, newParentValue);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const PropertyLabel = ({ label }: { label: string }) => (
    <label className="text-[11px] text-gray-500 w-20 flex-shrink-0">{label}</label>
  );

  const renderPropertyField = (prop: any) => {
    const value = localProps[prop.name];

    switch (prop.type) {
      case 'string':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            className="flex-1 bg-transparent border border-[#333333] hover:border-gray-600 focus:border-blue-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => handlePropChange(prop.name, parseInt(e.target.value))}
            className="flex-1 bg-transparent border border-[#333333] hover:border-gray-600 focus:border-blue-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors"
          />
        );
      case 'color':
        return (
          <div className="flex-1 flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded border border-[#333333] cursor-pointer"
              style={{ backgroundColor: value || '#000000' }}
            />
            <input
              type="text"
              value={value || '#000000'}
              onChange={(e) => handlePropChange(prop.name, e.target.value)}
              className="flex-1 bg-transparent border border-[#333333] hover:border-gray-600 focus:border-blue-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors uppercase"
            />
          </div>
        );
      case 'select':
        return (
          <select
            value={value || prop.options?.[0]}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            className="flex-1 bg-[#2C2C2C] border border-[#333333] hover:border-gray-600 focus:border-blue-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors"
          >
            {prop.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      default:
        return null;
    }
  };

  const sections = [
    {
      id: 'layout',
      title: 'Layout',
      properties: [
        { 
          id: 'pos', 
          label: 'Position', 
          render: () => (
            <div className="flex space-x-2 w-full">
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-[10px] text-gray-600">X</span>
                <input 
                  type="number" 
                  value={localProps.position?.x || 0} 
                  onChange={(e) => nestedPropChange('position', 'x', parseInt(e.target.value))}
                  className="w-full bg-transparent border border-[#333333] hover:border-gray-600 rounded px-1.5 py-1 text-[11px] text-white outline-none"
                />
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-[10px] text-gray-600">Y</span>
                <input 
                  type="number" 
                  value={localProps.position?.y || 0} 
                  onChange={(e) => nestedPropChange('position', 'y', parseInt(e.target.value))}
                  className="w-full bg-transparent border border-[#333333] hover:border-gray-600 rounded px-1.5 py-1 text-[11px] text-white outline-none"
                />
              </div>
            </div>
          )
        },
        { 
          id: 'size', 
          label: 'Size', 
          render: () => (
            <div className="flex space-x-2 w-full">
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-[10px] text-gray-600">W</span>
                <input 
                  type="number" 
                  value={localProps.width || 0} 
                  onChange={(e) => handlePropChange('width', parseInt(e.target.value))}
                  className="w-full bg-transparent border border-[#333333] hover:border-gray-600 rounded px-1.5 py-1 text-[11px] text-white outline-none"
                />
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-[10px] text-gray-600">H</span>
                <input 
                  type="number" 
                  value={localProps.height || 0} 
                  onChange={(e) => handlePropChange('height', parseInt(e.target.value))}
                  className="w-full bg-transparent border border-[#333333] hover:border-gray-600 rounded px-1.5 py-1 text-[11px] text-white outline-none"
                />
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      properties: [
        { id: 'opacity', label: 'Opacity', type: 'number', name: 'opacity' },
        { id: 'radius', label: 'Corners', type: 'number', name: 'borderRadius' },
        { id: 'bg', label: 'Fill', type: 'color', name: 'backgroundColor' }
      ]
    },
    {
      id: 'content',
      title: 'Content',
      properties: [
        { id: 'text', label: 'Value', type: 'string', name: 'text' },
        { id: 'font', label: 'Size', type: 'number', name: 'fontSize' },
        { id: 'color', label: 'Text', type: 'color', name: 'color' },
        { id: 'align', label: 'Align', type: 'select', name: 'textAlign', options: ['left', 'center', 'right'] }
      ]
    }
  ];

  return (
    <div className="flex flex-col bg-[#2C2C2C] h-full overflow-y-auto custom-scrollbar divide-y divide-[#333333]">
      {/* Node Info Header */}
      <div className="p-4 bg-[#2C2C2C] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">{node.type}</h2>
          </div>
          <button 
            onClick={() => useBuilderStore.getState().deleteNode(nodeId)}
            className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-500 font-mono">{nodeId}</p>
      </div>

      {sections.map(section => (
        <div key={section.id} className="flex flex-col">
          <button 
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors group"
          >
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{section.title}</span>
            {expandedSections.includes(section.id) ? (
              <ChevronDownIcon className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
            )}
          </button>
          
          {expandedSections.includes(section.id) && (
            <div className="px-4 pb-4 space-y-3">
              {section.properties.map((prop: any) => (
                <div key={prop.id} className="flex items-center space-x-2">
                  <PropertyLabel label={prop.label} />
                  {prop.render ? prop.render() : renderPropertyField(prop)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Advanced Section */}
      <div className="p-4">
        <button className="w-full py-2 bg-[#3C3C3C] hover:bg-[#4C4C4C] text-[11px] text-white font-medium rounded transition-colors border border-[#444444]">
          View JSON Data
        </button>
      </div>
    </div>
  );
}
