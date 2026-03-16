import React, { useState } from 'react';
import { useBuilderStore } from '@designcraft/builder-engine';
import { getComponentList } from '@designcraft/component-registry';
import { Toolbar } from './toolbar/Toolbar';
import { Canvas } from './canvas/Canvas';
import { Inspector } from './inspector/Inspector';
import { ComponentLibrary } from './library/ComponentLibrary';

export function Editor() {
  const [activePanel, setActivePanel] = useState<'library' | 'inspector'>('library');
  const document = useBuilderStore(state => state.document);
  const selectedNodeId = useBuilderStore(state => state.selectedNodeId);

  const handleCreateDocument = () => {
    useBuilderStore.getState().createDocument('New Design');
  };

  const handleInsertNode = (nodeType: string) => {
    useBuilderStore.getState().insertNode(nodeType, null, 0);
  };

  const handleSelectNode = (nodeId: string) => {
    useBuilderStore.getState().selectNode(nodeId);
  };

  const handleUpdateProps = (props: any) => {
    if (selectedNodeId) {
      useBuilderStore.getState().updateNodeProps(selectedNodeId, props);
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">DesignCraft Editor</h1>
          <p className="text-sm text-gray-600 mt-1">AI-powered website builder</p>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activePanel === 'library' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActivePanel('library')}
          >
            Components
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activePanel === 'inspector' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActivePanel('inspector')}
          >
            Inspector
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activePanel === 'library' && (
            <ComponentLibrary onInsert={handleInsertNode} />
          )}
          {activePanel === 'inspector' && (
            <Inspector 
              nodeId={selectedNodeId}
              onUpdateProps={handleUpdateProps}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Toolbar onCreateDocument={handleCreateDocument} />
        <div className="flex-1 overflow-hidden">
          <Canvas onSelectNode={handleSelectNode} />
        </div>
      </div>
    </div>
  );
}