import React, { useState } from 'react';
import {
  User,
  Copy,
  Check,
  RotateCcw,
  Pencil,
  Trash2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Message } from '../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
  isLastAiMessage: boolean;
  isStreaming: boolean;
  onRegenerate?: () => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastAiMessage,
  isStreaming,
  onRegenerate,
  onEditMessage,
  onDeleteMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isMessageStreaming = message.status === 'streaming';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy message:', e);
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEditMessage?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const formatTime = (ts: number) => {
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`group relative flex gap-3 sm:gap-4 px-3 sm:px-6 py-4.5 transition-colors ${
        isUser
          ? 'bg-transparent'
          : 'bg-zinc-50/70 dark:bg-zinc-900/40 border-y border-zinc-200/60 dark:border-zinc-800/50'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-850 flex items-center justify-center text-white shadow-xs ring-2 ring-zinc-400/20">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {isUser ? 'You' : 'Gemini AI'}
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {formatTime(message.timestamp)}
            </span>
            {!isUser && isMessageStreaming && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                Thinking...
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Copy message text"
              type="button"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Edit User Message Button */}
            {isUser && !isEditing && (
              <button
                onClick={() => {
                  setEditContent(message.content);
                  setIsEditing(true);
                }}
                disabled={isStreaming}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer"
                title="Edit and resubmit message"
                type="button"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Regenerate AI response */}
            {!isUser && isLastAiMessage && !isStreaming && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Regenerate answer"
                type="button"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete Message Button */}
            {onDeleteMessage && (
              <button
                onClick={() => onDeleteMessage(message.id)}
                disabled={isStreaming}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer"
                title="Delete message"
                type="button"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content or Edit Mode */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full p-3.5 text-sm rounded-xl border border-indigo-400 dark:border-indigo-500 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-all cursor-pointer"
              >
                Save & Resubmit
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {isError ? (
              <div className="p-4 rounded-2xl border border-rose-300/80 dark:border-rose-900/60 bg-rose-50/90 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-sm space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs">Error generating response</p>
                    <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5 leading-relaxed">
                      {message.errorMessage || 'Something went wrong while contacting Gemini API.'}
                    </p>
                  </div>
                </div>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                <MarkdownRenderer content={message.content} />
                {isMessageStreaming && (
                  <span className="inline-block w-2 h-4 ml-1.5 bg-indigo-500 dark:bg-indigo-400 animate-pulse align-middle" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
