import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { OrientationMatrix } from '@/utils/conversation/MatrixComparison';

interface OrientationEvolutionRadarProps {
  startOrientation: OrientationMatrix;
  currentOrientation: OrientationMatrix;
  title?: string;
}

export default function OrientationEvolutionRadar({ 
  startOrientation, 
  currentOrientation,
  title = "Orientation Evolution - 6-Axis Analysis"
}: OrientationEvolutionRadarProps) {
  
  // Transform orientation data for radar chart
  const radarData = [
    {
      axis: 'Personal-Reluctant',
      start: Math.round(startOrientation.personalReluctant * 100),
      current: Math.round(currentOrientation.personalReluctant * 100),
      fullName: 'Personal Focus + Reluctant'
    },
    {
      axis: 'Personal-Open',
      start: Math.round(startOrientation.personalNotReluctant * 100),
      current: Math.round(currentOrientation.personalNotReluctant * 100),
      fullName: 'Personal Focus + Not Reluctant'
    },
    {
      axis: 'Community-Reluctant',
      start: Math.round(startOrientation.personalOtherReluctant * 100),
      current: Math.round(currentOrientation.personalOtherReluctant * 100),
      fullName: 'Community Focus + Reluctant'
    },
    {
      axis: 'Community-Open',
      start: Math.round(startOrientation.personalOtherNotReluctant * 100),
      current: Math.round(currentOrientation.personalOtherNotReluctant * 100),
      fullName: 'Community Focus + Not Reluctant'
    },
    {
      axis: 'Climate-Reluctant',
      start: Math.round(startOrientation.personalClimateReluctant * 100),
      current: Math.round(currentOrientation.personalClimateReluctant * 100),
      fullName: 'Climate Focus + Reluctant'
    },
    {
      axis: 'Climate-Open',
      start: Math.round(startOrientation.personalClimateNotReluctant * 100),
      current: Math.round(currentOrientation.personalClimateNotReluctant * 100),
      fullName: 'Climate Focus + Not Reluctant'
    }
  ];

  // Calculate the dominant orientation
  const getDominantOrientation = (matrix: OrientationMatrix) => {
    const orientations = {
      'Personal-Reluctant': matrix.personalReluctant,
      'Personal-Open': matrix.personalNotReluctant,
      'Community-Reluctant': matrix.personalOtherReluctant,
      'Community-Open': matrix.personalOtherNotReluctant,
      'Climate-Reluctant': matrix.personalClimateReluctant,
      'Climate-Open': matrix.personalClimateNotReluctant
    };
    
    return Object.entries(orientations).reduce((a, b) => 
      orientations[a[0] as keyof typeof orientations] > orientations[b[0] as keyof typeof orientations] ? a : b
    )[0];
  };

  const startDominant = getDominantOrientation(startOrientation);
  const currentDominant = getDominantOrientation(currentOrientation);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          🎯 {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Six-dimensional analysis of your farming perspective evolution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis 
                  dataKey="axis" 
                  tick={{ fontSize: 11, fill: '#374151' }}
                  className="text-xs"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                />
                
                {/* Start position */}
                <Radar
                  name="Initial"
                  dataKey="start"
                  stroke="#94A3B8"
                  fill="#94A3B8"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: '#94A3B8', strokeWidth: 1, r: 3 }}
                />
                
                {/* Current position */}
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                />
                
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Orientation Shift</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-blue-700">Initial:</span>
                <div className="font-medium text-blue-900">{startDominant}</div>
              </div>
              <div>
                <span className="text-blue-700">Current:</span>
                <div className="font-medium text-blue-900">{currentDominant}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Key Insights</h4>
            <div className="space-y-2 text-sm text-gray-600">
              {radarData.map((item, index) => {
                const change = item.current - item.start;
                if (Math.abs(change) > 10) {
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {change > 0 ? '+' : ''}{change}%
                      </span>
                      <span className="text-xs">{item.axis}</span>
                    </div>
                  );
                }
                return null;
              }).filter(Boolean)}
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-800 text-sm mb-1">Understanding the Axes</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• <strong>Personal:</strong> Individual farm decisions</li>
              <li>• <strong>Community:</strong> Collective/industry considerations</li>
              <li>• <strong>Climate:</strong> Environmental focus</li>
              <li>• <strong>Open/Reluctant:</strong> Readiness for change</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}