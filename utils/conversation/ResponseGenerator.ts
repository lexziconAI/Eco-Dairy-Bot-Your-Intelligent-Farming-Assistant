import { Orientation } from './DynamicPromptEngine';
import { MatrixAnalysis } from './MatrixComparison';
import { BojeAnalysis } from './NarrativeModule';

export interface ResponseContext {
  orientation: Orientation;
  emotionalTone: string;
  narrativeStage: 'emerging' | 'developing' | 'converging';
  conflictLevel: 'low' | 'medium' | 'high';
  engagementLevel: 'low' | 'medium' | 'high';
  userInput: string;
  detectedThemes: string[];
  narrativeAnalysis?: BojeAnalysis;
}

export interface GeneratedResponse {
  empathicAcknowledgment: string;
  clarificationOrValidation: string;
  insightOrInformation: string;
  storyConnection: string;
  nextStepQuestion: string;
  fullResponse: string;
}

export class ResponseGenerator {
  
  /**
   * Generate a complete response following the 5-part template structure
   * CRITICAL: Must NOT start with "The user..."
   */
  generateResponse(context: ResponseContext): GeneratedResponse {
    const parts = {
      empathicAcknowledgment: this.generateEmpathicAcknowledgment(context),
      clarificationOrValidation: this.generateClarificationOrValidation(context),
      insightOrInformation: this.generateInsightOrInformation(context),
      storyConnection: this.generateStoryConnection(context),
      nextStepQuestion: this.generateNextStepQuestion(context)
    };

    // Combine all parts into full response
    const fullResponse = [
      parts.empathicAcknowledgment,
      parts.clarificationOrValidation,
      parts.insightOrInformation,
      parts.storyConnection,
      parts.nextStepQuestion
    ].filter(part => part.trim().length > 0).join(' ');

    return {
      ...parts,
      fullResponse
    };
  }

  /**
   * 1. Empathic acknowledgement - "Thanks for sharing... it sounds like..."
   */
  private generateEmpathicAcknowledgment(context: ResponseContext): string {
    const { emotionalTone, orientation, userInput } = context;
    
    // Extract key concern or topic from user input
    const keyConcern = this.extractKeyConcern(userInput);
    
    const acknowledgmentTemplates = {
      'P-R': {
        frustration: `Thanks for sharing your concerns about ${keyConcern}. I can hear the frustration in what you're describing, and it's completely understandable given the pressures you're facing.`,
        worry: `I appreciate you opening up about ${keyConcern}. It sounds like there's a lot weighing on your mind, and that's natural when dealing with such important decisions for your farm.`,
        neutral: `Thank you for sharing your thoughts on ${keyConcern}. I can sense you're carefully weighing the different aspects of this decision.`,
        hope: `Thanks for sharing your perspective on ${keyConcern}. I can hear some optimism in your words, even as you're working through the challenges.`
      },
      'P-NR': {
        excitement: `Thank you for sharing your enthusiasm about ${keyConcern}! Your energy around this topic really comes through, and it's exciting to hear about your proactive approach.`,
        hope: `I appreciate you sharing your thoughts on ${keyConcern}. Your hopeful outlook and willingness to explore new possibilities is really encouraging.`,
        neutral: `Thanks for sharing your interest in ${keyConcern}. It sounds like you're actively exploring what this could mean for your operation.`,
        curiosity: `Thank you for bringing up ${keyConcern}. Your curiosity and open-minded approach to farming innovations is refreshing to hear.`
      },
      'PO-R': {
        concern: `Thanks for sharing your observations about ${keyConcern} in your community. It sounds like you're thoughtfully considering how these changes affect not just your farm, but your neighbors too.`,
        frustration: `I appreciate you sharing the community perspective on ${keyConcern}. It can be challenging when there are mixed feelings in the farming community about new approaches.`,
        neutral: `Thank you for bringing up the community aspect of ${keyConcern}. It's valuable to consider how these decisions ripple through farming communities.`
      },
      'PO-NR': {
        leadership: `Thank you for sharing your vision for ${keyConcern}. It sounds like you're thinking about how to lead positive change in your farming community.`,
        collaboration: `I appreciate your perspective on ${keyConcern}. Your focus on bringing the community along in these changes shows real leadership.`,
        neutral: `Thanks for sharing your thoughts on ${keyConcern} from a community perspective. Your inclusive approach to farming decisions is commendable.`
      },
      'PC-R': {
        uncertainty: `Thank you for sharing your thoughts on ${keyConcern}. I understand the uncertainty around climate investments and the need for solid evidence before making changes.`,
        concern: `I appreciate you bringing up ${keyConcern}. The intersection of climate action and farm economics can feel overwhelming, and your cautious approach makes sense.`,
        neutral: `Thanks for sharing your perspective on ${keyConcern}. Balancing climate considerations with practical farming needs requires careful thought.`
      },
      'PC-NR': {
        commitment: `Thank you for sharing your commitment to ${keyConcern}. Your dedication to environmental stewardship while maintaining a viable farming operation is inspiring.`,
        vision: `I appreciate your forward-thinking approach to ${keyConcern}. Your vision for sustainable farming practices shows real environmental leadership.`,
        neutral: `Thanks for sharing your thoughts on ${keyConcern}. Your integration of climate considerations into your farming decisions is commendable.`
      }
    };

    const orientationTemplates = acknowledgmentTemplates[orientation] || acknowledgmentTemplates['P-R'];
    const toneTemplate = orientationTemplates[emotionalTone as keyof typeof orientationTemplates] || orientationTemplates.neutral;
    
    return toneTemplate;
  }

