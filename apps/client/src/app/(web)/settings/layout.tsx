// app/settings/layout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ApiIcon,
 
  Cancel01Icon,
  LockPasswordIcon,
  Menu01Icon,

  UserCircleIcon,
  Wallet05Icon,
  WebhookIcon,

} from '@hugeicons/core-free-icons';

// Settings links with icons
const settingsLinks = [
  { 
    href: '/settings', 
    label: 'Profile', 
    icon: UserCircleIcon 
  },
  { 
    href: '/settings/account', 
    label: 'Account', 
    icon: Wallet05Icon 
  },
  { 
    href: '/settings/security', 
    label: 'Security', 
    icon: LockPasswordIcon 
  },
 
 
  { 
    href: '/settings/api-tokens', 
    label: 'API Tokens', 
    icon: ApiIcon 
  },
  { 
    href: '/settings/webhooks', 
    label: 'Webhooks', 
    icon: WebhookIcon 
  },
];

export default function SettingsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === '/settings') {
      return pathname === '/settings';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account
          </p>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-accent"
          aria-label="Toggle menu"
        >
          <HugeiconsIcon 
            icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon} 
            className="h-5 w-5"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-background border-r p-6 animate-in slide-in-from-left-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold">Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your account
                </p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-accent"
                aria-label="Close menu"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {settingsLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <HugeiconsIcon 
                    icon={link.icon} 
                    className={cn(
                      'h-4 w-4',
                      isActive(link.href) ? 'opacity-100' : 'opacity-60'
                    )}
                  />
                  {link.label}
                  {isActive(link.href) && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-55 flex-shrink-0 border-r sticky bg-background">
        <div className="flex flex-col sticky h-full w-full p-4">
          <div className="mb-8">
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account
            </p>
          </div>
          <nav className="flex-1 space-y-1">
            {settingsLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-1 py-3 rounded-md text-sm font-medium transition-colors group',
                  isActive(link.href)
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-md transition-colors',
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary'
                )}>
                  <HugeiconsIcon icon={link.icon} className="h-4 w-4" />
                </div>
                {link.label}
                {isActive(link.href) && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
          
          
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-1 w-full">
        {/* Mobile Breadcrumb */}
        <div className="md:hidden px-4 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Link 
              href="/settings" 
              className="text-muted-foreground hover:text-foreground"
            >
              Settings
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">
              {settingsLinks.find(link => isActive(link.href))?.label || 'Settings'}
            </span>
          </div>
        </div>

        <div className="p-2 md:p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}