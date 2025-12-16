
// ---

// callout.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import {
  InfoIcon,
  AlertTriangleIcon,
  AlertCircle,
  CheckCircle2,
  LightbulbIcon,
} from 'lucide-react';

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip';

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  type: CalloutType;
  title?: string;
  icon?: React.ReactNode;
}

export function Callout({
  type,
  title,
  icon,
  className,
  children,
  ...props
}: CalloutProps) {
  const icons = {
    info: <InfoIcon className="w-5 h-5" />,
    warning: <AlertTriangleIcon className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    tip: <LightbulbIcon className="w-5 h-5" />,
  };

  const typeStyles = {
    info: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300',
    warning:
      'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300',
    error:
      'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20 text-red-900 dark:text-red-300',
    success:
      'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 text-green-900 dark:text-green-300',
    tip: 'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300',
  };

  const iconColors = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    tip: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div
      className={cn(
        'my-6 rounded-lg border-l-4 px-4 py-4',
        typeStyles[type],
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', iconColors[type])}>
          {icon || icons[type]}
        </div>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

