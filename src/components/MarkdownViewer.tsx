import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const htmlContent = useMemo(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    return marked.parse(content) as string;
  }, [content]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm">
      <div
        className="prose prose-slate dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight 
          prose-h1:text-2xl prose-h1:border-b prose-h1:border-slate-200 dark:prose-h1:border-slate-800 prose-h1:pb-3
          prose-h2:text-xl prose-h2:mt-8 prose-h2:text-teal-700 dark:prose-h2:text-teal-400
          prose-h3:text-lg
          prose-ul:my-4 prose-li:my-1.5 prose-li:text-sm prose-li:leading-relaxed
          prose-strong:text-slate-900 dark:prose-strong:text-slate-100"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
