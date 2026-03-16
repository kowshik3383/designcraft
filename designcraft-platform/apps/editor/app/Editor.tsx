"use client";

import React, { useState, useRef, useEffect } from "react";
import { useBuilderStore } from "@designcraft/builder-engine";
import { Toolbar } from "./toolbar/Toolbar";
import { Canvas } from "./canvas/Canvas";
import { Inspector } from "./inspector/Inspector";
import { ComponentLibrary } from "./library/ComponentLibrary";
import { StoryMode } from "./story/StoryMode";

export default function Editor() {
  const [activePanel, setActivePanel] = useState<"library" | "inspector" | "story">("library");
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [inspectorWidth, setInspectorWidth] = useState(320);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);
  
  const document = useBuilderStore((state) => state.document);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const sidebarDragRef = useRef<HTMLDivElement>(null);
  const inspectorDragRef = useRef<HTMLDivElement>(null);

  const handleCreateDocument = () => {
    useBuilderStore.getState().createDocument("New Design");
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        console.log('Undo action triggered');
        // Add undo logic here
      }
      
      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        console.log('Redo action triggered');
        // Add redo logic here
      }
      
      // Toggle Sidebar: Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(!isSidebarCollapsed);
      }
      
      // Toggle Inspector: Ctrl/Cmd + I
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        if (activePanel === 'inspector') {
          setIsInspectorCollapsed(!isInspectorCollapsed);
        } else {
          setActivePanel('inspector');
          setIsInspectorCollapsed(false);
        }
      }
      
      // Delete selected node: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        console.log('Delete node:', selectedNodeId);
        // Add delete logic here
      }
      
      // Escape: Close inspector or clear selection
      if (e.key === 'Escape') {
        if (activePanel === 'inspector' && !isInspectorCollapsed) {
          setIsInspectorCollapsed(true);
        } else if (selectedNodeId) {
          useBuilderStore.getState().selectNode(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId, activePanel, isInspectorCollapsed, isSidebarCollapsed]);

  // Sidebar resize handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarDragRef.current) return;
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    sidebarDragRef.current?.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Inspector resize handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!inspectorDragRef.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 200 && newWidth < 500) {
        setInspectorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    inspectorDragRef.current?.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="editor-container">
      {/* Left Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`sidebar ${isSidebarCollapsed ? 'w-16' : ''}`}
        style={{ width: isSidebarCollapsed ? 64 : sidebarWidth }}
      >
        <div className="sidebar-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">DesignCraft</h1>
              <p className="text-sm text-gray-600 mt-1">AI-powered editor</p>
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {!isSidebarCollapsed && (
          <>
            {/* Tabs */}
            <div className="sidebar-tabs">
              {["library", "inspector", "story"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePanel(tab as typeof activePanel)}
                  className={`sidebar-tab ${activePanel === tab ? 'sidebar-tab-active' : 'sidebar-tab-inactive'}`}
                >
                  {tab === "library"
                    ? "Components"
                    : tab === "inspector"
                      ? "Inspector"
                      : "Story Mode"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activePanel === "library" && (
                <ComponentLibrary onInsert={handleInsertNode} />
              )}
              {activePanel === "inspector" && (
                <Inspector
                  nodeId={selectedNodeId}
                  onUpdateProps={handleUpdateProps}
                />
              )}
              {activePanel === "story" && <StoryMode />}
            </div>
          </>
        )}

        {/* Resize handle */}
        <div
          ref={sidebarDragRef}
          className="absolute top-0 right-0 bottom-0 w-1 bg-transparent hover:bg-blue-200 cursor-col-resize transition-colors"
          style={{ width: isSidebarCollapsed ? 0 : 1 }}
        />
      </aside>

      {/* Resize handle for sidebar */}
      {!isSidebarCollapsed && (
        <div
          className="absolute top-0 bottom-0 w-1 bg-transparent hover:bg-blue-200 cursor-col-resize"
          style={{ left: sidebarWidth, top: 0, bottom: 0, width: 1 }}
        />
      )}

      {/* Main Editor Area */}
      <main className="main-content">
        {/* Top Toolbar */}
        <div className="toolbar">
          <Toolbar onCreateDocument={handleCreateDocument} />
        </div>

        {/* Canvas */}
        <div className="canvas-container">
          <Canvas onSelectNode={handleSelectNode} />
        </div>
      </main>

      {/* Right Inspector Drawer */}
      {activePanel === "inspector" && selectedNodeId && !isInspectorCollapsed && (
        <>
          <aside 
            ref={inspectorRef}
            className="w-80 bg-white border-l border-gray-200 overflow-y-auto"
            style={{ width: inspectorWidth }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Inspector</h3>
              <button
                onClick={() => setIsInspectorCollapsed(true)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Inspector
              nodeId={selectedNodeId}
              onUpdateProps={handleUpdateProps}
            />
          </aside>

          {/* Resize handle for inspector */}
          <div
            ref={inspectorDragRef}
            className="absolute top-0 bottom-0 w-1 bg-transparent hover:bg-blue-200 cursor-col-resize"
            style={{ right: inspectorWidth, top: 0, bottom: 0, width: 1 }}
          />
        </>
      )}

      {/* Inspector toggle button */}
      {activePanel === "inspector" && selectedNodeId && (
        <button
          onClick={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
          className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-md shadow-lg hover:bg-gray-50 transition-colors z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
