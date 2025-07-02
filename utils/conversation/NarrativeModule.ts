import { LivingStory, AnteNarrative, GrandNarrativeConnection } from './PersistedMemory';
import { DialecticalTension, EmergentNarrative } from './InferentialAnalysisEngine';

export interface BojeAnalysis {
  livingStories: LivingStory[];
  anteNarratives: AnteNarrative[];
  grandNarratives: GrandNarrativeConnection[];
  narrativeGaps: NarrativeGap[];
  storyConnections: StoryConnection[];
  quantumNarratives: QuantumNarrative[];
  narrativeCoherence: number;
  storyEvolutionPotential: number;
}

// Enhanced Quantum Storytelling Framework
export interface QuantumNarrative {
  id: string;
  type: 'superposition' | 'entanglement' | 'collapse' | 'emergence';
  description: string;
  alternativePossibilities: string[];
  observerEffect: string; // How telling the story changes it
  uncertaintyPrinciple: string; // What can't be precisely known
  quantumCoherence: number; // 0-1, how well story maintains quantum properties
  philosophicalImplications: string[];
}

export interface NarrativeArchetype {
  name: string;
  pattern: string;
  resonance: number; // 0-1, how strongly this archetype appears
  transformationalPotential: number; // 0-1, capacity for growth
  shadowElements: string[]; // Hidden or denied aspects
  giftElements: string[]; // Positive potential
}

export interface StoryEvolution {
  currentStage: 'initiation' | 'separation' | 'descent' | 'ordeal' | 'revelation' | 'transformation' | 'return';
  evolutionDirection: 'progressive' | 'regressive' | 'cyclical' | 'spiral';
  transformationCatalysts: string[];
  resistanceFactors: string[];
  nextStageReadiness: number; // 0-1
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
  private quantumNarratives: QuantumNarrative[] = [];
  private narrativeArchetypes: NarrativeArchetype[] = [];
  private storyEvolution: StoryEvolution | null = null;
  
  // Integration with philosophical analysis
  integrateWithPhilosophicalAnalysis(
    dialecticalTensions: DialecticalTension[], 
    emergentNarratives: EmergentNarrative[]
  ): void {
    // Transform dialectical tensions into quantum narratives
    dialecticalTensions.forEach(tension => {
      this.quantumNarratives.push({
        id: `quantum_${Date.now()}_${Math.random()}`,
        type: 'superposition',
        description: `Farmer exists in superposition between ${tension.thesis} and ${tension.antithesis}`,
        alternativePossibilities: [tension.thesis, tension.antithesis, tension.currentSynthesis || 'Unknown synthesis'],
        observerEffect: 'Discussing this tension may cause collapse into one position',
        uncertaintyPrinciple: 'Cannot simultaneously know exact position on both poles of tension',
        quantumCoherence: tension.readinessForSynthesis,
        philosophicalImplications: [
          'Reality as multiple simultaneous possibilities',
          'Observer participation in narrative creation',
          'Complementarity of opposing views'
        ]
      });
    });
    
    // Integrate emergent narratives with archetypal patterns
    emergentNarratives.forEach(narrative => {
      this.narrativeArchetypes.push(this.identifyArchetype(narrative));
    });
  }
  
  private identifyArchetype(emergentNarrative: EmergentNarrative): NarrativeArchetype {
    const archetypeMap = {
      'becoming': {
        name: 'The Emerging Farmer',
        pattern: 'Transformation from traditional to regenerative',
        shadowElements: ['Fear of change', 'Loss of identity'],
        giftElements: ['Adaptability', 'Innovation']
      },
      'transformation': {
        name: 'The Alchemical Steward',
        pattern: 'Transmuting challenges into wisdom',
        shadowElements: ['Perfectionism', 'Control'],
        giftElements: ['Resilience', 'Integration']
      },
      'resistance': {
        name: 'The Guardian Keeper',
        pattern: 'Protecting traditional wisdom',
        shadowElements: ['Rigidity', 'Fear'],
        giftElements: ['Stability', 'Preservation']
      },
      'integration': {
        name: 'The Bridge Builder',
        pattern: 'Synthesizing old and new ways',
        shadowElements: ['Overwhelm', 'Indecision'],
        giftElements: ['Balance', 'Wisdom']
      }
    };
    
    const baseArchetype = archetypeMap[emergentNarrative.type];
    
    return {
      ...baseArchetype,
      resonance: this.calculateArchetypeResonance(emergentNarrative),
      transformationalPotential: this.calculateTransformationPotential(emergentNarrative)
    };
  }
  
