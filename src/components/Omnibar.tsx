import React, { useRef, useEffect, useState } from 'react';
import {
  Send,
  Square,
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  FileText,
  FileCode,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { Attachment } from '../types/chat';
import { useSpeechRecognition } from '../utils/useSpeechRecognition';

interface OmnibarProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (text?: string, attachments?: Attachment[], isImageMode?: boolean) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  showSuggestions?: boolean;
}

export const SUGGESTIONS = [
  {
    title: 'Explain Quantum Computing',
    desc: 'in simple, intuitive terms for a beginner',
    prompt: 'Explain quantum computing in simple, intuitive terms for a curious beginner, including qubits and superposition.',
  },
  {
    title: 'Debug React TypeScript',
    desc: 'troubleshoot an async state race condition',
    prompt: 'Help me debug a React 19 + TypeScript component where state updates cause a race condition during async fetch. Provide a robust solution.',
  },
  {
    title: 'Analyze Attached Document',
    desc: 'summarize key points and insights',
    prompt: 'Please read the attached document and provide a structured summary with key takeaways and actionable insights.',
  },
  {
    title: 'Generate Cyberpunk City Art',
    desc: 'create a high-resolution futuristic cityscape',
    prompt: '/image A neon-lit futuristic cyberpunk metropolis with flying vehicles, rainy holographic reflections, cinematic lighting, 8k',
  },
];

