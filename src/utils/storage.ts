import { Conversation, Message, Settings } from '../types/chat';

const STORAGE_KEYS = {
  CONVERSATIONS: 'gemini_chat_conversations_v1',
  ACTIVE_ID: 'gemini_chat_active_id_v1',
  SETTINGS: 'gemini_chat_settings_v1',
  THEME: 'gemini_chat_theme_v1',
};

export const DEFAULT_SETTINGS: Settings = {
  defaultModel: 'gemini-3.1-flash-lite',
  systemInstruction: 'You are an intelligent, thoughtful, and articulate AI assistant powered by Google Gemini. Provide direct, helpful, well-structured answers using markdown formatting and clean code snippets when useful.',
  autoScroll: true,
  soundEnabled: false,
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateConversationTitle(firstMessage: string): string {
  const clean = firstMessage.replace(/[\r\n]+/g, ' ').trim();
  if (clean.length <= 40) return clean || 'New Conversation';
  return clean.slice(0, 38) + '...';
}

// Conversation CRUD
export function getSavedConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return [];
  } catch (e) {
    console.error('Failed to load conversations from local storage:', e);
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations to local storage:', e);
  }
}

export function getActiveConversationId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
  } catch {
    return null;
  }
}

export function setActiveConversationId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
    }
  } catch {
    // Ignore error
  }
}

export function createNewConversation(title = 'New Chat', initialMessages: Message[] = []): Conversation {
  const now = Date.now();
  const conv: Conversation = {
    id: generateId(),
    title,
    createdAt: now,
    updatedAt: now,
    messages: initialMessages,
    model: 'gemini-3.8-flash',
  };

  const list = getSavedConversations();
  const updated = [conv, ...list];
  saveConversations(updated);
  setActiveConversationId(conv.id);
  return conv;
}

export function updateConversationTitle(id: string, newTitle: string): Conversation[] {
  const list = getSavedConversations();
  const updated = list.map((c) =>
    c.id === id ? { ...c, title: newTitle.trim() || 'Untitled Chat', updatedAt: Date.now() } : c
  );
  saveConversations(updated);
  return updated;
}

export function deleteConversationById(id: string): Conversation[] {
  const list = getSavedConversations();
  const updated = list.filter((c) => c.id !== id);
  saveConversations(updated);

  const activeId = getActiveConversationId();
  if (activeId === id) {
    const nextActive = updated.length > 0 ? updated[0].id : null;
    setActiveConversationId(nextActive);
  }

  return updated;
}

export function clearAllConversations(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
  } catch (e) {
    console.error('Failed to clear conversations:', e);
  }
}

// Message CRUD
export function appendMessage(conversationId: string, message: Message): Conversation[] {
  const list = getSavedConversations();
  let found = false;
  const now = Date.now();

  const updated = list.map((c) => {
    if (c.id === conversationId) {
      found = true;
      let newTitle = c.title;
      // If it was default title and this is the first user message, generate title
      if ((c.title === 'New Chat' || c.title === 'New Conversation') && message.role === 'user') {
        newTitle = generateConversationTitle(message.content);
      }
      return {
        ...c,
        title: newTitle,
        updatedAt: now,
        messages: [...c.messages, message],
      };
    }
    return c;
  });

  if (!found) {
    const newConv: Conversation = {
      id: conversationId,
      title: message.role === 'user' ? generateConversationTitle(message.content) : 'New Chat',
      createdAt: now,
      updatedAt: now,
      messages: [message],
      model: 'gemini-3.8-flash',
    };
    const nextList = [newConv, ...list];
    saveConversations(nextList);
    return nextList;
  }

  saveConversations(updated);
  return updated;
}

export function updateMessage(conversationId: string, messageId: string, newContent: string): Conversation[] {
  const list = getSavedConversations();
  const updated = list.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        updatedAt: Date.now(),
        messages: c.messages.map((m) =>
          m.id === messageId ? { ...m, content: newContent, status: 'complete' as const } : m
        ),
      };
    }
    return c;
  });
  saveConversations(updated);
  return updated;
}

export function deleteMessage(conversationId: string, messageId: string): Conversation[] {
  const list = getSavedConversations();
  const updated = list.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        updatedAt: Date.now(),
        messages: c.messages.filter((m) => m.id !== messageId),
      };
    }
    return c;
  });
  saveConversations(updated);
  return updated;
}

// Settings
export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
