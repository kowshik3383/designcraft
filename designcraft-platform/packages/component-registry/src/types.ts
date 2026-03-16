import { ComponentSchema, PropSchema } from '@designcraft/types';

export interface ComponentRegistry {
  [key: string]: {
    component: React.ComponentType<any>;
    schema: ComponentSchema;
  };
}

export type ComponentRenderer = (nodeId: string, props: any) => React.ReactNode;