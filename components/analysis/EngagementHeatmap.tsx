import React from 'react';
import { EngagementDepthMatrix } from '@/utils/conversation/MatrixComparison';

interface EngagementHeatmapProps {
  data: Array<{
    timestamp: number;
    engagement: EngagementDepthMatrix;
  }>;
  title?: string;
}

interface HeatmapCell {
  timestamp: number;
  step: number;
  emotionalScore: number;
  practicalScore: number;
  supportScore: number;
  overallScore: number;
}

export default function EngagementHeatmap({ 
  data, 
  title = "Engagement Heatmap - Interaction Intensity Over Time" 
}: EngagementHeatmapProps) {
  
  // Transform engagement data into heatmap cells
  const heatmapData: HeatmapCell[] = data.map((item, index) => {
    const emotional = { low: 1, medium: 2, high: 3 }[item.engagement.emotionalInvestment];
    const practical = { exploring: 1, planning: 2, acting: 3 }[item.engagement.practicalReadiness];
    const support = { information: 1, validation: 2, resources: 3 }[item.engagement.supportNeeds];
    
    return {
      timestamp: item.timestamp,
      step: index + 1,
      emotionalScore: emotional,
      practicalScore: practical,
      supportScore: support,
      overallScore: (emotional + practical + support) / 3
    };
  });

  // Get color intensity based on score
  const getHeatColor = (score: number, maxScore: number = 3) => {
    const intensity = score / maxScore;
    const alpha = Math.max(0.1, intensity);
    
    if (intensity >= 0.8) return `rgba(239, 68, 68, ${alpha})`; // Red - High
    if (intensity >= 0.6) return `rgba(245, 158, 11, ${alpha})`; // Orange - Medium-High
    if (intensity >= 0.4) return `rgba(59, 130, 246, ${alpha})`; // Blue - Medium
    return `rgba(156, 163, 175, ${alpha})`; // Gray - Low
  };

  const getEngagementLabel = (score: number) => {
    if (score >= 2.5) return 'Very High';
    if (score >= 2) return 'High';
    if (score >= 1.5) return 'Medium';
    return 'Low';
  };

  // Calculate peak engagement moments
  const peakMoments = heatmapData
    .filter(cell => cell.overallScore >= 2.5)
    .map(cell => cell.step);

  const averageEngagement = heatmapData.length > 0 
    ? heatmapData.reduce((sum, cell) => sum + cell.overallScore, 0) / heatmapData.length 
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          🔥 {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Color intensity shows engagement levels across emotional, practical, and support dimensions
        </p>
      </div>

      {heatmapData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No engagement data available yet. Start a conversation to see the heatmap!
        </div>
      ) : (
        <div className="space-y-6">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Headers */}
              <div className="grid grid-cols-5 gap-2 mb-2">
                <div className="text-sm font-medium text-gray-600 p-2">Step</div>
                <div className="text-sm font-medium text-gray-600 p-2">Emotional</div>
                <div className="text-sm font-medium text-gray-600 p-2">Practical</div>
                <div className="text-sm font-medium text-gray-600 p-2">Support</div>
                <div className="text-sm font-medium text-gray-600 p-2">Overall</div>
              </div>

              {/* Heatmap Rows */}
              {heatmapData.map((cell) => (
                <div key={cell.step} className="grid grid-cols-5 gap-2 mb-1">
                  {/* Step Number */}
                  <div className="p-3 bg-gray-100 rounded text-center text-sm font-medium">
                    {cell.step}
                  </div>

                  {/* Emotional Investment */}
                  <div 
                    className="p-3 rounded text-center text-sm font-medium text-white"
                    style={{ backgroundColor: getHeatColor(cell.emotionalScore) }}
                  >
                    {cell.emotionalScore}/3
                  </div>

                  {/* Practical Readiness */}
                  <div 
                    className="p-3 rounded text-center text-sm font-medium text-white"
                    style={{ backgroundColor: getHeatColor(cell.practicalScore) }}
                  >
                    {cell.practicalScore}/3
                  </div>

                  {/* Support Needs */}
                  <div 
                    className="p-3 rounded text-center text-sm font-medium text-white"
                    style={{ backgroundColor: getHeatColor(cell.supportScore) }}
                  >
                    {cell.supportScore}/3
                  </div>

                  {/* Overall Score */}
                  <div 
                    className="p-3 rounded text-center text-sm font-bold text-white"
                    style={{ backgroundColor: getHeatColor(cell.overallScore) }}
                  >
                    {getEngagementLabel(cell.overallScore)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Stats */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Engagement Summary</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-purple-700">Average Level:</span>
                  <div className="font-medium text-purple-900">
                    {getEngagementLabel(averageEngagement)} ({averageEngagement.toFixed(1)}/3)
                  </div>
                </div>
                <div>
                  <span className="text-purple-700">Peak Moments:</span>
                  <div className="font-medium text-purple-900">
                    {peakMoments.length > 0 ? `Steps ${peakMoments.join(', ')}` : 'None yet'}
                  </div>
                </div>
              </div>
            </div>

            {/* Trends */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Engagement Trends</h4>
              <div className="space-y-2 text-sm">
                {heatmapData.length >= 3 && (
                  <>
                    <div>
                      <span className="text-blue-700">Direction:</span>
                      <div className="font-medium text-blue-900">
                        {heatmapData[heatmapData.length - 1].overallScore > heatmapData[0].overallScore 
                          ? '📈 Increasing' : '📉 Decreasing'}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Most Active Dimension:</span>
                      <div className="font-medium text-blue-900">
                        {heatmapData.reduce((max, cell) => {
                          if (cell.emotionalScore >= cell.practicalScore && cell.emotionalScore >= cell.supportScore) return 'Emotional';
                          if (cell.practicalScore >= cell.supportScore) return 'Practical';
                          return 'Support';
                        }, 'Emotional')}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Engagement Insights</h4>
              <div className="text-sm text-green-700">
                {averageEngagement >= 2.5 ? (
                  <p>🌟 Excellent engagement! You're actively participating and ready for deeper discussions.</p>
                ) : averageEngagement >= 2 ? (
                  <p>👍 Good engagement level. Consider sharing more specific examples or questions.</p>
                ) : averageEngagement >= 1.5 ? (
                  <p>💡 Moderate engagement. Try exploring topics that particularly interest you.</p>
                ) : (
                  <p>🤔 Low engagement detected. Consider what topics or questions would be most valuable to you.</p>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Understanding the Heatmap</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Emotional Investment:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>1 = Low emotional involvement</li>
                  <li>2 = Moderate care/concern</li>
                  <li>3 = High emotional investment</li>
                </ul>
              </div>
              <div>
                <strong>Practical Readiness:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>1 = Exploring options</li>
                  <li>2 = Planning implementation</li>
                  <li>3 = Ready to act</li>
                </ul>
              </div>
              <div>
                <strong>Support Needs:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>1 = Need information</li>
                  <li>2 = Seeking validation</li>
                  <li>3 = Require resources</li>
                </ul>
              </div>
            </div>
            
            {/* Color Legend */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-600">Intensity:</span>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatColor(1) }}></div>
                <span className="text-xs">Low</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatColor(2) }}></div>
                <span className="text-xs">Medium</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatColor(3) }}></div>
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}