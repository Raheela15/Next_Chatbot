/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  const {
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
  } = useChat();

  const { theme, resolvedTheme, toggleTheme } = useTheme();

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Deletion modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    mode: 'single' | 'all';
    targetId?: string;
  }>({
    isOpen: false,
    mode: 'single',
  });

  // Auto-scroll state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;

  // Auto-scroll effect
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (settings.autoScroll && !showScrollBottom) {
      scrollToBottom('smooth');
    }
  }, [messages, isStreaming, settings.autoScroll, showScrollBottom]);

  // Track scroll position to show/hide "Scroll to bottom" button
  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceToBottom > 160);
  };

  // Keyboard shortcut Cmd/Ctrl + K for New Chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  // Open confirmation for single conversation
  const promptDeleteConversation = (id: string) => {
    setDeleteModalState({
      isOpen: true,
      mode: 'single',
      targetId: id,
    });
  };

  // Open confirmation for clearing all history
  const promptClearAll = () => {
    setDeleteModalState({
      isOpen: true,
      mode: 'all',
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.mode === 'single' && deleteModalState.targetId) {
      handleDeleteConversation(deleteModalState.targetId);
    } else if (deleteModalState.mode === 'all') {
      handleClearAllHistory();
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={promptDeleteConversation}
        onOpenClearModal={promptClearAll}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Header */}
        <ChatHeader
          title={activeConversation?.title || 'New Chat'}
          onRenameTitle={(newTitle) => {
            if (activeId) handleRenameConversation(activeId, newTitle);
          }}
          onNewChat={handleNewChat}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          model={selectedModel}
          onSelectModel={setSelectedModel}
        />

        {/* Chat Messages or Welcome Screen */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
        >
          {!hasMessages ? (
            <WelcomeScreen
              onSelectPrompt={(starterPrompt) => {
                handleSendMessage(starterPrompt);
              }}
            />
          ) : (
            <div className="flex-1 w-full max-w-4xl mx-auto py-4 space-y-1">
              {messages.map((message, index) => {
                const isLastAi =
                  message.role === 'assistant' &&
                  index === messages.length - 1;

                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLastAiMessage={isLastAi}
                    isStreaming={isStreaming && isLastAi}
                    onRegenerate={handleRegenerate}
                    onEditMessage={handleEditMessage}
                    onDeleteMessage={handleDeleteMessage}
                  />
                );
              })}

              {/* Typing indicator when waiting for initial streaming chunk */}
              {isStreaming &&
                messages.length > 0 &&
                messages[messages.length - 1].role === 'assistant' &&
                !messages[messages.length - 1].content && (
                  <div className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 typing-dot-1"></span>
                      <span className="w-2 h-2 rounded-full bg-indigo-500 typing-dot-2"></span>
                      <span className="w-2 h-2 rounded-full bg-indigo-500 typing-dot-3"></span>
                      <span className="text-xs text-zinc-400 font-medium ml-2">
                        Gemini is thinking...
                      </span>
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Floating Scroll to Bottom Button */}
        {showScrollBottom && hasMessages && (
          <button
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-24 right-6 sm:right-10 z-20 p-2.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer animate-in fade-in duration-200"
            title="Scroll to latest message"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}

        {/* Input Bar */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          onStop={handleStopGenerating}
          isStreaming={isStreaming}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Delete / Clear Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState((s) => ({ ...s, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={
          deleteModalState.mode === 'all'
            ? 'Clear entire chat history?'
            : 'Delete conversation?'
        }
        description={
          deleteModalState.mode === 'all'
            ? 'This will permanently remove all your conversations and saved messages from browser storage. This action cannot be undone.'
            : 'Are you sure you want to delete this conversation? This action cannot be undone.'
        }
        confirmText={deleteModalState.mode === 'all' ? 'Clear All' : 'Delete'}
      />
    </div>
  );
}
