"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/icons/icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
} from "@hugeicons/core-free-icons";

// Icon mapping utility (same as desktop)
const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case "message":
      return <HugeiconsIcon icon={BubbleChatIcon} size={18} />;
    case "shield":
      return <HugeiconsIcon icon={SmsCodeIcon} size={18} />;
    case "mail":
      return <HugeiconsIcon icon={Mail01Icon} size={18} />;
    case "rocket":
      return <HugeiconsIcon icon={Rocket01Icon} size={18} />;
    case "users":
      return <HugeiconsIcon icon={UserMultiple02Icon} size={18} />;
    case "graduation":
      return <HugeiconsIcon icon={Mortarboard02Icon} size={18} />;
    case "code":
      return <HugeiconsIcon icon={SourceCodeSquareIcon} size={18} />;
    case "layers":
      return <HugeiconsIcon icon={Layers01Icon} size={18} />;
    case "file":
      return <HugeiconsIcon icon={File02Icon} size={18} />;
    case "building":
      return <HugeiconsIcon icon={Building03Icon} size={18} />;
    case "phone":
      return <HugeiconsIcon icon={Building03Icon} size={18} />;
    case "bank":
      return <HugeiconsIcon icon={BankIcon} size={18} />;
    case "cart":
      return <HugeiconsIcon icon={ShoppingCart01Icon} size={18} />;
    default:
      return null;
  }
};

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MainMobileNav({ isOpen }: MobileMenuProps) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState("");

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? "" : key);
  };

  if (!isOpen) return null;

  return (
    // <div className="lg:hidden absolute top-full bg-white dark:bg-dark-primary w-full border-b border-gray-200 dark:border-gray-800 shadow-lg">
    <div className="lg:hidden h-screen absolute top-full bg-white dark:bg-dark-primary w-full border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
            {navItems.map((item) => {
              if (item.type === "link") {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-base font-medium",
                      {
                        "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400":
                          isActive,
                        "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50":
                          !isActive,
                      },
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              if (item.type === "dropdown") {
                const hasActiveChild = item.items.some((subItem) =>
                  pathname.includes(subItem.href),
                );

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={cn(
                        "flex justify-between items-center w-full px-4 py-3 rounded-lg text-base font-medium",
                        {
                          "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400":
                            hasActiveChild,
                          "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50":
                            !hasActiveChild,
                        },
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon
                        className={cn(
                          "size-4 transition-transform duration-200",
                          activeDropdown === item.label && "rotate-180",
                        )}
                      />
                    </button>

                    {activeDropdown === item.label && (
                      <div className="mt-1 space-y-0.5 pl-4">
                        {item.items.map((subItem) => {
                          const isSubActive = pathname.includes(subItem.href);
                          const iconComponent = subItem.icon
                            ? getIconComponent(subItem.icon)
                            : null;

                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm",
                                {
                                  "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400":
                                    isSubActive,
                                  "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50":
                                    !isSubActive,
                                },
                              )}
                            >
                              {iconComponent && (
                                <div
                                  className={cn("p-1.5 rounded-lg shrink-0", {
                                    "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400":
                                      isSubActive,
                                    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400":
                                      !isSubActive,
                                  })}
                                >
                                  {iconComponent}
                                </div>
                              )}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate">
                                  {subItem.label}
                                </span>
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
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className="flex flex-col pt-2 pb-3 space-y-3 px-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/signin"
            className="text-sm block w-full border h-11 border-gray-200 dark:border-gray-700 px-5 py-3 rounded-full text-center font-medium text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="flex items-center px-5 py-3 gradient-btn justify-center text-sm text-white rounded-full button-bg h-11 hover:opacity-90"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
