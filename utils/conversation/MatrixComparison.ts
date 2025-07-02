import { Orientation } from './DynamicPromptEngine';

// Four matrices as specified in the Enhanced MVP spec
export interface OrientationMatrix {
  personalReluctant: number;
  personalNotReluctant: number;
  personalOtherReluctant: number;
  personalOtherNotReluctant: number;
  personalClimateReluctant: number;
  personalClimateNotReluctant: number;
}

export interface DialecticalTensionMatrix {
  thesisStrength: number;
  antithesisPresence: number;
  synthesisReadiness: number;
}

export interface NarrativeEvolutionMatrix {
  storyType: 'living' | 'ante' | 'grand';
  evolutionStage: 'emerging' | 'developing' | 'converging';
  communityResonance: 'individual' | 'local' | 'universal';
}

export interface EngagementDepthMatrix {
  emotionalInvestment: 'low' | 'medium' | 'high';
  practicalReadiness: 'exploring' | 'planning' | 'acting';
  supportNeeds: 'information' | 'validation' | 'resources';
}

export interface MatrixAnalysis {
  orientationMatrix: OrientationMatrix;
  dialecticalMatrix: DialecticalTensionMatrix;
  narrativeMatrix: NarrativeEvolutionMatrix;
  engagementMatrix: EngagementDepthMatrix;
  timestamp: number;
}

export class MatrixComparison {
  private analysisHistory: MatrixAnalysis[] = [];

  analyzeConversation(
    conversationText: string,
    detectedClues: any
  ): MatrixAnalysis {
    const analysis: MatrixAnalysis = {
      orientationMatrix: this.calculateOrientationMatrix(conversationText, detectedClues),
      dialecticalMatrix: this.calculateDialecticalMatrix(conversationText, detectedClues),
      narrativeMatrix: this.calculateNarrativeMatrix(conversationText),
      engagementMatrix: this.calculateEngagementMatrix(conversationText, detectedClues),
      timestamp: Date.now()
    };

    this.analysisHistory.push(analysis);
    return analysis;
  }

  private calculateOrientationMatrix(text: string, clues: any): OrientationMatrix {
    const lowerText = text.toLowerCase();
    
    // Personal focus indicators
    const personalMarkers = ['my farm', 'i want', 'i need', 'my situation', 'for me'];
    const personalScore = personalMarkers.filter(m => lowerText.includes(m)).length / personalMarkers.length;

    // Community/other focus indicators
    const communityMarkers = ['other farmers', 'community', 'neighbors', 'everyone', 'we should'];
    const communityScore = communityMarkers.filter(m => lowerText.includes(m)).length / communityMarkers.length;

    // Climate focus indicators
    const climateMarkers = ['environment', 'climate', 'sustainability', 'carbon', 'emissions'];
    const climateScore = climateMarkers.filter(m => lowerText.includes(m)).length / climateMarkers.length;

    // Reluctance indicators
    const reluctanceMarkers = ['not sure', 'worried', 'concerned', 'expensive', 'risky', 'difficult'];
    const reluctanceScore = reluctanceMarkers.filter(m => lowerText.includes(m)).length / reluctanceMarkers.length;

    // Calculate matrix values (normalized 0-1)
    return {
      personalReluctant: Math.min(personalScore + reluctanceScore, 1),
      personalNotReluctant: Math.min(personalScore + (1 - reluctanceScore), 1),
      personalOtherReluctant: Math.min(communityScore + reluctanceScore, 1),
      personalOtherNotReluctant: Math.min(communityScore + (1 - reluctanceScore), 1),
      personalClimateReluctant: Math.min(climateScore + reluctanceScore, 1),
      personalClimateNotReluctant: Math.min(climateScore + (1 - reluctanceScore), 1)
    };
  }

  private calculateDialecticalMatrix(text: string, clues: any): DialecticalTensionMatrix {
    const lowerText = text.toLowerCase();

    // Thesis strength - how strongly current position is held
    const certaintyMarkers = ['definitely', 'absolutely', 'always', 'never', 'must'];
    const thesisStrength = Math.min(
      certaintyMarkers.filter(m => lowerText.includes(m)).length / 5, 1
    );

    // Antithesis presence - opposing forces or contradictions
    const contradictionCount = clues.contradictionFlags?.length || 0;
    const conflictMarkers = ['but', 'however', 'although', 'on the other hand'];
    const antithesisPresence = Math.min(
      (contradictionCount + conflictMarkers.filter(m => lowerText.includes(m)).length) / 5, 1
    );

    // Synthesis readiness - openness to resolution
    const opensMarkers = ['maybe', 'could try', 'might work', 'open to', 'willing'];
    const synthesisReadiness = Math.min(
      opensMarkers.filter(m => lowerText.includes(m)).length / 5, 1
    );

    return {
      thesisStrength,
      antithesisPresence,
      synthesisReadiness
    };
  }

