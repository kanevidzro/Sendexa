
// comparison.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface ComparisonItem {
  feature: string;
  left: boolean | string;
  right: boolean | string;
}

interface ComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  leftLabel: string;
  rightLabel: string;
  items: ComparisonItem[];
}

export function Comparison({
  leftLabel,
  rightLabel,
  items,
  className,
  ...props
}: ComparisonProps) {
  return (
    <div className={cn('my-8 overflow-x-auto', className)} {...props}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 dark:border-gray-700">
            <th className="text-left px-4 py-4 font-semibold text-gray-900 dark:text-gray-100 w-1/3">
              Feature
            </th>
            <th className="text-center px-4 py-4 font-semibold text-gray-900 dark:text-gray-100">
              {leftLabel}
            </th>
            <th className="text-center px-4 py-4 font-semibold text-gray-900 dark:text-gray-100">
              {rightLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={idx}
              className={cn(
                'border-b border-gray-200 dark:border-gray-800',
                idx % 2 === 0 && 'bg-gray-50 dark:bg-gray-900/30'
              )}
            >
              <td className="px-4 py-4 text-gray-900 dark:text-gray-100 font-medium">
                {item.feature}
              </td>
              <td className="px-4 py-4 text-center">
                {typeof item.left === 'boolean' ? (
                  item.left ? (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto" />
                  )
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">{item.left}</span>
                )}
              </td>
              <td className="px-4 py-4 text-center">
                {typeof item.right === 'boolean' ? (
                  item.right ? (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto" />
                  )
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">{item.right}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}