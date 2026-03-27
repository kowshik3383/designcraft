'use client';

import React from 'react';
import { Document } from '@designcraft/types';
import { getComponent } from '@designcraft/component-registry';

interface RendererProps {
  document: Document;
  mode: 'preview' | 'export';
}

export function Renderer({ document, mode }: RendererProps) {
  const renderNode = (node: any) => {
    const Component = getComponent(node.type)?.component;
    if (!Component) {
      return <div key={node.id} className="text-red-500">Unknown: {node.type}</div>;
    }

    const style: React.CSSProperties = {
      position: 'absolute',
      left: node.props?.position?.x || 0,
      top: node.props?.position?.y || 0,
      width: node.props?.width || 'auto',
      height: node.props?.height || 'auto',
      backgroundColor: node.props?.backgroundColor,
      color: node.props?.color,
      fontSize: node.props?.fontSize,
      borderRadius: node.props?.borderRadius,
      opacity: node.props?.opacity,
      textAlign: node.props?.textAlign,
      display: node.props?.visible === false ? 'none' : 'block',
      zIndex: node.order || 0,
      boxSizing: 'border-box',
      overflow: 'hidden'
    };

    return (
      <div key={node.id} style={style}>
        <Component
          {...node.props}
          onClick={() => {
            if (mode === 'preview') {
              console.log('Component clicked:', node.type, node.id);
            }
          }}
        />
        {renderChildren(node.id)}
      </div>
    );
  };

  const renderChildren = (parentId: string | null) => {
    const children = document.nodes
      .filter(n => n.parentId === parentId)
      .sort((a, b) => a.order - b.order);

    return children.map(child => renderNode(child));
  };

  return (
    <div className="renderer-page bg-white min-h-screen relative overflow-auto">
      <div className="canvas-main relative w-[1200px] h-[800px] mx-auto bg-white shadow-lg">
        {renderChildren(null)}
      </div>
    </div>
  );
}