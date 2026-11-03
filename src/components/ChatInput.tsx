import React, { useRef, useEffect } from 'react';
import { Send, Square, Sparkles, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (messageText?: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  disabled = false,
  placeholder = 'Message Gemini AI... (Press Enter to send, Shift + Enter for new line)',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, 200);
    el.style.height = `${Math.max(54, nextHeight)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend();
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) {
      onStop();
    } else if (input.trim()) {
      onSend();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="relative max-w-3xl mx-auto w-full px-3 sm:px-6 pb-4 sm:pb-5"
    >
      <div className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-950/5 dark:shadow-zinc-950/30 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500 transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none py-4 pl-4 pr-16 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none leading-relaxed disabled:opacity-50"
        />

        {/* Action button inside input: Stop or Send */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer animate-pulse"
              title="Stop generating"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${
                input.trim() && !disabled
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 active:scale-95'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Helpful shortcut footer */}
      <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] text-zinc-400 dark:text-zinc-500 select-none">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-medium text-zinc-500 dark:text-zinc-400">Powered by Google Gemini Free API</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>Enter to send</span>
          <span>•</span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </form>
  );
};
