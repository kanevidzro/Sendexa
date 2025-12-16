// 'use client';
// import React from 'react';
// import { useMDXComponent } from 'next-contentlayer2/hooks';
// import clsx from 'clsx';
// import SearchButton from '@/components/search-button';
// import Preview from '@/components/preview';
// import { Tab, Tabs, TabsContent, TabsList } from '@/components/tabs';
// import Link from 'next/link';
// import CustomSyntaxHighlighter from '@/components/syntax-highlighter';
// import Stepper from '@/components/vertical-stepper';
// import { Step, Steps, StepTitle, StepContent } from '@/components/step';
// import { Button } from '@/components/button';
// import { Menu, MenuItem, MenuTrigger, PopMenu } from '@/components/menu';
// import {
//   PopoverContent,
//   PopoverTrigger,
//   Popover,
//   PopoverClose,
// } from '@/components/popover';
// import {
//   Home,
//   Users,
//   Settings,
//   FileText,
//   BarChart,
//   Mail,
//   Bell,
//   BookOpen,
//   Component,
// } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from '@/components/select';
// import {
//   DialogCloseTrigger,
//   DialogContent,
//   DialogTrigger,
//   Dialog,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
// } from '@/components/dialog';
// import { Folder, FolderTree, File } from '@/components/folder-tree';
// import { Note } from '@/components/note';
// import { Checkbox } from '@/components/checkbox';
// import { Label } from '@/components/label';
// import { Input } from '@/components/input';

// // Import new media components
// import { MDXImage } from '@/components/mdx/image';
// import { MDXVideo } from '@/components/mdx/video';
// import { MDXEmbed } from '@/components/mdx/embed';
// import { Callout } from '@/components/mdx/callout';
// import { CodeBlock } from '@/components/mdx/code-block';
// import { Comparison } from '@/components/mdx/comparison';

// const components = {
//   // Heading components with improved styling
//   h1: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <h1
//       className={`text-4xl font-bold mt-8 mb-4 scroll-m-20 tracking-tight ${className}`}
//       {...children}
//     />
//   ),
//   h2: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
//     return (
//       <Link
//         href={`#${props.id}`}
//         className={'cursor-pointer group relative items-center w-fit'}
//       >
//         <h2
//           className={`text-3xl font-bold mt-8 mb-4 scroll-m-20 hover:underline gap-1 flex items-center ${className}`}
//           {...props}
//         >
//           {props.children}
//           <span className="text-2xl text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
//             #
//           </span>
//         </h2>
//       </Link>
//     );
//   },
//   h3: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <h3
//       className={`text-2xl font-semibold mt-6 mb-3 scroll-m-20 ${className}`}
//       {...children}
//     />
//   ),
//   h4: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <h4
//       className={`text-xl font-semibold mt-6 mb-3 scroll-m-20 ${className}`}
//       {...children}
//     />
//   ),
//   h5: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <h5
//       className={`text-lg font-semibold mt-5 mb-2 scroll-m-20 ${className}`}
//       {...children}
//     />
//   ),
//   h6: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <h6
//       className={`text-base font-semibold mt-4 mb-2 scroll-m-20 ${className}`}
//       {...children}
//     />
//   ),

//   // Text components
//   p: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <p className={`my-5 leading-7 text-gray-700 dark:text-gray-300 ${className}`} {...children} />
//   ),
//   a: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <a
//       className={`text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ${className}`}
//       {...children}
//     />
//   ),

//   // List components with better spacing
//   ul: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <ul className={`list-disc list-inside my-5 space-y-2 ${className}`} {...children} />
//   ),
//   ol: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <ol className={`list-decimal list-inside my-5 space-y-2 ${className}`} {...children} />
//   ),
//   li: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <li className={`text-gray-700 dark:text-gray-300 ${className}`} {...children} />
//   ),