  /**
   * 2. Clarification or validation
   */
  private generateClarificationOrValidation(context: ResponseContext): string {
    const { orientation, conflictLevel, userInput } = context;
    
    if (conflictLevel === 'high') {
      return "I want to make sure I understand correctly - it seems like you're feeling pulled in different directions on this. Is that accurate?";
    }

    if (context.engagementLevel === 'low') {
      return "Help me understand what aspects of this are most important to you right now.";
    }

    // Orientation-specific validation
    const validationTemplates = {
      'P-R': "So if I'm hearing you right, you're weighing the potential benefits against the risks and costs involved?",
      'P-NR': "It sounds like you're actively exploring this and feeling positive about the possibilities - is that how you see it?",
      'PO-R': "From what you're sharing, it seems like community acceptance and proven results are key factors for you?",
      'PO-NR': "It sounds like you're thinking about how to bring others along with you in making these changes?",
      'PC-R': "So you're looking for concrete evidence about the climate benefits and economic viability?",
      'PC-NR': "It seems like you're committed to the environmental goals and working out the practical implementation?"
    };

    return validationTemplates[orientation];
  }

  /**
   * 3. Insight / information provision
   */
  private generateInsightOrInformation(context: ResponseContext): string {
    const { detectedThemes, orientation } = context;
    const primaryTheme = detectedThemes[0] || 'sustainable farming';

    const insightBank = {
      'feed costs': {
        'P-R': "Many farmers find that rotational grazing can reduce feed costs by 20-30% over time, though the initial setup does require some planning and potentially new fencing.",
        'P-NR': "There are several proven strategies for reducing feed costs, including improved pasture management, feed testing, and timing purchases strategically.",
        'PO-R': "I've seen farming communities form feed cooperatives to get better bulk pricing, which helps everyone manage costs together.",
        'PO-NR': "Some innovative farmers are leading feed cost reduction initiatives in their areas, sharing what works and supporting neighbors in making changes.",
        'PC-R': "Research shows that climate-smart feed practices can reduce costs while lowering emissions, with ROI typically seen within 2-3 years.",
        'PC-NR': "Sustainable feed management not only cuts costs but also improves soil health and carbon sequestration on your land."
      },
      'pasture management': {
        'P-R': "Good pasture management typically pays for itself within the first year through improved grass quality and reduced need for supplemental feed.",
        'P-NR': "Rotational grazing systems can increase pasture productivity by 40-60% while improving soil health and reducing labor over time.",
        'PO-R': "Many farming communities have pasture management groups where farmers share equipment and knowledge to make improvements more affordable.",
        'PO-NR': "Leading farmers often demonstrate rotational grazing benefits to neighbors through field days and shared experiences.",
        'PC-R': "Well-managed pastures sequester significant carbon while improving water retention and reducing erosion - measurable environmental benefits.",
        'PC-NR': "Regenerative pasture practices create a positive feedback loop of improved soil health, better water cycles, and increased biodiversity."
      },
      'sustainability': {
        'P-R': "The key to sustainable practices is finding ones that improve your bottom line first, then deliver environmental benefits as a bonus.",
        'P-NR': "Many sustainable farming practices actually reduce input costs and labor while improving soil health and production over time.",
        'PO-R': "Sustainability programs often work best when farming communities adopt them together, sharing costs and learning from each other.",
        'PO-NR': "Farmer-led sustainability initiatives tend to be more successful because they're designed by people who understand the practical challenges.",
        'PC-R': "The most successful sustainability programs provide clear metrics and financial incentives to help farmers measure both environmental and economic returns.",
        'PC-NR': "Integrated sustainability approaches can create multiple revenue streams while building long-term resilience against climate variability."
      }
    };

    const themeInsights = insightBank[primaryTheme as keyof typeof insightBank] || insightBank['sustainability'];
    return themeInsights[orientation] || themeInsights['P-R'];
  }

