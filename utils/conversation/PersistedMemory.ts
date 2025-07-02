import { Orientation } from './DynamicPromptEngine';
import { MatrixAnalysis } from './MatrixComparison';

// Session Memory schema as per Enhanced MVP spec
export interface SessionMemory {
  userProfile: UserProfile;
  conversationState: ConversationState;
  narrativeCollection: NarrativeCollection;
  analysisReadyFlag: boolean;
  lastUpdated: number;
}

export interface UserProfile {
  inferredCharacteristics: Map<string, any>;
  dominantOrientation: Orientation;
  sentimentTrajectory: number[];
  keyConcernsList: string[];
}

export interface ConversationState {
  currentTopic: string;
  depthLevel: number;
  activeConflicts: string[];
  resolutionProgress: number;
}

export interface NarrativeCollection {
  livingStories: LivingStory[];
  anteNarratives: AnteNarrative[];
  grandNarrativeConnections: GrandNarrativeConnection[];
}

export interface LivingStory {
  id: string;
  content: string;
  theme: string;
  emotion: string;
  outcome: string;
  timestamp: number;
}

export interface AnteNarrative {
  id: string;
  aspiration: string;
  timeframe: string;
  feasibility: number;
  timestamp: number;
}

export interface GrandNarrativeConnection {
  id: string;
  theme: string;
  universalTruth: string;
  applicability: 'local' | 'regional' | 'universal';
  timestamp: number;
}

