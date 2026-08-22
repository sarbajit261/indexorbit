import { openai, getAnthropicClient, getCurrentProvider, aiConfig } from './config';
import type { ParsedAIQuery, SearchParams, SearchResult, AIProvider } from '@/types';
import { searchBusinesses, getBusinessBySlug } from '@/lib/services/business';

// ============================================================================
// AI SEARCH TOOLS (Visitor-facing - Read-only operations)
// ============================================================================

export const VISITOR_TOOLS = {
  searchBusinesses: {
    name: 'searchBusinesses',
    description: 'Search for businesses in the directory. Use this to find businesses matching user criteria.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        businessType: { type: 'string', description: 'Business type slug (e.g., "restaurant", "hotel")' },
        category: { type: 'string', description: 'Category slug' },
        location: { type: 'string', description: 'Location (city, state, or country)' },
        rating: { type: 'number', description: 'Minimum rating (1-5)' },
        openNow: { type: 'boolean', description: 'Filter for businesses open now' },
        limit: { type: 'number', description: 'Maximum results to return', default: 10 },
      },
      required: ['limit'],
    },
  },

  getBusiness: {
    name: 'getBusiness',
    description: 'Get detailed information about a specific business by its slug.',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The business slug' },
      },
      required: ['slug'],
    },
  },

  getBusinessesByCategory: {
    name: 'getBusinessesByCategory',
    description: 'Get all businesses in a specific category.',
    parameters: {
      type: 'object',
      properties: {
        categorySlug: { type: 'string', description: 'The category slug' },
        limit: { type: 'number', default: 10 },
      },
      required: ['categorySlug'],
    },
  },

  getBusinessesByLocation: {
    name: 'getBusinessesByLocation',
    description: 'Get all businesses in a specific location.',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'Location name' },
        limit: { type: 'number', default: 10 },
      },
      required: ['location'],
    },
  },

  getNearbyBusinesses: {
    name: 'getNearbyBusinesses',
    description: 'Get businesses near a specific location.',
    parameters: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        radius: { type: 'number', description: 'Radius in miles', default: 10 },
        businessType: { type: 'string' },
        limit: { type: 'number', default: 10 },
      },
      required: ['latitude', 'longitude', 'limit'],
    },
  },

  getOpenBusinesses: {
    name: 'getOpenBusinesses',
    description: 'Get businesses that are currently open.',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        businessType: { type: 'string' },
        limit: { type: 'number', default: 10 },
      },
      required: ['limit'],
    },
  },

  getBusinessesWithOffer: {
    name: 'getBusinessesWithOffer',
    description: 'Get businesses that have active offers or deals.',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        limit: { type: 'number', default: 10 },
      },
      required: ['limit'],
    },
  },

  getTopRatedBusinesses: {
    name: 'getTopRatedBusinesses',
    description: 'Get top-rated businesses.',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        businessType: { type: 'string' },
        limit: { type: 'number', default: 10 },
      },
      required: ['limit'],
    },
  },
} as const;

// ============================================================================
// TOOL IMPLEMENTATIONS
// ============================================================================

type ToolName = keyof typeof VISITOR_TOOLS;

interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function executeVisitorTool(
  toolName: ToolName,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (toolName) {
      case 'searchBusinesses': {
        const params: SearchParams = {
          query: args.query as string,
          businessType: args.businessType as string,
          category: args.category as string,
          location: args.location as string,
          rating: args.rating as number,
          openNow: args.openNow as boolean,
          limit: (args.limit as number) || 10,
        };
        const { results } = await searchBusinesses(params);
        return { success: true, data: results.slice(0, params.limit) };
      }

      case 'getBusiness': {
        const business = await getBusinessBySlug(args.slug as string);
        return { success: true, data: business };
      }

      case 'getBusinessesByCategory': {
        const { results } = await searchBusinesses({
          category: args.categorySlug as string,
          limit: (args.limit as number) || 10,
        });
        return { success: true, data: results };
      }

      case 'getBusinessesByLocation': {
        const { results } = await searchBusinesses({
          location: args.location as string,
          limit: (args.limit as number) || 10,
        });
        return { success: true, data: results };
      }

      case 'getNearbyBusinesses': {
        const { getNearbyBusinesses } = await import('@/lib/services/business');
        const results = await getNearbyBusinesses(
          args.latitude as number,
          args.longitude as number,
          (args.radius as number) || 10,
          { limit: (args.limit as number) || 10 }
        );
        return { success: true, data: results };
      }

      case 'getOpenBusinesses': {
        const { results } = await searchBusinesses({
          location: args.location as string,
          businessType: args.businessType as string,
          openNow: true,
          limit: (args.limit as number) || 10,
        });
        return { success: true, data: results };
      }

      case 'getBusinessesWithOffer': {
        const { results } = await searchBusinesses({
          location: args.location as string,
          hasOffers: true,
          limit: (args.limit as number) || 10,
        });
        return { success: true, data: results };
      }

      case 'getTopRatedBusinesses': {
        const { results } = await searchBusinesses({
          location: args.location as string,
          businessType: args.businessType as string,
          sort: 'RATING',
          limit: (args.limit as number) || 10,
        });
        return { success: true, data: results };
      }

      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    console.error(`Tool error: ${toolName}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// ============================================================================
// AI QUERY PARSING
// ============================================================================

const VISITOR_SYSTEM_PROMPT = `You are an AI assistant for a business directory website called IndexOrbit. Your role is to help users find businesses.

IMPORTANT RULES:
1. You can ONLY return businesses that actually exist in the database
2. NEVER invent businesses, ratings, addresses, or other information
3. ALWAYS use the provided tools to search for real businesses
4. Be helpful and conversational, but always base your responses on actual data
5. If no businesses match, tell the user honestly and suggest alternatives
6. Keep responses concise and focused on helping users find what they need

When a user asks to find businesses:
1. Parse their intent and extract: location, business type, category, services, attributes
2. Use the appropriate search tool to find matching businesses
3. Present results clearly with relevant details
4. Explain why each result matches their request

Example queries you might receive:
- "Find restaurants in Austin"
- "I need a plumber who offers emergency service"
- "Hotels near Times Square with free breakfast"
- "Which shops are open right now?"

Always prioritize accuracy over speed.`;

export async function parseUserQuery(userMessage: string): Promise<{
  parsed: ParsedAIQuery;
  toolCalls: Array<{ name: ToolName; args: Record<string, unknown> }>;
}> {
  const provider = getCurrentProvider();

  if (provider === AIProvider.OPENAI) {
    const completion = await openai.chat.completions.create({
      model: aiConfig.openai.model,
      messages: [
        { role: 'system', content: VISITOR_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      tools: Object.values(VISITOR_TOOLS).map((tool) => ({
        type: 'function' as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      })),
      tool_choice: 'auto',
    });

    const toolCalls = completion.choices[0]?.message?.tool_calls || [];
    const parsed = extractParsedQuery(userMessage);

    return {
      parsed,
      toolCalls: toolCalls.map((call) => ({
        name: call.function.name as ToolName,
        args: JSON.parse(call.function.arguments),
      })),
    };
  } else {
    // Anthropic implementation
    const client = getAnthropicClient();
    if (!client) {
      throw new Error('Anthropic client not configured');
    }

    const response = await client.messages.create({
      model: aiConfig.anthropic.model,
      max_tokens: 1024,
      system: VISITOR_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      tools: Object.values(VISITOR_TOOLS).map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters,
      })),
    });

    const toolCalls = response.content
      .filter((block) => block.type === 'tool_use')
      .map((block) => ({
        name: block.name as ToolName,
        args: block.input,
      }));

    const parsed = extractParsedQuery(userMessage);

    return { parsed, toolCalls };
  }
}

function extractParsedQuery(message: string): ParsedAIQuery {
  const parsed: ParsedAIQuery = {};

  // Simple extraction logic - in production, this would be more sophisticated
  const lowerMessage = message.toLowerCase();

  // Location patterns
  const locationPatterns = [
    /in\s+([A-Za-z\s]+?)(?:\s+with|\s+that|\s+near|\s+|$)/gi,
    /near\s+([A-Za-z\s]+?)(?:\s+with|\s+that|\s+|$)/gi,
  ];

  for (const pattern of locationPatterns) {
    const match = pattern.exec(message);
    if (match) {
      parsed.location = match[1].trim();
      break;
    }
  }

  // Business type patterns
  const typePatterns = /(?:a|an|the)?\s*(plumber|restaurant|hotel|shop|salon|clinic|contractor|agency|gym|cleaner|electrician)/gi;
  const typeMatch = typePatterns.exec(lowerMessage);
  if (typeMatch) {
    parsed.businessType = typeMatch[1];
  }

  // Rating patterns
  const ratingMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*(?:star)?/);
  if (ratingMatch) {
    parsed.minRating = parseFloat(ratingMatch[1]);
  }

  // Open now
  if (lowerMessage.includes('open now') || lowerMessage.includes('currently open')) {
    parsed.openNow = true;
  }

  return parsed;
}

// ============================================================================
// AI SEARCH EXECUTION
// ============================================================================

export async function executeAISearch(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<{
  response: string;
  results: SearchResult[];
  toolCalls: Array<{ name: string; args: Record<string, unknown>; result: unknown }>;
}> {
  const { parsed, toolCalls: plannedCalls } = await parseUserQuery(userMessage);

  const toolResults: Array<{ name: string; args: Record<string, unknown>; result: unknown }> = [];
  let allResults: SearchResult[] = [];

  // Execute each planned tool call
  for (const call of plannedCalls) {
    const result = await executeVisitorTool(call.name, call.args);
    toolResults.push({
      name: call.name,
      args: call.args,
      result: result.success ? result.data : null,
    });

    if (result.success && result.data) {
      const data = result.data as SearchResult[];
      if (Array.isArray(data)) {
        allResults = [...allResults, ...data];
      }
    }
  }

  // Generate response based on results
  let response: string;

  if (allResults.length === 0) {
    response = generateNoResultsResponse(userMessage, parsed);
  } else {
    response = generateResultsResponse(allResults, parsed);
  }

  return {
    response,
    results: allResults,
    toolCalls: toolResults,
  };
}

function generateNoResultsResponse(
  message: string,
  parsed: ParsedAIQuery
): string {
  let response = "I couldn't find any businesses matching your search.";

  if (parsed.location) {
    response += ` For the location "${parsed.location}"`;
  }

  response +=
    ". Here are some suggestions:\n\n" +
    "• Try a different or more general location\n" +
    "• Use a broader search term\n" +
    "• Check back later as new businesses are added regularly\n\n" +
    "Would you like me to help with anything else?";

  return response;
}

function generateResultsResponse(results: SearchResult[], parsed: ParsedAIQuery): string {
  const count = results.length;
  let response = `I found **${count} business${count > 1 ? 'es' : ''}** that match your search`;

  if (parsed.location) {
    response += ` in ${parsed.location}`;
  }

  response += ":\n\n";

  const topResults = results.slice(0, 5);
  for (const { business, matchReasons } of topResults) {
    response += `**${business.name}**\n`;
    response += `📍 ${business.city || 'Location varies'}`;
    if (business.rating > 0) {
      response += ` • ⭐ ${business.rating.toFixed(1)} (${business.reviewCount} reviews)`;
    }
    if (business.shortDescription) {
      response += `\n${business.shortDescription.slice(0, 100)}...`;
    }
    response += "\n\n";
  }

  if (results.length > 5) {
    response += `_And ${results.length - 5} more businesses..._`;
  }

  return response;
}
