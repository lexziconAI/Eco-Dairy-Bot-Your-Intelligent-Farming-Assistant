import { Orientation } from './DynamicPromptEngine';

// === SUSTAINABILITY PHILOSOPHY & FARMER ORIENTATION ANALYSIS SYSTEM ===

export interface SustainabilityPhilosophy {
  coreBeliefs: PhilosophicalBelief[];
  valueSystem: ValueSystem;
  worldviewOrientation: WorldviewOrientation;
  dialecticalTensions: DialecticalTension[];
  emergentNarratives: EmergentNarrative[];
  philosophicalDepth: number; // 0-1, how deep their thinking goes
  intellectualCuriosity: number; // 0-1, openness to challenging ideas
  systemicThinking: number; // 0-1, ability to see interconnections
}

export interface PhilosophicalBelief {
  category: 'epistemological' | 'ontological' | 'axiological' | 'cosmological';
  belief: string;
  confidence: number;
  origins: string[]; // where this belief seems to come from
  tensions: string[]; // internal contradictions
  implications: string[]; // what this means for action
}

export interface ValueSystem {
  primaryValues: string[];
  secondaryValues: string[];
  hiddenValues: string[]; // values they demonstrate but don't articulate
  valueConflicts: ValueConflict[];
  moralComplexity: number; // 0-1, sophistication of moral reasoning
}

export interface ValueConflict {
  tension: string;
  manifestation: string;
  resolution: 'avoided' | 'acknowledged' | 'integrated' | 'transcended';
  dialecticalPotential: number; // 0-1, potential for growth
}

export interface WorldviewOrientation {
  mechanistic: number; // 0-1, sees world as machine
  organic: number; // 0-1, sees world as living system
  holistic: number; // 0-1, sees interconnected wholes
  reductionist: number; // 0-1, breaks down to parts
  linear: number; // 0-1, cause-effect thinking
  cyclical: number; // 0-1, circular, seasonal thinking
  hierarchical: number; // 0-1, top-down organization
  network: number; // 0-1, web-like connections
}

export interface DialecticalTension {
  thesis: string;
  antithesis: string;
  currentSynthesis: string | null;
  emotionalCharge: number; // 0-1, how much this bothers them
  readinessForSynthesis: number; // 0-1, openness to resolution
  philosophicalImportance: number; // 0-1, centrality to their worldview
}

export interface EmergentNarrative {
  type: 'becoming' | 'transformation' | 'resistance' | 'integration';
  storyFragment: string;
  developmentalStage: 'initiation' | 'struggle' | 'breakthrough' | 'integration';
  archetypeResonance: string[]; // archetypal patterns present
  futureImplications: string[];
}

// SES (Socio-Ecological Systems) Theory Integration
export interface SESAnalysis {
  resourceSystems: ResourceSystem[];
  governanceSystems: GovernanceSystem[];
  users: UserSystem[];
  interactions: SESInteraction[];
  outcomes: SESOutcome[];
  systemResilience: number; // 0-1, adaptive capacity
  transformationPotential: number; // 0-1, readiness for change
}

export interface ResourceSystem {
  type: 'land' | 'water' | 'biodiversity' | 'knowledge' | 'social_capital';
  condition: 'degraded' | 'stable' | 'improving' | 'thriving';
  accessibility: number; // 0-1, how accessible it is to the farmer
  sustainability: number; // 0-1, long-term viability
  farmerPerception: string; // how they see this resource
}

export interface GovernanceSystem {
  level: 'individual' | 'family' | 'community' | 'regional' | 'national' | 'global';
  rules: string[];
  enforcement: 'weak' | 'moderate' | 'strong';
  legitimacy: number; // 0-1, farmer's acceptance
  adaptability: number; // 0-1, capacity to change
}

export interface UserSystem {
  stakeholder: string;
  interests: string[];
  power: number; // 0-1, influence level
  knowledge: string[];
  relationships: string[];
}

export interface SESInteraction {
  type: 'cooperation' | 'conflict' | 'adaptation' | 'transformation';
  stakeholders: string[];
  outcome: 'positive' | 'negative' | 'neutral' | 'complex';
  leverage: number; // 0-1, potential for influence
}

export interface SESOutcome {
  domain: 'social' | 'ecological' | 'economic';
  indicator: string;
  trend: 'declining' | 'stable' | 'improving';
  sustainability: number; // 0-1, long-term viability
}

// Chaos Theory Integration
export interface ChaosTheoryAnalysis {
  systemState: SystemState;
  attractors: Attractor[];
  bifurcationPoints: BifurcationPoint[];
  emergentProperties: EmergentProperty[];
  nonlinearDynamics: NonlinearDynamic[];
  sensitivityToInitialConditions: number; // 0-1, butterfly effect potential
  systemStability: number; // 0-1, resistance to perturbation
  adaptiveCapacity: number; // 0-1, ability to evolve
}

export interface SystemState {
  phase: 'stable' | 'transitional' | 'chaotic' | 'emergent';
  energy: number; // 0-1, system vitality
  entropy: number; // 0-1, disorder level
  information: number; // 0-1, organized complexity
  coherence: number; // 0-1, internal consistency
}

export interface Attractor {
  type: 'point' | 'cycle' | 'strange' | 'chaotic';
  description: string;
  strength: number; // 0-1, pull towards this state
  stability: number; // 0-1, resistance to change
  desirability: number; // 0-1, farmer's preference
}

export interface BifurcationPoint {
  trigger: string;
  criticalThreshold: string;
  possibleOutcomes: string[];
  probability: number; // 0-1, likelihood of reaching this point
  preparedness: number; // 0-1, farmer's readiness
}

export interface EmergentProperty {
  property: string;
  level: 'individual' | 'family' | 'farm' | 'community' | 'landscape';
  novelty: number; // 0-1, how new this is
  significance: number; // 0-1, importance for sustainability
}

export interface NonlinearDynamic {
  cause: string;
  effect: string;
  amplification: number; // factor of amplification
  timeDelay: number; // delay between cause and effect
  threshold: string; // tipping point description
}

// Enhanced Inferential Analysis
export interface ComprehensiveInferentialAnalysis {
  // Core orientation analysis
  orientationCode: Orientation;
  confidence: number;
  
  // Surface and deep analysis
  surfaceIndicators: string[];
  inferredIndicators: string[];
  inferenceReasoning: string;
  emotionalSubtext: string;
  suggestedResponseFrame: string;
  
  // Psychological analysis
  uncertaintyMarkers: UncertaintyMarker[];
  avoidancePatterns: AvoidancePattern[];
  emotionalDrivers: EmotionalDriver[];
  
  // Philosophical analysis
  sustainabilityPhilosophy: SustainabilityPhilosophy;
  philosophicalChallenges: PhilosophicalChallenge[];
  conceptualGaps: ConceptualGap[];
  
  // Systems analysis
  sesAnalysis: SESAnalysis;
  chaosAnalysis: ChaosTheoryAnalysis;
  
  // Response strategy
  intellectualEngagementStrategy: IntellectualEngagementStrategy;
  philosophicalPrompts: PhilosophicalPrompt[];
  dialecticalOpportunities: DialecticalOpportunity[];
}

export interface PhilosophicalChallenge {
  category: 'assumption' | 'contradiction' | 'limitation' | 'opportunity';
  challenge: string;
  evidence: string[];
  approach: 'gentle_questioning' | 'socratic_method' | 'perspective_shift' | 'story_reframe';
  readiness: number; // 0-1, farmer's readiness for this challenge
}

export interface ConceptualGap {
  missing: string;
  impact: string;
  bridgingStrategy: string;
  examples: string[];
}

export interface IntellectualEngagementStrategy {
  level: 'surface' | 'analytical' | 'synthetic' | 'transformative';
  approach: 'empirical' | 'rational' | 'intuitive' | 'dialectical' | 'contemplative';
  techniques: string[];
  pacing: 'immediate' | 'gradual' | 'patient' | 'cyclical';
}

