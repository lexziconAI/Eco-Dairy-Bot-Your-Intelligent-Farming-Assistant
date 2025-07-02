import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts';
import { AnalysisResult } from '@/utils/api';
import { transformMetricsForLens } from '@/utils/lenses';

interface BojeChartsProps {
  results: AnalysisResult;
}

export default function BojeCharts({ results }: BojeChartsProps) {
  const series = results?.series || results?.dairyMetrics || {};
  const bojeData = transformMetricsForLens(series, 'Boje');
  
  // Create narrative flow data (Sankey-like representation)
  const narrativeFlowData = bojeData.map((item, index) => ({
    metric: item.metric,
    Antenarrative: item.antenarrative * 100,
    'Grand Narrative': item.grandNarrative * 100,
    'Living Story': item.livingStory * 100,
    index,
  }));

  // Create polarity data
  const polarityData = bojeData.map((item) => ({
    metric: item.metric,
    tension: (item.antenarrative - item.grandNarrative) * 100,
    coherence: item.grandNarrative * 100,
    emergence: item.livingStory * 100,
  }));

  // Story-triad timeline
  const timelineData = Array.from({ length: 30 }, (_, i) => {
    const dataPoint: any = { time: i + 1 };
    
    Object.entries(series).forEach(([key, values]) => {
      const metricName = key.replace(/([a-z])([A-Z])/g, '$1 $2');
      // Divide timeline into three narrative phases
      if (i < 10) {
        dataPoint[`${metricName} Ante`] = values[i];
      } else if (i < 20) {
        dataPoint[`${metricName} Grand`] = values[i];
      } else {
        dataPoint[`${metricName} Living`] = values[i];
      }
    });
    
    return dataPoint;
  });

  const colors = ['#F6C177', '#FFD3A5', '#FDE68A', '#FCD34D', '#F59E0B'];

  return (
    <div className="space-y-8">
      {/* Narrative Polarity Bar Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          ⚖️ Narrative Tension & Coherence
        </h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={polarityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="metric" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11, fill: '#374151' }}
              />
              <YAxis 
                label={{ value: 'Narrative Intensity', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12, fill: '#374151' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="tension" fill="#F6C177" name="Antenarrative Tension" />
              <Bar dataKey="coherence" fill="#FFD3A5" name="Grand Narrative Coherence" />
              <Bar dataKey="emergence" fill="#FDE68A" name="Living Story Emergence" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Story-Triad Flow */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🌊 Story-Triad Evolution Flow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bojeData.map((item, index) => (
            <div key={`${item.metric}-${index}`} className="bg-gradient-to-br from-bojeGold/10 to-bojeGold/5 rounded-lg p-4 border border-bojeGold/20">
              <h4 className="font-semibold text-gray-800 mb-4 text-center">{item.metric}</h4>
              
              {/* Story flow visualization */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🌾</div>
                  <div className="text-sm font-medium text-gray-700">Antenarrative</div>
                  <div className="text-xs text-gray-500 mb-2">Emerging tensions</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-bojeGold h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.antenarrative * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-bold text-bojeGold mt-1">
                    {(item.antenarrative * 100).toFixed(0)}%
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>

                <div className="text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-sm font-medium text-gray-700">Grand Narrative</div>
                  <div className="text-xs text-gray-500 mb-2">Structured story</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.grandNarrative * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-bold text-yellow-600 mt-1">
                    {(item.grandNarrative * 100).toFixed(0)}%
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>

                <div className="text-center">
                  <div className="text-2xl mb-2">🫶</div>
                  <div className="text-sm font-medium text-gray-700">Living Story</div>
                  <div className="text-xs text-gray-500 mb-2">Dynamic reality</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.livingStory * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-bold text-amber-600 mt-1">
                    {(item.livingStory * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative Balance Overview */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          📊 Story-Triad Balance
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={narrativeFlowData}>
              <defs>
                <linearGradient id="anteGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F6C177" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F6C177" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="grandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD3A5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFD3A5" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="livingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FDE68A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FDE68A" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="metric" 
                tick={{ fontSize: 11, fill: '#374151' }}
              />
              <YAxis 
                label={{ value: 'Narrative Strength', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12, fill: '#374151' }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Antenarrative"
                stackId="1"
                stroke="#F6C177"
                fill="url(#anteGradient)"
              />
              <Area
                type="monotone"
                dataKey="Grand Narrative"
                stackId="1"
                stroke="#FFD3A5"
                fill="url(#grandGradient)"
              />
              <Area
                type="monotone"
                dataKey="Living Story"
                stackId="1"
                stroke="#FDE68A"
                fill="url(#livingGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Theoretical Context */}
      <div className="bg-bojeGold/10 border border-bojeGold/20 rounded-lg p-4">
        <h4 className="font-semibold text-bojeGold mb-2 flex items-center gap-2">
          📖 Boje's Story-Triad Framework
        </h4>
        <p className="text-sm text-gray-700 mb-3">
          This lens applies David Boje's narrative theory, examining the dynamic interplay between 
          antenarrative (emerging, fragmented stories), grand narrative (official, structured accounts), 
          and living story (embodied, performed reality).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-lg">🌾</span>
            <div>
              <strong>Antenarrative:</strong> Pre-structured tensions and emerging story fragments
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">📈</span>
            <div>
              <strong>Grand Narrative:</strong> Coherent, official version of events and meaning
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">🫶</span>
            <div>
              <strong>Living Story:</strong> Dynamic, embodied reality as it's actually lived
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}