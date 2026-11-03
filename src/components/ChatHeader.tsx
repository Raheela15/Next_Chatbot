import React, { useState } from 'react';
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Sparkles,
  Edit2,
  Check,
  X,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  onRenameTitle: (newTitle: string) => void;
  onNewChat: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenMobileSidebar: () => void;
  resolvedTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  model: string;
  onSelectModel: (model: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onRenameTitle,
  onNewChat,
  onToggleSidebar,
  isSidebarOpen,
  onOpenMobileSidebar,
  resolvedTheme,
  onToggleTheme,
  onOpenSettings,
  model,
  onSelectModel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleSave = () => {
    if (tempTitle.trim()) {
      onRenameTitle(tempTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-10 w-full h-15 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl px-3 sm:px-5 flex items-center justify-between transition-colors">
      {/* Left controls */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Open chat history"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        {/* New Chat shortcut button */}
        <button
          onClick={onNewChat}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>

        {/* Title & Rename */}
        <div className="flex items-center gap-1.5 min-w-0 ml-1">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="px-2.5 py-1 text-xs sm:text-sm font-medium rounded-lg border border-indigo-500 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleSave}
                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0 group">
              <h1 className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                {title}
              </h1>
              <button
                onClick={() => {
                  setTempTitle(title);
                  setIsEditing(true);
                }}
                className="p-1 rounded-md text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                title="Rename conversation"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Model Selector Pill */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => onSelectModel(e.target.value)}
            className="text-[11px] sm:text-xs font-semibold pl-3 pr-8 py-1.5 rounded-xl bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200/90 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none shadow-2xs transition-all"
          >
            <option value="gemini-3.1-flash-lite">⚡ Gemini 3.1 Flash Lite (Free & Fast)</option>
            <option value="gemini-3.8-flash">🧠 Gemini 3.8 Flash (Deep Reasoning)</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-600" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="AI Settings & System Persona"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
