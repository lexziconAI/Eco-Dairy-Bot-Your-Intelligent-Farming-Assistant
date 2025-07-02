export type Orientation = 'P-R' | 'P-NR' | 'PO-R' | 'PO-NR' | 'PC-R' | 'PC-NR';

export interface PromptContext {
  orientation: Orientation;
  sentiment: number;
  topicHistory: string[];
  lastResponse: string;
  conversationDepth: number;
  detectedConcerns: string[];
}

export class DynamicPromptEngine {
  private static promptTemplates = {
    'P-R': {
      initial: "What specific costs concern you most about {topic}?",
      followUp: "Tell me more about your experience with {concern}. What makes it challenging?",
      clarifying: "When you say {phrase}, are you thinking about the financial impact or something else?",
      deepening: "What would need to change for you to feel more confident about {topic}?",
      resolution: "If we could address {concern}, what would that mean for your farm?"
    },
    'P-NR': {
      initial: "What improvements would have the biggest impact on your farm?",
      followUp: "That's interesting about {topic}. What specific results are you hoping to see?",
      clarifying: "Help me understand - is {topic} something you're actively planning or still exploring?",
      deepening: "What's driving your interest in {topic}? Is it efficiency, sustainability, or something else?",
      resolution: "What's your timeline for implementing {topic}? What support would help?"
    },
    'PO-R': {
      initial: "How do other farmers in your area view these changes?",
      followUp: "You mentioned {topic}. What's the general sentiment in your community?",
      clarifying: "Are these concerns coming from personal experience or community discussions?",
      deepening: "What would help your community feel more comfortable with {topic}?",
      resolution: "Who in your community might be open to trying {topic} first?"
    },
    'PO-NR': {
      initial: "What would help you lead this change in your community?",
      followUp: "As someone interested in {topic}, what obstacles do you see for others?",
      clarifying: "Are you looking to implement this yourself first or bring others along?",
      deepening: "What success stories from your area inspire you?",
      resolution: "How can we help you share your vision with other farmers?"
    },
    'PC-R': {
      initial: "What evidence would help you evaluate climate-smart investments?",
      followUp: "You mentioned {concern}. What data would be most convincing for you?",
      clarifying: "Are you looking for local examples or broader research on {topic}?",
      deepening: "What's your biggest uncertainty about the climate benefits of {topic}?",
      resolution: "What ROI timeline would make {topic} viable for your operation?"
    },
    'PC-NR': {
      initial: "Which climate resilience measures align with your goals?",
      followUp: "You're interested in {topic}. How does this fit your sustainability vision?",
      clarifying: "Is {topic} part of a larger sustainability plan you're developing?",
      deepening: "What environmental outcomes matter most to you?",
      resolution: "What's the next step in your climate adaptation journey?"
    }
  };

  static generatePrompt(
    type: 'initial' | 'followUp' | 'clarifying' | 'deepening' | 'resolution',
    context: PromptContext
  ): string {
    const templates = this.promptTemplates[context.orientation];
    let template = templates[type];

    // Replace placeholders with context
    if (context.detectedConcerns.length > 0) {
      template = template.replace('{concern}', context.detectedConcerns[0]);
    }
    
    if (context.topicHistory.length > 0) {
      template = template.replace('{topic}', context.topicHistory[context.topicHistory.length - 1]);
    }

    // Extract key phrases from last response for clarifying prompts
    if (type === 'clarifying' && context.lastResponse) {
      const keyPhrase = this.extractKeyPhrase(context.lastResponse);
      template = template.replace('{phrase}', keyPhrase);
    }

    return template;
  }

  static determinePromptType(context: PromptContext): 'initial' | 'followUp' | 'clarifying' | 'deepening' | 'resolution' {
    // Initial prompt for new conversations
    if (context.conversationDepth === 0) {
      return 'initial';
    }

    // Resolution prompt when ready to conclude
    if (context.conversationDepth > 6 && context.sentiment > 0.5) {
      return 'resolution';
    }

    // Clarifying when ambiguity detected
    if (this.detectAmbiguity(context.lastResponse)) {
      return 'clarifying';
    }

    // Deepening for engaged conversations
    if (context.conversationDepth > 3 && context.sentiment > 0) {
      return 'deepening';
    }

    // Default to follow-up
    return 'followUp';
  }

  private static extractKeyPhrase(text: string): string {
    // Simple extraction - get the most meaningful phrase
    const sentences = text.split(/[.!?]+/);
    const lastSentence = sentences[sentences.length - 2] || sentences[sentences.length - 1];
    
    // Look for phrases with uncertainty markers
    const uncertaintyMarkers = ['maybe', 'might', 'could', 'possibly', 'wondering', 'not sure'];
    for (const marker of uncertaintyMarkers) {
      if (lastSentence.toLowerCase().includes(marker)) {
        const words = lastSentence.split(' ');
        const markerIndex = words.findIndex(w => w.toLowerCase().includes(marker));
        return words.slice(Math.max(0, markerIndex - 2), markerIndex + 3).join(' ');
      }
    }

    // Return last 5-7 words as fallback
    const words = lastSentence.trim().split(' ');
    return words.slice(-6).join(' ');
  }

  private static detectAmbiguity(text: string): boolean {
    const ambiguityMarkers = [
      'maybe', 'might', 'could be', 'possibly', 'not sure',
      'i guess', 'perhaps', 'either', 'or maybe', 'kind of'
    ];
    
    const lowerText = text.toLowerCase();
    return ambiguityMarkers.some(marker => lowerText.includes(marker));
  }

  static getInitialPrompt(): string {
    return "Hello! I'm here to explore sustainable farming possibilities with you. What's been on your mind lately about your farm's future?";
  }
}