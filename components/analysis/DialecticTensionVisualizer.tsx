import React, { useEffect, useState } from 'react';
import { DialecticalTensionMatrix } from '@/utils/conversation/MatrixComparison';

interface DialecticTensionVisualizerProps {
  data: DialecticalTensionMatrix[];
  title?: string;
}

export default function DialecticTensionVisualizer({ 
  data, 
  title = "Dialectical Tension Dynamics"
}: DialecticTensionVisualizerProps) {
  const [animationStep, setAnimationStep] = useState(0);
  
  // Use the latest data point, or default values
  const latestData = data.length > 0 ? data[data.length - 1] : {
    thesisStrength: 0.5,
    antithesisPresence: 0.3,
    synthesisReadiness: 0.2
  };

  // Animation effect for pulsing
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate circle properties
  const baseSize = 100;
  const thesisSize = baseSize + (latestData.thesisStrength * 80);
  const antithesisSize = baseSize + (latestData.antithesisPresence * 80);
  const synthesisSize = baseSize + (latestData.synthesisReadiness * 80);

  // Calculate overlap areas
  const thesisAntithesisOverlap = Math.min(latestData.thesisStrength, latestData.antithesisPresence) * 100;
  const overallSynthesis = (latestData.thesisStrength + latestData.antithesisPresence + latestData.synthesisReadiness) / 3;

  // Pulsing effect for active conflicts
  const pulseIntensity = Math.sin(animationStep * 0.3) * 0.1 + 1;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          ⚖️ {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Three interconnected forces: Current Position, Opposing Forces, and Potential Resolution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization */}
        <div className="relative">
          <svg 
            width="100%" 
            height="300" 
            viewBox="0 0 400 300" 
            className="overflow-visible"
          >
            <defs>
              {/* Gradients for circles */}
              <radialGradient id="thesisGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.2 }} />
              </radialGradient>
              <radialGradient id="antithesisGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: '#EF4444', stopOpacity: 0.2 }} />
              </radialGradient>
              <radialGradient id="synthesisGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0.2 }} />
              </radialGradient>
            </defs>

            {/* Thesis Circle (Current Position) */}
            <circle
              cx="140"
              cy="120"
              r={thesisSize / 2}
              fill="url(#thesisGrad)"
              stroke="#3B82F6"
              strokeWidth="2"
              style={{
                transform: `scale(${latestData.antithesisPresence > 0.6 ? pulseIntensity : 1})`,
                transformOrigin: "140px 120px"
              }}
            />
            <text x="140" y="125" textAnchor="middle" className="text-sm font-medium fill-blue-700">
              Thesis
            </text>

            {/* Antithesis Circle (Opposing Forces) */}
            <circle
              cx="260"
              cy="120"
              r={antithesisSize / 2}
              fill="url(#antithesisGrad)"
              stroke="#EF4444"
              strokeWidth="2"
              style={{
                transform: `scale(${latestData.antithesisPresence > 0.5 ? pulseIntensity : 1})`,
                transformOrigin: "260px 120px"
              }}
            />
            <text x="260" y="125" textAnchor="middle" className="text-sm font-medium fill-red-700">
              Antithesis
            </text>

            {/* Synthesis Circle (Resolution) */}
            <circle
              cx="200"
              cy="200"
              r={synthesisSize / 2}
              fill="url(#synthesisGrad)"
              stroke="#10B981"
              strokeWidth="2"
              style={{
                transform: `scale(${latestData.synthesisReadiness > 0.5 ? pulseIntensity : 1})`,
                transformOrigin: "200px 200px"
              }}
            />
            <text x="200" y="205" textAnchor="middle" className="text-sm font-medium fill-green-700">
              Synthesis
            </text>

            {/* Connection lines */}
            <line x1="140" y1="120" x2="260" y2="120" stroke="#6B7280" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="140" y1="120" x2="200" y2="200" stroke="#6B7280" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="260" y1="120" x2="200" y2="200" stroke="#6B7280" strokeWidth="1" strokeDasharray="5,5" />

            {/* Overlap indicator */}
            {thesisAntithesisOverlap > 20 && (
              <ellipse
                cx="200"
                cy="120"
                rx={thesisAntithesisOverlap / 4}
                ry={thesisAntithesisOverlap / 6}
                fill="#A855F7"
                opacity="0.4"
              />
            )}
          </svg>
        </div>

        {/* Metrics Panel */}
        <div className="space-y-4">
          {/* Thesis Strength */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              🎯 Current Position Strength
            </h4>
            <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${latestData.thesisStrength * 100}%` }}
              />
            </div>
            <p className="text-sm text-blue-700">
              {(latestData.thesisStrength * 100).toFixed(0)}% - 
              {latestData.thesisStrength > 0.7 ? ' Very strong convictions' :
               latestData.thesisStrength > 0.4 ? ' Moderate confidence' : ' Open to change'}
            </p>
          </div>

          {/* Antithesis Presence */}
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
              ⚡ Opposing Forces
            </h4>
            <div className="w-full bg-red-200 rounded-full h-3 mb-2">
              <div 
                className="bg-red-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${latestData.antithesisPresence * 100}%` }}
              />
            </div>
            <p className="text-sm text-red-700">
              {(latestData.antithesisPresence * 100).toFixed(0)}% - 
              {latestData.antithesisPresence > 0.6 ? ' High tension detected' :
               latestData.antithesisPresence > 0.3 ? ' Some conflicts present' : ' Minimal opposition'}
            </p>
          </div>

          {/* Synthesis Readiness */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
              🌱 Resolution Readiness
            </h4>
            <div className="w-full bg-green-200 rounded-full h-3 mb-2">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${latestData.synthesisReadiness * 100}%` }}
              />
            </div>
            <p className="text-sm text-green-700">
              {(latestData.synthesisReadiness * 100).toFixed(0)}% - 
              {latestData.synthesisReadiness > 0.6 ? ' Ready for integration' :
               latestData.synthesisReadiness > 0.3 ? ' Moving toward resolution' : ' Early exploration'}
            </p>
          </div>

          {/* Overall Assessment */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Overall Dialectical State</h4>
            <p className="text-sm text-purple-700">
              {overallSynthesis > 0.6 ? 'High integration potential - ready for breakthrough insights' :
               overallSynthesis > 0.4 ? 'Moderate tension - exploring different perspectives' :
               'Early stage - gathering information and forming opinions'}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {data.length > 1 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">Tension Evolution</h4>
          <div className="flex items-center justify-between">
            {data.slice(-5).map((point, index) => (
              <div key={index} className="text-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-green-400 mb-1" 
                     style={{ 
                       opacity: 0.3 + (point.synthesisReadiness * 0.7),
                       transform: `scale(${0.8 + (point.antithesisPresence * 0.4)})` 
                     }} 
                />
                <div className="text-xs text-gray-600">Step {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}