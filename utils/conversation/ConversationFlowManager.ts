import { Orientation } from './DynamicPromptEngine';

export interface ConversationState {
  currentTopic: string;
  previousTopics: string[];
  depth: number;
  momentum: 'building' | 'steady' | 'declining';
  branchPoints: BranchPoint[];
  topicTransitions: TopicTransition[];
}

export interface BranchPoint {
  fromTopic: string;
  toTopics: string[];
  reason: 'user_interest' | 'natural_progression' | 'clarification_needed';
  timestamp: number;
}

export interface TopicTransition {
  from: string;
  to: string;
  smooth: boolean;
  timestamp: number;
}

export class ConversationFlowManager {
  private state: ConversationState;
  private topicGraph: Map<string, string[]>;

  constructor() {
    this.state = {
      currentTopic: 'general',
      previousTopics: [],
      depth: 0,
      momentum: 'building',
      branchPoints: [],
      topicTransitions: []
    };

    // Initialize topic relationship graph
    this.topicGraph = new Map([
      ['feed_costs', ['pasture_management', 'sustainable_feed', 'financial_planning']],
      ['pasture_management', ['rotational_grazing', 'soil_health', 'feed_costs']],
      ['emissions', ['methane_reduction', 'carbon_sequestration', 'sustainable_practices']],
      ['sustainable_practices', ['certification', 'market_opportunities', 'community_adoption']],
      ['technology', ['precision_farming', 'data_management', 'investment_roi']],
      ['climate_adaptation', ['water_management', 'heat_stress', 'resilient_breeds']],
    ]);
  }

  updateFlow(userResponse: string, detectedTopics: string[]): void {
    const previousTopic = this.state.currentTopic;
    
    // Determine new topic
    const newTopic = this.selectBestTopic(detectedTopics);
    
    // Update state
    if (newTopic !== previousTopic) {
      this.state.previousTopics.push(previousTopic);
      this.state.currentTopic = newTopic;
      
      // Record transition
      this.state.topicTransitions.push({
        from: previousTopic,
        to: newTopic,
        smooth: this.isRelatedTopic(previousTopic, newTopic),
        timestamp: Date.now()
      });
    }

    // Update depth
    this.state.depth++;

    // Update momentum
    this.state.momentum = this.calculateMomentum(userResponse);

    // Check for branch points
    if (detectedTopics.length > 1) {
      this.state.branchPoints.push({
        fromTopic: previousTopic,
        toTopics: detectedTopics,
        reason: 'user_interest',
        timestamp: Date.now()
      });
    }
  }

  private selectBestTopic(detectedTopics: string[]): string {
    if (detectedTopics.length === 0) {
      return this.state.currentTopic;
    }

    // Prefer topics related to current topic
    for (const topic of detectedTopics) {
      if (this.isRelatedTopic(this.state.currentTopic, topic)) {
        return topic;
      }
    }

    // Otherwise, take the first detected topic
    return detectedTopics[0];
  }

  private isRelatedTopic(topic1: string, topic2: string): boolean {
    const relatedTopics = this.topicGraph.get(topic1) || [];
    return relatedTopics.includes(topic2);
  }

  private calculateMomentum(userResponse: string): 'building' | 'steady' | 'declining' {
    const responseLength = userResponse.split(' ').length;
    const hasQuestions = userResponse.includes('?');
    const hasPositiveMarkers = /interest|excited|curious|tell me more|want to know/i.test(userResponse);
    const hasNegativeMarkers = /not sure|don't know|maybe later|complicated/i.test(userResponse);

    // Building momentum indicators
    if (responseLength > 20 && (hasQuestions || hasPositiveMarkers)) {
      return 'building';
    }

    // Declining momentum indicators
    if (responseLength < 10 || hasNegativeMarkers) {
      return 'declining';
    }

    return 'steady';
  }

  shouldPivotTopic(): boolean {
    // Pivot if momentum is declining and we've been on topic for a while
    if (this.state.momentum === 'declining' && this.state.depth > 3) {
      return true;
    }

    // Don't pivot if user is engaged
    if (this.state.momentum === 'building') {
      return false;
    }

    // Consider pivoting after sufficient depth on steady momentum
    return this.state.momentum === 'steady' && this.state.depth > 5;
  }

  suggestNextTopic(): string | null {
    const relatedTopics = this.topicGraph.get(this.state.currentTopic) || [];
    
    // Filter out topics we've already covered
    const unseenTopics = relatedTopics.filter(
      topic => !this.state.previousTopics.includes(topic)
    );

    return unseenTopics.length > 0 ? unseenTopics[0] : null;
  }

  getDepthLevel(): 'surface' | 'exploring' | 'deep' {
    if (this.state.depth < 3) return 'surface';
    if (this.state.depth < 6) return 'exploring';
    return 'deep';
  }

  shouldStepBack(): boolean {
    // Step back if user seems overwhelmed
    return this.state.momentum === 'declining' && this.getDepthLevel() === 'deep';
  }

  getConversationState(): ConversationState {
    return { ...this.state };
  }

  reset(): void {
    this.state = {
      currentTopic: 'general',
      previousTopics: [],
      depth: 0,
      momentum: 'building',
      branchPoints: [],
      topicTransitions: []
    };
  }

  // Analytics methods
  getTopicEngagement(): Map<string, number> {
    const engagement = new Map<string, number>();
    
    for (const transition of this.state.topicTransitions) {
      const count = engagement.get(transition.to) || 0;
      engagement.set(transition.to, count + 1);
    }

    return engagement;
  }

  getSmoothTransitionRate(): number {
    if (this.state.topicTransitions.length === 0) return 1;
    
    const smoothTransitions = this.state.topicTransitions.filter(t => t.smooth).length;
    return smoothTransitions / this.state.topicTransitions.length;
  }
}