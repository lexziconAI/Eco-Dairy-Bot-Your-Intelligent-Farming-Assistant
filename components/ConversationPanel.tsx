import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Brain, MessageCircle, BarChart3, ArrowLeft, 
  Users, TrendingUp, History, Plus, Eye, Loader, Sparkles
} from 'lucide-react';
import { transcribeAudio, analyzeText, isApiAuthError, generateSpeech } from '@/utils/api';
import { useDebug } from '@/hooks/useDebug';

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
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcriptionError, setTranscriptionError] = useState<any>(null);
  
  // Refs
  const recognitionRef = useRef<any>(null);
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
    isListening,
    hasAudioBlob: !!audioBlob,
    speechSupported,
    currentConversationId,
    historyCount: conversationHistory.length
  }, [conversation, isThinking, isRecording, isListening, audioBlob, speechSupported, currentConversationId, conversationHistory]);

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

    // Setup speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentInput(prev => (prev + ' ' + finalTranscript).trim());
        }
      };
      
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
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
    // Simple rule-based responses for dairy farming context
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses based on conversation flow
    if (lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('money')) {
      return "I understand cost is a major concern. Many farmers face the challenge of balancing immediate expenses with long-term investments. What specific costs are weighing on your mind? Are you thinking about operational costs, new technology investments, or something else?";
    }
    
    if (lowerMessage.includes('environment') || lowerMessage.includes('climate') || lowerMessage.includes('sustainable')) {
      return "Environmental stewardship is such an important topic in modern dairy farming. I'm curious about your perspective - do you see environmental practices as primarily a responsibility, a business opportunity, or perhaps both? What environmental challenges do you face on your farm?";
    }
    
    if (lowerMessage.includes('technology') || lowerMessage.includes('automation') || lowerMessage.includes('tech')) {
      return "Technology is transforming dairy farming in fascinating ways. From milking robots to precision agriculture, there are so many options. What's your experience with farm technology? Are you excited about new innovations, or do you prefer more traditional approaches?";
    }
    
    if (lowerMessage.includes('family') || lowerMessage.includes('generation') || lowerMessage.includes('children')) {
      return "Family farming has such deep roots and meaning. The decisions you make today affect not just your operation, but potentially future generations. How does thinking about family legacy influence your farming decisions? Do you hope the next generation will continue farming?";
    }
    
    if (lowerMessage.includes('community') || lowerMessage.includes('neighbor') || lowerMessage.includes('local')) {
      return "Community connections are so valuable in farming. The farming community has always been about mutual support and shared knowledge. How important is your local farming community to you? Do you find yourself learning from neighbors or sharing your own experiences?";
    }
    
    if (lowerMessage.includes('future') || lowerMessage.includes('change') || lowerMessage.includes('evolving')) {
      return "The future of dairy farming is both exciting and uncertain. Consumer demands are shifting, regulations are evolving, and new technologies emerge constantly. When you think about the future of your farm, what excites you most? What concerns you?";
    }
    
    // Default thoughtful responses
    const thoughtfulResponses = [
      "That's a really interesting perspective. Can you tell me more about how you came to that view? I'm curious about what experiences shaped this thinking.",
      "I appreciate you sharing that. It sounds like there's more complexity there than might appear on the surface. What factors do you weigh when making decisions about this?",
      "That resonates with many farmers I've spoken with. Every farm is unique though - what makes your situation or approach different from others you know?",
      "Thank you for being so open. It's clear you've given this real thought. What would you say to another farmer who was struggling with similar issues?",
      "Your experience offers valuable insights. Looking back, is there anything you'd do differently, or advice you'd give to your past self?",
      "That's the kind of real-world wisdom that only comes from hands-on experience. How do you balance intuition from experience with new information or advice you receive?"
    ];
    
    return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
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

  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech recognition requires Chrome, Edge, or Safari');
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
        alert('Speech recognition failed. Please try typing instead.');
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
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
      const transcript = await transcribeAudio(audioBlob);
      setCurrentInput(transcript);
      setAudioBlob(null);
    } catch (error) {
      setTranscriptionError(error);
      if (onApiError) onApiError(error);
      
      if (isApiAuthError(error)) {
        alert('Voice transcription unavailable – API key issue.');
      } else {
        alert('Transcription failed. Please try again or type your message.');
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
                {msg.content.split('**').map((part, i) => 
                  i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                )}
              </div>
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
            {voiceEnabled && speechSupported && (
              <button
                onClick={toggleListening}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
            
            {voiceEnabled && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
                title={isRecording ? 'Stop recording' : 'Record audio'}
              >
                <Mic size={20} />
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