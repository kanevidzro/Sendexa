'use client';

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Cancel01Icon,
  Megaphone02Icon,
} from "@hugeicons/core-free-icons";

import { announcements } from "@/config/announcements";
import { variantStyles } from "@/config/announcement-variants";

interface AnnouncementBannerProps {
  index?: number;
  closable?: boolean;
}

export default function AnnouncementBanner({
  index = 0,
  closable = true,
}: AnnouncementBannerProps) {
  const announcement = announcements[index];
  const styles = variantStyles[announcement.variant]; // ✅ THIS LINE

  const storageKey = `sendexa_announcement_${announcement.id}`;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(storageKey) === "true") {
      setVisible(false);
    }
  }, [storageKey]);

  useEffect(() => {
    if (announcement.autoClose && visible) {
      const timer = setTimeout(
        () => handleClose(),
        announcement.autoClose * 1000
      );
      return () => clearTimeout(timer);
    }
  }, [announcement.autoClose, visible]);

  const handleClose = () => {
    setVisible(false);
    if (closable) {
      localStorage.setItem(storageKey, "true");
    }
  };

  if (!visible) return null;

  return (
    <div className={`relative ${styles.background} text-white`}>
      <div className="wrapper">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-2 sm:py-3">
          
          {/* Left */}
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md bg-white/10 ${styles.icon}`}>
              <HugeiconsIcon icon={Megaphone02Icon} className="w-4 h-4" />
            </div>

            <div className="text-xs sm:text-sm leading-tight">
              <span className="font-medium">{announcement.title}</span>
              {announcement.description && (
                <span className="hidden sm:inline text-white/80 ml-2">
                  {announcement.description}
                </span>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {announcement.ctaHref && (
              <a
                href={announcement.ctaHref}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${styles.button}`}
              >
                {announcement.ctaLabel}
                <HugeiconsIcon icon={ArrowRight02Icon} className="w-3.5 h-3.5" />
              </a>
            )}

            {closable && (
              <button
                onClick={handleClose}
                aria-label="Dismiss announcement"
                className="p-1 rounded hover:bg-white/10"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
