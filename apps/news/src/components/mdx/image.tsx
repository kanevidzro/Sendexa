// image.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MDXImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  rounded?: boolean;
  shadow?: boolean;
}

export function MDXImage({
  src,
  alt,
  width = 800,
  height = 400,
  caption,
  rounded = true,
  shadow = true,
  className,
  ...props
}: MDXImageProps) {
  return (
    <figure className="my-8 flex flex-col items-center">
      <div
        className={cn(
          'w-full overflow-hidden',
          rounded && 'rounded-lg',
          shadow && 'shadow-lg'
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-auto object-cover',
            className
          )}
          quality={95}
          priority
          {...props}
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