export const Omnibar: React.FC<OmnibarProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isGenerating,
  disabled = false,
  showSuggestions = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isImageMode, setIsImageMode] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Speech Recognition hook for Voice Commands
  const {
    isListening,
    transcript,
    error: speechError,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition((spokenText) => {
    // Append or update input with spoken text
    setInput(spokenText);
  });

  // Show voice error if any
  useEffect(() => {
    if (speechError) {
      setVoiceNotice(speechError);
      const timer = setTimeout(() => setVoiceNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [speechError]);

  // Auto-resize textarea to fit content up to 180px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  // Detect /image or /imagine prefix in input to auto-toggle Image Mode
  useEffect(() => {
    if (input.startsWith('/image ') || input.startsWith('/imagine ')) {
      if (!isImageMode) setIsImageMode(true);
    }
  }, [input, isImageMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && (input.trim() || attachments.length > 0)) {
        submitMessage();
      }
    }
  };

  const submitMessage = (overridePrompt?: string) => {
    const textToSend = overridePrompt !== undefined ? overridePrompt : input;
    if (!textToSend.trim() && attachments.length === 0) return;

    if (isListening) {
      stopListening();
    }

    const currentAttachments = [...attachments];
    const imageModeActive =
      isImageMode ||
      textToSend.trim().startsWith('/image ') ||
      textToSend.trim().startsWith('/imagine ');

    // Clean /image prefix if in image mode
    let cleanText = textToSend;
    if (imageModeActive) {
      cleanText = cleanText.replace(/^\/(image|imagine)\s*/i, '');
    }

    onSend(cleanText, currentAttachments, imageModeActive);

    // Reset local attachments and image mode
    setAttachments([]);
    setIsImageMode(false);
  };

  const handleSuggestionClick = (prompt: string) => {
    if (prompt.startsWith('/image ')) {
      setIsImageMode(true);
      submitMessage(prompt);
    } else {
      submitMessage(prompt);
    }
  };

  // Document & File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      const reader = new FileReader();

      if (isImg || isPdf) {
        // Read as Data URL (base64)
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const newAttachment: Attachment = {
            id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            name: file.name,
            size: file.size,
            type: isImg ? 'image' : 'pdf',
            mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
            data: dataUrl,
            isImage: isImg,
          };
          setAttachments((prev) => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      } else {
        // Read text / code / csv / markdown / json
        reader.onload = (event) => {
          const textContent = event.target?.result as string;
          const newAttachment: Attachment = {
            id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            name: file.name,
            size: file.size,
            type: 'document',
            mimeType: file.type || 'text/plain',
            data: textContent,
            isImage: false,
          };
          setAttachments((prev) => [...prev, newAttachment]);
        };
        reader.readAsText(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (att: Attachment) => {
    if (att.isImage) return <ImageIcon className="w-3.5 h-3.5 text-blue-400" />;
    if (att.name.endsWith('.csv') || att.name.endsWith('.xlsx'))
      return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />;
    if (
      att.name.endsWith('.py') ||
      att.name.endsWith('.js') ||
      att.name.endsWith('.ts') ||
      att.name.endsWith('.tsx') ||
      att.name.endsWith('.json')
    )
      return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
    return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1">
      {/* Hidden file input for document reading / image attachments */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.markdown,.pdf,.csv,.json,.py,.js,.ts,.tsx,.html,.css,.sql,.sh,.png,.jpg,.jpeg,.webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Starter Suggestions on empty conversation */}
      {showSuggestions && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] mb-2.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>Quick Capabilities & Prompts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item.prompt)}
                disabled={isGenerating}
                className="group p-3 rounded-xl bg-[#121215] border border-[#27272a] hover:border-[#6366f1]/60 hover:bg-[#18181b] text-left transition-all duration-150 flex flex-col justify-between"
              >
                <div className="font-medium text-xs text-[#f4f4f5] group-hover:text-[#c0c1ff] transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  {item.prompt.startsWith('/image') && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-950/60 border border-fuchsia-800/40 text-fuchsia-300">
                      Image
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#71717a] group-hover:text-[#a1a1aa] transition-colors mt-0.5 line-clamp-1">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Error Notice */}
      {voiceNotice && (
        <div className="mb-2 p-2 rounded-lg bg-amber-950/50 border border-amber-800/50 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Attached Documents Dock */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-[#121215] border border-[#27272a] rounded-xl">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg bg-[#18181b] border border-[#3f3f46]/60 text-xs text-[#f4f4f5]"
            >
              {getFileIcon(att)}
              <span className="truncate max-w-[140px] font-medium" title={att.name}>
                {att.name}
              </span>
              <span className="text-[10px] text-[#71717a] font-mono">
                {formatFileSize(att.size)}
              </span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="p-0.5 text-[#71717a] hover:text-white rounded hover:bg-[#27272a]"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="text-[11px] text-[#71717a] self-center ml-auto font-mono pr-1">
            {attachments.length} {attachments.length === 1 ? 'document' : 'documents'} ready
          </div>
        </div>
      )}

      {/* Mode Indicators (Voice Listening or Image Mode) */}
      {(isListening || isImageMode) && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 rounded-xl bg-[#1e1b4b]/40 border border-[#4338ca]/40 text-xs">
          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1.5 text-red-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Listening... Speak your command</span>
              </span>
            )}
            {isImageMode && (
              <span className="flex items-center gap-1.5 text-fuchsia-300 font-medium">
                <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Image Generation Mode Active</span>
              </span>
            )}
          </div>
          {isImageMode && (
            <button
              onClick={() => setIsImageMode(false)}
              className="text-[11px] text-[#a1a1aa] hover:text-white underline"
            >
              Exit Image Mode
            </button>
          )}
        </div>
      )}

      {/* The Floating Omnibar Container */}
      <div
        className={`relative rounded-2xl bg-[#18181b] border transition-all duration-200 shadow-xl shadow-black/50 ${
          isImageMode
            ? 'border-fuchsia-600/70 ring-2 ring-fuchsia-600/20'
            : isListening
            ? 'border-red-500/80 ring-2 ring-red-500/20'
            : 'border-[#27272a] focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-[#6366f1]/20'
        }`}
      >
        <div className="p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              isGenerating
                ? 'Synthetix is responding...'
                : isListening
                ? 'Listening to your voice...'
                : isImageMode
                ? 'Describe the image you want to generate...'
                : 'Message Synthetix, upload a doc, or use voice command...'
            }
            className="w-full bg-transparent text-[#f4f4f5] placeholder-[#71717a] text-[14px] leading-relaxed resize-none focus:outline-none max-h-44 min-h-[26px]"
          />

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/50 mt-1">
            {/* Left Action Buttons: Attachment, Voice Command, Image Gen Mode */}
            <div className="flex items-center gap-1">
              {/* Document Reading / File Attachment */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating || disabled}
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272a] transition-colors relative"
                title="Attach Document or Image (PDF, TXT, Code, CSV, etc.)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Command (Speech-to-Text) */}
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isGenerating || disabled}
                className={`p-1.5 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272a]'
                }`}
                title={
                  isSpeechSupported
                    ? isListening
                      ? 'Stop Voice Command'
                      : 'Voice Command (Speak to input)'
                    : 'Speech recognition not supported in this browser'
                }
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Image Generation Toggle */}
              <button
                type="button"
                onClick={() => setIsImageMode(!isImageMode)}
                disabled={isGenerating || disabled}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                  isImageMode
                    ? 'bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/40 font-medium'
                    : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272a]'
                }`}
                title="Toggle AI Image Generation Mode"
              >
                <ImageIcon className="w-4 h-4 text-fuchsia-400" />
                <span className="hidden sm:inline">Image</span>
              </button>
            </div>

            {/* Right Action: Send / Stop */}
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-medium transition-all shadow-md shadow-red-950/40"
                  title="Stop generation"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submitMessage()}
                  disabled={(!input.trim() && attachments.length === 0) || disabled}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 ${
                    (input.trim() || attachments.length > 0) && !disabled
                      ? isImageMode
                        ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-md shadow-fuchsia-600/30 active:scale-95'
                        : 'bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-md shadow-[#6366f1]/30 active:scale-95'
                      : 'bg-[#27272a] text-[#71717a] cursor-not-allowed'
                  }`}
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-[#52525b]">
        <span>⚡ Ultra-Fast Gemini</span>
        <span>•</span>
        <span>🎙️ Voice Commands</span>
        <span>•</span>
        <span>📄 Document Analysis</span>
        <span>•</span>
        <span>🎨 AI Image Generation</span>
      </div>
    </div>
  );
};
