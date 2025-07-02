import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Brain, MessageCircle, BarChart3, ArrowLeft, 
  Users, TrendingUp, History, Plus, Eye, Loader, Sparkles
} from 'lucide-react';
import { transcribeAudio, analyzeText, isApiAuthError, generateSpeech } from '@/utils/api';
import { useDebug } from '@/hooks/useDebug';
import { VoicePlayer } from '@/components/VoicePlayer';

// Component to render formatted message content
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  // Convert various markdown-style formatting to HTML
  const formatContent = (text: string) => {
    return text
      // Convert double line breaks to paragraphs
      .replace(/\n\n+/g, '</p><p>')
      // Convert single line breaks to <br>
      .replace(/\n/g, '<br>')
      // Bold text **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Handle bullet points with proper line breaks
      .replace(/^[•\-]\s+(.+)$/gm, '<div class="bullet-point">• $1</div>')
      // Handle numbered lists with proper line breaks
      .replace(/^(\d+\.)\s+(.+)$/gm, '<div class="numbered-point"><strong>$1</strong> $2</div>')
      // Wrap in paragraph tags
      .replace(/^(.)/gm, '<p>$1')
      .replace(/(.+)$/gm, '$1</p>')
      // Clean up multiple paragraph tags
      .replace(/<\/p><p>/g, '</p>\n<p>')
      // Handle existing HTML
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, '')
      // Fix bullet points that got wrapped in paragraphs
      .replace(/<p><div class="bullet-point">/g, '<div class="bullet-point">')
      .replace(/<\/div><\/p>/g, '</div>')
      .replace(/<p><div class="numbered-point">/g, '<div class="numbered-point">')
      // Ensure proper spacing around bullet points
      .replace(/(<div class="bullet-point">.*?<\/div>)/g, '\n$1\n')
      .replace(/(<div class="numbered-point">.*?<\/div>)/g, '\n$1\n');
  };

  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: formatContent(content) 
      }} 
      className="formatted-message"
    />
  );
};

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface ConversationSession {
  id: string;
  title: string;
  messages: Message[];
  userMessageCount: number;
  lastUpdated: number;
  timestamp: number;
}

interface ConversationPanelProps {
  onAnalyze: (conversationHistory: Message[]) => void;
  isAnalyzing: boolean;
  onApiError?: (error: any) => void;
  voiceEnabled: boolean;
}


