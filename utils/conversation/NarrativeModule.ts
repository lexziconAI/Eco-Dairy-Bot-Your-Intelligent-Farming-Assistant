import { LivingStory, AnteNarrative, GrandNarrativeConnection } from './PersistedMemory';

export interface BojeAnalysis {
  livingStories: LivingStory[];
  anteNarratives: AnteNarrative[];
  grandNarratives: GrandNarrativeConnection[];
  narrativeGaps: NarrativeGap[];
  storyConnections: StoryConnection[];
}

export interface NarrativeGap {
  type: 'missing_living' | 'weak_ante' | 'disconnected_grand';
  description: string;
  suggestedPrompt: string;
}

export interface StoryConnection {
  fromId: string;
  toId: string;
  connectionType: 'evolution' | 'contradiction' | 'reinforcement';
  strength: number;
}

export class NarrativeModule {
  
  /**
   * Extract Living Stories from conversation text
   * Living Stories are concrete experiences and challenges
   */
  extractLivingStory(text: string): LivingStory | null {
    const lowerText = text.toLowerCase();
    
    // Look for past tense indicators and concrete farming experiences
    const livingStoryMarkers = [
      'last season', 'last year', 'when i', 'i tried', 'we had', 
      'my experience', 'what happened', 'i remember', 'on my farm',
      'i noticed', 'i found', 'it worked', 'it failed', 'i learned'
    ];

    const hasLivingMarker = livingStoryMarkers.some(marker => lowerText.includes(marker));
    
    if (!hasLivingMarker) return null;

    // Extract theme and emotion
    const theme = this.extractTheme(text);
    const emotion = this.extractEmotion(text);
    const outcome = this.extractOutcome(text);

    if (!theme) return null;

    return {
      id: `living_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: text.trim(),
      theme,
      emotion,
      outcome,
      timestamp: Date.now()
    };
  }

  /**
   * Detect Ante Narratives - future aspirations and possibilities
   */
  detectAnteNarrative(text: string): AnteNarrative | null {
    const lowerText = text.toLowerCase();
    
    // Look for future indicators and aspirational language
    const anteMarkers = [
      'i hope', 'i want', 'i plan', 'i\'m thinking', 'maybe we could',
      'what if', 'i\'d like to', 'in the future', 'next year', 'eventually',
      'i imagine', 'it would be great if', 'my goal is', 'i\'m hoping'
    ];

    const hasAnteMarker = anteMarkers.some(marker => lowerText.includes(marker));
    
    if (!hasAnteMarker) return null;

    // Extract aspiration and timeframe
    const aspiration = this.extractAspiration(text);
    const timeframe = this.extractTimeframe(text);
    const feasibility = this.calculateFeasibility(text);

    if (!aspiration) return null;

    return {
      id: `ante_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      aspiration,
      timeframe,
      feasibility,
      timestamp: Date.now()
    };
  }

