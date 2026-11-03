export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'sending' | 'streaming' | 'complete' | 'error';
  errorMessage?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  systemInstruction?: string;
  model?: string;
  personaId?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ChatModel {
  id: string;
  name: string;
  badge: string;
  description: string;
  freeTier: boolean;
}

export interface Settings {
  defaultModel: string;
  systemInstruction: string;
  autoScroll: boolean;
  soundEnabled: boolean;
}

/** Available Gemini models shown in the UI model selector. */
export const AVAILABLE_MODELS: ChatModel[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    badge: '3.8 Flash',
    description: 'Deep reasoning and complex task processing. Recommended.',
    freeTier: true,
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    badge: '3.1 Lite',
    description: 'Ultra-fast, lowest latency, highly responsive free tier model.',
    freeTier: true,
  },
];

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
}

/** Preset assistant personas for the persona selector. */
export const PRESET_PERSONAS: Persona[] = [
  {
    id: 'default',
    name: 'Gemini AI',
    description: 'Intelligent, helpful all-purpose assistant.',
    systemInstruction:
      'You are an intelligent, helpful, and friendly AI assistant powered by Google Gemini. Provide clear, accurate, well-formatted answers with markdown and syntax-highlighted code blocks when appropriate.',
  },
  {
    id: 'coder',
    name: 'Code Expert',
    description: 'Senior developer focused on clean, production-ready code.',
    systemInstruction:
      'You are a senior software engineer and code expert. Write clean, efficient, well-documented, production-ready code. Always explain your logic. Prefer modern best practices and highlight potential pitfalls.',
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Patient educator who explains concepts step by step.',
    systemInstruction:
      'You are a patient, encouraging teacher. Break down complex topics into simple, digestible steps. Use analogies, examples, and clear explanations. Adapt your language to the learner\'s level.',
  },
  {
    id: 'writer',
    name: 'Creative Writer',
    description: 'Creative writing assistant for stories, essays, and more.',
    systemInstruction:
      'You are a skilled creative writer. Help craft compelling stories, essays, scripts, and creative content. Focus on vivid language, engaging narrative, and strong structure.',
  },
];
