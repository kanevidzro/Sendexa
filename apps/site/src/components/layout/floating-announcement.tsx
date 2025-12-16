'use client';

import { useState, useEffect } from 'react';
//import { XMarkIcon, GiftIcon, SparklesIcon } from '@/icons/icons';
import { HugeiconsIcon } from '@hugeicons/react';

import {
  Cancel01Icon,
  GiftIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
export default function FloatingAnnouncement() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState('bottom-right'); // 'bottom-right' | 'top-right'

  useEffect(() => {
    // Show after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('sendexa_floating_announcement_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${position === 'bottom-right' ? 'bottom-6 right-6' : 'top-6 right-6'} z-50 animate-slide-up`}>
      <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden w-80">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <HugeiconsIcon icon={GiftIcon} className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Special Offer! 🎁</h3>
              <p className="text-white/80 text-xs">For new users only</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-bold text-lg">1,000 FREE SMS</span>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Start your Ghanaian business communication journey with free credits. No credit card required.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-white/80 text-xs">
              <div className="w-1 h-1 bg-white/60 rounded-full mr-2"></div>
              Valid for all Ghanaian networks
            </div>
            <div className="flex items-center text-white/80 text-xs">
              <div className="w-1 h-1 bg-white/60 rounded-full mr-2"></div>
              Includes MTN, Vodafone & AirtelTigo
            </div>
            <div className="flex items-center text-white/80 text-xs">
              <div className="w-1 h-1 bg-white/60 rounded-full mr-2"></div>
              Expires in 30 days
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="/signup?promo=welcome1000"
            className="block w-full bg-white text-primary-700 hover:bg-gray-100 font-semibold py-3 px-4 rounded-lg text-center transition shadow-lg hover:shadow-xl"
          >
            Get Free Credits Now
          </a>

          <p className="text-white/60 text-xs text-center mt-3">
            Limited time offer. Terms apply.
          </p>
        </div>
      </div>
    </div>
  );
}