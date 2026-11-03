import React from 'react';
import {
  Sparkles,
  Code2,
  Lightbulb,
  Cpu,
  Compass,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    category: 'Coding & Tech',
    icon: Code2,
    gradient: 'from-blue-500/15 via-indigo-500/10 to-transparent',
    iconBg: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20',
    prompt: 'Write a modern TypeScript React hook for debouncing search input with clean cleanup.',
    badge: 'Code Snippet',
  },
  {
    category: 'Reasoning & Concepts',
    icon: Cpu,
    gradient: 'from-purple-500/15 via-pink-500/10 to-transparent',
    iconBg: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20',
    prompt: 'Explain how Large Language Models and Attention mechanisms work using an intuitive analogy.',
    badge: 'Explanation',
  },
  {
    category: 'Writing & Strategy',
    icon: Lightbulb,
    gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    iconBg: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20',
    prompt: 'Draft an engaging and persuasive proposal email for introducing AI tools to my team.',
    badge: 'Drafting',
  },
  {
    category: 'Architecture',
    icon: Compass,
    gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
    iconBg: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20',
    prompt: 'Compare Monolithic vs Microservices architectures with practical trade-offs for growing teams.',
    badge: 'Analysis',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl mx-auto w-full select-none">
      {/* Brand Icon & Heading */}
      <div className="relative mb-6 text-center space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-2xl shadow-indigo-500/30">
          <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 dark:text-indigo-400 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            Google Gemini Free API
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          What would you like to explore?
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Ask questions, debug code, brainstorm ideas, or analyze complex problems with ultra-fast AI responses.
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-4">
        {STARTER_PROMPTS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group text-left p-4.5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/90 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${item.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.prompt}
                </p>
              </div>

              <div className="relative z-10 mt-3.5 flex items-center text-xs text-zinc-400 group-hover:text-indigo-500 font-semibold transition-colors">
                <span>Start conversation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
