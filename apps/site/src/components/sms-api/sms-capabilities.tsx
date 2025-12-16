// components/sms-api/sms-capabilities.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const capabilities = [
  {
    id: 'bulk',
    title: 'Bulk SMS',
    description: 'Send thousands of messages simultaneously to your entire contact list.',
    features: ['Batch sending', 'Contact segmentation', 'Personalization', 'Scheduling'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )
  },
  {
    id: 'two-way',
    title: 'Two-Way Messaging',
    description: 'Receive and respond to customer messages for real-time conversations.',
    features: ['Inbound SMS', 'Auto-replies', 'Conversation threading', 'Agent assignment'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    id: 'transactional',
    title: 'Transactional SMS',
    description: 'Send important notifications like OTPs, alerts, and updates.',
    features: ['High priority routing', 'Instant delivery', 'Delivery receipts', 'Status tracking'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'marketing',
    title: 'Marketing Campaigns',
    description: 'Run targeted SMS marketing campaigns with analytics.',
    features: ['A/B testing', 'Click tracking', 'Conversion tracking', 'ROI analytics'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )
  },
  {
    id: 'scheduled',
    title: 'Scheduled SMS',
    description: 'Schedule messages for optimal delivery times.',
    features: ['Time zone support', 'Recurring messages', 'Queue management', 'Delivery optimization'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'unicode',
    title: 'Unicode Support',
    description: 'Send messages in local languages with full character support.',
    features: ['Twi & Ga support', 'Emoji support', 'Long messages', 'Automatic encoding'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )
  }
];

export default function SMSCapabilities() {
  const [activeCapability, setActiveCapability] = useState('bulk');

  return (
    <section className="py-14 md:py-28 bg-gray-50 dark:bg-white/1">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 text-3xl dark:text-white/90 md:text-title-lg">
            Complete SMS Capabilities
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Everything you need to power SMS communication for your business in Ghana.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Capabilities List */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {capabilities.map((cap) => (
                  <button
                    key={cap.id}
                    onClick={() => setActiveCapability(cap.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl transition-all',
                      activeCapability === cap.id
                        ? 'bg-white dark:bg-white/10 border-2 border-primary-500 shadow-lg'
                        : 'bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        activeCapability === cap.id
                          ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                      )}>
                        {cap.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {cap.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Active Capability Details */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
                {capabilities
                  .filter(cap => cap.id === activeCapability)
                  .map((cap) => (
                    <div key={cap.id}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">
                          {cap.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {cap.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {cap.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {cap.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                            <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Example Use Case */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Example Use Case</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Messages per hour</span>
                            <span className="font-bold text-gray-800 dark:text-white">10,000+</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Delivery success rate</span>
                            <span className="font-bold text-green-600 dark:text-green-400">99.9%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Average response time</span>
                            <span className="font-bold text-gray-800 dark:text-white">&lt; 1 second</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}