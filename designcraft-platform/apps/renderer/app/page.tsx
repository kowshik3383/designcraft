'use client';

import { Renderer } from './Renderer';

export default function HomePage() {
  // Sample document for demonstration
  const sampleDocument = {
    id: 'sample-doc',
    name: 'Sample Page',
    version: '1.0.0',
    nodes: [
      {
        id: 'node-1',
        type: 'Text',
        props: {
          text: 'Welcome to DesignCraft',
          fontSize: 32,
          color: '#333333',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        children: [],
        parentId: null,
        order: 0
      },
      {
        id: 'node-2',
        type: 'Text',
        props: {
          text: 'Build beautiful websites with AI assistance',
          fontSize: 18,
          color: '#666666',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        children: [],
        parentId: null,
        order: 1
      },
      {
        id: 'node-3',
        type: 'Image',
        props: {
          src: 'https://via.placeholder.com/800x400',
          alt: 'Hero image',
          width: '100%',
          height: '400px',
          objectFit: 'cover'
        },
        children: [],
        parentId: null,
        order: 2
      },
      {
        id: 'node-4',
        type: 'Button',
        props: {
          text: 'Get Started',
          variant: 'primary',
          size: 'lg',
          fullWidth: true
        },
        children: [],
        parentId: null,
        order: 3
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        DesignCraft Renderer Demo
      </h1>
      <Renderer document={sampleDocument} mode="preview" />
    </div>
  );
}