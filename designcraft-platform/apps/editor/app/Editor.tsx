"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@designcraft/builder-engine";
import { Toolbar } from "./toolbar/Toolbar";
import { Canvas } from "./canvas/Canvas";
import { Inspector } from "./inspector/Inspector";
import { ComponentLibrary } from "./library/ComponentLibrary";
import { StoryMode } from "./story/StoryMode";

export default function Editor() {
  const [activePanel, setActivePanel] = useState<
    "library" | "inspector" | "story"
  >("library");
  const document = useBuilderStore((state) => state.document);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);

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

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-6  border-b border-gray-200">
          <h1 className="text-3xl font-medium text-gray-900">DesignCraft</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered editor</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 px-2 mt-4">
          {["library", "inspector", "story"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePanel(tab as typeof activePanel)}
              className={`flex-1 py-2 text-sm font-medium rounded-md
                ${
                  activePanel === tab
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-500 hover:bg-gray-100"
                }
              `}
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
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <Toolbar onCreateDocument={handleCreateDocument} />
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <Canvas onSelectNode={handleSelectNode} />
        </div>
      </main>

      {/* Right Inspector Drawer */}
      {activePanel === "inspector" && selectedNodeId && (
        <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <Inspector
            nodeId={selectedNodeId}
            onUpdateProps={handleUpdateProps}
          />
        </aside>
      )}
    </div>
  );
}