  private calculateArchetypeResonance(narrative: EmergentNarrative): number {
    // Calculate based on story fragment analysis
    const storyDepth = narrative.storyFragment.length / 100; // Rough measure
    const developmentStage = {
      'initiation': 0.3,
      'struggle': 0.6,
      'breakthrough': 0.8,
      'integration': 0.9
    }[narrative.developmentalStage];
    
    return Math.min((storyDepth + developmentStage) / 2, 1);
  }
  
  private calculateTransformationPotential(narrative: EmergentNarrative): number {
    // Higher potential if multiple future implications
    const futureRichness = narrative.futureImplications.length / 5;
    const archetypeResonance = narrative.archetypeResonance.length / 3;
    
    return Math.min((futureRichness + archetypeResonance) / 2, 1);
  }
  
  // Quantum narrative analysis methods
  detectNarrativeSuperposition(text: string): QuantumNarrative | null {
    const lowerText = text.toLowerCase();
    
    // Look for simultaneous contradictory states
    const contradictionMarkers = [
      ['excited', 'worried'],
      ['optimistic', 'concerned'],
      ['interested', 'hesitant'],
      ['want', 'afraid'],
      ['love', 'frustrated']
    ];
    
    const foundContradictions = contradictionMarkers.filter(([pos, neg]) => 
      lowerText.includes(pos) && lowerText.includes(neg)
    );
    
    if (foundContradictions.length === 0) return null;
    
    return {
      id: `superposition_${Date.now()}`,
      type: 'superposition',
      description: `Farmer exists in emotional/conceptual superposition`,
      alternativePossibilities: foundContradictions.map(([pos, neg]) => 
        `Both ${pos} and ${neg} simultaneously`
      ),
      observerEffect: 'Questioning may force collapse into single emotional state',
      uncertaintyPrinciple: 'Cannot precisely measure both excitement and worry simultaneously',
      quantumCoherence: 0.7,
      philosophicalImplications: [
        'Emotional complexity as quantum phenomenon',
        'Multiple valid truth states',
        'Observer effect in therapeutic dialogue'
      ]
    };
  }
  
  detectNarrativeEntanglement(text: string, contextTexts: string[]): QuantumNarrative | null {
    const lowerText = text.toLowerCase();
    
    // Look for connections between distant concepts
    const entanglementPatterns = [
      ['family', 'environment'], // Family welfare entangled with environmental health
      ['profit', 'stewardship'], // Economic and ethical entanglement
      ['tradition', 'innovation'], // Past and future entangled
      ['individual', 'community'] // Personal and collective entangled
    ];
    
    const foundEntanglements = entanglementPatterns.filter(([concept1, concept2]) => 
      lowerText.includes(concept1) && lowerText.includes(concept2)
    );
    
    if (foundEntanglements.length === 0) return null;
    
    return {
      id: `entanglement_${Date.now()}`,
      type: 'entanglement',
      description: 'Concepts show quantum entanglement - change in one affects the other instantly',
      alternativePossibilities: foundEntanglements.map(([c1, c2]) => 
        `${c1} and ${c2} are quantum entangled`
      ),
      observerEffect: 'Focusing on one concept immediately affects perception of entangled concept',
      uncertaintyPrinciple: 'Cannot isolate entangled concepts without affecting their connection',
      quantumCoherence: 0.8,
      philosophicalImplications: [
        'Non-local connections in farmer worldview',
        'Holistic thinking as quantum phenomenon',
        'Action at a distance in value systems'
      ]
    };
  }
  