export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  onAnalyze,
  isAnalyzing,
  onApiError,
  voiceEnabled
}) => {
  // Conversation state
  const [currentInput, setCurrentInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationSession[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Voice/Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcriptionError, setTranscriptionError] = useState<any>(null);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Dairy farming conversation starters
  const dairyPrompts = [
    "What's your biggest challenge in dairy farming right now?",
    "How do you balance profitability with environmental stewardship on your farm?",
    "What role does technology play in your dairy operation?",
    "How has climate change affected your farming practices?",
    "What does sustainable dairy farming mean to you?",
    "How do you see the future of dairy farming evolving?"
  ];

  // Debug logging
  useDebug('conversationPanel', {
    conversationLength: conversation.length,
    userMessages: conversation.filter(m => m.type === 'user').length,
    isThinking,
    isRecording,
    hasAudioBlob: !!audioBlob,
    currentConversationId,
    historyCount: conversationHistory.length
  }, [conversation, isThinking, isRecording, audioBlob, currentConversationId, conversationHistory]);

  useEffect(() => {
    // Load conversation history from localStorage
    const savedHistory = localStorage.getItem('eco-dairy-bot-conversations');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setConversationHistory(parsed);
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    }

    // Initialize conversation with a farming-focused prompt
    const prompt = dairyPrompts[Math.floor(Math.random() * dairyPrompts.length)];
    setConversation([{
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: `Welcome to your dairy farming assistant! I'm here to help you explore sustainable farming practices and understand your approach to modern agriculture.\n\nLet's start with this: **${prompt}**\n\nFeel free to share your thoughts, experiences, or questions about dairy farming. We can have a natural conversation, and when you're ready, I can analyze our discussion to provide deeper insights about your farming philosophy and approach.`,
      timestamp: Date.now()
    }]);

  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const saveConversationHistory = (conversationToSave: ConversationSession) => {
    const updatedHistory = currentConversationId 
      ? conversationHistory.map(conv => conv.id === currentConversationId ? conversationToSave : conv)
      : [...conversationHistory, conversationToSave];
    
    setConversationHistory(updatedHistory);
    localStorage.setItem('eco-dairy-bot-conversations', JSON.stringify(updatedHistory));
  };

  const generateBotResponse = async (userMessage: string, conversationContext: Message[]): Promise<string> => {
    try {
      // Calculate response length target based on user input
      const userWords = userMessage.trim().split(/\s+/).length;
      let targetLength: string;
      let responseStyle: string;
      
      if (userWords <= 10) {
        targetLength = "Keep your response brief (1-2 sentences, 15-30 words)";
        responseStyle = "conversational and direct";
      } else if (userWords <= 50) {
        targetLength = "Provide a moderate response (2-4 sentences, 30-80 words)";
        responseStyle = "thoughtful and engaging";
      } else if (userWords <= 100) {
        targetLength = "Give a substantial response (1-2 paragraphs, 80-150 words)";
        responseStyle = "detailed and analytical";
      } else {
        targetLength = "Provide a comprehensive response (2-3 paragraphs, 150-250 words)";
        responseStyle = "thorough and nuanced";
      }
      
      // Build conversation history for context
      const recentContext = conversationContext
        .slice(-6) // Last 6 messages for context
        .map(msg => `${msg.type === 'user' ? 'Farmer' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');
      
      const systemPrompt = `You are an intelligent dairy farming assistant with deep knowledge of sustainable agriculture, farm economics, and rural life. You engage in natural conversations with dairy farmers about their operations, challenges, and aspirations.

Your personality:
- Knowledgeable but not preachy
- Genuinely curious about their specific situation
- Practical and realistic about farming challenges
- Supportive of both traditional and innovative approaches
- Use farming terminology naturally
- Include relevant emojis (🐄🌱💚🚜) but don't overdo it

Response guidelines:
- ${targetLength}
- Style: ${responseStyle}
- Use **bold** for emphasis on key points
- Use bullet points (•) when listing multiple items
- Ask follow-up questions to deepen the conversation
- Reference specific details they've shared
- Use HTML formatting: <strong>bold</strong>, <em>italics</em>, <br> for line breaks

Focus areas: sustainability, profitability, technology adoption, family farming, community, environmental stewardship, and practical farm management.`;
      
      const userPrompt = `Recent conversation context:
${recentContext}

Farmer's latest message: "${userMessage}"

Provide a thoughtful, engaging response that continues this dairy farming conversation. Match their level of detail and energy.`;
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: Math.min(300 + (userWords * 2), 500) // Dynamic token limit
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Chat API error:', response.status, errorData);
        throw new Error(`Chat API failed: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      return data.response || data.message || 'I appreciate what you\'ve shared. Could you tell me more about that?';
      
    } catch (error) {
      console.error('Error generating bot response:', error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      
      // Fallback responses based on message length
      const userWords = userMessage.trim().split(/\s+/).length;
      
      if (userWords <= 10) {
        return "Thanks for sharing! 🐄 What else would you like to discuss about your farming operation?";
      } else if (userWords <= 50) {
        return "That's really interesting! It sounds like you've put a lot of thought into this. **What specific challenges** are you facing with this approach, and how are you working through them?";
      } else if (userWords <= 100) {
        return "Thank you for that detailed perspective! Your thinking clearly goes beyond just the technical aspects of farming. **What specific farming practices** does this philosophy lead you toward, and how do you see it playing out in your day-to-day operations?";
      } else {
        return "Thank you for sharing such a comprehensive perspective! That's a fascinating theological and economic framework for thinking about environmental stewardship. <br><br>Your emphasis on **human flourishing first** and the role of **prosperity in enabling conservation** raises really important questions about development priorities. <br><br>• How do you see this philosophy applying specifically to dairy farming practices?<br>• What role do you think modern agricultural technology should play in this framework?<br>• How do you balance immediate productivity needs with longer-term stewardship goals on your operation?";
      }
    }
  };

  const sendMessage = async () => {
    if (!currentInput.trim() || isThinking) return;
    
    const userMessage = currentInput.trim();
    setCurrentInput('');
    setIsThinking(true);
    
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user', 
      content: userMessage,
      timestamp: Date.now()
    };
    
    const newConversation = [...conversation, userMsg];
    setConversation(newConversation);
    
    try {
      // Generate contextual bot response
      const botResponse = await generateBotResponse(userMessage, newConversation);
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: botResponse,
        timestamp: Date.now()
      };
      
      const finalConversation = [...newConversation, botMsg];
      setConversation(finalConversation);
      
      // Auto-save conversation if it has multiple user messages
      const userMessageCount = finalConversation.filter(msg => msg.type === 'user').length;
      if (userMessageCount >= 2) {
        const conversationToSave: ConversationSession = {
          id: currentConversationId || `conv-${Date.now()}`,
          title: finalConversation.find(msg => msg.type === 'user')?.content.slice(0, 50) + '...' || 'New Conversation',
          messages: finalConversation,
          userMessageCount,
          lastUpdated: Date.now(),
          timestamp: Date.now()
        };
        
        if (!currentConversationId) {
          setCurrentConversationId(conversationToSave.id);
        }
        
        saveConversationHistory(conversationToSave);
      }
      
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMsg: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "I'm having trouble responding right now, but I'm still here to listen. What else would you like to share about your farming experience?",
        timestamp: Date.now()
      };
      setConversation([...newConversation, errorMsg]);
    }
    
    setIsThinking(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    // Save current conversation if it has user messages
    if (conversation.filter(msg => msg.type === 'user').length > 0) {
      const conversationToSave: ConversationSession = {
        id: currentConversationId || `conv-${Date.now()}`,
        title: conversation.find(msg => msg.type === 'user')?.content.slice(0, 50) + '...' || 'New Conversation',
        messages: conversation,
        userMessageCount: conversation.filter(msg => msg.type === 'user').length,
        lastUpdated: Date.now(),
        timestamp: Date.now()
      };
      
      saveConversationHistory(conversationToSave);
    }
    
    // Start new conversation
    const prompt = dairyPrompts[Math.floor(Math.random() * dairyPrompts.length)];
    setConversation([{
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: `Welcome back! Let's explore another aspect of dairy farming. **${prompt}** What's your take on this?`,
      timestamp: Date.now()
    }]);
    setCurrentConversationId(null);
  };

  const loadConversation = (conv: ConversationSession) => {
    setConversation(conv.messages);
    setCurrentConversationId(conv.id);
  };

  const runAnalysis = () => {
    const userMessages = conversation.filter(msg => msg.type === 'user');
    
    if (userMessages.length === 0) {
      alert('Please have some conversation before running analysis!');
      return;
    }

    onAnalyze(conversation);
  };


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      // Use WebM if supported, fallback to default
      const options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options.mimeType = 'audio/mp4';
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/wav';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone permissions and try again.');
      } else {
        alert('Could not access microphone. Please check your device and browser settings.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAndSend = async () => {
    if (!audioBlob) return;

    try {
      setTranscriptionError(null);
      console.log('Starting transcription...', { audioSize: audioBlob.size, audioType: audioBlob.type });
      const transcript = await transcribeAudio(audioBlob);
      console.log('Transcription successful:', transcript);
      setCurrentInput(transcript);
      setAudioBlob(null);
    } catch (error) {
      console.error('Transcription error details:', error);
      setTranscriptionError(error);
      if (onApiError) onApiError(error);
      
      if (isApiAuthError(error)) {
        alert('Voice transcription unavailable – OpenAI API key not configured in Vercel.');
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        alert(`Transcription failed: ${errorMsg}. Please try again or type your message.`);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MessageCircle className="text-green-600" size={24} />
          <h2 className="text-xl font-semibold text-green-800">Dairy Farming Conversation</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={startNewConversation}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>New</span>
          </button>
          
          {conversationHistory.length > 0 && (
            <div className="relative group">
              <button className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-1">
                <History size={16} />
                <span>History ({conversationHistory.length})</span>
              </button>
              
              <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg border max-h-64 overflow-y-auto w-80 z-10 hidden group-hover:block">
                {conversationHistory.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b text-sm"
                  >
                    <div className="font-medium text-gray-800 truncate">{conv.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {conv.userMessageCount} messages • {new Date(conv.lastUpdated).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {conversation.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-lg ${
              msg.type === 'user' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              <div className="prose prose-sm max-w-none">
                <FormattedMessage content={msg.content} />
              </div>
              
              {/* Voice Player for bot messages */}
              {msg.type === 'bot' && voiceEnabled && (
                <div className="mt-3 pt-3 border-t border-blue-200 flex justify-end">
                  <VoicePlayer 
                    text={msg.content}
                    size="sm"
                    variant="secondary"
                    onError={onApiError}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-600 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="animate-pulse" size={20} />
                <span>Thinking about your farming approach...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-3 mb-3">
          <div className="flex-1">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts about dairy farming, sustainability, or any farming challenges you're facing..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            {voiceEnabled && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                title={isRecording ? 'Stop recording' : 'Record audio (OpenAI Whisper)'}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
          </div>
        </div>
        
        {audioBlob && (
          <div className="mb-3 p-3 bg-purple-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-purple-700">Audio recorded. Click to transcribe:</span>
            <button
              onClick={transcribeAndSend}
              className="bg-purple-600 text-white px-3 py-1 rounded font-semibold hover:bg-purple-700 transition-colors text-sm"
            >
              Transcribe
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={sendMessage}
              disabled={!currentInput.trim() || isThinking}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </div>
          
          <button
            onClick={runAnalysis}
            disabled={conversation.filter(msg => msg.type === 'user').length === 0 || isAnalyzing}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Analyze Conversation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-t p-4 bg-gray-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {conversation.filter(msg => msg.type === 'user').length}
            </div>
            <div className="text-sm text-gray-600">Your Messages</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {conversation.filter(msg => msg.type === 'bot').length}
            </div>
            <div className="text-sm text-gray-600">Assistant Responses</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {conversation.filter(msg => msg.type === 'user').reduce((total, msg) => total + msg.content.split(' ').length, 0)}
            </div>
            <div className="text-sm text-gray-600">Words Shared</div>
          </div>
        </div>
      </div>
    </div>
  );
};