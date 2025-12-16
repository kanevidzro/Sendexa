// ---

// code-block.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  language?: string;
  title?: string;
  highlight?: number[];
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language = 'plaintext',
  title,
  showLineNumbers = true,
  className,
  ...props
}: CodeBlockProps) {
  const lines = String(children).split('\n').filter(line => line.length > 0);

  return (
    <div className={cn('my-6 rounded-lg overflow-hidden', className)} {...props}>
      {title && (
        <div className="bg-gray-900 dark:bg-gray-950 px-4 py-2 text-sm font-medium text-gray-300">
          {title}
        </div>
      )}
      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 overflow-x-auto">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="inline-block w-8 text-right pr-4 text-gray-600 dark:text-gray-500 select-none">
                  {i + 1}
                </span>
              )}
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

