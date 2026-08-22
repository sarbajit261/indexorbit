import OpenAI from 'openai';
import { AIProvider } from '@/types';

// AI Configuration
export const aiConfig = {
  provider: (process.env.AI_PROVIDER || 'openai') as AIProvider,

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  },
} as const;

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: aiConfig.openai.apiKey,
});

// Lazy import for Anthropic to avoid build errors when not configured
let anthropicClient: unknown = null;

export async function getAnthropicClient() {
  if (!anthropicClient && aiConfig.anthropic.apiKey) {
    try {
      const { Anthropic } = await import('@anthropic-ai/sdk');
      anthropicClient = new Anthropic({
        apiKey: aiConfig.anthropic.apiKey,
      });
    } catch {
      console.warn('Anthropic SDK not available');
    }
  }
  return anthropicClient;
}

// Model configuration for each provider
export const modelConfig = {
  [AIProvider.OPENAI]: {
    model: aiConfig.openai.model,
    maxTokens: 4096,
    temperature: 0.7,
  },
  [AIProvider.ANTHROPIC]: {
    model: aiConfig.anthropic.model,
    maxTokens: 4096,
    temperature: 0.7,
  },
};

// Check if AI is configured
export function isAIConfigured(): boolean {
  return !!(aiConfig.openai.apiKey || aiConfig.anthropic.apiKey);
}

export function getCurrentProvider(): AIProvider {
  if (aiConfig.provider === AIProvider.ANTHROPIC && aiConfig.anthropic.apiKey) {
    return AIProvider.ANTHROPIC;
  }
  return AIProvider.OPENAI;
}
