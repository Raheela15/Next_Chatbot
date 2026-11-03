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
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  freeTier: boolean;
}

export interface Settings {
  defaultModel: string;
  systemInstruction: string;
  autoScroll: boolean;
  soundEnabled: boolean;
}
