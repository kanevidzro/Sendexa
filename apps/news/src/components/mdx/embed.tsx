// ---

// embed.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface MDXEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'youtube' | 'vimeo' | 'codepen' | 'twitter' | 'github-gist' | 'iframe';
  id?: string;
  src?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function MDXEmbed({
  type,
  id,
  src,
  caption,
  width = 100,
  height = 600,
  className,
  ...props
}: MDXEmbedProps) {
  const getEmbedUrl = () => {
    switch (type) {
      case 'youtube':
        return `https://www.youtube.com/embed/${id}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${id}`;
      case 'codepen':
        return `https://codepen.io/${id}/embed`;
      case 'iframe':
        return src;
      default:
        return '';
    }
  };

  if (type === 'twitter') {
    return (
      <div className="my-8 flex justify-center">
        <div className={cn('w-full max-w-2xl', className)} {...props}>
          <script async src="https://platform.twitter.com/widgets.js"></script>
          <blockquote
            className="twitter-tweet"
            dangerouslySetInnerHTML={{
              __html: `<a href="${src}"></a>`,
            }}
          />
          {caption && (
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 italic">
              {caption}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (type === 'github-gist') {
    return (
      <div className="my-8">
        <script src={`https://gist.github.com/${id}.js`}></script>
        {caption && (
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 italic">
            {caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="my-8 flex flex-col items-center">
      <div
        className={cn(
          'w-full max-w-4xl rounded-lg shadow-lg overflow-hidden',
          className
        )}
        {...props}
      >
        <iframe
          src={getEmbedUrl()}
          width={`${width}%`}
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full"
        />
      </div>
      {caption && (
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 italic">
          {caption}
        </p>
      )}
    </div>
  );
}
