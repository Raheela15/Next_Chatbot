import { useState, useEffect, useRef, useCallback } from 'react';
import { Conversation, Message, Settings } from '../types/chat';
import {
  getSavedConversations,
  saveConversations,
  getActiveConversationId,
  setActiveConversationId,
  createNewConversation,
  updateConversationTitle,
  deleteConversationById,
  clearAllConversations,
  generateId,
  generateConversationTitle,
  loadSettings,
  saveSettings as saveSettingsToStorage,
} from '../utils/storage';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash-lite');

  // Abort controller and animation ref
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimerRef = useRef<any>(null);

  // Initialize conversations from localStorage on mount
  useEffect(() => {
    const saved = getSavedConversations();
    setConversations(saved);

    const savedActiveId = getActiveConversationId();
    if (savedActiveId && saved.some((c) => c.id === savedActiveId)) {
      setActiveId(savedActiveId);
    } else if (saved.length > 0) {
      setActiveId(saved[0].id);
      setActiveConversationId(saved[0].id);
    } else {
      const fresh = createNewConversation('New Chat');
      setConversations([fresh]);
      setActiveId(fresh.id);
    }
  }, []);

  // Update selected model when settings change
  useEffect(() => {
    if (settings.defaultModel) {
      setSelectedModel(settings.defaultModel);
    }
  }, [settings.defaultModel]);

  // Active conversation helper
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // Persist conversation list updates
  const updateConversationsList = useCallback((updater: (prev: Conversation[]) => Conversation[]) => {
    setConversations((prev) => {
      const next = updater(prev);
      saveConversations(next);
      return next;
    });
  }, []);

  // Stop Generating
  const handleStopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsStreaming(false);

    // Mark current streaming assistant message as complete
    if (activeId) {
      updateConversationsList((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.status === 'streaming' ? { ...m, status: 'complete' as const } : m
              ),
            };
          }
          return c;
        })
      );
    }
  }, [activeId, updateConversationsList]);

  // Start a new chat
  const handleNewChat = useCallback(() => {
    handleStopGenerating();

    if (activeConversation && activeConversation.messages.length === 0) {
      return;
    }

    const fresh = createNewConversation('New Chat');
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    setActiveConversationId(fresh.id);
    setInput('');
  }, [handleStopGenerating, activeConversation]);

  // Switch conversation
  const handleSelectConversation = useCallback((id: string) => {
    handleStopGenerating();
    setActiveId(id);
    setActiveConversationId(id);
  }, [handleStopGenerating]);

  // Rename conversation
  const handleRenameConversation = useCallback((id: string, newTitle: string) => {
    const updated = updateConversationTitle(id, newTitle);
    setConversations(updated);
  }, []);

  // Delete conversation
  const handleDeleteConversation = useCallback((id: string) => {
    handleStopGenerating();
    const updated = deleteConversationById(id);
    setConversations(updated);

    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
      } else {
        const fresh = createNewConversation('New Chat');
        setConversations([fresh]);
        setActiveId(fresh.id);
      }
    }
  }, [activeId, handleStopGenerating]);

  // Clear all chats
  const handleClearAllHistory = useCallback(() => {
    handleStopGenerating();
    clearAllConversations();
    const fresh = createNewConversation('New Chat');
    setConversations([fresh]);
    setActiveId(fresh.id);
  }, [handleStopGenerating]);

  // Update Settings
  const handleSaveSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
    if (newSettings.defaultModel) {
      setSelectedModel(newSettings.defaultModel);
    }
  }, []);

  // Send request and animate response smoothly
  const executeChatRequest = async (
    targetConvId: string,
    historyMessages: Message[],
    assistantMessageId: string
  ) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsStreaming(true);

    try {
      // Send API request to our secure backend proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemInstruction: settings.systemInstruction,
          model: selectedModel,
          stream: false, // Bulletproof against reverse proxy buffering
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMsg = '';
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errJson = await response.json();
            errorMsg = errJson.error || errJson.message || '';
            if (typeof errorMsg === 'string' && errorMsg.startsWith('{')) {
              try {
                const inner = JSON.parse(errorMsg);
                errorMsg = inner?.error?.message || errorMsg;
              } catch {}
            }
          } else {
            const text = await response.text();
            if (text && text.length < 200 && !text.includes('<!DOCTYPE')) {
              errorMsg = text;
            }
          }
        } catch {
          // ignore parse errors
        }

        if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
          errorMsg =
            'Invalid Gemini API key. If deployed on Vercel, please check Project Settings > Environment Variables and ensure GEMINI_API_KEY is pasted without quotes (e.g. AIzaSy... NOT "AIzaSy...").';
        }

        if (!errorMsg) {
          if (response.status === 404) {
            errorMsg =
              'HTTP 404: API route not found. On Vercel, make sure the latest api/chat.ts is deployed and GEMINI_API_KEY is added to Vercel Environment Variables.';
          } else if (response.status === 500) {
            errorMsg =
              'HTTP 500: Server error. Please check that GEMINI_API_KEY is configured in Vercel Project Settings > Environment Variables without quotes.';
          } else {
            errorMsg = `Server responded with status ${response.status}.`;
          }
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();
      const fullText = data.text || 'No response generated.';

      // Animate text with high-speed typewriter effect for smooth readability
      let currentLength = 0;
      const step = Math.max(3, Math.ceil(fullText.length / 50)); // smooth pacing

      await new Promise<void>((resolve) => {
        typingTimerRef.current = setInterval(() => {
          if (controller.signal.aborted) {
            clearInterval(typingTimerRef.current);
            resolve();
            return;
          }

          currentLength += step;
          const currentSlice = fullText.slice(0, currentLength);

          updateConversationsList((prev) =>
            prev.map((conv) => {
              if (conv.id === targetConvId) {
                return {
                  ...conv,
                  updatedAt: Date.now(),
                  messages: conv.messages.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          content: currentSlice,
                          status: currentLength >= fullText.length ? 'complete' : 'streaming',
                        }
                      : msg
                  ),
                };
              }
              return conv;
            })
          );

          if (currentLength >= fullText.length) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
            resolve();
          }
        }, 15);
      });

      // Mark complete
      updateConversationsList((prev) =>
        prev.map((conv) => {
          if (conv.id === targetConvId) {
            return {
              ...conv,
              updatedAt: Date.now(),
              messages: conv.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: fullText,
                      status: 'complete' as const,
                    }
                  : msg
              ),
            };
          }
          return conv;
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User stopped generation intentionally
        updateConversationsList((prev) =>
          prev.map((conv) => {
            if (conv.id === targetConvId) {
              return {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        status: 'complete' as const,
                      }
                    : msg
                ),
              };
            }
            return conv;
          })
        );
      } else {
        console.error('Error generating AI response:', err);
        updateConversationsList((prev) =>
          prev.map((conv) => {
            if (conv.id === targetConvId) {
              return {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        status: 'error' as const,
                        errorMessage: err.message || 'Unable to connect to Google Gemini API.',
                      }
                    : msg
                ),
              };
            }
            return conv;
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text || isStreaming) return;

    let targetConvId = activeId;
    let targetConv = conversations.find((c) => c.id === targetConvId);

    if (!targetConvId || !targetConv) {
      const newConv = createNewConversation('New Chat');
      targetConvId = newConv.id;
      setActiveId(newConv.id);
      targetConv = newConv;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      status: 'complete',
    };

    const assistantPlaceholderMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      status: 'streaming',
    };

    const isFirst = targetConv.messages.length === 0;
    const newTitle = isFirst ? generateConversationTitle(text) : targetConv.title;
    const nextMessages = [...targetConv.messages, userMessage];

    updateConversationsList((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          return {
            ...c,
            title: newTitle,
            updatedAt: Date.now(),
            messages: [...nextMessages, assistantPlaceholderMessage],
          };
        }
        return c;
      })
    );

    setInput('');

    await executeChatRequest(targetConvId, nextMessages, assistantPlaceholderMessage.id);
  };

  // Regenerate Response
  const handleRegenerate = async () => {
    if (!activeConversation || isStreaming) return;
    const msgs = activeConversation.messages;
    if (msgs.length === 0) return;

    let lastAiIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant') {
        lastAiIndex = i;
        break;
      }
    }

    if (lastAiIndex === -1) return;

    const contextMessages = msgs.slice(0, lastAiIndex);
    const targetAiMessageId = msgs[lastAiIndex].id;

    updateConversationsList((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === targetAiMessageId
                ? {
                    ...m,
                    content: '',
                    status: 'streaming' as const,
                    errorMessage: undefined,
                  }
                : m
            ),
          };
        }
        return c;
      })
    );

    await executeChatRequest(activeId!, contextMessages, targetAiMessageId);
  };

  // Edit message and resubmit
  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!activeConversation || isStreaming) return;
    const msgs = activeConversation.messages;
    const msgIndex = msgs.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;

    const updatedUserMsg: Message = {
      ...msgs[msgIndex],
      content: newContent,
      timestamp: Date.now(),
    };

    const newAssistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      status: 'streaming',
    };

    const truncatedMessages = [...msgs.slice(0, msgIndex), updatedUserMsg];

    updateConversationsList((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            updatedAt: Date.now(),
            messages: [...truncatedMessages, newAssistantMsg],
          };
        }
        return c;
      })
    );

    await executeChatRequest(activeId!, truncatedMessages, newAssistantMsg.id);
  };

  // Delete message
  const handleDeleteMessage = useCallback((messageId: string) => {
    if (!activeId) return;
    updateConversationsList((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            updatedAt: Date.now(),
            messages: c.messages.filter((m) => m.id !== messageId),
          };
        }
        return c;
      })
    );
  }, [activeId, updateConversationsList]);

  return {
    conversations,
    activeConversation,
    activeId,
    input,
    setInput,
    isStreaming,
    selectedModel,
    setSelectedModel,
    settings,
    handleSaveSettings,
    handleNewChat,
    handleSelectConversation,
    handleRenameConversation,
    handleDeleteConversation,
    handleClearAllHistory,
    handleSendMessage,
    handleStopGenerating,
    handleRegenerate,
    handleEditMessage,
    handleDeleteMessage,
  };
}
