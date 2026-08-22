// Client-side API wrapper for fetching data
// Used in Client Components

const API_BASE = '/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE}${endpoint}`;

  // Add query params if provided
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// Business APIs
// ============================================

export const businessApi = {
  /**
   * Get paginated list of businesses
   */
  list: (params?: {
    type?: string;
    category?: string;
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
  }) =>
    fetchApi<{
      businesses: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
      };
    }>('/businesses', { params }),

  /**
   * Get single business by slug
   */
  get: (slug: string) => fetchApi<any>(`/businesses/${slug}`),

  /**
   * Search businesses, categories, and locations
   */
  search: (query: string, limit: number = 10) =>
    fetchApi<{
      businesses: any[];
      categories: any[];
      locations: { city: string; state: string; country: string }[];
    }>('/businesses/search', { params: { q: query, limit } }),
};

// ============================================
// Business Types APIs
// ============================================

export const businessTypesApi = {
  /**
   * Get all business types
   */
  list: () => fetchApi<any[]>('/business-types'),
};

// ============================================
// Categories APIs
// ============================================

export const categoriesApi = {
  /**
   * Get all categories, optionally filtered by business type
   */
  list: (businessTypeSlug?: string) =>
    fetchApi<any[]>('/categories', {
      params: businessTypeSlug ? { type: businessTypeSlug } : undefined,
    }),
};

// ============================================
// Utility Types
// ============================================

export type { FetchOptions };