//   // Quote component
//   blockquote: ({ className, ...children }: React.HTMLAttributes<HTMLElement>) => (
//     <blockquote
//       className={`border-l-4 border-blue-500 pl-4 italic my-5 text-gray-700 dark:text-gray-300 py-2 ${className}`}
//       {...children}
//     />
//   ),

//   // Divider
//   hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
//     <hr className={`my-6 border-gray-300 dark:border-gray-700 ${className}`} {...props} />
//   ),

//   // Table components with better styling
//   table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
//     <div className="my-6 w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
//       <table
//         className={clsx(
//           'w-full text-sm text-gray-900 dark:text-gray-100',
//           className
//         )}
//         {...props}
//       />
//     </div>
//   ),
//   tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
//     <tr className={clsx('border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30', className)} {...props} />
//   ),
//   th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
//     <th
//       className={clsx(
//         'bg-gray-100 dark:bg-gray-900 px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100',
//         className
//       )}
//       {...props}
//     />
//   ),
//   td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
//     <td
//       className={clsx(
//         'px-4 py-3',
//         className
//       )}
//       {...props}
//     />
//   ),

//   // Code component
//   code: ({
//     className,
//     children,
//     ...props
//   }: React.HTMLAttributes<HTMLElement>) => {
//     const isLightMode = 'dark';
//     const match = className?.match(/language-(\w+)/);
//     const language = match ? match[1] : 'plaintext';

//     const extractText = (children: React.ReactNode): string => {
//       if (typeof children === 'string') return children;
//       if (Array.isArray(children)) return children.map(extractText).join('');
//       if (React.isValidElement(children))
//         return extractText((children.props as any)?.children || '');
//       return '';
//     };

//     if (language !== 'plaintext') {
//       return (
//         <CustomSyntaxHighlighter
//           tabs={{
//             [language]: { syntax: extractText(children) as string, language },
//           }}
//           themeMode={isLightMode}
//           indicatorColor="bg-blue-900"
//         />
//       );
//     } else {
//       return (
//         <code
//           className={clsx(
//             'relative rounded bg-gray-100 dark:bg-gray-900 px-2 py-1 font-mono text-sm text-gray-900 dark:text-gray-100',
//             className
//           )}
//           {...props}
//         >
//           {children}
//         </code>
//       );
//     }
//   },

//   // Existing components
//   Preview,
//   SearchButton,
//   CustomSyntaxHighlighter,
//   Tabs,
//   TabsList,
//   Tab,
//   TabsContent,
//   Button,
//   Step,
//   Steps,
//   StepTitle,
//   StepContent,
//   Stepper,
//   Checkbox,
//   Label,
//   Input,
//   Home,
//   Users,
//   Settings,
//   FileText,
//   BarChart,
//   Mail,
//   Bell,
//   BookOpen,
//   Component,
//   Folder,
//   FolderTree,
//   File,
//   Note,
//   Menu,
//   MenuItem,
//   MenuTrigger,
//   PopMenu,
//   PopoverContent,
//   PopoverTrigger,
//   Popover,
//   PopoverClose,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectValue,
//   DialogCloseTrigger,
//   DialogContent,
//   DialogTrigger,
//   Dialog,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,

//   // New media components
//   MDXImage,
//   MDXVideo,
//   MDXEmbed,
//   Callout,
//   CodeBlock,
//   Comparison,
// };

// interface Mdxchildren {
//   code: string;
// }



// export function Mdx({ code }: Mdxchildren) {
//   const Component = useMDXComponent(code, {
//     style: 'default',
//   });

//   return (
//     <div className="mdx prose prose-lg dark:prose-invert max-w-none">
//       <Component components={components} />
//     </div>
//   );
// }

'use client';

import React from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import clsx from 'clsx';
import Link from 'next/link';