  /**
   * Form Grand Narrative connections - universal themes
   */
  formGrandNarrative(text: string, existingStories: (LivingStory | AnteNarrative)[]): GrandNarrativeConnection | null {
    const lowerText = text.toLowerCase();
    
    // Look for universal language and broad statements
    const grandMarkers = [
      'all farmers', 'the industry', 'everyone', 'we all', 'farmers like us',
      'the farming community', 'agriculture needs', 'the future of farming',
      'sustainability is', 'climate change', 'food security', 'rural communities'
    ];

    const hasGrandMarker = grandMarkers.some(marker => lowerText.includes(marker));
    
    if (!hasGrandMarker && existingStories.length < 3) return null;

    // Identify universal theme from text and existing stories
    const theme = this.identifyUniversalTheme(text, existingStories);
    const universalTruth = this.extractUniversalTruth(text);
    const applicability = this.determineApplicability(text);

    if (!theme || !universalTruth) return null;

    return {
      id: `grand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      theme,
      universalTruth,
      applicability,
      timestamp: Date.now()
    };
  }

  /**
   * Generate prompts based on narrative gaps
   */
  narrativePromptStrategy(analysis: BojeAnalysis): string {
    const gaps = analysis.narrativeGaps;
    
    if (gaps.length === 0) {
      return "Can you tell me more about how this connects to your broader farming philosophy?";
    }

    // Prioritize gaps
    const missingLiving = gaps.find(g => g.type === 'missing_living');
    const weakAnte = gaps.find(g => g.type === 'weak_ante');
    const disconnectedGrand = gaps.find(g => g.type === 'disconnected_grand');

    // Return the most urgent prompt
    if (missingLiving) return missingLiving.suggestedPrompt;
    if (weakAnte) return weakAnte.suggestedPrompt;
    if (disconnectedGrand) return disconnectedGrand.suggestedPrompt;

    return "What specific example comes to mind when you think about this?";
  }

  /**
   * Analyze narrative collection for gaps and connections
   */
  analyzeNarrativeCollection(
    livingStories: LivingStory[],
    anteNarratives: AnteNarrative[],
    grandNarratives: GrandNarrativeConnection[]
  ): BojeAnalysis {
    const gaps: NarrativeGap[] = [];
    const connections: StoryConnection[] = [];

    // Check for missing living stories
    if (livingStories.length === 0) {
      gaps.push({
        type: 'missing_living',
        description: 'No concrete farming experiences shared yet',
        suggestedPrompt: 'Can you share a specific example from your farming experience that relates to this?'
      });
    }

    // Check for weak ante narratives
    if (anteNarratives.length === 0 && livingStories.length > 2) {
      gaps.push({
        type: 'weak_ante',
        description: 'Limited future aspirations expressed',
        suggestedPrompt: 'What would success look like for you in this area? What are you hoping to achieve?'
      });
    }

    // Check for disconnected grand narratives
    if (grandNarratives.length === 0 && (livingStories.length + anteNarratives.length) > 4) {
      gaps.push({
        type: 'disconnected_grand',
        description: 'Stories not connecting to broader themes',
        suggestedPrompt: 'How does this connect to what other farmers in your area are experiencing?'
      });
    }

    // Find story connections
    connections.push(...this.findStoryConnections(livingStories, anteNarratives, grandNarratives));

    return {
      livingStories,
      anteNarratives,
      grandNarratives,
      narrativeGaps: gaps,
      storyConnections: connections
    };
  }

  // Helper methods
  private extractTheme(text: string): string {
    const themes = [
      'feed costs', 'pasture management', 'sustainability', 'technology',
      'climate adaptation', 'financial pressure', 'community support',
      'regulations', 'animal welfare', 'efficiency', 'environmental impact'
    ];

    for (const theme of themes) {
      if (text.toLowerCase().includes(theme.toLowerCase())) {
        return theme;
      }
    }

    // Extract key nouns as theme fallback
    const words = text.split(/\s+/);
    const keyWords = words.filter(word => word.length > 4 && !['that', 'with', 'have', 'been', 'this'].includes(word.toLowerCase()));
    
    return keyWords.length > 0 ? keyWords[0].toLowerCase() : 'farming challenge';
  }

  private extractEmotion(text: string): string {
    const emotions = [
      { words: ['frustrated', 'angry', 'annoyed'], emotion: 'frustration' },
      { words: ['excited', 'enthusiastic', 'thrilled'], emotion: 'excitement' },
      { words: ['worried', 'concerned', 'anxious'], emotion: 'concern' },
      { words: ['hopeful', 'optimistic', 'positive'], emotion: 'hope' },
      { words: ['satisfied', 'pleased', 'happy'], emotion: 'satisfaction' },
      { words: ['confused', 'uncertain', 'unsure'], emotion: 'uncertainty' }
    ];

    const lowerText = text.toLowerCase();
    
    for (const { words, emotion } of emotions) {
      if (words.some(word => lowerText.includes(word))) {
        return emotion;
      }
    }

    return 'neutral';
  }

  private extractOutcome(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('worked') || lowerText.includes('successful') || lowerText.includes('good result')) {
      return 'positive';
    }
    if (lowerText.includes('failed') || lowerText.includes('didn\'t work') || lowerText.includes('problem')) {
      return 'negative';
    }
    if (lowerText.includes('mixed') || lowerText.includes('partly')) {
      return 'mixed';
    }
    
    return 'ongoing';
  }

  private extractAspiration(text: string): string {
    // Simple extraction - look for content after future markers
    const futureMarkers = ['i want to', 'i hope to', 'i plan to', 'i\'d like to'];
    const lowerText = text.toLowerCase();
    
    for (const marker of futureMarkers) {
      const index = lowerText.indexOf(marker);
      if (index !== -1) {
        const aspirationText = text.substring(index + marker.length).split('.')[0];
        return aspirationText.trim();
      }
    }
    
    return text.substring(0, 100).trim(); // Fallback to first part of text
  }

  private extractTimeframe(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('next season') || lowerText.includes('this year')) return 'short-term';
    if (lowerText.includes('next year') || lowerText.includes('soon')) return 'medium-term';
    if (lowerText.includes('eventually') || lowerText.includes('in the future')) return 'long-term';
    
    return 'unspecified';
  }

  private calculateFeasibility(text: string): number {
    const lowerText = text.toLowerCase();
    
    // Positive feasibility indicators
    let score = 0.5; // baseline
    
    if (lowerText.includes('plan') || lowerText.includes('budget')) score += 0.2;
    if (lowerText.includes('already') || lowerText.includes('started')) score += 0.3;
    if (lowerText.includes('simple') || lowerText.includes('easy')) score += 0.1;
    
    // Negative feasibility indicators
    if (lowerText.includes('expensive') || lowerText.includes('costly')) score -= 0.2;
    if (lowerText.includes('difficult') || lowerText.includes('challenging')) score -= 0.1;
    if (lowerText.includes('maybe') || lowerText.includes('might')) score -= 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private identifyUniversalTheme(text: string, existingStories: (LivingStory | AnteNarrative)[]): string {
    // Look for themes that appear across multiple stories
    const allTexts = [text, ...existingStories.map(s => 'content' in s ? s.content : s.aspiration)].join(' ');
    const lowerText = allTexts.toLowerCase();
    
    const universalThemes = [
      'sustainability transition',
      'economic pressure',
      'climate adaptation',
      'community resilience',
      'technological adoption',
      'generational farming',
      'environmental stewardship'
    ];

    for (const theme of universalThemes) {
      const words = theme.split(' ');
      if (words.every(word => lowerText.includes(word))) {
        return theme;
      }
    }

    return 'farming evolution';
  }

  private extractUniversalTruth(text: string): string {
    // Look for statements about universal conditions
    const statements = text.split(/[.!?]+/);
    
    for (const statement of statements) {
      const lowerStmt = statement.toLowerCase();
      if (lowerStmt.includes('all farmers') || lowerStmt.includes('everyone') || lowerStmt.includes('the industry')) {
        return statement.trim();
      }
    }
    
    return 'Farming requires continuous adaptation to changing conditions';
  }

  private determineApplicability(text: string): 'local' | 'regional' | 'universal' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('everywhere') || lowerText.includes('all farmers') || lowerText.includes('globally')) {
      return 'universal';
    }
    if (lowerText.includes('region') || lowerText.includes('state') || lowerText.includes('country')) {
      return 'regional';
    }
    
    return 'local';
  }

  private findStoryConnections(
    livingStories: LivingStory[],
    anteNarratives: AnteNarrative[],
    grandNarratives: GrandNarrativeConnection[]
  ): StoryConnection[] {
    const connections: StoryConnection[] = [];
    const allStories = [...livingStories, ...anteNarratives, ...grandNarratives];

    // Find theme-based connections
    for (let i = 0; i < allStories.length; i++) {
      for (let j = i + 1; j < allStories.length; j++) {
        const storyA = allStories[i];
        const storyB = allStories[j];
        
        const connection = this.analyzeStoryConnection(storyA, storyB);
        if (connection) {
          connections.push(connection);
        }
      }
    }

    return connections;
  }

  private analyzeStoryConnection(storyA: any, storyB: any): StoryConnection | null {
    const textA = ('content' in storyA ? storyA.content : storyA.aspiration || storyA.universalTruth).toLowerCase();
    const textB = ('content' in storyB ? storyB.content : storyB.aspiration || storyB.universalTruth).toLowerCase();

    // Simple keyword overlap analysis
    const wordsA = textA.split(/\s+/).filter((w: string) => w.length > 3);
    const wordsB = textB.split(/\s+/).filter((w: string) => w.length > 3);
    
    const overlap = wordsA.filter((word: string) => wordsB.includes(word)).length;
    const strength = overlap / Math.max(wordsA.length, wordsB.length);

    if (strength > 0.2) {
      return {
        fromId: storyA.id,
        toId: storyB.id,
        connectionType: 'reinforcement',
        strength
      };
    }

    return null;
  }
}