  assessNarrativeEvolution(text: string, conversationHistory: string[]): StoryEvolution {
    const lowerText = text.toLowerCase();
    
    // Determine current stage based on language patterns
    let currentStage: StoryEvolution['currentStage'] = 'initiation';
    
    if (/(question|wonder|explore|curious)/g.test(lowerText)) {
      currentStage = 'initiation';
    } else if (/(leaving|different|separate|change)/g.test(lowerText)) {
      currentStage = 'separation';
    } else if (/(difficult|challenge|hard|struggle)/g.test(lowerText)) {
      currentStage = 'descent';
    } else if (/(crisis|breaking|limit|edge)/g.test(lowerText)) {
      currentStage = 'ordeal';
    } else if (/(realize|understand|see|insight)/g.test(lowerText)) {
      currentStage = 'revelation';
    } else if (/(transform|change|become|evolve)/g.test(lowerText)) {
      currentStage = 'transformation';
    } else if (/(share|teach|give back|community)/g.test(lowerText)) {
      currentStage = 'return';
    }
    
    // Determine evolution direction
    let evolutionDirection: StoryEvolution['evolutionDirection'] = 'progressive';
    if (/(back|return|traditional|old way)/g.test(lowerText)) {
      evolutionDirection = 'regressive';
    } else if (/(cycle|season|pattern)/g.test(lowerText)) {
      evolutionDirection = 'cyclical';
    } else if (/(spiral|deeper|layer)/g.test(lowerText)) {
      evolutionDirection = 'spiral';
    }
    
    // Identify catalysts and resistance
    const transformationCatalysts: string[] = [];
    const resistanceFactors: string[] = [];
    
    if (lowerText.includes('crisis')) transformationCatalysts.push('Crisis event');
    if (lowerText.includes('mentor') || lowerText.includes('advisor')) transformationCatalysts.push('Guidance');
    if (lowerText.includes('success') || lowerText.includes('worked')) transformationCatalysts.push('Positive feedback');
    
    if (lowerText.includes('fear') || lowerText.includes('afraid')) resistanceFactors.push('Fear');
    if (lowerText.includes('cost') || lowerText.includes('expensive')) resistanceFactors.push('Economic pressure');
    if (lowerText.includes('family') || lowerText.includes('tradition')) resistanceFactors.push('Social/cultural expectations');
    
    // Calculate readiness for next stage
    const nextStageReadiness = Math.min(
      (transformationCatalysts.length * 0.3) + 0.4 - (resistanceFactors.length * 0.2),
      1
    );
    
    return {
      currentStage,
      evolutionDirection,
      transformationCatalysts,
      resistanceFactors,
      nextStageReadiness: Math.max(nextStageReadiness, 0)
    };
  }
  
  /**
   * Enhanced analysis with quantum storytelling integration
   */
  analyzeWithQuantumStorytelling(
    text: string, 
    conversationHistory: string[] = [],
    dialecticalTensions: DialecticalTension[] = [],
    emergentNarratives: EmergentNarrative[] = []
  ): BojeAnalysis {
    // Integrate philosophical analysis
    this.integrateWithPhilosophicalAnalysis(dialecticalTensions, emergentNarratives);
    
    // Detect quantum narratives
    const superposition = this.detectNarrativeSuperposition(text);
    const entanglement = this.detectNarrativeEntanglement(text, conversationHistory);
    
    if (superposition) this.quantumNarratives.push(superposition);
    if (entanglement) this.quantumNarratives.push(entanglement);
    
    // Assess story evolution
    this.storyEvolution = this.assessNarrativeEvolution(text, conversationHistory);
    
    // Perform traditional Boje analysis
    const livingStory = this.extractLivingStory(text);
    const anteNarrative = this.extractAnteNarrative(text);
    const grandNarrative = this.identifyGrandNarrative(text);
    
    const livingStories = livingStory ? [livingStory] : [];
    const anteNarratives = anteNarrative ? [anteNarrative] : [];
    const grandNarratives = grandNarrative ? [grandNarrative] : [];
    
    // Calculate narrative metrics
    const narrativeCoherence = this.calculateNarrativeCoherence(livingStories, anteNarratives, grandNarratives);
    const storyEvolutionPotential = this.storyEvolution?.nextStageReadiness || 0;
    
    return {
      livingStories,
      anteNarratives,
      grandNarratives,
      narrativeGaps: this.identifyNarrativeGaps(livingStories, anteNarratives, grandNarratives),
      storyConnections: [],
      quantumNarratives: this.quantumNarratives,
      narrativeCoherence,
      storyEvolutionPotential
    };
  }
  
