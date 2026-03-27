'use client';

import React, { useState } from 'react';
import { 
  SparklesIcon,
  PlusIcon,
  Squares2X2Icon,
  Bars3Icon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useDraggable } from '@dnd-kit/core';

interface ComponentLibraryProps {
  onInsert: (nodeType: string) => void;
}

const components = [
  { type: 'Text', name: 'Text', icon: '📝', category: 'Basic', color: 'text-blue-600', description: 'Add text content to your design' },
  { type: 'Image', name: 'Image', icon: '🖼️', category: 'Media', color: 'text-green-600', description: 'Insert images and photos' },
  { type: 'Button', name: 'Button', icon: '🔘', category: 'Interactive', color: 'text-purple-600', description: 'Clickable buttons' },
  { type: 'Container', name: 'Container', icon: '📦', category: 'Layout', color: 'text-orange-600', description: 'Group and organize content' },
  { type: 'Input', name: 'Input', icon: '🔤', category: 'Form', color: 'text-red-600', description: 'Text input fields' },
  { type: 'Card', name: 'Card', icon: '🃏', category: 'Layout', color: 'text-teal-600', description: 'Content cards with borders' },
  { type: 'Heading', name: 'Heading', icon: '📝', category: 'Basic', color: 'text-blue-600', description: 'Large text headings' },
  { type: 'Paragraph', name: 'Paragraph', icon: '📝', category: 'Basic', color: 'text-blue-600', description: 'Multi-line text content' },
  { type: 'Link', name: 'Link', icon: '🔗', category: 'Interactive', color: 'text-indigo-600', description: 'Clickable links' },
  { type: 'List', name: 'List', icon: '📋', category: 'Basic', color: 'text-blue-600', description: 'Ordered and unordered lists' }
];

interface DraggableComponentProps {
  component: typeof components[0];
  viewMode: 'grid' | 'list';
  onInsert: (type: string) => void;
}

function DraggableComponent({ component, viewMode, onInsert }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${component.type}`,
    data: {
      type: component.type,
      isLibraryItem: true
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`transition-all cursor-pointer group bg-[#2C2C2C] border border-[#333333] rounded-lg hover:border-blue-500/50 ${isDragging ? 'opacity-50 z-50' : ''}`}
      onClick={() => onInsert(component.type)}
    >
      <div className={`flex items-center ${viewMode === 'grid' ? 'space-x-3 p-3' : 'space-x-4 p-3'}`}>
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          <span className="text-lg">{component.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-white text-xs">{component.name}</span>
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">{component.category}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{component.description}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <PlusIcon className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </div>
  );
}

export function ComponentLibrary({ onInsert }: ComponentLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(components.map(c => c.category)))];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#2C2C2C] border border-[#333333] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Assets</h3>
            <p className="text-[11px] text-gray-500">Drag to canvas</p>
          </div>
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#3C3C3C] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#3C3C3C] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Bars3Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#333333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333333] rounded px-2 py-1.5 text-xs text-gray-400 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Components Grid/List */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 gap-2' : 'space-y-2'}`}>
        {filteredComponents.map((component) => (
          <DraggableComponent 
            key={component.type} 
            component={component} 
            viewMode={viewMode} 
            onInsert={onInsert} 
          />
        ))}
      </div>

      {/* AI Components */}
      <div className="bg-[#2C2C2C] border border-[#333333] rounded-lg p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Magic</h3>
        <div className="space-y-3">
          <div className="transition-all cursor-pointer group bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-3 p-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-white text-sm">AI Builder</span>
                <p className="text-[11px] text-gray-400 mt-1">Generate sections</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
