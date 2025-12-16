// ---

// video.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface MDXVideoProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  type?: string;
  thumbnail?: string;
  caption?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  rounded?: boolean;
  shadow?: boolean;
}

export function MDXVideo({
  src,
  type = 'video/mp4',
  thumbnail,
  caption,
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  rounded = true,
  shadow = true,
  className,
  ...props
}: MDXVideoProps) {
  const [isPlaying, setIsPlaying] = React.useState(autoplay);

  return (
    <figure className="my-8 flex flex-col items-center">
      <div
        className={cn(
          'w-full relative bg-black overflow-hidden',
          rounded && 'rounded-lg',
          shadow && 'shadow-lg'
        )}
      >
        <video
          src={src}
          poster={thumbnail}
          autoPlay={autoplay}
          controls={controls}
          loop={loop}
          muted={muted}
          className="w-full h-auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          {...props}
        >
          <source src={src} type={type} />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && thumbnail && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <Play className="w-12 h-12 text-white opacity-80" fill="white" />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

