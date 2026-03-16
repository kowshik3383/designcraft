import { AIPrompt, AIResponse, Operation } from '@designcraft/types';

export interface AIEngineConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
}

export interface PromptContext {
  selectedNodeId?: string;
  pageContext?: string;
  availableComponents: string[];
}

export interface OperationGenerator {
  generateOperations(prompt: string, context: PromptContext): Operation[];
}