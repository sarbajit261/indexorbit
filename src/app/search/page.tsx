'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, MapPin, Star, Clock, Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BusinessCard } from '@/components/business/business-card';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Link from 'next/link';

const FALLBACK_EXAMPLE_QUERIES = [
  'Find restaurants in New York with outdoor seating',
  'Hotels near Times Square with free breakfast',
  'Find a plumber in Austin open now',
  'Indian restaurants in Los Angeles',
  'Gyms in Miami with a pool',
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  results?: any[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exampleQueries, setExampleQueries] = useState<string[]>(FALLBACK_EXAMPLE_QUERIES);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.popularSearches && Array.isArray(data.popularSearches) && data.popularSearches.length > 0) {
            setExampleQueries(data.popularSearches);
          }
        }
      } catch {
        // use fallbacks
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userQuery = query;
    setQuery('');
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: 'user', content: userQuery }]);

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || 'I found some businesses for you!',
          results: data.results || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Let me try a regular search instead.',
          results: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <div className="flex-1 mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">AI-Powered Search</h1>
        <p className="text-muted-foreground">
          Describe what you are looking for in natural language
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mx-auto mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Describe what you're looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-12 text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>

      {/* Example Queries */}
      <div className="mb-8 text-center">
        <p className="mb-3 text-sm text-muted-foreground">Try these examples:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {exampleQueries.map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="mx-auto max-w-4xl">
        <ScrollArea className="h-[500px] rounded-lg border bg-card p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      AI Assistant
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {/* Search Results */}
                  {message.results && message.results.length > 0 && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {message.results.map((result) => (
                        <BusinessCard key={result.id} business={result} />
                      ))}
                    </div>
                  )}

                  {message.results && message.results.length === 0 && message.role === 'assistant' && messages.length > 1 && (
                    <div className="mt-4">
                      <Link href={`/businesses?q=${encodeURIComponent(messages[0]?.content || '')}`}>
                        <Button variant="outline" size="sm">
                          Try regular search
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        </div>
      </div>
      <Footer />
    </div>
  );
}