  private calculateNarrativeMatrix(text: string): NarrativeEvolutionMatrix {
    const lowerText = text.toLowerCase();

    // Story type detection
    let storyType: 'living' | 'ante' | 'grand' = 'living';
    if (lowerText.includes('hope') || lowerText.includes('plan') || lowerText.includes('future')) {
      storyType = 'ante';
    }
    if (lowerText.includes('everyone') || lowerText.includes('industry') || lowerText.includes('all farmers')) {
      storyType = 'grand';
    }

    // Evolution stage
    let evolutionStage: 'emerging' | 'developing' | 'converging' = 'emerging';
    if (text.split('.').length > 3) { // Multiple sentences suggest development
      evolutionStage = 'developing';
    }
    const convergenceMarkers = ['conclusion', 'realize', 'understand', 'clear'];
    if (convergenceMarkers.some(m => lowerText.includes(m))) {
      evolutionStage = 'converging';
    }

    // Community resonance
    let communityResonance: 'individual' | 'local' | 'universal' = 'individual';
    if (lowerText.includes('neighbors') || lowerText.includes('area') || lowerText.includes('local')) {
      communityResonance = 'local';
    }
    if (lowerText.includes('everyone') || lowerText.includes('all') || lowerText.includes('industry')) {
      communityResonance = 'universal';
    }

    return {
      storyType,
      evolutionStage,
      communityResonance
    };
  }

  private calculateEngagementMatrix(text: string, clues: any): EngagementDepthMatrix {
    const lowerText = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;

    // Emotional investment
    const emotionMarkers = clues.linguisticMarkers?.filter((m: any) => m.type === 'emotion') || [];
    let emotionalInvestment: 'low' | 'medium' | 'high' = 'low';
    if (emotionMarkers.length > 2 || wordCount > 100) {
      emotionalInvestment = 'high';
    } else if (emotionMarkers.length > 0 || wordCount > 50) {
      emotionalInvestment = 'medium';
    }

    // Practical readiness
    let practicalReadiness: 'exploring' | 'planning' | 'acting' = 'exploring';
    const planningMarkers = ['plan', 'timeline', 'budget', 'steps'];
    const actionMarkers = ['doing', 'started', 'implementing', 'already'];
    
    if (actionMarkers.some(m => lowerText.includes(m))) {
      practicalReadiness = 'acting';
    } else if (planningMarkers.some(m => lowerText.includes(m))) {
      practicalReadiness = 'planning';
    }

    // Support needs
    let supportNeeds: 'information' | 'validation' | 'resources' = 'information';
    const validationMarkers = ['right', 'correct', 'good idea', 'makes sense'];
    const resourceMarkers = ['help', 'funding', 'support', 'assistance'];
    
    if (resourceMarkers.some(m => lowerText.includes(m))) {
      supportNeeds = 'resources';
    } else if (validationMarkers.some(m => lowerText.includes(m))) {
      supportNeeds = 'validation';
    }

    return {
      emotionalInvestment,
      practicalReadiness,
      supportNeeds
    };
  }

  getEvolutionSeries(): MatrixAnalysis[] {
    return [...this.analysisHistory];
  }

