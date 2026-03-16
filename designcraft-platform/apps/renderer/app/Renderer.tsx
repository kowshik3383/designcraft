import React from 'react';
import { Document, RenderContext } from '@designcraft/types';
import { getComponent } from '@designcraft/component-registry';

interface RendererProps {
  document: Document;
  mode: 'preview' | 'export';
}

export function Renderer({ document, mode }: RendererProps) {
  const renderNode = (nodeId: string) => {
    const node = document.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const Component = getComponent(node.type)?.component;
    if (!Component) {
      return <div key={node.id}>Unknown component: {node.type}</div>;
    }

    return (
      <Component
        key={node.id}
        {...node.props}
        onClick={() => {
          if (mode === 'preview') {
            console.log('Component clicked:', node.type, node.id);
          }
        }}
      />
    );
  };

  const renderChildren = (parentId: string | null) => {
    const children = document.nodes
      .filter(n => n.parentId === parentId)
      .sort((a, b) => a.order - b.order);

    return children.map(child => (
      <React.Fragment key={child.id}>
        {renderNode(child.id)}
        {renderChildren(child.id)}
      </React.Fragment>
    ));
  };

  return (
    <div className="renderer-container">
      {renderChildren(null)}
    </div>
  );
}