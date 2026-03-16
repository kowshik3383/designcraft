'use client';

import React, { useState } from 'react';
import { 
  SparklesIcon,
  PlusIcon,
  Squares2X2Icon,
  Bars3Icon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useDndContext, useDraggable } from '@dnd-kit/core';

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

export function ComponentLibrary({ onInsert }: ComponentLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(components.map(c => c.category))];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (type: string) => {
    // Handle drag start for dnd-kit
    console.log('Drag started for:', type);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="notion-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="inspector-label mb-1">Component Library</h3>
            <p className="text-xs text-gray-600">Drag components to canvas</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Bars3Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Components Grid/List */}
      <div className="notion-card p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredComponents.map((component) => (
              <div
                key={component.type}
                className="notion-card notion-hover transition-all cursor-pointer group"
                draggable
                onDragStart={() => handleDragStart(component.type)}
                onClick={() => onInsert(component.type)}
              >
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <span className="text-lg">{component.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{component.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{component.category}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{component.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredComponents.map((component) => (
              <div
                key={component.type}
                className="notion-card notion-hover transition-all cursor-pointer group"
                draggable
                onDragStart={() => handleDragStart(component.type)}
                onClick={() => onInsert(component.type)}
              >
                <div className="flex items-center space-x-4 p-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <span className="text-lg">{component.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{component.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{component.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Components */}
      <div className="notion-card p-4">
        <h3 className="inspector-label mb-3">AI Components</h3>
        <div className="space-y-3">
          <div className="notion-card notion-hover transition-all cursor-pointer group">
            <div className="flex items-center space-x-4 p-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-900">AI Generated Component</span>
                <p className="text-sm text-gray-600 mt-1">Describe what you want and let AI create it</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <SparklesIcon className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
