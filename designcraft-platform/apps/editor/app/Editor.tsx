"use client";

import React, { useState, useRef, useEffect } from "react";
import { useBuilderStore } from "@designcraft/builder-engine";
import { Toolbar } from "./toolbar/Toolbar";
import { Canvas } from "./canvas/Canvas";
import { Inspector } from "./inspector/Inspector";
import { ComponentLibrary } from "./library/ComponentLibrary";
import { StoryMode } from "./story/StoryMode";
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent, 
  useSensor, 
  useSensors, 
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";

export default function Editor() {
  const [activePanel, setActivePanel] = useState<"library" | "inspector" | "story">("library");
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [inspectorWidth, setInspectorWidth] = useState(320);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const document = useBuilderStore((state) => state.document);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const sidebarDragRef = useRef<HTMLDivElement>(null);
  const inspectorDragRef = useRef<HTMLDivElement>(null);

  const handleCreateDocument = () => {
    useBuilderStore.getState().createDocument("New Design");
  };

  const handleInsertNode = (nodeType: string, position?: { x: number, y: number }) => {
    useBuilderStore.getState().insertNode(nodeType, null, 0, {
      position: position || { x: 100, y: 100 },
      width: 200,
      height: 100
    });
  };

  const handleSelectNode = (nodeId: string | null) => {
    useBuilderStore.getState().selectNode(nodeId);
  };

  const handleUpdateProps = (props: any) => {
    if (selectedNodeId) {
      useBuilderStore.getState().updateNodeProps(selectedNodeId, props);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedItem(event.active.data.current?.type || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setDraggedItem(null);

    if (over && over.id === 'canvas' && active.data.current?.isLibraryItem) {
      // Logic for dropping new component from library
      const x = 100 + delta.x; // Simplified relative drop
      const y = 100 + delta.y;
      handleInsertNode(active.data.current.type, { x, y });
    } else if (active.data.current?.isNode) {
      // Logic for moving existing node
      const nodeId = active.data.current.id;
      const node = useBuilderStore.getState().getNode(nodeId);
      if (node) {
        const currentPos = node.props.position || { x: 0, y: 0 };
        useBuilderStore.getState().updateNodeProps(nodeId, {
          position: {
            x: currentPos.x + delta.x,
            y: currentPos.y + delta.y
          }
        });
      }
    }
  };

  // Initialize document if none exists
  useEffect(() => {
    if (!document) {
      handleCreateDocument();
    }
  }, [document]);

  // Figma Paste Handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type === 'text/plain') {
          items[i].getAsString((content) => {
            try {
              if (content.includes('figma') || content.startsWith('{')) {
                console.log('Detected potential Figma design data');
                useBuilderStore.getState().insertNode('Container', null, 0, {
                  name: 'Pasted Group',
                  isPasted: true,
                  content,
                  position: { x: 100, y: 100 },
                  width: 400,
                  height: 300
                });
              }
            } catch (err) {
              console.error('Failed to parse paste data', err);
            }
          });
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        useBuilderStore.getState().undo();
      }
      
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        useBuilderStore.getState().redo();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(!isSidebarCollapsed);
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        if (activePanel === 'inspector') {
          setIsInspectorCollapsed(!isInspectorCollapsed);
        } else {
          setActivePanel('inspector');
          setIsInspectorCollapsed(false);
        }
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        useBuilderStore.getState().deleteNode(selectedNodeId);
      }
      
      if (e.key === 'Escape') {
        if (activePanel === 'inspector' && !isInspectorCollapsed) {
          setIsInspectorCollapsed(true);
        } else if (selectedNodeId) {
          useBuilderStore.getState().selectNode(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="editor-container h-screen flex overflow-hidden">
        {/* Left Sidebar */}
        <aside 
          ref={sidebarRef}
          className={`sidebar relative transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : ''}`}
          style={{ width: isSidebarCollapsed ? 64 : sidebarWidth }}
        >
          <div className="sidebar-header">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">DesignCraft</h1>
                  <p className="text-sm text-gray-400 mt-1">AI-powered editor</p>
                </div>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {!isSidebarCollapsed && (
            <>
              {/* Tabs */}
              <div className="sidebar-tabs px-2 py-1">
                {["library", "inspector", "story"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePanel(tab as typeof activePanel)}
                    className={`sidebar-tab ${activePanel === tab ? 'sidebar-tab-active' : 'sidebar-tab-inactive'}`}
                  >
                    {tab === "library"
                      ? "Assets"
                      : tab === "inspector"
                        ? "Design"
                        : "Prototyping"}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activePanel === "library" && (
                  <ComponentLibrary onInsert={(type) => handleInsertNode(type)} />
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
            className="absolute top-0 right-0 bottom-0 w-1 bg-transparent hover:bg-blue-500 cursor-col-resize transition-colors z-50"
          />
        </aside>

        {/* Main Editor Area */}
        <main className="main-content flex-1 h-screen flex flex-col bg-[#1E1E1E]">
          {/* Top Toolbar */}
          <div className="toolbar z-20">
            <Toolbar onCreateDocument={handleCreateDocument} />
          </div>

          {/* Canvas */}
          <div className="canvas-container flex-1 relative overflow-hidden bg-[#181818] rounded-tl-xl shadow-2xl">
            <Canvas onSelectNode={handleSelectNode} />
          </div>
        </main>

        {/* Right Inspector Drawer */}
        {selectedNodeId && !isInspectorCollapsed && (
          <aside 
            ref={inspectorRef}
            className="w-80 bg-[#2C2C2C] border-l border-[#333333] overflow-y-auto relative"
            style={{ width: inspectorWidth }}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#333333]">
              <h3 className="font-semibold text-white">Inspector</h3>
              <button
                onClick={() => setIsInspectorCollapsed(true)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Inspector
              nodeId={selectedNodeId}
              onUpdateProps={handleUpdateProps}
            />
            {/* Resize handle for inspector */}
            <div
              ref={inspectorDragRef}
              className="absolute top-0 left-0 bottom-0 w-1 bg-transparent hover:bg-blue-500 cursor-col-resize transition-colors z-50"
            />
          </aside>
        )}

        {/* Inspector toggle button */}
        {selectedNodeId && isInspectorCollapsed && (
          <button
            onClick={() => setIsInspectorCollapsed(false)}
            className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-[#2C2C2C] border border-[#333333] p-2 rounded-l-md shadow-lg hover:bg-[#3C3C3C] transition-colors z-50"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {draggedItem ? (
          <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4 flex items-center justify-center backdrop-blur-sm">
            <span className="text-blue-500 font-bold">{draggedItem}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
