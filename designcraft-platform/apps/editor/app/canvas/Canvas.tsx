'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusIcon, 
  CursorArrowRaysIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  TrashIcon,
  DocumentDuplicateIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { useBuilderStore } from '@designcraft/builder-engine';
import { useDroppable, useDraggable } from '@dnd-kit/core';

interface CanvasProps {
  onSelectNode: (nodeId: string | null) => void;
}

interface DraggableNodeProps {
  node: any;
  isSelected: boolean;
  zoom: number;
  onClick: (nodeId: string) => void;
}

function DraggableNode({ node, isSelected, zoom, onClick }: DraggableNodeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: {
      isNode: true,
      id: node.id
    }
  });

  const style = {
    left: node.props?.position?.x || 0,
    top: node.props?.position?.y || 0,
    width: node.props?.width || 200,
    height: node.props?.height || 100,
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${zoom / 100})` 
      : `scale(${zoom / 100})`,
    transformOrigin: 'top left',
    zIndex: isSelected ? 40 : 10
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute p-4 border rounded-lg transition-shadow cursor-pointer shadow-sm group ${
        isSelected 
          ? 'border-blue-500 ring-1 ring-blue-500 bg-[#2C2C2C]' 
          : 'border-[#333333] hover:border-gray-500 bg-[#1E1E1E]'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node.id);
      }}
    >
      <div {...listeners} {...attributes} className="absolute inset-x-0 -top-3 h-3 cursor-move" />
      
      <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-medium text-gray-500 uppercase">{node.type}</span>
        <div className="flex space-x-1">
          <button 
            className="p-1 hover:bg-white/10 rounded"
            onClick={(e) => {
              e.stopPropagation();
              useBuilderStore.getState().copyNode(node.id);
            }}
          >
            <DocumentDuplicateIcon className="w-3 h-3 text-gray-400" />
          </button>
          <button 
            className="p-1 hover:bg-red-500/20 rounded"
            onClick={(e) => {
              e.stopPropagation();
              useBuilderStore.getState().deleteNode(node.id);
            }}
          >
            <TrashIcon className="w-3 h-3 text-red-400" />
          </button>
        </div>
      </div>
      
      {node.type === 'Text' && (
        <div className="text-sm text-white font-medium">
          {node.props?.text || 'Sample text'}
        </div>
      )}
      
      {node.type === 'Button' && (
        <button className="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded font-bold shadow-md shadow-blue-500/20">
          {node.props?.text || 'Button'}
        </button>
      )}
      
      {node.type === 'Image' && (
        <div className="w-full h-16 bg-[#2C2C2C] border border-[#333333] rounded flex items-center justify-center overflow-hidden">
          {node.props?.src ? (
            <img src={node.props.src} alt={node.props.alt} className="w-full h-full object-cover" />
          ) : (
            <PlusIcon className="w-6 h-6 text-gray-700" />
          )}
        </div>
      )}

      {node.type === 'Container' && (
        <div className="w-full h-full border border-dashed border-gray-700 rounded-md flex items-center justify-center">
          <span className="text-[10px] text-gray-600">Container</span>
        </div>
      )}

      {isSelected && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
        </>
      )}
    </div>
  );
}

export function Canvas({ onSelectNode }: CanvasProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  
  const nodes = useBuilderStore((state) => state.document?.nodes || []);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);

  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'canvas-bg' || (e.target as HTMLElement).id === 'canvas-grid') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in') return Math.min(prev + 10, 200);
      return Math.max(prev - 10, 50);
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#181818] select-none">
      {/* Canvas Toolbar overlay */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-[#2C2C2C] border border-[#333333] rounded-full px-4 py-1.5 flex items-center space-x-4 shadow-xl shadow-black/50">
        <div className="flex items-center space-x-2 border-r border-[#333333] pr-4">
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-bold text-gray-300 w-10 text-center">{zoom}%</span>
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-full transition-colors ${showGrid ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white'}`}
          >
            <Squares2X2Icon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectNode(null)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <CursorArrowRaysIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={setNodeRef}
        id="canvas-viewport"
        className={`flex-1 relative overflow-hidden transition-colors ${isOver ? 'bg-blue-500/5' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Infinite Grid/Background */}
        <div 
          id="canvas-bg"
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            width: '10000px',
            height: '10000px',
            left: '-5000px',
            top: '-5000px'
          }}
        >
          {/* Grid Background */}
          {showGrid && (
            <div 
              id="canvas-grid"
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(#262626 1px, transparent 1px),
                  linear-gradient(90deg, #262626 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}

          {/* Canvas Center Content */}
          <div 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-[#1E1E1E] shadow-2xl border border-[#333333] relative pointer-events-auto"
            id="canvas"
            onClick={() => onSelectNode(null)}
          >
            {/* Empty State */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="text-center text-white">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <PlusIcon className="w-8 h-8 text-gray-700" />
                  </div>
                  <p className="text-sm font-medium">Drag assets here or use AI to generate</p>
                </div>
              </div>
            )}

            {/* Render Nodes */}
            {nodes.map(node => (
              <DraggableNode 
                key={node.id} 
                node={node} 
                isSelected={selectedNodeId === node.id}
                zoom={zoom}
                onClick={onSelectNode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Status Bar */}
      <div className="bg-[#2C2C2C] border-t border-[#333333] px-3 py-1 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-medium">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span>Live Sync</span>
          </span>
          <span>{nodes.length} Layers</span>
          {selectedNodeId && <span>Selected: {selectedNodeId}</span>}
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-gray-400">
          <span>Space + Drag to pan</span>
          <span>•</span>
          <span>Cmd + Z to undo</span>
        </div>
      </div>
    </div>
  );
}