export class PersistedMemory {
  private dbName = 'EcoDairyBotMemory';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('timestamp', 'lastUpdated', { unique: false });
        }

        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', { keyPath: 'id' });
          conversationStore.createIndex('sessionId', 'sessionId', { unique: false });
        }

        if (!db.objectStoreNames.contains('matrices')) {
          const matrixStore = db.createObjectStore('matrices', { keyPath: 'id' });
          matrixStore.createIndex('sessionId', 'sessionId', { unique: false });
        }
      };
    });
  }

  async saveSession(sessionId: string, memory: SessionMemory): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');

      const sessionData = {
        id: sessionId,
        ...memory,
        // Convert Map to object for storage
        userProfile: {
          ...memory.userProfile,
          inferredCharacteristics: Object.fromEntries(memory.userProfile.inferredCharacteristics)
        }
      };

      const request = store.put(sessionData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save session'));
    });
  }

  async loadSession(sessionId: string): Promise<SessionMemory | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.get(sessionId);

      request.onsuccess = () => {
        if (request.result) {
          const data = request.result;
          // Convert object back to Map
          const memory: SessionMemory = {
            ...data,
            userProfile: {
              ...data.userProfile,
              inferredCharacteristics: new Map(Object.entries(data.userProfile.inferredCharacteristics))
            }
          };
          resolve(memory);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(new Error('Failed to load session'));
    });
  }

  async saveConversationEntry(
    sessionId: string,
    entry: {
      userInput: string;
      botResponse: string;
      timestamp: number;
      detectedClues: any;
    }
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');

      const conversationData = {
        id: `${sessionId}_${entry.timestamp}`,
        sessionId,
        ...entry
      };

      const request = store.add(conversationData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save conversation entry'));
    });
  }

  async getConversationHistory(sessionId: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const index = store.index('sessionId');
      const request = index.getAll(sessionId);

      request.onsuccess = () => {
        const results = request.result.sort((a, b) => a.timestamp - b.timestamp);
        resolve(results);
      };

      request.onerror = () => reject(new Error('Failed to get conversation history'));
    });
  }

  async saveMatrixAnalysis(sessionId: string, analysis: MatrixAnalysis): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['matrices'], 'readwrite');
      const store = transaction.objectStore('matrices');

      const matrixData = {
        id: `${sessionId}_${analysis.timestamp}`,
        sessionId,
        ...analysis
      };

      const request = store.add(matrixData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save matrix analysis'));
    });
  }

  async getMatrixHistory(sessionId: string): Promise<MatrixAnalysis[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['matrices'], 'readonly');
      const store = transaction.objectStore('matrices');
      const index = store.index('sessionId');
      const request = index.getAll(sessionId);

      request.onsuccess = () => {
        const results = request.result
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(item => ({
            orientationMatrix: item.orientationMatrix,
            dialecticalMatrix: item.dialecticalMatrix,
            narrativeMatrix: item.narrativeMatrix,
            engagementMatrix: item.engagementMatrix,
            timestamp: item.timestamp
          }));
        resolve(results);
      };

      request.onerror = () => reject(new Error('Failed to get matrix history'));
    });
  }

  async createDefaultSession(sessionId: string): Promise<SessionMemory> {
    const defaultMemory: SessionMemory = {
      userProfile: {
        inferredCharacteristics: new Map(),
        dominantOrientation: 'P-R',
        sentimentTrajectory: [],
        keyConcernsList: []
      },
      conversationState: {
        currentTopic: 'general',
        depthLevel: 0,
        activeConflicts: [],
        resolutionProgress: 0
      },
      narrativeCollection: {
        livingStories: [],
        anteNarratives: [],
        grandNarrativeConnections: []
      },
      analysisReadyFlag: false,
      lastUpdated: Date.now()
    };

    await this.saveSession(sessionId, defaultMemory);
    return defaultMemory;
  }

  async clearSession(sessionId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['sessions', 'conversations', 'matrices'], 'readwrite');

    // Clear session
    const sessionStore = transaction.objectStore('sessions');
    await new Promise<void>((resolve, reject) => {
      const request = sessionStore.delete(sessionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to clear session'));
    });

    // Clear conversations
    const conversationStore = transaction.objectStore('conversations');
    const conversationIndex = conversationStore.index('sessionId');
    await new Promise<void>((resolve, reject) => {
      const request = conversationIndex.openCursor(IDBKeyRange.only(sessionId));
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(new Error('Failed to clear conversations'));
    });

    // Clear matrices
    const matrixStore = transaction.objectStore('matrices');
    const matrixIndex = matrixStore.index('sessionId');
    await new Promise<void>((resolve, reject) => {
      const request = matrixIndex.openCursor(IDBKeyRange.only(sessionId));
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(new Error('Failed to clear matrices'));
    });
  }

  // Analytics methods
  async getSessionStats(): Promise<{
    totalSessions: number;
    averageConversationLength: number;
    mostCommonTopics: string[];
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['sessions', 'conversations'], 'readonly');
    
    // Get total sessions
    const sessionStore = transaction.objectStore('sessions');
    const sessionCount = await new Promise<number>((resolve, reject) => {
      const request = sessionStore.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to count sessions'));
    });

    // Get conversation stats
    const conversationStore = transaction.objectStore('conversations');
    const conversations = await new Promise<any[]>((resolve, reject) => {
      const request = conversationStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get conversations'));
    });

    // Calculate average conversation length
    const sessionConversations = new Map<string, number>();
    const topicCounts = new Map<string, number>();

    for (const conv of conversations) {
      sessionConversations.set(conv.sessionId, (sessionConversations.get(conv.sessionId) || 0) + 1);
      
      // Extract topics from user input (simple keyword matching)
      const topics = ['feed', 'pasture', 'emissions', 'sustainability', 'cost', 'climate'];
      for (const topic of topics) {
        if (conv.userInput.toLowerCase().includes(topic)) {
          topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
        }
      }
    }

    const averageConversationLength = sessionConversations.size > 0 
      ? Array.from(sessionConversations.values()).reduce((a, b) => a + b, 0) / sessionConversations.size
      : 0;

    const mostCommonTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    return {
      totalSessions: sessionCount,
      averageConversationLength,
      mostCommonTopics
    };
  }
}

// Singleton instance
export const persistedMemory = new PersistedMemory();