export interface PhilosophicalPrompt {
  question: string;
  purpose: string;
  expectedResistance: string;
  followUpStrategies: string[];
  philosophicalDepth: number; // 0-1, how deep this goes
}

export interface DialecticalOpportunity {
  tension: string;
  intervention: string;
  timing: 'now' | 'soon' | 'later' | 'eventual';
  growthPotential: number; // 0-1, potential for development
}

// Original interfaces maintained for compatibility
export interface InferentialAnalysis {
  orientationCode: Orientation;
  confidence: number;
  surfaceIndicators: string[];
  inferredIndicators: string[];
  inferenceReasoning: string;
  emotionalSubtext: string;
  suggestedResponseFrame: string;
  uncertaintyMarkers: UncertaintyMarker[];
  avoidancePatterns: AvoidancePattern[];
  emotionalDrivers: EmotionalDriver[];
}

export interface UncertaintyMarker {
  text: string;
  type: 'linguistic' | 'structural' | 'contextual';
  intensity: number;
}

export interface AvoidancePattern {
  pattern: string;
  evidence: string;
  likelihood: number;
}

export interface EmotionalDriver {
  emotion: string;
  intensity: number;
  indicators: string[];
  hiddenConcern: string;
}

export interface OrientationTransition {
  fromOrientation: Orientation;
  toOrientation: Orientation;
  timestamp: number;
  trigger: string;
  confidence: number;
  conversationContext: string;
}

export class InferentialAnalysisEngine {
  private conversationHistory: string[] = [];
  private orientationHistory: Array<{
    orientation: Orientation;
    confidence: number;
    timestamp: number;
    context: string;
  }> = [];
  private philosophicalJourney: PhilosophicalBelief[] = [];
  private systemStateHistory: SystemState[] = [];
  private dialecticalEvolution: DialecticalTension[] = [];

  // Main analysis method - now returns comprehensive analysis
  analyzeTextComprehensively(text: string, conversationContext: string[] = []): ComprehensiveInferentialAnalysis {
    this.conversationHistory.push(text);
    
    // Core inferential analysis
    const coreAnalysis = this.performCoreAnalysis(text, conversationContext);
    
    // Philosophical analysis
    const sustainabilityPhilosophy = this.analyzeSustainabilityPhilosophy(text, conversationContext);
    const philosophicalChallenges = this.identifyPhilosophicalChallenges(text, sustainabilityPhilosophy);
    const conceptualGaps = this.identifyConceptualGaps(text, conversationContext);
    
    // Systems analysis
    const sesAnalysis = this.performSESAnalysis(text, conversationContext);
    const chaosAnalysis = this.performChaosAnalysis(text, conversationContext);
    
    // Response strategy
    const intellectualStrategy = this.developIntellectualEngagementStrategy(sustainabilityPhilosophy, sesAnalysis, chaosAnalysis);
    const philosophicalPrompts = this.generatePhilosophicalPrompts(philosophicalChallenges, conceptualGaps);
    const dialecticalOpportunities = this.identifyDialecticalOpportunities(sustainabilityPhilosophy.dialecticalTensions);
    
    return {
      // Core analysis
      orientationCode: coreAnalysis.orientationCode,
      confidence: coreAnalysis.confidence,
      surfaceIndicators: coreAnalysis.surfaceIndicators,
      inferredIndicators: coreAnalysis.inferredIndicators,
      inferenceReasoning: coreAnalysis.inferenceReasoning,
      emotionalSubtext: coreAnalysis.emotionalSubtext,
      suggestedResponseFrame: coreAnalysis.suggestedResponseFrame,
      uncertaintyMarkers: coreAnalysis.uncertaintyMarkers,
      avoidancePatterns: coreAnalysis.avoidancePatterns,
      emotionalDrivers: coreAnalysis.emotionalDrivers,
      
      // Enhanced analysis
      sustainabilityPhilosophy,
      philosophicalChallenges,
      conceptualGaps,
      sesAnalysis,
      chaosAnalysis,
      intellectualEngagementStrategy: intellectualStrategy,
      philosophicalPrompts,
      dialecticalOpportunities
    };
  }

  // Backward compatibility method
  analyzeText(text: string, conversationContext: string[] = []): InferentialAnalysis {
    this.conversationHistory.push(text);
    
    // Multi-layer inference processing
    const surfaceIndicators = this.extractSurfaceIndicators(text);
    const uncertaintyMarkers = this.detectUncertaintyMarkers(text);
    const avoidancePatterns = this.detectAvoidancePatterns(text, conversationContext);
    const emotionalDrivers = this.analyzeEmotionalDrivers(text);
    const inferredIndicators = this.performDeepInference(text, conversationContext);
    
    // Classify orientation using weighted inference
    const orientationAnalysis = this.classifyOrientation(
      text,
      surfaceIndicators,
      inferredIndicators,
      uncertaintyMarkers,
      avoidancePatterns,
      emotionalDrivers,
      conversationContext
    );

    // Track orientation evolution
    this.trackOrientationEvolution(orientationAnalysis.orientation, orientationAnalysis.confidence, text);

    return {
      orientationCode: orientationAnalysis.orientation,
      confidence: orientationAnalysis.confidence,
      surfaceIndicators,
      inferredIndicators,
      inferenceReasoning: orientationAnalysis.reasoning,
      emotionalSubtext: this.generateEmotionalSubtext(emotionalDrivers, avoidancePatterns),
      suggestedResponseFrame: this.generateResponseFrame(orientationAnalysis.orientation, emotionalDrivers),
      uncertaintyMarkers,
      avoidancePatterns,
      emotionalDrivers
    };
  }

  private performCoreAnalysis(text: string, conversationContext: string[]): InferentialAnalysis {
    // Multi-layer inference processing
    const surfaceIndicators = this.extractSurfaceIndicators(text);
    const uncertaintyMarkers = this.detectUncertaintyMarkers(text);
    const avoidancePatterns = this.detectAvoidancePatterns(text, conversationContext);
    const emotionalDrivers = this.analyzeEmotionalDrivers(text);
    const inferredIndicators = this.performDeepInference(text, conversationContext);
    
    // Classify orientation using weighted inference
    const orientationAnalysis = this.classifyOrientation(
      text,
      surfaceIndicators,
      inferredIndicators,
      uncertaintyMarkers,
      avoidancePatterns,
      emotionalDrivers,
      conversationContext
    );

    // Track orientation evolution
    this.trackOrientationEvolution(orientationAnalysis.orientation, orientationAnalysis.confidence, text);

    return {
      orientationCode: orientationAnalysis.orientation,
      confidence: orientationAnalysis.confidence,
      surfaceIndicators,
      inferredIndicators,
      inferenceReasoning: orientationAnalysis.reasoning,
      emotionalSubtext: this.generateEmotionalSubtext(emotionalDrivers, avoidancePatterns),
      suggestedResponseFrame: this.generateResponseFrame(orientationAnalysis.orientation, emotionalDrivers),
      uncertaintyMarkers,
      avoidancePatterns,
      emotionalDrivers
    };
  }

  // === SUSTAINABILITY PHILOSOPHY ANALYSIS ===
  private analyzeSustainabilityPhilosophy(text: string, context: string[]): SustainabilityPhilosophy {
    const lowerText = text.toLowerCase();
    
    // Extract core beliefs
    const coreBeliefs = this.extractPhilosophicalBeliefs(text, context);
    
    // Analyze value system
    const valueSystem = this.analyzeValueSystem(text, context);
    
    // Determine worldview orientation
    const worldviewOrientation = this.assessWorldviewOrientation(text, context);
    
    // Identify dialectical tensions
    const dialecticalTensions = this.identifyDialecticalTensions(text, context);
    
    // Extract emergent narratives
    const emergentNarratives = this.extractEmergentNarratives(text, context);
    
    // Calculate meta-cognitive scores
    const philosophicalDepth = this.calculatePhilosophicalDepth(text, coreBeliefs, dialecticalTensions);
    const intellectualCuriosity = this.assessIntellectualCuriosity(text, context);
    const systemicThinking = this.assessSystemicThinking(text, context);
    
    return {
      coreBeliefs,
      valueSystem,
      worldviewOrientation,
      dialecticalTensions,
      emergentNarratives,
      philosophicalDepth,
      intellectualCuriosity,
      systemicThinking
    };
  }

