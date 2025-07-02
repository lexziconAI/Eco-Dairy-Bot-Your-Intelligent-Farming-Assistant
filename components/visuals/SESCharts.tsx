import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '@/utils/api';
import { transformMetricsForLens } from '@/utils/lenses';

interface SESChartsProps {
  results: AnalysisResult;
}

export default function SESCharts({ results }: SESChartsProps) {
  const sesData = transformMetricsForLens(results?.series || {}, 'SES');
  
  // Create radar chart data
  const radarData = sesData.map(item => ({
    metric: item.metric,
    Resilience: item.resilience * 100,
    Adaptability: item.adaptability * 100,
    Stability: item.stability * 100,
  }));

  // Risk assessment colors
  const getRiskColor = (value: number) => {
    if (value > 0.7) return '#10B981'; // Green - Low risk
    if (value > 0.4) return '#F59E0B'; // Yellow - Medium risk
    return '#EF4444'; // Red - High risk
  };

  return (
    <div className="space-y-8">
      {/* Socio-Ecological Balance Radar */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🕸️ System Resilience Matrix
        </h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="metric" 
                className="text-sm font-medium"
                tick={{ fontSize: 12, fill: '#374151' }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]}
                className="text-xs"
                tick={{ fontSize: 10, fill: '#6b7280' }}
              />
              <Radar
                name="Resilience"
                dataKey="Resilience"
                stroke="#5AC48C"
                fill="#5AC48C"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Adaptability"
                dataKey="Adaptability"
                stroke="#A8E6CF"
                fill="#A8E6CF"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Stability"
                dataKey="Stability"
                stroke="#34D399"
                fill="#34D399"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sesGreen"></span>
            <span>Resilience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-coolMint"></span>
            <span>Adaptability</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span>Stability</span>
          </div>
        </div>
      </div>

      {/* Risk Assessment Traffic Light Grid */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🚦 Risk Assessment Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sesData.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="font-semibold text-gray-800 mb-3">{item.metric}</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resilience</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getRiskColor(item.resilience) }}
                    ></div>
                    <span className="text-sm font-medium">
                      {(item.resilience * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Adaptability</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getRiskColor(item.adaptability) }}
                    ></div>
                    <span className="text-sm font-medium">
                      {(item.adaptability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stability</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getRiskColor(item.stability) }}
                    ></div>
                    <span className="text-sm font-medium">
                      {(item.stability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Risk Legend */}
        <div className="flex gap-6 mt-4 text-sm justify-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Low Risk (70%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Medium Risk (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>High Risk (&lt;40%)</span>
          </div>
        </div>
      </div>

      {/* Theoretical Context */}
      <div className="bg-sesGreen/10 border border-sesGreen/20 rounded-lg p-4">
        <h4 className="font-semibold text-sesGreen mb-2 flex items-center gap-2">
          🌱 Socio-Ecological Systems Theory
        </h4>
        <p className="text-sm text-gray-700">
          This lens examines your narrative through the framework of coupled human-natural systems, 
          focusing on resilience, adaptability, and the capacity to persist through change while 
          maintaining essential functions and identity.
        </p>
      </div>
    </div>
  );
}