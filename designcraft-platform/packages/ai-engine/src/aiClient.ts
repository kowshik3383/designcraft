import axios from 'axios';
import { AIResponse, AIPrompt } from '@designcraft/types';
import { AIEngineConfig } from './types';

export class AIClient {
  private config: AIEngineConfig;

  constructor(config: AIEngineConfig) {
    this.config = config;
  }

  async generateResponse(prompt: AIPrompt): Promise<AIResponse> {
    try {
      const response = await axios.post(
        this.config.apiUrl,
        {
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that helps with website design. 
              Convert natural language design requests into structured operations for a website builder.
              Return operations in JSON format with the following structure:
              {
                "operations": [
                  {
                    "type": "INSERT_NODE" | "DELETE_NODE" | "MOVE_NODE" | "UPDATE_NODE_PROPS",
                    "payload": { /* operation-specific data */ },
                    "timestamp": number
                  }
                ],
                "explanation": "Brief explanation of what was done"
              }`
            },
            {
              role: 'user',
              content: prompt.text
            }
          ],
          temperature: 0.1,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}