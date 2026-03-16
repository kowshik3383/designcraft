import { ComponentSchema, PropSchema } from '@designcraft/types';
import { Text } from './components/Text';
import { Image } from './components/Image';
import { Button } from './components/Button';
import { ComponentRegistry } from './types';

const textSchema: ComponentSchema = {
  type: 'Text',
  displayName: 'Text',
  category: 'Typography',
  props: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'The text content to display'
    },
    {
      name: 'fontSize',
      type: 'number',
      required: false,
      defaultValue: 16,
      description: 'Font size in pixels'
    },
    {
      name: 'color',
      type: 'string',
      required: false,
      defaultValue: '#000000',
      description: 'Text color'
    },
    {
      name: 'fontWeight',
      type: 'enum',
      required: false,
      defaultValue: 'normal',
      options: ['normal', 'bold', 'lighter', 'bolder'],
      description: 'Font weight'
    },
    {
      name: 'textAlign',
      type: 'enum',
      required: false,
      defaultValue: 'left',
      options: ['left', 'center', 'right'],
      description: 'Text alignment'
    }
  ],
  defaultProps: {
    text: 'Sample text',
    fontSize: 16,
    color: '#000000',
    fontWeight: 'normal',
    textAlign: 'left'
  }
};

const imageSchema: ComponentSchema = {
  type: 'Image',
  displayName: 'Image',
  category: 'Media',
  props: [
    {
      name: 'src',
      type: 'string',
      required: true,
      description: 'Image source URL'
    },
    {
      name: 'alt',
      type: 'string',
      required: false,
      defaultValue: '',
      description: 'Alternative text for accessibility'
    },
    {
      name: 'width',
      type: 'string',
      required: false,
      defaultValue: '100%',
      description: 'Image width'
    },
    {
      name: 'height',
      type: 'string',
      required: false,
      defaultValue: 'auto',
      description: 'Image height'
    },
    {
      name: 'objectFit',
      type: 'enum',
      required: false,
      defaultValue: 'cover',
      options: ['cover', 'contain', 'fill', 'scale-down', 'none'],
      description: 'Object fit property'
    },
    {
      name: 'borderRadius',
      type: 'number',
      required: false,
      defaultValue: 0,
      description: 'Border radius in pixels'
    }
  ],
  defaultProps: {
    src: 'https://via.placeholder.com/300x150',
    alt: 'Placeholder image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 0
  }
};

const buttonSchema: ComponentSchema = {
  type: 'Button',
  displayName: 'Button',
  category: 'Form',
  props: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Button text content'
    },
    {
      name: 'variant',
      type: 'enum',
      required: false,
      defaultValue: 'primary',
      options: ['primary', 'secondary', 'outline'],
      description: 'Button variant style'
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
      description: 'Button size'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: 'Whether button is disabled'
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      required: false,
      defaultValue: false,
      description: 'Whether button takes full width'
    }
  ],
  defaultProps: {
    text: 'Click me',
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false
  }
};

export const componentRegistry: ComponentRegistry = {
  Text: {
    component: Text,
    schema: textSchema
  },
  Image: {
    component: Image,
    schema: imageSchema
  },
  Button: {
    component: Button,
    schema: buttonSchema
  }
};

export const getComponent = (type: string) => {
  return componentRegistry[type];
};

export const getComponentSchema = (type: string) => {
  return componentRegistry[type]?.schema;
};

export const getComponentList = () => {
  return Object.keys(componentRegistry).map(type => ({
    type,
    ...componentRegistry[type].schema
  }));
};