  compareMatrices(index1: number, index2: number): {
    orientationShift: number;
    dialecticalProgression: number;
    narrativeEvolution: boolean;
    engagementChange: number;
  } {
    if (index1 >= this.analysisHistory.length || index2 >= this.analysisHistory.length) {
      throw new Error('Invalid matrix indices');
    }

    const matrix1 = this.analysisHistory[index1];
    const matrix2 = this.analysisHistory[index2];

    // Calculate orientation shift (Euclidean distance)
    const orientationShift = Math.sqrt(
      Object.keys(matrix1.orientationMatrix).reduce((sum, key) => {
        const k = key as keyof OrientationMatrix;
        const diff = matrix2.orientationMatrix[k] - matrix1.orientationMatrix[k];
        return sum + diff * diff;
      }, 0)
    );

    // Calculate dialectical progression
    const dialecticalProgression = (
      (matrix2.dialecticalMatrix.synthesisReadiness - matrix1.dialecticalMatrix.synthesisReadiness) +
      (matrix1.dialecticalMatrix.antithesisPresence - matrix2.dialecticalMatrix.antithesisPresence)
    ) / 2;

    // Check narrative evolution
    const narrativeEvolution = (
      matrix2.narrativeMatrix.evolutionStage !== matrix1.narrativeMatrix.evolutionStage ||
      matrix2.narrativeMatrix.communityResonance !== matrix1.narrativeMatrix.communityResonance
    );

    // Calculate engagement change
    const engagementLevels = { low: 1, medium: 2, high: 3, exploring: 1, planning: 2, acting: 3, information: 1, validation: 2, resources: 3 };
    const engagementChange = (
      engagementLevels[matrix2.engagementMatrix.emotionalInvestment] - 
      engagementLevels[matrix1.engagementMatrix.emotionalInvestment] +
      engagementLevels[matrix2.engagementMatrix.practicalReadiness] - 
      engagementLevels[matrix1.engagementMatrix.practicalReadiness]
    ) / 2;

    return {
      orientationShift,
      dialecticalProgression,
      narrativeEvolution,
      engagementChange
    };
  }

  getCurrentOrientation(): Orientation {
    if (this.analysisHistory.length === 0) {
      return 'P-R'; // Default
    }

    const latest = this.analysisHistory[this.analysisHistory.length - 1];
    const om = latest.orientationMatrix;

    // Find the dominant orientation
    const orientations: { [key in Orientation]: number } = {
      'P-R': om.personalReluctant,
      'P-NR': om.personalNotReluctant,
      'PO-R': om.personalOtherReluctant,
      'PO-NR': om.personalOtherNotReluctant,
      'PC-R': om.personalClimateReluctant,
      'PC-NR': om.personalClimateNotReluctant
    };

    return Object.entries(orientations).reduce((a, b) => 
      orientations[a[0] as Orientation] > orientations[b[0] as Orientation] ? a : b
    )[0] as Orientation;
  }

  reset(): void {
    this.analysisHistory = [];
  }

  // Export for visualization
  exportForVisualization(): {
    sentimentJourney: Array<{ timestamp: number; sentiment: number }>;
    orientationSeries: Array<{ timestamp: number; orientation: OrientationMatrix }>;
    dialecticData: Array<{ timestamp: number; dialectic: DialecticalTensionMatrix }>;
    narrativeGraph: Array<{ timestamp: number; narrative: NarrativeEvolutionMatrix }>;
    engagementHeat: Array<{ timestamp: number; engagement: EngagementDepthMatrix }>;
  } {
    return {
      sentimentJourney: this.analysisHistory.map((analysis, index) => ({
        timestamp: analysis.timestamp,
        sentiment: this.calculateSentimentScore(analysis)
      })),
      orientationSeries: this.analysisHistory.map(analysis => ({
        timestamp: analysis.timestamp,
        orientation: analysis.orientationMatrix
      })),
      dialecticData: this.analysisHistory.map(analysis => ({
        timestamp: analysis.timestamp,
        dialectic: analysis.dialecticalMatrix
      })),
      narrativeGraph: this.analysisHistory.map(analysis => ({
        timestamp: analysis.timestamp,
        narrative: analysis.narrativeMatrix
      })),
      engagementHeat: this.analysisHistory.map(analysis => ({
        timestamp: analysis.timestamp,
        engagement: analysis.engagementMatrix
      }))
    };
  }

  private calculateSentimentScore(analysis: MatrixAnalysis): number {
    // Calculate sentiment based on orientation and dialectical matrices
    const positiveOrientation = (
      analysis.orientationMatrix.personalNotReluctant +
      analysis.orientationMatrix.personalOtherNotReluctant +
      analysis.orientationMatrix.personalClimateNotReluctant
    ) / 3;

    const negativeOrientation = (
      analysis.orientationMatrix.personalReluctant +
      analysis.orientationMatrix.personalOtherReluctant +
      analysis.orientationMatrix.personalClimateReluctant
    ) / 3;

    const synthesisBonus = analysis.dialecticalMatrix.synthesisReadiness * 0.5;

    return Math.max(-1, Math.min(1, positiveOrientation - negativeOrientation + synthesisBonus));
  }
}