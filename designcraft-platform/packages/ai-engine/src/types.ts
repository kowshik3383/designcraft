import { AIPrompt, AIResponse, Operation, Document } from '@designcraft/types';

export interface AIEngineConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
}

export interface PromptContext {
  selectedNodeId?: string;
  pageContext?: string;
  availableComponents: string[];
  document?: Document;
}

export interface IOperationGenerator {
  generateOperations(prompt: string, context: PromptContext): Operation[];
}