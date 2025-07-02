export interface DetectedClues {
  linguisticMarkers: LinguisticMarker[];
  topicPatterns: TopicPattern[];
  engagementSignals: EngagementSignal[];
  contradictionFlags: ContradictionFlag[];
}

export interface LinguisticMarker {
  type: 'hesitation' | 'certainty' | 'emotion' | 'uncertainty';
  text: string;
  confidence: number;
}

export interface TopicPattern {
  type: 'repeated_concern' | 'avoided_subject' | 'enthusiasm_trigger';
  topic: string;
  frequency: number;
}

export interface EngagementSignal {
  type: 'response_length' | 'response_speed' | 'question_asking';
  value: number;
  interpretation: 'high' | 'medium' | 'low';
}

export interface ContradictionFlag {
  statement1: string;
  statement2: string;
  topic: string;
  severity: 'minor' | 'major';
}

export class ClueDetectionEngine {
  private conversationHistory: string[] = [];
  private responseTimestamps: number[] = [];
  private topicMentions: Map<string, number> = new Map();

  analyzeResponse(
    userResponse: string,
    responseTime?: number
  ): DetectedClues {
    // Add to history
    this.conversationHistory.push(userResponse);
    if (responseTime) {
      this.responseTimestamps.push(responseTime);
    }

    return {
      linguisticMarkers: this.detectLinguisticMarkers(userResponse),
      topicPatterns: this.detectTopicPatterns(userResponse),
      engagementSignals: this.detectEngagementSignals(userResponse, responseTime),
      contradictionFlags: this.detectContradictions(userResponse)
    };
  }

  private detectLinguisticMarkers(text: string): LinguisticMarker[] {
    const markers: LinguisticMarker[] = [];
    const lowerText = text.toLowerCase();

    // Hesitation markers
    const hesitationWords = [
      'um', 'uh', 'well', 'you know', 'i mean', 'sort of', 'kind of',
      'i guess', 'maybe', 'perhaps', 'possibly'
    ];
    
    for (const word of hesitationWords) {
      if (lowerText.includes(word)) {
        markers.push({
          type: 'hesitation',
          text: word,
          confidence: 0.8
        });
      }
    }

    // Certainty markers
    const certaintyWords = [
      'definitely', 'absolutely', 'certainly', 'sure', 'obviously',
      'clearly', 'without doubt', 'for sure', 'no question'
    ];
    
    for (const word of certaintyWords) {
      if (lowerText.includes(word)) {
        markers.push({
          type: 'certainty',
          text: word,
          confidence: 0.9
        });
      }
    }

    // Emotion markers
    const emotionPatterns = [
      { pattern: /frustrat|angry|upset|annoyed/i, emotion: 'frustration' },
      { pattern: /excit|thrill|eager|enthusiastic/i, emotion: 'excitement' },
      { pattern: /worr|concern|anxious|nervous/i, emotion: 'worry' },
      { pattern: /hope|optimis|looking forward/i, emotion: 'hope' }
    ];

    for (const { pattern, emotion } of emotionPatterns) {
      if (pattern.test(text)) {
        markers.push({
          type: 'emotion',
          text: emotion,
          confidence: 0.85
        });
      }
    }

    // Uncertainty markers
    const uncertaintyPhrases = [
      "i'm not sure", "don't know", "hard to say", "it depends",
      "might be", "could be", "unclear", "not certain"
    ];

    for (const phrase of uncertaintyPhrases) {
      if (lowerText.includes(phrase)) {
        markers.push({
          type: 'uncertainty',
          text: phrase,
          confidence: 0.9
        });
      }
    }

    return markers;
  }

  private detectTopicPatterns(text: string): TopicPattern[] {
    const patterns: TopicPattern[] = [];
    
    // Common dairy farming topics
    const topics = [
      'feed costs', 'pasture', 'emissions', 'milk production',
      'weather', 'equipment', 'labor', 'regulations', 'market prices',
      'sustainability', 'organic', 'technology', 'breeding', 'health'
    ];

    // Update topic mentions
    for (const topic of topics) {
      if (text.toLowerCase().includes(topic)) {
        const currentCount = this.topicMentions.get(topic) || 0;
        this.topicMentions.set(topic, currentCount + 1);
      }
    }

    // Identify repeated concerns (mentioned 3+ times)
    const topicEntries = Array.from(this.topicMentions.entries());
    for (const [topic, count] of topicEntries) {
      if (count >= 3) {
        patterns.push({
          type: 'repeated_concern',
          topic,
          frequency: count
        });
      }
    }

    // Detect enthusiasm triggers
    const enthusiasmWords = ['love', 'excited', 'great', 'wonderful', 'amazing'];
    for (const topic of topics) {
      if (text.toLowerCase().includes(topic)) {
        for (const word of enthusiasmWords) {
          if (text.toLowerCase().includes(word)) {
            patterns.push({
              type: 'enthusiasm_trigger',
              topic,
              frequency: 1
            });
            break;
          }
        }
      }
    }

    // Detect avoided subjects (topics mentioned early but not recently)
    if (this.conversationHistory.length > 5) {
      const recentTexts = this.conversationHistory.slice(-3).join(' ').toLowerCase();
      const earlyTexts = this.conversationHistory.slice(0, 3).join(' ').toLowerCase();
      
      for (const topic of topics) {
        if (earlyTexts.includes(topic) && !recentTexts.includes(topic)) {
          patterns.push({
            type: 'avoided_subject',
            topic,
            frequency: 0
          });
        }
      }
    }

    return patterns;
  }

