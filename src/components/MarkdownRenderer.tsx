import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ content }) => {
  return (
    <div className="text-zinc-800 dark:text-zinc-200 text-[15px] leading-relaxed break-words space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            if (!inline && (match || value.includes('\n'))) {
              return <CodeBlock language={match ? match[1] : 'text'} value={value} />;
            }

            return (
              <code
                className="px-1.5 py-0.5 mx-0.5 rounded-md text-xs font-mono font-medium bg-zinc-200/70 dark:bg-zinc-800/80 text-indigo-700 dark:text-indigo-300 border border-zinc-300/40 dark:border-zinc-700/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-5 mb-2 pb-1.5 border-b border-zinc-200 dark:border-zinc-800 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2 pb-1 border-b border-zinc-200/70 dark:border-zinc-800/70 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5 tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500/60 pl-4 py-1 italic my-3 text-zinc-600 dark:text-zinc-400 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-r-lg">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-100/90 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold uppercase text-xs tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 bg-white/50 dark:bg-zinc-950/40">
              {children}
            </tbody>
          ),
          th: ({ children }) => <th className="px-4 py-2.5 font-semibold">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2.5 text-sm">{children}</td>,
          hr: () => <hr className="my-5 border-zinc-200 dark:border-zinc-800" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';
