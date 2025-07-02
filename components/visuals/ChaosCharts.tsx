import React from 'react';
import { AnalysisResult } from '@/utils/api';
import { transformMetricsForLens } from '@/utils/lenses';
import SimpleTimelineChart from '@/components/Charts/SimpleTimelineChart';
import SimpleLineChart from '@/components/Charts/SimpleLineChart';
import MiniMetricBar from '@/components/MiniMetricBar';

interface ChaosChartsProps {
  results: AnalysisResult;
}

export default function ChaosCharts({ results }: ChaosChartsProps) {
  const series = results?.series || results?.dairyMetrics || {};
  const chaosData = transformMetricsForLens(series, 'Chaos');

  // Transform function for divergence calculation
  const calculateDivergence = (values: number[], index: number) => {
    const initialValue = values[0];
    return values.map(currentValue => Math.abs(currentValue - initialValue));
  };

  return (
    <div className="space-y-8">
      {/* Chaos Dynamics Timeline */}
      <SimpleTimelineChart 
        results={results}
        title="Chaos Dynamics Timeline"
        emoji="🌀"
        caption="I can see the rich complexity in what you've shared—this chart reveals how different aspects of your situation evolve and build upon each other over time. Each colored bar shows how various themes intensify and interact, helping you understand the deeper patterns in your experience."
      />

      {/* System Divergence Patterns */}
      <SimpleLineChart 
        results={results}
        title="System Divergence Patterns"
        emoji="📈"
        caption="Thank you for trusting me with your thoughts—this divergence analysis shows how different aspects of your situation change from where they started. Each line represents a key theme, and higher values indicate greater transformation or evolution in that area. This helps you see which parts of your experience are shifting most dramatically over time."
        transform={calculateDivergence}
      />

      {/* Chaos Metrics Grid */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🔬 Complexity Indicators
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chaosData.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col gap-3">
              <h4 className="font-semibold text-gray-800 mb-1">{item.metric}</h4>
              
              <div className="space-y-3">
                <MiniMetricBar
                  label="Entropy"
                  value={item.entropy}
                  color="#9F7AEA"
                  percentage={true}
                />
                
                <MiniMetricBar
                  label="Emergence"
                  value={item.emergence}
                  color="#A855F7"
                  percentage={true}
                />
                
                <MiniMetricBar
                  label="Divergence"
                  value={item.divergence}
                  color="#8B5CF6"
                  percentage={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theoretical Context */}
      <div className="bg-chaosPurple/10 border border-chaosPurple/20 rounded-lg p-4">
        <h4 className="font-semibold text-chaosPurple mb-2 flex items-center gap-2">
          🌀 Chaos Theory & Complex Systems
        </h4>
        <p className="text-sm text-gray-700">
          This lens applies chaos theory and complexity science to examine non-linear dynamics, 
          emergent patterns, and sensitive dependence on initial conditions within your narrative system. 
          It reveals how small changes can lead to large-scale transformations.
        </p>
      </div>
    </div>
  );
}