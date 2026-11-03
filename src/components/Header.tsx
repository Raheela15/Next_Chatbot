import React, { useState } from 'react';
import {
  Menu,
  Edit2,
  Check,
  X,
  Sparkles,
  Download,
  Trash2,
  Settings,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { Conversation, PRESET_PERSONAS, AVAILABLE_MODELS } from '../types/chat';

interface HeaderProps {
  conversation: Conversation | null;
  onToggleSidebar: () => void;
  onRename: (newTitle: string) => void;
  onClearCurrentChat: () => void;
  onSelectPersona: (personaId: string) => void;
  onSelectModel: (modelId: string) => void;
  onOpenSettings: () => void;
  onExportMarkdown: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  conversation,
  onToggleSidebar,
  onRename,
  onClearCurrentChat,
  onSelectPersona,
  onSelectModel,
  onOpenSettings,
  onExportMarkdown,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);

  const currentPersona =
    PRESET_PERSONAS.find((p) => p.id === conversation?.personaId) || PRESET_PERSONAS[0];

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === conversation?.model) || AVAILABLE_MODELS[0];

  const handleStartEdit = () => {
    if (conversation) {
      setTitleInput(conversation.title);
      setIsEditingTitle(true);
    }
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (titleInput.trim()) {
      onRename(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a]/80">
      {/* Left: Mobile hamburger & Chat title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {conversation ? (
          isEditingTitle ? (
            <form onSubmit={handleSaveEdit} className="flex items-center gap-1.5">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                className="bg-[#18181b] border border-[#6366f1] rounded-lg px-2.5 py-1 text-xs text-[#f4f4f5] focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 text-emerald-400 hover:bg-[#18181b] rounded"
                title="Save title"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                className="p-1 text-red-400 hover:bg-[#18181b] rounded"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 group min-w-0">
              <h2
                onClick={handleStartEdit}
                className="font-medium text-sm text-[#f4f4f5] truncate max-w-[160px] sm:max-w-md cursor-pointer hover:text-[#c0c1ff] transition-colors"
                title="Click to rename"
              >
                {conversation.title}
              </h2>
              <button
                onClick={handleStartEdit}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#71717a] hover:text-[#f4f4f5] rounded transition-opacity"
                title="Rename conversation"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )
        ) : (
          <h2 className="font-medium text-sm text-[#a1a1aa]">Synthetix AI</h2>
        )}
      </div>

      {/* Right: Model Selector & Persona dropdown & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Fast Model Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowModelMenu(!showModelMenu);
              setShowPersonaMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#c7c4d7] transition-colors"
            title="Switch AI model speed mode"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="font-medium text-amber-300 hidden sm:inline">{currentModel.badge}</span>
            <ChevronDown className="w-3 h-3 text-[#71717a]" />
          </button>

          {showModelMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowModelMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-72 p-1.5 rounded-xl bg-[#18181b] border border-[#27272a] shadow-xl z-40 space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider font-mono">
                  Select Engine Speed
                </div>
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setShowModelMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                      m.id === currentModel.id
                        ? 'bg-[#27272a] text-[#c0c1ff]'
                        : 'text-[#a1a1aa] hover:bg-[#27272a]/60 hover:text-[#f4f4f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#121215] border border-[#3f3f46] text-amber-400 font-mono">
                        {m.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#71717a] mt-0.5">
                      {m.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Persona Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPersonaMenu(!showPersonaMenu);
              setShowModelMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#c7c4d7] transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#818cf8]" />
            <span className="hidden md:inline font-medium">{currentPersona.name}</span>
            <ChevronDown className="w-3 h-3 text-[#71717a]" />
          </button>

          {showPersonaMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowPersonaMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 p-1.5 rounded-xl bg-[#18181b] border border-[#27272a] shadow-xl z-40 space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider font-mono">
                  Select Assistant Mode
                </div>
                {PRESET_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPersona(p.id);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                      p.id === currentPersona.id
                        ? 'bg-[#27272a] text-[#c0c1ff]'
                        : 'text-[#a1a1aa] hover:bg-[#27272a]/60 hover:text-[#f4f4f5]'
                    }`}
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="text-[11px] text-[#71717a] mt-0.5 line-clamp-1">
                      {p.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Export Markdown */}
        {conversation && conversation.messages.length > 0 && (
          <button
            onClick={onExportMarkdown}
            className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181b] transition-colors"
            title="Export conversation as Markdown"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        {/* Clear Current Chat */}
        {conversation && conversation.messages.length > 0 && (
          <button
            onClick={onClearCurrentChat}
            className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-red-400 hover:bg-red-950/20 transition-colors"
            title="Clear current messages"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#18181b] transition-colors"
          title="Settings & System Prompt"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
