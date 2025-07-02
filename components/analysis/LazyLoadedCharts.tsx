import dynamic from 'next/dynamic';
import React from 'react';

// Lazy load all heavy chart components with loading fallbacks
export const SentimentJourneyGraph = dynamic(
  () => import('./SentimentJourneyGraph'),
  {
    ssr: false,
    loading: () => <ChartLoadingSkeleton title="Sentiment Journey" />
  }
);

export const OrientationEvolutionRadar = dynamic(
  () => import('./OrientationEvolutionRadar'),
  {
    ssr: false,
    loading: () => <ChartLoadingSkeleton title="Orientation Evolution" />
  }
);

export const DialecticTensionVisualizer = dynamic(
  () => import('./DialecticTensionVisualizer'),
  {
    ssr: false,
    loading: () => <ChartLoadingSkeleton title="Dialectical Tension" />
  }
);

export const NarrativeWebDiagram = dynamic(
  () => import('./NarrativeWebDiagram'),
  {
    ssr: false,
    loading: () => <ChartLoadingSkeleton title="Narrative Web" />
  }
);

export const EngagementHeatmap = dynamic(
  () => import('./EngagementHeatmap'),
  {
    ssr: false,
    loading: () => <ChartLoadingSkeleton title="Engagement Heatmap" />
  }
);

// Loading skeleton component
function ChartLoadingSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 loading-skeleton"></div>
        <div className="h-4 bg-gray-100 rounded w-2/3 loading-skeleton"></div>
      </div>
      
      <div className="h-80 bg-gray-50 rounded-lg loading-skeleton mb-4"></div>
      
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full loading-skeleton"></div>
        <div className="h-3 bg-gray-100 rounded w-3/4 loading-skeleton"></div>
      </div>
    </div>
  );
}

// Optimistic UI placeholder while analysis is loading
export function AnalysisPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-700 font-medium">Analyzing your conversation...</span>
        </div>
      </div>
      
      {/* Show skeleton charts */}
      <ChartLoadingSkeleton title="Sentiment Journey" />
      <ChartLoadingSkeleton title="Orientation Evolution" />
      <ChartLoadingSkeleton title="Dialectical Tension" />
    </div>
  );
}

// Memoized cache for identical prompts (10 minute TTL)
const responseCache = new Map<string, { response: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function getCachedResponse(prompt: string): any | null {
  const cached = responseCache.get(prompt);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  return null;
}

export function setCachedResponse(prompt: string, response: any): void {
  responseCache.set(prompt, { response, timestamp: Date.now() });
  
  // Clean up old entries
  if (responseCache.size > 50) {
    const entries = Array.from(responseCache.entries());
    const oldEntries = entries.filter(([_, data]) => Date.now() - data.timestamp > CACHE_TTL);
    oldEntries.forEach(([key]) => responseCache.delete(key));
  }
}

// Debounced function helper
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      const existing = this.metrics.get(operation) || [];
      existing.push(duration);
      this.metrics.set(operation, existing.slice(-10)); // Keep last 10 measurements
      
      if (duration > 2000) {
        console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  getAverageTime(operation: string): number {
    const times = this.metrics.get(operation) || [];
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  getMetrics(): Record<string, { avg: number; count: number; latest: number }> {
    const result: Record<string, { avg: number; count: number; latest: number }> = {};
    
    const entries = Array.from(this.metrics.entries());
    for (const [operation, times] of entries) {
      result[operation] = {
        avg: times.reduce((a: number, b: number) => a + b, 0) / times.length,
        count: times.length,
        latest: times[times.length - 1] || 0
      };
    }
    
    return result;
  }
}

// Error boundary for chart components
export class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">⚠️ Chart Error</div>
          <p className="text-red-700 text-sm">
            Unable to render chart. Please try refreshing the analysis.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}