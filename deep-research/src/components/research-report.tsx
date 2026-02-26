"use client";

import ReactMarkdown from "react-markdown";

interface ResearchReportProps {
  content: string;
}

export function ResearchReport({ content }: ResearchReportProps) {
  if (!content) return null;

  return (
    <div className="w-full max-w-2xl animate-in fade-in duration-500">
      <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-4 prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-2 prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:my-0.5">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