  private detectEngagementSignals(
    text: string,
    responseTime?: number
  ): EngagementSignal[] {
    const signals: EngagementSignal[] = [];

    // Response length signal
    const wordCount = text.split(/\s+/).length;
    signals.push({
      type: 'response_length',
      value: wordCount,
      interpretation: wordCount > 50 ? 'high' : wordCount > 20 ? 'medium' : 'low'
    });

    // Response speed signal
    if (responseTime && this.responseTimestamps.length > 1) {
      const avgResponseTime = this.responseTimestamps.reduce((a, b) => a + b, 0) / this.responseTimestamps.length;
      signals.push({
        type: 'response_speed',
        value: responseTime,
        interpretation: responseTime < avgResponseTime * 0.7 ? 'high' : 
                       responseTime > avgResponseTime * 1.3 ? 'low' : 'medium'
      });
    }

    // Question asking signal
    const questionCount = (text.match(/\?/g) || []).length;
    signals.push({
      type: 'question_asking',
      value: questionCount,
      interpretation: questionCount >= 2 ? 'high' : questionCount === 1 ? 'medium' : 'low'
    });

    return signals;
  }

  private detectContradictions(currentText: string): ContradictionFlag[] {
    const flags: ContradictionFlag[] = [];
    
    if (this.conversationHistory.length < 2) {
      return flags;
    }

    // Simple contradiction detection based on sentiment reversal
    const positiveWords = ['good', 'great', 'love', 'excited', 'interested'];
    const negativeWords = ['bad', 'hate', 'worried', 'concerned', 'afraid'];
    
    const currentPositive = positiveWords.some(w => currentText.toLowerCase().includes(w));
    const currentNegative = negativeWords.some(w => currentText.toLowerCase().includes(w));

    // Check against previous statements
    for (let i = this.conversationHistory.length - 2; i >= 0; i--) {
      const prevText = this.conversationHistory[i];
      const prevPositive = positiveWords.some(w => prevText.toLowerCase().includes(w));
      const prevNegative = negativeWords.some(w => prevText.toLowerCase().includes(w));

      // Detect contradiction
      if ((currentPositive && prevNegative) || (currentNegative && prevPositive)) {
        // Try to identify the topic
        const topics = ['sustainability', 'technology', 'costs', 'change'];
        let contradictionTopic = 'general';
        
        for (const topic of topics) {
          if (currentText.toLowerCase().includes(topic) && prevText.toLowerCase().includes(topic)) {
            contradictionTopic = topic;
            break;
          }
        }

        flags.push({
          statement1: prevText.substring(0, 50) + '...',
          statement2: currentText.substring(0, 50) + '...',
          topic: contradictionTopic,
          severity: i === this.conversationHistory.length - 2 ? 'major' : 'minor'
        });
      }
    }

    return flags;
  }

  reset(): void {
    this.conversationHistory = [];
    this.responseTimestamps = [];
    this.topicMentions.clear();
  }

  getConversationInsights(): {
    dominantTopics: string[];
    overallEngagement: 'high' | 'medium' | 'low';
    emotionalTone: string;
  } {
    // Get top 3 mentioned topics
    const sortedTopics = Array.from(this.topicMentions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);

    // Calculate average response length
    const avgWordCount = this.conversationHistory.reduce((sum, text) => {
      return sum + text.split(/\s+/).length;
    }, 0) / this.conversationHistory.length;

    const overallEngagement = avgWordCount > 40 ? 'high' : avgWordCount > 20 ? 'medium' : 'low';

    // Determine emotional tone
    const allText = this.conversationHistory.join(' ').toLowerCase();
    const tones = [
      { name: 'optimistic', keywords: ['excited', 'hope', 'looking forward', 'great'] },
      { name: 'cautious', keywords: ['worried', 'concerned', 'not sure', 'maybe'] },
      { name: 'frustrated', keywords: ['frustrated', 'difficult', 'problems', 'issues'] },
      { name: 'curious', keywords: ['interested', 'tell me', 'wondering', 'questions'] }
    ];

    let dominantTone = 'neutral';
    let maxScore = 0;

    for (const tone of tones) {
      const score = tone.keywords.filter(k => allText.includes(k)).length;
      if (score > maxScore) {
        maxScore = score;
        dominantTone = tone.name;
      }
    }

    return {
      dominantTopics: sortedTopics,
      overallEngagement,
      emotionalTone: dominantTone
    };
  }
}