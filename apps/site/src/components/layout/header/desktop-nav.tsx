
import { ChevronDown2Icon } from '@/icons/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';
import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BubbleChatIcon,
  Building03Icon,
  File02Icon,
  SourceCodeSquareIcon,
  Layers01Icon,
  Mail01Icon,
  Mortarboard02Icon,
  Rocket01Icon,
  SmsCodeIcon,
  UserMultiple02Icon,
  ShoppingCart01Icon,
  BankIcon,
} from '@hugeicons/core-free-icons';

// Icon mapping utility
const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'message':
      return <HugeiconsIcon icon={BubbleChatIcon} size={18} />;
    case 'shield':
      return <HugeiconsIcon icon={SmsCodeIcon} size={18} />;
    case 'mail':
      return <HugeiconsIcon icon={Mail01Icon} size={18} />;
    case 'rocket':
      return <HugeiconsIcon icon={Rocket01Icon} size={18} />;
    case 'users':
      return <HugeiconsIcon icon={UserMultiple02Icon} size={18} />;
    case 'graduation':
      return <HugeiconsIcon icon={Mortarboard02Icon} size={18} />;
    case 'code':
      return <HugeiconsIcon icon={SourceCodeSquareIcon} size={18} />;
    case 'layers':
      return <HugeiconsIcon icon={Layers01Icon} size={18} />;
    case 'file':
      return <HugeiconsIcon icon={File02Icon} size={18} />;
    case 'building':
      return <HugeiconsIcon icon={Building03Icon} size={18} />;
    case 'phone':
        return <HugeiconsIcon icon={Building03Icon} size={18} />;
    case 'bank':
        return <HugeiconsIcon icon={BankIcon} size={18} />;
    case 'cart':
      return <HugeiconsIcon icon={ShoppingCart01Icon} size={18} />;
    default:
      return null;
  }
};

export default function DesktopNav() {
  const pathname = usePathname();
  const [activeDropdownKey, setActiveDropdownKey] = useState('');
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);

  function toggleActiveDropdown(key: string) {
    setActiveDropdownKey((prevKey) => (prevKey === key ? '' : key));
  }

  function openDropdown(key: string) {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveDropdownKey(key);
  }

  function closeDropdown(delay = 150) {
    // Don't close if user is hovering over the dropdown
    if (isHoveringDropdown) return;
    
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      setActiveDropdownKey('');
    }, delay);
    setHoverTimeout(timeout);
  }

  useEffect(() => {
    // Hide dropdown on pathname changes
    setActiveDropdownKey('');
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [pathname, hoverTimeout]);

  return (
    <nav className="hidden lg:flex lg:items-center bg-[#F9FAFB] dark:bg-white/3 rounded-full p-1 max-h-fit">
      {navItems.map((item) => {
        if (item.type === 'link') {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-gray-600 dark:text-gray-300 text-sm px-5 py-2 rounded-full font-medium transition-all duration-200',
                {
                  'bg-white dark:bg-white/5 text-gray-900 dark:text-white font-medium shadow-xs': isActive,
                  'hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-white/5': !isActive,
                }
              )}
            >
              {item.label}
            </Link>
          );
        }

        if (item.type === 'dropdown') {
          const isDropdownActive = activeDropdownKey === item.label;
          const hasActiveChild = item.items.some(({ href }) => pathname?.includes(href));

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => openDropdown(item.label)}
              onMouseLeave={() => closeDropdown()}
            >
              <button
                onClick={() => toggleActiveDropdown(item.label)}
                className={cn(
                  'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 group text-sm inline-flex gap-1.5 items-center px-5 py-2 font-medium rounded-full transition-all duration-200',
                  {
                    'bg-white dark:bg-white/5 text-gray-900 dark:text-white font-medium shadow-xs': hasActiveChild || isDropdownActive,
                    'hover:bg-white/50 dark:hover:bg-white/5': !hasActiveChild,
                  }
                )}
              >
                <span>{item.label}</span>
                <ChevronDown2Icon
                  className={cn('size-4 transition-transform duration-200', {
                    'rotate-180': isDropdownActive,
                    'group-hover:rotate-180': !isDropdownActive,
                  })}
                />
              </button>

              {isDropdownActive && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-theme-xl border border-gray-100 dark:border-gray-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => {
                    setIsHoveringDropdown(true);
                    openDropdown(item.label);
                  }}
                  onMouseLeave={() => {
                    setIsHoveringDropdown(false);
                    closeDropdown(100); // Shorter delay when leaving dropdown
                  }}
                >
                  <div className="space-y-0.5">
                    {item.items.map((subItem) => {
                      const isSubActive = pathname?.includes(subItem.href);
                      const iconComponent = subItem.icon ? getIconComponent(subItem.icon) : null;
                      
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            'flex items-start gap-3 px-4 py-3 text-sm rounded-lg transition-colors duration-150 group',
                            {
                              'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': isSubActive,
                              'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50': !isSubActive,
                            }
                          )}
                          onClick={() => {
                            setActiveDropdownKey('');
                            setIsHoveringDropdown(false);
                          }}
                        >
                          {iconComponent && (
                            <div className={cn(
                              'p-1.5 rounded-lg mt-0.5 shrink-0',
                              {
                                'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': isSubActive,
                                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600': !isSubActive,
                              }
                            )}>
                              {iconComponent}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{subItem.label}</span>
                            {subItem.description && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                {subItem.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }
      })}
    </nav>
  );
}