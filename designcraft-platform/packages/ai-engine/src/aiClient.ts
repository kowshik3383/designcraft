import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse, AIPrompt } from '@designcraft/types';
import { AIEngineConfig } from './types';

export class AIClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(config: AIEngineConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.model });
  }

  async generateResponse(prompt: AIPrompt): Promise<AIResponse> {
    try {
      const systemPrompt = `You are an AI assistant that helps with website design. 
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
      }`;

      const result = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: prompt.text }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
          topP: 1,
          topK: 32
        }
      });

      const response = result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsedResponse: AIResponse = JSON.parse(jsonMatch[0]);
      return parsedResponse;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}
