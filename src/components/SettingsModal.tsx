import React, { useState } from 'react';
import { X, Sparkles, Sliders, Keyboard, ShieldCheck, RefreshCw } from 'lucide-react';
import { Settings } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSaveSettings: (settings: Settings) => void;
}

const PERSONA_PRESETS = [
  {
    name: 'Helpful & Balanced',
    prompt:
      'You are an intelligent, thoughtful, and articulate AI assistant powered by Google Gemini. Provide direct, helpful, well-structured answers using markdown formatting and clean code snippets when useful.',
  },
  {
    name: 'Senior Software Engineer',
    prompt:
      'You are a senior full-stack software engineer and architect with 10+ years of industry experience. Focus on modern clean code, production design patterns, performance optimizations, robust typing, and practical architecture. Keep explanations sharp and actionable.',
  },
  {
    name: 'Concise & Direct',
    prompt:
      'You are an ultra-concise assistant. Answer queries directly without conversational filler, pleasantries, or preamble. Keep code examples tight and to the point.',
  },
  {
    name: 'Patient Tutor',
    prompt:
      'You are an encouraging, patient tutor. Explain concepts clearly using step-by-step reasoning, intuitive real-world metaphors, and helpful summaries.',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);

  if (!isOpen) return null;

  const handleApplyPreset = (prompt: string) => {
    setCurrentSettings((prev) => ({ ...prev, systemInstruction: prompt }));
  };

  const handleSave = () => {
    onSaveSettings(currentSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Chatbot Settings & Persona
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Free Tier Model Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Default Gemini Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentSettings((s) => ({ ...s, defaultModel: 'gemini-3.8-flash' }))
                }
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentSettings.defaultModel === 'gemini-3.8-flash'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="font-medium text-xs">Gemini 3.8 Flash</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Fast & intelligent (Recommended)
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentSettings((s) => ({ ...s, defaultModel: 'gemini-3.1-flash-lite' }))
                }
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentSettings.defaultModel === 'gemini-3.1-flash-lite'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="font-medium text-xs">Gemini 3.1 Flash Lite</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Ultra-low latency free tier
                </div>
              </button>
            </div>
          </div>

          {/* System Persona / Instruction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                System Instruction / AI Persona
              </label>
              <span className="text-[11px] text-zinc-400">Customizes tone & behavior</span>
            </div>

            {/* Persona chips */}
            <div className="flex flex-wrap gap-1.5">
              {PERSONA_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p.prompt)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>

            <textarea
              value={currentSettings.systemInstruction}
              onChange={(e) =>
                setCurrentSettings((s) => ({ ...s, systemInstruction: e.target.value }))
              }
              rows={4}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Provide system instructions for the AI..."
            />
          </div>

          {/* Keyboard shortcuts */}
          <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <Keyboard className="w-3.5 h-3.5 text-zinc-500" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between items-center pr-2">
                <span>Send message</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[10px] font-mono shadow-2xs">
                  Enter
                </kbd>
              </div>
              <div className="flex justify-between items-center pr-2">
                <span>New line</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[10px] font-mono shadow-2xs">
                  Shift+Enter
                </kbd>
              </div>
            </div>
          </div>

          {/* Security & API Status */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Secure Server-Side Architecture</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 mt-0.5 leading-relaxed">
                Your Google Gemini API credentials are processed server-side through protected endpoints and never exposed to the client.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