  private calculateNarrativeCoherence(
    livingStories: LivingStory[], 
    anteNarratives: AnteNarrative[], 
    grandNarratives: GrandNarrativeConnection[]
  ): number {
    const hasLiving = livingStories.length > 0 ? 0.3 : 0;
    const hasAnte = anteNarratives.length > 0 ? 0.3 : 0;
    const hasGrand = grandNarratives.length > 0 ? 0.2 : 0;
    const quantumCoherence = this.quantumNarratives.reduce((sum, qn) => sum + qn.quantumCoherence, 0) / 
                           (this.quantumNarratives.length || 1) * 0.2;
    
    return hasLiving + hasAnte + hasGrand + quantumCoherence;
  }
  
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
      storyConnections: connections,
      quantumNarratives: this.quantumNarratives,
      narrativeCoherence: this.calculateNarrativeCoherence(livingStories, anteNarratives, grandNarratives),
      storyEvolutionPotential: this.storyEvolution?.nextStageReadiness || 0
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

  // Missing method implementations for backward compatibility
  private extractAnteNarrative(text: string): AnteNarrative | null {
    const lowerText = text.toLowerCase();
    
    // Look for future-oriented or aspirational language
    const anteMarkers = [
      'want to', 'hope to', 'planning', 'thinking about', 'considering',
      'might try', 'could', 'maybe', 'someday', 'eventually'
    ];
    
    const hasAnteMarker = anteMarkers.some(marker => lowerText.includes(marker));
    if (!hasAnteMarker) return null;
    
    return {
      id: `ante_${Date.now()}`,
      aspiration: text.slice(0, 200),
      timeframe: 'future',
      feasibility: 0.5,
      timestamp: Date.now()
    };
  }
  
  private identifyGrandNarrative(text: string): GrandNarrativeConnection | null {
    const lowerText = text.toLowerCase();
    
    // Look for connections to larger narratives
    const grandMarkers = [
      'agriculture', 'farming industry', 'food system', 'climate change',
      'sustainability', 'future of farming', 'next generation'
    ];
    
    const hasGrandMarker = grandMarkers.some(marker => lowerText.includes(marker));
    if (!hasGrandMarker) return null;
    
    return {
      id: `grand_${Date.now()}`,
      theme: 'sustainable agriculture',
      universalTruth: 'Farming is essential for human survival and environmental stewardship',
      applicability: 'universal' as const,
      timestamp: Date.now()
    };
  }
  
  private identifyNarrativeGaps(
    livingStories: LivingStory[], 
    anteNarratives: AnteNarrative[], 
    grandNarratives: GrandNarrativeConnection[]
  ): NarrativeGap[] {
    const gaps: NarrativeGap[] = [];
    
    if (livingStories.length === 0) {
      gaps.push({
        type: 'missing_living',
        description: 'No concrete experiences shared yet',
        suggestedPrompt: 'Can you share a specific experience from your farm?'
      });
    }
    
    if (anteNarratives.length === 0) {
      gaps.push({
        type: 'weak_ante',
        description: 'No future aspirations identified',
        suggestedPrompt: 'What changes are you considering for your farm?'
      });
    }
    
    if (grandNarratives.length === 0) {
      gaps.push({
        type: 'disconnected_grand',
        description: 'Not connected to larger farming narratives',
        suggestedPrompt: 'How do you see your farm fitting into the bigger picture of agriculture?'
      });
    }
    
    return gaps;
  }
}