'use client'

import React from 'react';

interface PhilosophicalAnalysisData {
  sustainabilityPhilosophy: {
    philosophicalDepth: number;
    intellectualCuriosity: number;
    systemicThinking: number;
    coreBeliefs: Array<{
      category: string;
      belief: string;
      confidence: number;
    }>;
    valueSystem: {
      primaryValues: string[];
      valueConflicts: Array<{
        tension: string;
        dialecticalPotential: number;
      }>;
      moralComplexity: number;
    };
    dialecticalTensions: Array<{
      thesis: string;
      antithesis: string;
      readinessForSynthesis: number;
      philosophicalImportance: number;
    }>;
  };
  sesAnalysis: {
    systemResilience: number;
    transformationPotential: number;
  };
  chaosAnalysis: {
    systemStability: number;
    adaptiveCapacity: number;
    systemState: {
      phase: string;
      energy: number;
      entropy: number;
      coherence: number;
    };
  };
  intellectualEngagementStrategy: {
    level: string;
    approach: string;
    techniques: string[];
    pacing: string;
  };
  philosophicalChallenges: Array<{
    category: string;
    challenge: string;
    readiness: number;
  }>;
  dialecticalOpportunities: Array<{
    tension: string;
    timing: string;
    growthPotential: number;
  }>;
}

interface Props {
  data: PhilosophicalAnalysisData | null;
  title?: string;
}

export default function PhilosophicalAnalysisChart({ data, title = "Philosophical Analysis" }: Props) {
  if (!data) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500">No philosophical analysis data available yet.</p>
      </div>
    );
  }

  const { sustainabilityPhilosophy, sesAnalysis, chaosAnalysis, intellectualEngagementStrategy, philosophicalChallenges, dialecticalOpportunities } = data;

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
      
      {/* Philosophical Development Metrics */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">🧠 Philosophical Development</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Philosophical Depth</div>
            <div className="flex items-center mt-2">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sustainabilityPhilosophy.philosophicalDepth * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-semibold text-blue-700">
                {(sustainabilityPhilosophy.philosophicalDepth * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Intellectual Curiosity</div>
            <div className="flex items-center mt-2">
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sustainabilityPhilosophy.intellectualCuriosity * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-semibold text-green-700">
                {(sustainabilityPhilosophy.intellectualCuriosity * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Systemic Thinking</div>
            <div className="flex items-center mt-2">
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sustainabilityPhilosophy.systemicThinking * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-semibold text-purple-700">
                {(sustainabilityPhilosophy.systemicThinking * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values and Beliefs */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">💝 Core Values & Beliefs</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-600 mb-2">Primary Values</h5>
            <div className="space-y-2">
              {sustainabilityPhilosophy.valueSystem.primaryValues.map((value, index) => (
                <div key={index} className="bg-emerald-50 px-3 py-2 rounded-md text-sm text-emerald-700">
                  {value}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-600 mb-2">Core Beliefs</h5>
            <div className="space-y-2">
              {sustainabilityPhilosophy.coreBeliefs.slice(0, 3).map((belief, index) => (
                <div key={index} className="bg-indigo-50 px-3 py-2 rounded-md">
                  <div className="text-sm text-indigo-700">{belief.belief}</div>
                  <div className="text-xs text-indigo-500 mt-1">
                    {belief.category} • {(belief.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialectical Tensions */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">⚖️ Dialectical Tensions</h4>
        <div className="space-y-4">
          {sustainabilityPhilosophy.dialecticalTensions.slice(0, 3).map((tension, index) => (
            <div key={index} className="border-l-4 border-orange-400 pl-4 bg-orange-50 p-4 rounded-r-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-orange-600">Thesis</div>
                  <div className="text-sm text-orange-800">{tension.thesis}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-600">Antithesis</div>
                  <div className="text-sm text-orange-800">{tension.antithesis}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-xs text-orange-600">
                <span>Synthesis Readiness: {(tension.readinessForSynthesis * 100).toFixed(0)}%</span>
                <span>Philosophical Importance: {(tension.philosophicalImportance * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Systems Analysis */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">🌐 Systems Analysis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {(sesAnalysis.systemResilience * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-blue-700">System Resilience</div>
          </div>
          
          <div className="text-center bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(sesAnalysis.transformationPotential * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-green-700">Transformation Potential</div>
          </div>
          
          <div className="text-center bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(chaosAnalysis.systemStability * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-purple-700">System Stability</div>
          </div>
          
          <div className="text-center bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {(chaosAnalysis.adaptiveCapacity * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-orange-700">Adaptive Capacity</div>
          </div>
        </div>
      </div>

      {/* System State Visualization */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">📊 Current System State</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Phase</div>
              <div className="font-semibold text-gray-800 capitalize">{chaosAnalysis.systemState.phase}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Energy</div>
              <div className="font-semibold text-gray-800">{(chaosAnalysis.systemState.energy * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Entropy</div>
              <div className="font-semibold text-gray-800">{(chaosAnalysis.systemState.entropy * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Coherence</div>
              <div className="font-semibold text-gray-800">{(chaosAnalysis.systemState.coherence * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Strategy */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">🎯 Intellectual Engagement Strategy</h4>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-600">Level</div>
              <div className="font-semibold text-slate-800 capitalize">{intellectualEngagementStrategy.level}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Approach</div>
              <div className="font-semibold text-slate-800 capitalize">{intellectualEngagementStrategy.approach}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Pacing</div>
              <div className="font-semibold text-slate-800 capitalize">{intellectualEngagementStrategy.pacing}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Techniques</div>
              <div className="text-xs text-slate-700">{intellectualEngagementStrategy.techniques.slice(0, 2).join(', ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophical Challenges */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">🤔 Philosophical Challenges</h4>
        <div className="space-y-3">
          {philosophicalChallenges.slice(0, 3).map((challenge, index) => (
            <div key={index} className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm font-medium text-amber-700 capitalize">{challenge.category}</div>
                  <div className="text-sm text-amber-800 mt-1">{challenge.challenge}</div>
                </div>
                <div className="text-xs text-amber-600 ml-4">
                  Readiness: {(challenge.readiness * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialectical Opportunities */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-4">🚀 Growth Opportunities</h4>
        <div className="space-y-3">
          {dialecticalOpportunities.slice(0, 3).map((opportunity, index) => (
            <div key={index} className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-teal-800">{opportunity.tension}</div>
                </div>
                <div className="text-xs text-teal-600 ml-4 text-right">
                  <div>Timing: {opportunity.timing}</div>
                  <div>Growth Potential: {(opportunity.growthPotential * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}