  private extractPhilosophicalBeliefs(text: string, context: string[]): PhilosophicalBelief[] {
    const beliefs: PhilosophicalBelief[] = [];
    const lowerText = text.toLowerCase();
    
    // Epistemological beliefs (how knowledge is gained)
    const epistemologicalPatterns = [
      { pattern: /experience (shows|tells|teaches)/g, belief: 'Knowledge comes from direct experience', confidence: 0.8 },
      { pattern: /research (shows|proves|indicates)/g, belief: 'Knowledge comes from scientific research', confidence: 0.7 },
      { pattern: /my (grandfather|father|family) (always|used to)/g, belief: 'Knowledge comes from tradition', confidence: 0.9 },
      { pattern: /everyone knows/g, belief: 'Knowledge comes from common consensus', confidence: 0.6 },
      { pattern: /i feel like|my gut tells me/g, belief: 'Knowledge comes from intuition', confidence: 0.7 }
    ];
    
    epistemologicalPatterns.forEach(({ pattern, belief, confidence }) => {
      if (pattern.test(text)) {
        beliefs.push({
          category: 'epistemological',
          belief,
          confidence,
          origins: ['conversation_analysis'],
          tensions: [],
          implications: ['Affects how they evaluate new information']
        });
      }
    });
    
    // Ontological beliefs (nature of reality)
    const ontologicalPatterns = [
      { pattern: /everything (is connected|relates)/g, belief: 'Reality is interconnected', confidence: 0.8 },
      { pattern: /(natural|nature) (cycles|balance)/g, belief: 'Nature operates in balanced cycles', confidence: 0.7 },
      { pattern: /survival of the fittest/g, belief: 'Reality is competitive', confidence: 0.6 },
      { pattern: /(higher purpose|greater plan)/g, belief: 'Reality has inherent purpose', confidence: 0.8 }
    ];
    
    ontologicalPatterns.forEach(({ pattern, belief, confidence }) => {
      if (pattern.test(text)) {
        beliefs.push({
          category: 'ontological',
          belief,
          confidence,
          origins: ['conversation_analysis'],
          tensions: [],
          implications: ['Shapes how they view farming within larger systems']
        });
      }
    });
    
    // Axiological beliefs (values and ethics)
    const axiologicalPatterns = [
      { pattern: /(stewardship|taking care)/g, belief: 'Humans are stewards of nature', confidence: 0.8 },
      { pattern: /(profit|business) (first|comes first)/g, belief: 'Economic success is primary', confidence: 0.7 },
      { pattern: /(future|next) generation/g, belief: 'Intergenerational responsibility matters', confidence: 0.9 },
      { pattern: /do what\'s right/g, belief: 'Moral duty guides action', confidence: 0.8 }
    ];
    
    axiologicalPatterns.forEach(({ pattern, belief, confidence }) => {
      if (pattern.test(text)) {
        beliefs.push({
          category: 'axiological',
          belief,
          confidence,
          origins: ['conversation_analysis'],
          tensions: [],
          implications: ['Influences ethical decision-making']
        });
      }
    });
    
    return beliefs;
  }

  private analyzeValueSystem(text: string, context: string[]): ValueSystem {
    const lowerText = text.toLowerCase();
    const primaryValues: string[] = [];
    const secondaryValues: string[] = [];
    const hiddenValues: string[] = [];
    const valueConflicts: ValueConflict[] = [];
    
    // Value detection patterns
    const valuePatterns = [
      { pattern: /(family|children|kids)/g, value: 'Family welfare', priority: 'primary' },
      { pattern: /(profit|income|money)/g, value: 'Financial security', priority: 'primary' },
      { pattern: /(environment|nature|sustainability)/g, value: 'Environmental stewardship', priority: 'primary' },
      { pattern: /(community|neighbors|local)/g, value: 'Community connection', priority: 'secondary' },
      { pattern: /(innovation|technology|modern)/g, value: 'Progress and innovation', priority: 'secondary' },
      { pattern: /(tradition|heritage|old ways)/g, value: 'Cultural tradition', priority: 'secondary' },
      { pattern: /(independence|self-reliant)/g, value: 'Autonomy', priority: 'hidden' },
      { pattern: /(respect|recognition)/g, value: 'Social recognition', priority: 'hidden' }
    ];
    
    valuePatterns.forEach(({ pattern, value, priority }) => {
      if (pattern.test(text)) {
        if (priority === 'primary') primaryValues.push(value);
        else if (priority === 'secondary') secondaryValues.push(value);
        else hiddenValues.push(value);
      }
    });
    
    // Detect value conflicts
    if (primaryValues.includes('Financial security') && primaryValues.includes('Environmental stewardship')) {
      valueConflicts.push({
        tension: 'Profit vs Environmental protection',
        manifestation: 'Expressed concern about costs of sustainable practices',
        resolution: 'avoided',
        dialecticalPotential: 0.8
      });
    }
    
    if (primaryValues.includes('Family welfare') && primaryValues.includes('Cultural tradition')) {
      valueConflicts.push({
        tension: 'Innovation vs Tradition',
        manifestation: 'Wanting to preserve family legacy while adapting to change',
        resolution: 'acknowledged',
        dialecticalPotential: 0.7
      });
    }
    
    // Calculate moral complexity
    const moralComplexity = Math.min(
      (primaryValues.length * 0.3 + valueConflicts.length * 0.5 + hiddenValues.length * 0.2),
      1
    );
    
    return {
      primaryValues,
      secondaryValues,
      hiddenValues,
      valueConflicts,
      moralComplexity
    };
  }

  private assessWorldviewOrientation(text: string, context: string[]): WorldviewOrientation {
    const lowerText = text.toLowerCase();
    
    // Initialize all orientations to 0.5 (neutral)
    const orientation: WorldviewOrientation = {
      mechanistic: 0.5,
      organic: 0.5,
      holistic: 0.5,
      reductionist: 0.5,
      linear: 0.5,
      cyclical: 0.5,
      hierarchical: 0.5,
      network: 0.5
    };
    
    // Mechanistic indicators
    if (/(efficiency|optimization|inputs|outputs|systems)/g.test(text)) {
      orientation.mechanistic += 0.2;
    }
    
    // Organic indicators
    if (/(natural|organic|living|growing|breathing)/g.test(text)) {
      orientation.organic += 0.2;
    }
    
    // Holistic indicators
    if (/(whole|everything connected|big picture)/g.test(text)) {
      orientation.holistic += 0.2;
    }
    
    // Reductionist indicators
    if (/(break down|analyze|separate|individual)/g.test(text)) {
      orientation.reductionist += 0.2;
    }
    
    // Linear indicators
    if (/(cause|effect|then|because|result)/g.test(text)) {
      orientation.linear += 0.2;
    }
    
    // Cyclical indicators
    if (/(cycle|seasonal|pattern|rhythm|circular)/g.test(text)) {
      orientation.cyclical += 0.2;
    }
    
    // Hierarchical indicators
    if (/(top down|management|control|authority)/g.test(text)) {
      orientation.hierarchical += 0.2;
    }
    
    // Network indicators
    if (/(relationships|connections|web|network)/g.test(text)) {
      orientation.network += 0.2;
    }
    
    // Normalize to 0-1 range
    Object.keys(orientation).forEach(key => {
      orientation[key as keyof WorldviewOrientation] = Math.min(
        orientation[key as keyof WorldviewOrientation], 1
      );
    });
    
    return orientation;
  }

  private extractSurfaceIndicators(text: string): string[] {
    const indicators: string[] = [];
    const lowerText = text.toLowerCase();

    // Explicit statements
    const explicitPatterns = [
      { pattern: /i think|i believe|i feel/g, type: 'opinion' },
      { pattern: /i want|i need|i hope/g, type: 'desire' },
      { pattern: /i'm worried|i'm concerned|i'm afraid/g, type: 'fear' },
      { pattern: /sounds good|looks interesting|might work/g, type: 'interest' },
      { pattern: /not sure|don't know|maybe/g, type: 'uncertainty' }
    ];

    explicitPatterns.forEach(({ pattern, type }) => {
      const matches = text.match(pattern);
      if (matches) {
        indicators.push(...matches.map(match => `${type}: "${match}"`));
      }
    });

    return indicators;
  }

  private detectUncertaintyMarkers(text: string): UncertaintyMarker[] {
    const markers: UncertaintyMarker[] = [];

    // Linguistic uncertainty
    const linguisticPatterns = [
      { pattern: /\.\.\.|…/g, intensity: 0.8, marker: 'trailing off' },
      { pattern: /um+|uh+|er+/g, intensity: 0.6, marker: 'hesitation sounds' },
      { pattern: /kind of|sort of|maybe|perhaps/g, intensity: 0.7, marker: 'hedge words' },
      { pattern: /i guess|i suppose/g, intensity: 0.9, marker: 'uncertainty qualifiers' }
    ];

    linguisticPatterns.forEach(({ pattern, intensity, marker }) => {
      const matches = text.match(pattern);
      if (matches) {
        markers.push({
          text: matches[0],
          type: 'linguistic',
          intensity
        });
      }
    });

    // Structural uncertainty (incomplete sentences)
    if (text.includes('...') || text.endsWith(' and') || text.endsWith(' but')) {
      markers.push({
        text: 'incomplete thought',
        type: 'structural',
        intensity: 0.8
      });
    }

    return markers;
  }

  private detectAvoidancePatterns(text: string, context: string[]): AvoidancePattern[] {
    const patterns: AvoidancePattern[] = [];
    const lowerText = text.toLowerCase();

    // Deflection patterns
    if (lowerText.includes('you know how it is') || lowerText.includes('it\'s complicated')) {
      patterns.push({
        pattern: 'vague generalization',
        evidence: 'using universal statements to avoid specifics',
        likelihood: 0.85
      });
    }

    // Topic shifting
    if (lowerText.includes('anyway') || lowerText.includes('but anyway')) {
      patterns.push({
        pattern: 'topic deflection',
        evidence: 'attempting to change subject',
        likelihood: 0.7
      });
    }

    // Third-person deflection
    if (lowerText.includes('my neighbor') || lowerText.includes('other farmers') || lowerText.includes('everyone says')) {
      patterns.push({
        pattern: 'authority deflection',
        evidence: 'citing others to avoid personal commitment',
        likelihood: 0.75
      });
    }

    // Minimization
    if (lowerText.includes('just') && (lowerText.includes('wondering') || lowerText.includes('curious'))) {
      patterns.push({
        pattern: 'interest minimization',
        evidence: 'downplaying genuine interest',
        likelihood: 0.8
      });
    }

    return patterns;
  }

  private analyzeEmotionalDrivers(text: string): EmotionalDriver[] {
    const drivers: EmotionalDriver[] = [];
    const lowerText = text.toLowerCase();

    // Fear indicators
    const fearMarkers = ['worried', 'concerned', 'afraid', 'scary', 'risky', 'dangerous'];
    const fearCount = fearMarkers.filter(marker => lowerText.includes(marker)).length;
    if (fearCount > 0) {
      drivers.push({
        emotion: 'fear',
        intensity: Math.min(fearCount * 0.3, 1),
        indicators: fearMarkers.filter(marker => lowerText.includes(marker)),
        hiddenConcern: 'Fear of failure or financial loss'
      });
    }

    // Hope/optimism indicators
    const hopeMarkers = ['hope', 'excited', 'looking forward', 'opportunity', 'potential'];
    const hopeCount = hopeMarkers.filter(marker => lowerText.includes(marker)).length;
    if (hopeCount > 0) {
      drivers.push({
        emotion: 'hope',
        intensity: Math.min(hopeCount * 0.25, 1),
        indicators: hopeMarkers.filter(marker => lowerText.includes(marker)),
        hiddenConcern: 'Desire for improvement but cautious about change'
      });
    }

    // Frustration indicators
    const frustrationMarkers = ['difficult', 'hard', 'struggle', 'tired', 'fed up'];
    const frustrationCount = frustrationMarkers.filter(marker => lowerText.includes(marker)).length;
    if (frustrationCount > 0) {
      drivers.push({
        emotion: 'frustration',
        intensity: Math.min(frustrationCount * 0.35, 1),
        indicators: frustrationMarkers.filter(marker => lowerText.includes(marker)),
        hiddenConcern: 'Feeling overwhelmed by current situation'
      });
    }

    return drivers;
  }

  private performDeepInference(text: string, context: string[]): string[] {
    const inferences: string[] = [];
    const lowerText = text.toLowerCase();

    // Analyze sentence completion patterns
    if (text.includes('...') || text.includes(' and') && !text.includes(' and then')) {
      inferences.push('incomplete thought suggesting internal conflict');
    }

    // Analyze qualification patterns
    if (lowerText.includes('sounds') && lowerText.includes('but')) {
      inferences.push('qualified interest indicating hidden reservations');
    }

    // Analyze social proof seeking
    if (lowerText.includes('other') || lowerText.includes('everyone') || lowerText.includes('people say')) {
      inferences.push('seeking validation through social proof rather than personal conviction');
    }

    // Analyze temporal deflection
    if (lowerText.includes('someday') || lowerText.includes('eventually') || lowerText.includes('maybe next year')) {
      inferences.push('temporal distancing to avoid immediate commitment');
    }

    // Analyze contextual contradictions
    if (context.length > 0) {
      const previousInterest = context.some(c => c.toLowerCase().includes('interested') || c.toLowerCase().includes('excited'));
      if (previousInterest && (lowerText.includes('but') || lowerText.includes('however'))) {
        inferences.push('walking back previously expressed interest');
      }
    }

    return inferences;
  }

  private classifyOrientation(
    text: string,
    surfaceIndicators: string[],
    inferredIndicators: string[],
    uncertaintyMarkers: UncertaintyMarker[],
    avoidancePatterns: AvoidancePattern[],
    emotionalDrivers: EmotionalDriver[],
    context: string[]
  ): { orientation: Orientation; confidence: number; reasoning: string } {
    
    const scores = {
      'P-R': 0,
      'P-NR': 0,
      'PO-R': 0,
      'PO-NR': 0,
      'PC-R': 0,
      'PC-NR': 0
    };

    const lowerText = text.toLowerCase();
    
    // Personal vs Others vs Climate focus scoring
    let personalScore = 0;
    let othersScore = 0;
    let climateScore = 0;

    // Personal indicators
    if (lowerText.includes('my farm') || lowerText.includes('i need') || lowerText.includes('my situation')) {
      personalScore += 2;
    }

    // Others indicators  
    if (lowerText.includes('other farmers') || lowerText.includes('community') || lowerText.includes('neighbors')) {
      othersScore += 2;
    }

    // Climate indicators
    if (lowerText.includes('environment') || lowerText.includes('climate') || lowerText.includes('sustainable')) {
      climateScore += 2;
    }

    // Reluctance vs Non-reluctance scoring
    let reluctanceScore = 0;
    let opennessScore = 0;

    // Weight inferred indicators more heavily
    const fearDriver = emotionalDrivers.find(d => d.emotion === 'fear');
    if (fearDriver) {
      reluctanceScore += fearDriver.intensity * 3;
    }

    // Uncertainty markers indicate reluctance
    const totalUncertainty = uncertaintyMarkers.reduce((sum, marker) => sum + marker.intensity, 0);
    reluctanceScore += totalUncertainty;

    // Avoidance patterns strongly indicate reluctance
    const avoidanceWeight = avoidancePatterns.reduce((sum, pattern) => sum + pattern.likelihood, 0);
    reluctanceScore += avoidanceWeight * 2;

    // Hope/interest indicates openness
    const hopeDriver = emotionalDrivers.find(d => d.emotion === 'hope');
    if (hopeDriver) {
      opennessScore += hopeDriver.intensity * 2;
    }

    // Direct interest statements
    if (lowerText.includes('interested') || lowerText.includes('excited') || lowerText.includes('want to try')) {
      opennessScore += 1.5;
    }

    // Calculate final scores for each orientation
    const focusType = personalScore >= othersScore && personalScore >= climateScore ? 'personal' :
                     othersScore >= climateScore ? 'others' : 'climate';
    
    const isReluctant = reluctanceScore > opennessScore;

    // Assign scores based on analysis
    if (focusType === 'personal') {
      scores[isReluctant ? 'P-R' : 'P-NR'] += 2;
    } else if (focusType === 'others') {
      scores[isReluctant ? 'PO-R' : 'PO-NR'] += 2;
    } else {
      scores[isReluctant ? 'PC-R' : 'PC-NR'] += 2;
    }

    // Find dominant orientation
    const dominant = Object.entries(scores).reduce((a, b) => scores[a[0] as Orientation] > scores[b[0] as Orientation] ? a : b);
    const orientation = dominant[0] as Orientation;
    
    // Calculate confidence based on clarity of signals
    const maxScore = Math.max(...Object.values(scores));
    const confidence = Math.min(maxScore / 3, 1); // Normalize to 0-1

    // Generate reasoning
    const reasoning = this.generateClassificationReasoning(
      orientation,
      surfaceIndicators,
      inferredIndicators,
      uncertaintyMarkers,
      avoidancePatterns,
      emotionalDrivers
    );

    return { orientation, confidence, reasoning };
  }

  private generateClassificationReasoning(
    orientation: Orientation,
    surfaceIndicators: string[],
    inferredIndicators: string[],
    uncertaintyMarkers: UncertaintyMarker[],
    avoidancePatterns: AvoidancePattern[],
    emotionalDrivers: EmotionalDriver[]
  ): string {
    const parts: string[] = [];

    // Surface indicators
    if (surfaceIndicators.length > 0) {
      parts.push(`Surface indicators suggest ${surfaceIndicators.slice(0, 2).join(', ')}`);
    }

    // Emotional drivers
    const dominantEmotion = emotionalDrivers.reduce((prev, curr) => 
      curr.intensity > prev.intensity ? curr : prev, emotionalDrivers[0]);
    
    if (dominantEmotion) {
      parts.push(`Primary emotional driver is ${dominantEmotion.emotion} (${dominantEmotion.hiddenConcern})`);
    }

    // Avoidance patterns
    if (avoidancePatterns.length > 0) {
      parts.push(`Shows ${avoidancePatterns[0].pattern} indicating underlying hesitation`);
    }

    // Uncertainty markers
    if (uncertaintyMarkers.length > 0) {
      parts.push(`Multiple uncertainty markers (${uncertaintyMarkers.length}) suggest internal conflict`);
    }

    // Inferred indicators
    if (inferredIndicators.length > 0) {
      parts.push(`Subtext analysis reveals: ${inferredIndicators[0]}`);
    }

    return parts.join('. ') + `.`;
  }

  private generateEmotionalSubtext(emotionalDrivers: EmotionalDriver[], avoidancePatterns: AvoidancePattern[]): string {
    if (emotionalDrivers.length === 0) return 'Neutral emotional state';

    const primary = emotionalDrivers[0];
    const hasAvoidance = avoidancePatterns.length > 0;

    const subtextMap = {
      fear: hasAvoidance ? 'Fear of failure masked as casual uncertainty, seeking validation for inaction' :
                          'Genuine concern about risks, looking for reassurance',
      hope: hasAvoidance ? 'Optimism tempered by self-doubt, testing the waters carefully' :
                          'Authentic interest in possibilities, ready for guidance',
      frustration: hasAvoidance ? 'Overwhelm leading to withdrawal, deflecting to avoid admitting struggles' :
                                 'Direct expression of challenges, open to solutions'
    };

    return subtextMap[primary.emotion as keyof typeof subtextMap] || 'Complex emotional state requiring gentle exploration';
  }

  private generateResponseFrame(orientation: Orientation, emotionalDrivers: EmotionalDriver[]): string {
    const frameMap = {
      'P-R': 'Gentle exploration of specific unnamed concerns while validating their caution',
      'P-NR': 'Build on their personal interest with concrete, actionable next steps',
      'PO-R': 'Address community concerns while highlighting successful peer examples',
      'PO-NR': 'Leverage their leadership potential to explore community impact opportunities',
      'PC-R': 'Provide evidence-based reassurance about climate action effectiveness',
      'PC-NR': 'Channel their environmental motivation into specific sustainable practices'
    };

    const baseFrame = frameMap[orientation];
    const primaryEmotion = emotionalDrivers[0]?.emotion;

    if (primaryEmotion === 'fear') {
      return baseFrame + ', focusing on risk mitigation strategies';
    } else if (primaryEmotion === 'frustration') {
      return baseFrame + ', acknowledging current challenges first';
    }

    return baseFrame;
  }

  private trackOrientationEvolution(orientation: Orientation, confidence: number, context: string): void {
    const previous = this.orientationHistory[this.orientationHistory.length - 1];
    
    this.orientationHistory.push({
      orientation,
      confidence,
      timestamp: Date.now(),
      context: context.substring(0, 100) // Store first 100 chars for context
    });

    // Detect significant transitions
    if (previous && previous.orientation !== orientation && confidence > 0.6) {
      // This represents a significant orientation shift
      console.log(`Orientation transition detected: ${previous.orientation} → ${orientation}`);
    }
  }

  getOrientationTransitions(): OrientationTransition[] {
    const transitions: OrientationTransition[] = [];
    
    for (let i = 1; i < this.orientationHistory.length; i++) {
      const current = this.orientationHistory[i];
      const previous = this.orientationHistory[i - 1];
      
      if (current.orientation !== previous.orientation) {
        transitions.push({
          fromOrientation: previous.orientation,
          toOrientation: current.orientation,
          timestamp: current.timestamp,
          trigger: current.context,
          confidence: current.confidence,
          conversationContext: `Transition at step ${i}`
        });
      }
    }
    
    return transitions;
  }

  getOrientationHistory(): Array<{ orientation: Orientation; confidence: number; timestamp: number }> {
    return this.orientationHistory.map(({ orientation, confidence, timestamp }) => ({
      orientation,
      confidence,
      timestamp
    }));
  }

  reset(): void {
    this.conversationHistory = [];
    this.orientationHistory = [];
    this.philosophicalJourney = [];
    this.systemStateHistory = [];
    this.dialecticalEvolution = [];
  }

  private identifyDialecticalTensions(text: string, context: string[]): DialecticalTension[] {
    const tensions: DialecticalTension[] = [];
    const lowerText = text.toLowerCase();
    
    // Economic vs Environmental tension
    if ((lowerText.includes('profit') || lowerText.includes('money')) && 
        (lowerText.includes('environment') || lowerText.includes('sustainable'))) {
      tensions.push({
        thesis: 'Economic prosperity is necessary for farm survival',
        antithesis: 'Environmental protection requires economic sacrifice',
        currentSynthesis: null,
        emotionalCharge: 0.8,
        readinessForSynthesis: 0.4,
        philosophicalImportance: 0.9
      });
    }
    
    // Tradition vs Innovation tension
    if ((lowerText.includes('traditional') || lowerText.includes('old way')) && 
        (lowerText.includes('new') || lowerText.includes('technology'))) {
      tensions.push({
        thesis: 'Traditional methods are time-tested and reliable',
        antithesis: 'Innovation is necessary for future success',
        currentSynthesis: null,
        emotionalCharge: 0.6,
        readinessForSynthesis: 0.6,
        philosophicalImportance: 0.7
      });
    }
    
    // Individual vs Community tension
    if ((lowerText.includes('my farm') || lowerText.includes('independence')) && 
        (lowerText.includes('community') || lowerText.includes('cooperation'))) {
      tensions.push({
        thesis: 'Individual autonomy and self-reliance are fundamental',
        antithesis: 'Community cooperation is essential for sustainability',
        currentSynthesis: null,
        emotionalCharge: 0.5,
        readinessForSynthesis: 0.7,
        philosophicalImportance: 0.6
      });
    }
    
    return tensions;
  }

  private extractEmergentNarratives(text: string, context: string[]): EmergentNarrative[] {
    const narratives: EmergentNarrative[] = [];
    const lowerText = text.toLowerCase();
    
    // Transformation narrative
    if (lowerText.includes('changing') || lowerText.includes('different') || lowerText.includes('adapt')) {
      narratives.push({
        type: 'transformation',
        storyFragment: 'A story of adaptation and change in farming practices',
        developmentalStage: 'initiation',
        archetypeResonance: ['The Transforming Farmer', 'The Adaptive Steward'],
        futureImplications: ['Increased resilience', 'Enhanced sustainability']
      });
    }
    
    // Resistance narrative
    if (lowerText.includes('resist') || lowerText.includes('hold on') || lowerText.includes('preserve')) {
      narratives.push({
        type: 'resistance',
        storyFragment: 'A story of preserving traditional values against change',
        developmentalStage: 'struggle',
        archetypeResonance: ['The Guardian', 'The Traditionalist'],
        futureImplications: ['Cultural preservation', 'Potential isolation']
      });
    }
    
    return narratives;
  }

  private calculatePhilosophicalDepth(text: string, beliefs: PhilosophicalBelief[], tensions: DialecticalTension[]): number {
    let depth = 0.3; // Base level
    
    // Increase depth based on abstract thinking
    if (/(meaning|purpose|why|philosophy|principle)/g.test(text.toLowerCase())) {
      depth += 0.2;
    }
    
    // Increase depth based on belief diversity
    depth += beliefs.length * 0.1;
    
    // Increase depth based on tension awareness
    depth += tensions.length * 0.15;
    
    return Math.min(depth, 1);
  }

  private assessIntellectualCuriosity(text: string, context: string[]): number {
    let curiosity = 0.3; // Base level
    const lowerText = text.toLowerCase();
    
    // Question patterns
    const questionCount = (text.match(/\?/g) || []).length;
    curiosity += questionCount * 0.1;
    
    // Curiosity indicators
    if (/(wonder|curious|interesting|learn|explore)/g.test(lowerText)) {
      curiosity += 0.3;
    }
    
    // Openness to new ideas
    if (/(maybe|perhaps|could be|might)/g.test(lowerText)) {
      curiosity += 0.2;
    }
    
    return Math.min(curiosity, 1);
  }

  private assessSystemicThinking(text: string, context: string[]): number {
    let systemic = 0.2; // Base level
    const lowerText = text.toLowerCase();
    
    // Systems language
    if (/(connect|relationship|interact|system|network|web)/g.test(lowerText)) {
      systemic += 0.3;
    }
    
    // Causal thinking
    if (/(because|since|leads to|affects|impact)/g.test(lowerText)) {
      systemic += 0.2;
    }
    
    // Temporal thinking
    if (/(long term|future|generation|legacy)/g.test(lowerText)) {
      systemic += 0.2;
    }
    
    return Math.min(systemic, 1);
  }

  // === SES (SOCIO-ECOLOGICAL SYSTEMS) ANALYSIS ===
  private performSESAnalysis(text: string, context: string[]): SESAnalysis {
    const lowerText = text.toLowerCase();
    
    // Analyze resource systems
    const resourceSystems = this.analyzeResourceSystems(text);
    
    // Analyze governance systems
    const governanceSystems = this.analyzeGovernanceSystems(text);
    
    // Analyze user systems
    const users = this.analyzeUserSystems(text);
    
    // Analyze interactions
    const interactions = this.analyzeSESInteractions(text);
    
    // Analyze outcomes
    const outcomes = this.analyzeSESOutcomes(text);
    
    // Calculate resilience and transformation potential
    const systemResilience = this.calculateSystemResilience(resourceSystems, governanceSystems);
    const transformationPotential = this.calculateTransformationPotential(interactions, outcomes);
    
    return {
      resourceSystems,
      governanceSystems,
      users,
      interactions,
      outcomes,
      systemResilience,
      transformationPotential
    };
  }

  private analyzeResourceSystems(text: string): ResourceSystem[] {
    const resources: ResourceSystem[] = [];
    const lowerText = text.toLowerCase();
    
    // Land resources
    if (/(land|soil|pasture|field)/g.test(lowerText)) {
      resources.push({
        type: 'land',
        condition: this.assessResourceCondition(text, 'land'),
        accessibility: 0.8, // Assume high for owned land
        sustainability: this.assessSustainability(text, 'land'),
        farmerPerception: this.extractResourcePerception(text, 'land')
      });
    }
    
    // Water resources
    if (/(water|irrigation|rain|drought)/g.test(lowerText)) {
      resources.push({
        type: 'water',
        condition: this.assessResourceCondition(text, 'water'),
        accessibility: 0.6, // Often constrained
        sustainability: this.assessSustainability(text, 'water'),
        farmerPerception: this.extractResourcePerception(text, 'water')
      });
    }
    
    // Knowledge resources
    if (/(knowledge|information|research|learn)/g.test(lowerText)) {
      resources.push({
        type: 'knowledge',
        condition: this.assessResourceCondition(text, 'knowledge'),
        accessibility: 0.7,
        sustainability: 0.8, // Knowledge is sustainable
        farmerPerception: this.extractResourcePerception(text, 'knowledge')
      });
    }
    
    return resources;
  }

  private assessResourceCondition(text: string, resourceType: string): 'degraded' | 'stable' | 'improving' | 'thriving' {
    const lowerText = text.toLowerCase();
    
    if (/(degraded|worse|declining|poor)/g.test(lowerText)) return 'degraded';
    if (/(improving|better|growing|good)/g.test(lowerText)) return 'improving';
    if (/(excellent|thriving|abundant)/g.test(lowerText)) return 'thriving';
    return 'stable';
  }

  private assessSustainability(text: string, resourceType: string): number {
    const lowerText = text.toLowerCase();
    let sustainability = 0.5; // Base assumption
    
    if (/(sustainable|renewable|regenerative)/g.test(lowerText)) sustainability += 0.3;
    if (/(depleting|exhausting|mining)/g.test(lowerText)) sustainability -= 0.3;
    
    return Math.max(0, Math.min(sustainability, 1));
  }

  private extractResourcePerception(text: string, resourceType: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('precious') || lowerText.includes('valuable')) {
      return 'Highly valued resource';
    }
    if (lowerText.includes('problem') || lowerText.includes('challenge')) {
      return 'Problematic resource';
    }
    return 'Neutral perception';
  }

  private analyzeGovernanceSystems(text: string): GovernanceSystem[] {
    const governance: GovernanceSystem[] = [];
    const lowerText = text.toLowerCase();
    
    // Individual level
    governance.push({
      level: 'individual',
      rules: ['Personal farming decisions', 'Resource allocation'],
      enforcement: 'strong',
      legitimacy: 1.0,
      adaptability: 0.8
    });
    
    // Community level
    if (/(community|neighbors|local)/g.test(lowerText)) {
      governance.push({
        level: 'community',
        rules: ['Informal cooperation norms', 'Local knowledge sharing'],
        enforcement: 'moderate',
        legitimacy: 0.7,
        adaptability: 0.6
      });
    }
    
    // Regional/national level
    if (/(regulation|government|policy|law)/g.test(lowerText)) {
      governance.push({
        level: 'national',
        rules: ['Environmental regulations', 'Agricultural policies'],
        enforcement: 'moderate',
        legitimacy: 0.5, // Often contested
        adaptability: 0.3 // Slow to change
      });
    }
    
    return governance;
  }

  private analyzeUserSystems(text: string): UserSystem[] {
    const users: UserSystem[] = [];
    const lowerText = text.toLowerCase();
    
    // Always include the farmer
    users.push({
      stakeholder: 'Farmer',
      interests: ['Economic viability', 'Family welfare', 'Farm sustainability'],
      power: 0.8,
      knowledge: ['Local experience', 'Traditional practices'],
      relationships: ['Family', 'Local community']
    });
    
    // Add other stakeholders mentioned
    if (/(family|spouse|children)/g.test(lowerText)) {
      users.push({
        stakeholder: 'Family',
        interests: ['Financial security', 'Future inheritance'],
        power: 0.9,
        knowledge: ['Shared experience', 'Emotional support'],
        relationships: ['Farmer', 'Extended family']
      });
    }
    
    return users;
  }

  private analyzeSESInteractions(text: string): SESInteraction[] {
    const interactions: SESInteraction[] = [];
    const lowerText = text.toLowerCase();
    
    // Look for cooperation patterns
    if (/(cooperate|work together|share)/g.test(lowerText)) {
      interactions.push({
        type: 'cooperation',
        stakeholders: ['Farmer', 'Community'],
        outcome: 'positive',
        leverage: 0.7
      });
    }
    
    // Look for conflict patterns
    if (/(conflict|disagree|tension)/g.test(lowerText)) {
      interactions.push({
        type: 'conflict',
        stakeholders: ['Farmer', 'External forces'],
        outcome: 'negative',
        leverage: 0.5
      });
    }
    
    return interactions;
  }

  private analyzeSESOutcomes(text: string): SESOutcome[] {
    const outcomes: SESOutcome[] = [];
    const lowerText = text.toLowerCase();
    
    // Economic outcomes
    if (/(profit|income|cost)/g.test(lowerText)) {
      outcomes.push({
        domain: 'economic',
        indicator: 'Farm profitability',
        trend: this.assessTrend(text),
        sustainability: 0.6
      });
    }
    
    // Environmental outcomes
    if (/(environment|soil|water|biodiversity)/g.test(lowerText)) {
      outcomes.push({
        domain: 'ecological',
        indicator: 'Environmental health',
        trend: this.assessTrend(text),
        sustainability: 0.7
      });
    }
    
    return outcomes;
  }

  private assessTrend(text: string): 'declining' | 'stable' | 'improving' {
    const lowerText = text.toLowerCase();
    
    if (/(improving|better|increasing|growing)/g.test(lowerText)) return 'improving';
    if (/(declining|worse|decreasing|falling)/g.test(lowerText)) return 'declining';
    return 'stable';
  }

  private calculateSystemResilience(resources: ResourceSystem[], governance: GovernanceSystem[]): number {
    const resourceResilience = resources.reduce((sum, r) => sum + r.sustainability, 0) / resources.length;
    const governanceResilience = governance.reduce((sum, g) => sum + g.adaptability, 0) / governance.length;
    
    return (resourceResilience + governanceResilience) / 2;
  }

  private calculateTransformationPotential(interactions: SESInteraction[], outcomes: SESOutcome[]): number {
    const positiveInteractions = interactions.filter(i => i.outcome === 'positive').length;
    const totalInteractions = interactions.length || 1;
    const interactionScore = positiveInteractions / totalInteractions;
    
    const improvingOutcomes = outcomes.filter(o => o.trend === 'improving').length;
    const totalOutcomes = outcomes.length || 1;
    const outcomeScore = improvingOutcomes / totalOutcomes;
    
    return (interactionScore + outcomeScore) / 2;
  }

  // === CHAOS THEORY ANALYSIS ===
  private performChaosAnalysis(text: string, context: string[]): ChaosTheoryAnalysis {
    const systemState = this.assessSystemState(text, context);
    const attractors = this.identifyAttractors(text, context);
    const bifurcationPoints = this.identifyBifurcationPoints(text, context);
    const emergentProperties = this.identifyEmergentProperties(text, context);
    const nonlinearDynamics = this.identifyNonlinearDynamics(text, context);
    
    // Calculate chaos metrics
    const sensitivityToInitialConditions = this.calculateSensitivity(text, context);
    const systemStability = this.calculateStability(systemState, attractors);
    const adaptiveCapacity = this.calculateAdaptiveCapacity(emergentProperties, nonlinearDynamics);
    
    return {
      systemState,
      attractors,
      bifurcationPoints,
      emergentProperties,
      nonlinearDynamics,
      sensitivityToInitialConditions,
      systemStability,
      adaptiveCapacity
    };
  }

  private assessSystemState(text: string, context: string[]): SystemState {
    const lowerText = text.toLowerCase();
    
    // Determine phase
    let phase: 'stable' | 'transitional' | 'chaotic' | 'emergent' = 'stable';
    if (/(changing|transition|shifting)/g.test(lowerText)) phase = 'transitional';
    if (/(chaos|unpredictable|crazy)/g.test(lowerText)) phase = 'chaotic';
    if (/(emerging|new|developing)/g.test(lowerText)) phase = 'emergent';
    
    // Calculate energy (enthusiasm, activity level)
    const energyIndicators = (text.match(/(excited|motivated|active|busy)/g) || []).length;
    const energy = Math.min(energyIndicators * 0.2 + 0.3, 1);
    
    // Calculate entropy (disorder, confusion)
    const entropyIndicators = (text.match(/(confused|uncertain|mixed up|chaotic)/g) || []).length;
    const entropy = Math.min(entropyIndicators * 0.3 + 0.2, 1);
    
    // Calculate information (organized knowledge)
    const infoIndicators = (text.match(/(understand|clear|organized|systematic)/g) || []).length;
    const information = Math.min(infoIndicators * 0.25 + 0.3, 1);
    
    // Calculate coherence (internal consistency)
    const coherence = Math.max(1 - entropy, 0.2);
    
    return { phase, energy, entropy, information, coherence };
  }

  private identifyAttractors(text: string, context: string[]): Attractor[] {
    const attractors: Attractor[] = [];
    const lowerText = text.toLowerCase();
    
    // Stability attractor
    if (/(stable|steady|consistent|reliable)/g.test(lowerText)) {
      attractors.push({
        type: 'point',
        description: 'Stable farming practices',
        strength: 0.8,
        stability: 0.9,
        desirability: 0.7
      });
    }
    
    // Growth cycle attractor
    if (/(cycle|seasonal|pattern|rhythm)/g.test(lowerText)) {
      attractors.push({
        type: 'cycle',
        description: 'Seasonal farming cycles',
        strength: 0.7,
        stability: 0.8,
        desirability: 0.8
      });
    }
    
    // Innovation attractor
    if (/(innovation|change|new|different)/g.test(lowerText)) {
      attractors.push({
        type: 'strange',
        description: 'Innovation and adaptation',
        strength: 0.6,
        stability: 0.4,
        desirability: 0.6
      });
    }
    
    return attractors;
  }

  private identifyBifurcationPoints(text: string, context: string[]): BifurcationPoint[] {
    const points: BifurcationPoint[] = [];
    const lowerText = text.toLowerCase();
    
    // Economic pressure points
    if (/(financial|money|cost|pressure)/g.test(lowerText)) {
      points.push({
        trigger: 'Economic pressure',
        criticalThreshold: 'When costs exceed sustainable levels',
        possibleOutcomes: ['Intensification', 'Diversification', 'Exit farming'],
        probability: 0.6,
        preparedness: 0.4
      });
    }
    
    // Environmental threshold
    if (/(climate|weather|environment|stress)/g.test(lowerText)) {
      points.push({
        trigger: 'Environmental stress',
        criticalThreshold: 'When environmental conditions become unsustainable',
        possibleOutcomes: ['Adaptation', 'Migration', 'System collapse'],
        probability: 0.5,
        preparedness: 0.3
      });
    }
    
    return points;
  }

  private identifyEmergentProperties(text: string, context: string[]): EmergentProperty[] {
    const properties: EmergentProperty[] = [];
    const lowerText = text.toLowerCase();
    
    // Community resilience
    if (/(community|cooperation|together)/g.test(lowerText)) {
      properties.push({
        property: 'Community resilience',
        level: 'community',
        novelty: 0.6,
        significance: 0.8
      });
    }
    
    // Adaptive capacity
    if (/(adapt|flexible|learn|adjust)/g.test(lowerText)) {
      properties.push({
        property: 'Adaptive capacity',
        level: 'individual',
        novelty: 0.7,
        significance: 0.9
      });
    }
    
    return properties;
  }

  private identifyNonlinearDynamics(text: string, context: string[]): NonlinearDynamic[] {
    const dynamics: NonlinearDynamic[] = [];
    const lowerText = text.toLowerCase();
    
    // Small changes, big effects
    if (/(little|small|tiny)/g.test(lowerText) && /(big|huge|major)/g.test(lowerText)) {
      dynamics.push({
        cause: 'Small changes in practice',
        effect: 'Large system transformation',
        amplification: 10,
        timeDelay: 2, // years
        threshold: 'Critical adoption level'
      });
    }
    
    return dynamics;
  }

  private calculateSensitivity(text: string, context: string[]): number {
    const lowerText = text.toLowerCase();
    let sensitivity = 0.3; // Base level
    
    // High sensitivity indicators
    if (/(sensitive|delicate|fragile|vulnerable)/g.test(lowerText)) {
      sensitivity += 0.4;
    }
    
    // Feedback loop indicators
    if (/(feedback|spiral|cascade|domino)/g.test(lowerText)) {
      sensitivity += 0.3;
    }
    
    return Math.min(sensitivity, 1);
  }

  private calculateStability(systemState: SystemState, attractors: Attractor[]): number {
    const stateStability = 1 - systemState.entropy;
    const attractorStability = attractors.reduce((sum, a) => sum + a.stability, 0) / (attractors.length || 1);
    
    return (stateStability + attractorStability) / 2;
  }

  private calculateAdaptiveCapacity(emergent: EmergentProperty[], dynamics: NonlinearDynamic[]): number {
    const emergentCapacity = emergent.reduce((sum, e) => sum + e.significance, 0) / (emergent.length || 1);
    const dynamicCapacity = dynamics.length > 0 ? 0.8 : 0.4; // Presence of dynamics indicates adaptability
    
    return (emergentCapacity + dynamicCapacity) / 2;
  }

  // === PHILOSOPHICAL ANALYSIS METHODS ===
  private identifyPhilosophicalChallenges(text: string, philosophy: SustainabilityPhilosophy): PhilosophicalChallenge[] {
    const challenges: PhilosophicalChallenge[] = [];
    
    // Challenge assumptions
    philosophy.coreBeliefs.forEach(belief => {
      if (belief.tensions.length > 0) {
        challenges.push({
          category: 'assumption',
          challenge: `What if ${belief.belief.toLowerCase()} isn't always true?`,
          evidence: belief.tensions,
          approach: 'gentle_questioning',
          readiness: philosophy.intellectualCuriosity * 0.8
        });
      }
    });
    
    // Challenge contradictions
    philosophy.valueSystem.valueConflicts.forEach(conflict => {
      challenges.push({
        category: 'contradiction',
        challenge: `How might you reconcile ${conflict.tension}?`,
        evidence: [conflict.manifestation],
        approach: 'socratic_method',
        readiness: conflict.dialecticalPotential
      });
    });
    
    return challenges;
  }

  private identifyConceptualGaps(text: string, context: string[]): ConceptualGap[] {
    const gaps: ConceptualGap[] = [];
    const lowerText = text.toLowerCase();
    
    // Systems thinking gap
    if (!(/(system|connect|relationship|network)/g.test(lowerText))) {
      gaps.push({
        missing: 'Systems thinking perspective',
        impact: 'May miss important interconnections',
        bridgingStrategy: 'Introduce systems concepts through concrete examples',
        examples: ['Soil-plant-animal connections', 'Economic-environmental feedback loops']
      });
    }
    
    // Long-term thinking gap
    if (!(/(future|long.term|generation|legacy)/g.test(lowerText))) {
      gaps.push({
        missing: 'Long-term perspective',
        impact: 'Focus may be too short-term',
        bridgingStrategy: 'Explore generational thinking',
        examples: ['Multi-generational farm planning', 'Soil health over decades']
      });
    }
    
    return gaps;
  }

  private developIntellectualEngagementStrategy(philosophy: SustainabilityPhilosophy, ses: SESAnalysis, chaos: ChaosTheoryAnalysis): IntellectualEngagementStrategy {
    // Determine engagement level based on philosophical depth and curiosity
    let level: 'surface' | 'analytical' | 'synthetic' | 'transformative';
    
    if (philosophy.philosophicalDepth > 0.7 && philosophy.intellectualCuriosity > 0.7) {
      level = 'transformative';
    } else if (philosophy.philosophicalDepth > 0.5 || philosophy.intellectualCuriosity > 0.6) {
      level = 'synthetic';
    } else if (philosophy.systemicThinking > 0.5) {
      level = 'analytical';
    } else {
      level = 'surface';
    }
    
    // Determine approach based on worldview
    let approach: 'empirical' | 'rational' | 'intuitive' | 'dialectical' | 'contemplative';
    
    if (philosophy.worldviewOrientation.mechanistic > 0.7) {
      approach = 'empirical';
    } else if (philosophy.worldviewOrientation.organic > 0.7) {
      approach = 'intuitive';
    } else if (philosophy.dialecticalTensions.length > 2) {
      approach = 'dialectical';
    } else if (philosophy.philosophicalDepth > 0.6) {
      approach = 'contemplative';
    } else {
      approach = 'rational';
    }
    
    // Determine techniques
    const techniques = [];
    if (level === 'transformative') techniques.push('Quantum storytelling', 'Archetypal analysis');
    if (approach === 'dialectical') techniques.push('Thesis-antithesis exploration', 'Paradox integration');
    if (philosophy.systemicThinking > 0.5) techniques.push('Systems mapping', 'Feedback loop analysis');
    
    // Determine pacing
    let pacing: 'immediate' | 'gradual' | 'patient' | 'cyclical';
    
    if (chaos.systemState.phase === 'stable') {
      pacing = 'gradual';
    } else if (chaos.systemState.phase === 'transitional') {
      pacing = 'immediate';
    } else if (chaos.systemState.phase === 'chaotic') {
      pacing = 'patient';
    } else {
      pacing = 'cyclical';
    }
    
    return { level, approach, techniques, pacing };
  }

  private generatePhilosophicalPrompts(challenges: PhilosophicalChallenge[], gaps: ConceptualGap[]): PhilosophicalPrompt[] {
    const prompts: PhilosophicalPrompt[] = [];
    
    // Generate prompts from challenges
    challenges.forEach(challenge => {
      if (challenge.readiness > 0.5) {
        prompts.push({
          question: challenge.challenge,
          purpose: `Address ${challenge.category} in thinking`,
          expectedResistance: challenge.readiness < 0.7 ? 'Moderate resistance expected' : 'Low resistance expected',
          followUpStrategies: ['Provide concrete examples', 'Share relevant stories', 'Ask clarifying questions'],
          philosophicalDepth: challenge.readiness
        });
      }
    });
    
    // Generate prompts from gaps
    gaps.forEach(gap => {
      prompts.push({
        question: `How do you see ${gap.missing.toLowerCase()} playing a role in your farming?`,
        purpose: gap.bridgingStrategy,
        expectedResistance: 'Initial confusion possible',
        followUpStrategies: gap.examples,
        philosophicalDepth: 0.6
      });
    });
    
    return prompts;
  }

  private identifyDialecticalOpportunities(tensions: DialecticalTension[]): DialecticalOpportunity[] {
    return tensions.map(tension => ({
      tension: tension.thesis + ' vs ' + tension.antithesis,
      intervention: tension.readinessForSynthesis > 0.6 ? 
        'Explore creative synthesis through dialogue' : 
        'Gently surface the tension first',
      timing: tension.readinessForSynthesis > 0.7 ? 'now' : 
             tension.readinessForSynthesis > 0.5 ? 'soon' : 'later',
      growthPotential: tension.philosophicalImportance * tension.readinessForSynthesis
    }));
  }

  // Additional method to get comprehensive analysis results
  getComprehensiveAnalysis(text: string, context: string[] = []): ComprehensiveInferentialAnalysis {
    return this.analyzeTextComprehensively(text, context);
  }
}