  /**
   * 4. Story connection
   */
  private generateStoryConnection(context: ResponseContext): string {
    const { narrativeAnalysis, narrativeStage, detectedThemes } = context;
    
    if (!narrativeAnalysis) {
      return "This reminds me of other farmers who've shared similar experiences - the journey often starts with exactly these kinds of considerations.";
    }

    if (narrativeAnalysis.livingStories.length > 0) {
      const recentStory = narrativeAnalysis.livingStories[narrativeAnalysis.livingStories.length - 1];
      return `This connects to what you shared earlier about ${recentStory.theme} - I can see how these experiences are building on each other.`;
    }

    if (narrativeAnalysis.anteNarratives.length > 0) {
      const recentAnte = narrativeAnalysis.anteNarratives[narrativeAnalysis.anteNarratives.length - 1];
      return `This fits with your aspirations around ${recentAnte.aspiration} - it's interesting how these ideas are taking shape.`;
    }

    // Default connection based on narrative stage
    const stageConnections = {
      emerging: "What you're describing sounds like the beginning of an important journey that many successful farmers have taken.",
      developing: "I can see how your thinking on this is evolving and becoming more nuanced as you work through the different factors.",
      converging: "It sounds like you're bringing together all the pieces you've been considering and moving toward some clear decisions."
    };

    return stageConnections[narrativeStage];
  }

  /**
   * 5. Next step open question
   */
  private generateNextStepQuestion(context: ResponseContext): string {
    const { orientation, engagementLevel, conflictLevel, detectedThemes } = context;
    
    // High conflict situations need resolution-focused questions
    if (conflictLevel === 'high') {
      return "What would help you feel more confident about moving forward - more information, talking to other farmers, or seeing some examples of how this has worked out?";
    }

    // Low engagement needs motivation
    if (engagementLevel === 'low') {
      return "What aspects of this would be most valuable for your specific situation?";
    }

    // Orientation-specific next steps
    const nextStepTemplates = {
      'P-R': "What would it take for you to feel comfortable taking a small first step in this direction?",
      'P-NR': "What's the first thing you'd want to try or implement on your farm?",
      'PO-R': "How could we address the community concerns while still moving forward with what makes sense for your operation?",
      'PO-NR': "What would be the best way to share your experience and insights with other farmers in your area?",
      'PC-R': "What kind of pilot project or small-scale trial would give you the data you need to make a bigger decision?",
      'PC-NR': "How can we help you turn your environmental goals into concrete, measurable actions on your farm?"
    };

    return nextStepTemplates[orientation];
  }

  /**
   * Helper method to extract key concern from user input
   */
  private extractKeyConcern(userInput: string): string {
    const concerns = [
      'feed costs', 'pasture management', 'sustainability', 'climate change',
      'technology', 'regulations', 'market prices', 'animal welfare',
      'soil health', 'water management', 'equipment', 'labor'
    ];

    const lowerInput = userInput.toLowerCase();
    
    for (const concern of concerns) {
      if (lowerInput.includes(concern)) {
        return concern;
      }
    }

    // Extract key nouns as fallback
    const words = userInput.split(/\s+/);
    const keyWords = words.filter(word => 
      word.length > 4 && 
      !['that', 'with', 'have', 'been', 'this', 'they', 'were', 'will'].includes(word.toLowerCase())
    );
    
    return keyWords.length > 0 ? keyWords[0].toLowerCase() : 'your farming situation';
  }

  /**
   * Generate contextual follow-up based on response patterns
   */
  generateFollowUp(previousResponses: string[], currentContext: ResponseContext): string {
    // If user has been giving short responses, encourage elaboration
    const avgResponseLength = previousResponses.reduce((sum, resp) => sum + resp.split(' ').length, 0) / previousResponses.length;
    
    if (avgResponseLength < 10) {
      return "I'd love to hear more details about your specific situation. Can you tell me more about what this looks like on your farm?";
    }

    // If user is highly engaged, go deeper
    if (currentContext.engagementLevel === 'high') {
      return "You're clearly thinking deeply about this. What other aspects of this challenge have you been considering?";
    }

    // Default follow-up
    return "What questions do you have about moving forward with this?";
  }
}