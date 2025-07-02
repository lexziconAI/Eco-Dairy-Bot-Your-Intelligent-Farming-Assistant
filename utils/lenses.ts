import { Lens } from '@/hooks/useLens';

export interface LensConfig {
  emoji: string;
  color: string;
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface SESMetric {
  metric: string;
  resilience: number;
  adaptability: number;
  stability: number;
}

export interface ChaosMetric {
  metric: string;
  entropy: number;
  emergence: number;
  divergence: number;
}

export interface BojeMetric {
  metric: string;
  antenarrative: number;
  grandNarrative: number;
  livingStory: number;
}

export const LENSES: Record<Lens, LensConfig> = {
  SES: {
    emoji: '🌱',
    color: 'sesGreen',
    title: 'Socio-Ecological Systems',
    description: 'Resilience, adaptability, and system balance',
    primaryColor: '#5AC48C',
    secondaryColor: '#A8E6CF',
  },
  Chaos: {
    emoji: '🌀', 
    color: 'chaosPurple',
    title: 'Chaos Dynamics',
    description: 'Non-linear patterns, emergence, and complexity',
    primaryColor: '#9F7AEA',
    secondaryColor: '#C7CEEA',
  },
  Boje: {
    emoji: '📖',
    color: 'bojeGold', 
    title: 'Boje Story-Triad',
    description: 'Antenarrative, grand narrative, and living stories',
    primaryColor: '#F6C177',
    secondaryColor: '#FFD3A5',
  },
};

// Helper function to format metric names
export const formatMetricName = (name: string): string => {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to space separated
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
};

// Theory-specific metric transformations - overloaded signatures
export function transformMetricsForLens(series: Record<string, number[]>, lens: 'SES'): SESMetric[];
export function transformMetricsForLens(series: Record<string, number[]>, lens: 'Chaos'): ChaosMetric[];
export function transformMetricsForLens(series: Record<string, number[]>, lens: 'Boje'): BojeMetric[];
export function transformMetricsForLens(series: Record<string, number[]>, lens: Lens): SESMetric[] | ChaosMetric[] | BojeMetric[];
export function transformMetricsForLens(series: Record<string, number[]>, lens: Lens) {
  // Guard against null/undefined series
  if (!series || typeof series !== 'object') {
    return [];
  }
  
  const entries = Object.entries(series);
  
  // Return empty if no data
  if (entries.length === 0) {
    return [];
  }
  
  switch (lens) {
    case 'SES':
      return entries.map(([key, values]) => ({
        metric: formatMetricName(key),
        resilience: values.reduce((a, b) => a + b, 0) / values.length,
        adaptability: Math.max(...values) - Math.min(...values),
        stability: 1 - (values.reduce((acc, val, i, arr) => {
          if (i === 0) return 0;
          return acc + Math.abs(val - arr[i - 1]);
        }, 0) / values.length),
      }));
      
    case 'Chaos':
      return entries.map(([key, values]) => ({
        metric: formatMetricName(key),
        entropy: values.reduce((acc, val, i, arr) => {
          if (i === 0) return 0;
          return acc + Math.abs(val - arr[i - 1]);
        }, 0) / values.length,
        emergence: values.slice(-5).reduce((a, b) => a + b, 0) / 5,
        divergence: Math.max(...values) - Math.min(...values),
      }));
      
    case 'Boje':
      return entries.map(([key, values]) => ({
        metric: formatMetricName(key),
        antenarrative: values.slice(0, 10).reduce((a, b) => a + b, 0) / 10,
        grandNarrative: values.slice(10, 20).reduce((a, b) => a + b, 0) / 10,
        livingStory: values.slice(20, 30).reduce((a, b) => a + b, 0) / 10,
      }));
      
    default:
      return entries.map(([key, values]) => ({
        metric: formatMetricName(key),
        value: values.reduce((a, b) => a + b, 0) / values.length,
      }));
  }
};