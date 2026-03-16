'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusIcon, 
  CursorArrowRaysIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  Bars3Icon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { useBuilderStore } from '@designcraft/builder-engine';

interface CanvasProps {
  onSelectNode: (nodeId: string) => void;
}

export function Canvas({ onSelectNode }: CanvasProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const nodes = useBuilderStore((state) => state.document?.nodes || []);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in') return Math.min(prev + 10, 200);
      return Math.max(prev - 10, 50);
    });
  };

  const handleNodeClick = (nodeId: string) => {
    onSelectNode(nodeId);
  };

  const renderNode = (node: any) => {
    const isSelected = selectedNodeId === node.id;
    
    return (
      <div
        key={node.id}
        className={`absolute p-4 border-2 rounded-lg transition-all cursor-pointer ${
          isSelected 
            ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
        style={{
          left: node.position?.x || 0,
          top: node.position?.y || 0,
          width: node.props?.width || 200,
          height: node.props?.height || 100,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left'
        }}
        onClick={() => handleNodeClick(node.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">{node.type}</span>
          <div className="flex space-x-1">
            <button className="p-1 hover:bg-gray-100 rounded">
              <DocumentDuplicateIcon className="w-3 h-3 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-red-50 rounded">
              <TrashIcon className="w-3 h-3 text-red-400" />
            </button>
          </div>
        </div>
        
        {node.type === 'Text' && (
          <div className="text-sm">
            {node.props?.content || 'Sample text'}
          </div>
        )}
        
        {node.type === 'Button' && (
          <button className="w-full px-3 py-1 bg-blue-500 text-white text-sm rounded">
            {node.props?.content || 'Button'}
          </button>
        )}
        
        {node.type === 'Image' && (
          <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">Image</span>
          </div>
        )}

        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <div className="canvas-container relative">
      {/* Canvas Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <CursorArrowRaysIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Design Canvas</span>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded ${showGrid ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 w-12 text-center">{zoom}%</span>
              <button
                onClick={() => handleZoom('in')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center space-x-2 text-sm">
              <PlusIcon className="w-4 h-4" />
              <span>Add Section</span>
            </button>
            <button className="btn-ghost flex items-center space-x-2 text-sm">
              <DocumentTextIcon className="w-4 h-4" />
              <span>Clear Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="bg-white relative overflow-auto"
        style={{ height: 'calc(100vh - 120px)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid Background */}
        {showGrid && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}

        {/* Canvas Content */}
        <div 
          className="relative p-8"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            width: '2000px',
            height: '2000px'
          }}
        >
          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-medium text-gray-700 mb-2">Start Building Your Design</h3>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                  Drag and drop components from the sidebar to begin creating your website.
                  Use the grid and zoom controls to help with precise positioning.
                </p>
                
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                    onClick={() => onSelectNode('text-placeholder')}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-700 mb-2">Text Section</p>
                    <p className="text-xs text-gray-400">Add headings, paragraphs, and text content</p>
                  </div>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
                    onClick={() => onSelectNode('image-placeholder')}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <PlusIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-medium text-gray-700 mb-2">Image Section</p>
                    <p className="text-xs text-gray-400">Add visual content and media</p>
                  </div>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group"
                    onClick={() => onSelectNode('button-placeholder')}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <CursorArrowRaysIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="font-medium text-gray-700 mb-2">Interactive Elements</p>
                    <p className="text-xs text-gray-400">Add buttons and interactive components</p>
                  </div>
                </div>
                
                <div className="mt-8 text-xs text-gray-400">
                  Tip: Use Story Mode for guided design creation or drag components directly from the sidebar
                </div>
              </div>
            </div>
          )}

          {/* Render Nodes */}
          {nodes.map(renderNode)}
        </div>
      </div>

      {/* Canvas Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Canvas: {nodes.length} components</span>
            <span>Selected: {selectedNodeId || 'None'}</span>
            <span>Zoom: {zoom}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="flex items-center space-x-2 hover:text-gray-700"
            >
              <Squares2X2Icon className="w-4 h-4" />
              <span>{showGrid ? 'Hide' : 'Show'} Grid</span>
            </button>
            <span>•</span>
            <span>Drag to pan • Click components to select • Use inspector to edit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