import SearchButton from '@/components/search-button';
import Preview from '@/components/preview';
import { Tab, Tabs, TabsContent, TabsList } from '@/components/tabs';
import CustomSyntaxHighlighter from '@/components/syntax-highlighter';
import Stepper from '@/components/vertical-stepper';
import { Step, Steps, StepTitle, StepContent } from '@/components/step';
import { Button } from '@/components/button';
import { Menu, MenuItem, MenuTrigger, PopMenu } from '@/components/menu';
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
  PopoverClose,
} from '@/components/popover';
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart,
  Mail,
  Bell,
  BookOpen,
  Component,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/select';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/dialog';
import { Folder, FolderTree, File } from '@/components/folder-tree';
import { Note } from '@/components/note';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { Input } from '@/components/input';

import { MDXImage } from '@/components/mdx/image';
import { MDXVideo } from '@/components/mdx/video';
import { MDXEmbed } from '@/components/mdx/embed';
import { Callout } from '@/components/mdx/callout';
import { CodeBlock } from '@/components/mdx/code-block';
import { Comparison } from '@/components/mdx/comparison';

const components = {
  /**
   * Headings
   * - Page owns the real H1
   * - MDX starts from H2 visually
   */
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={clsx(
        'text-4xl font-bold mt-10 mb-4 scroll-m-20 tracking-tight',
        className
      )}
      {...props}
    />
  ),

  h2: ({ className, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={id}
      className={clsx(
        'text-3xl font-bold mt-10 mb-4 scroll-m-20 flex items-center gap-2',
        className
      )}
    >
      <a
        href={`#${id}`}
        className="group hover:underline"
      >
        {props.children}
        <span className="ml-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          #
        </span>
      </a>
    </h2>
  ),

  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={clsx('text-2xl font-semibold mt-8 mb-3 scroll-m-20', className)}
      {...props}
    />
  ),

  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={clsx('text-xl font-semibold mt-6 mb-3 scroll-m-20', className)}
      {...props}
    />
  ),

  /**
   * Text
   */
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={clsx(
        'my-5 leading-7 text-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    />
  ),

  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={clsx(
        'text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-700 dark:hover:text-blue-300',
        className
      )}
      {...props}
    />
  ),

  /**
   * Lists
   */
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={clsx('list-disc list-inside my-5 space-y-2', className)}
      {...props}
    />
  ),

  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={clsx('list-decimal list-inside my-5 space-y-2', className)}
      {...props}
    />
  ),

  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={clsx('text-gray-700 dark:text-gray-300', className)}
      {...props}
    />
  ),

  /**
   * Blockquote
   */
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={clsx(
        'border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    />
  ),

  /**
   * Code
   */
  code: ({ className, children }: React.HTMLAttributes<HTMLElement>) => {
    const match = className?.match(/language-(\w+)/);
    const language = match?.[1];

    if (language) {
      return (
        <CustomSyntaxHighlighter
          tabs={{
            [language]: { syntax: String(children), language },
          }}
          themeMode="dark"
        />
      );
    }

    return (
      <code className="rounded bg-gray-100 dark:bg-gray-900 px-2 py-1 font-mono text-sm">
        {children}
      </code>
    );
  },

  Preview,
  SearchButton,
  Tabs,
  TabsList,
  Tab,
  TabsContent,
  Button,
  Step,
  Steps,
  StepTitle,
  StepContent,
  Stepper,
  Checkbox,
  Label,
  Input,
  Home,
  Users,
  Settings,
  FileText,
  BarChart,
  Mail,
  Bell,
  BookOpen,
  Component,
  Folder,
  FolderTree,
  File,
  Note,
  Menu,
  MenuItem,
  MenuTrigger,
  PopMenu,
  PopoverContent,
  PopoverTrigger,
  Popover,
  PopoverClose,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  DialogCloseTrigger,
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  MDXImage,
  MDXVideo,
  MDXEmbed,
  Callout,
  CodeBlock,
  Comparison,
};

interface Mdxchildren {
  code: string;
}

export function Mdx({ code }: Mdxchildren) {
  const Component = useMDXComponent(code, {
    style: 'default',
  });

  return (
    <div className="mdx prose prose-lg dark:prose-invert max-w-none">
      <Component components={components} />
    </div>
  );
}
