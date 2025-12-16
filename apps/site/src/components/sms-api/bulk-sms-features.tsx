// components/sms-api/bulk-sms-features.tsx
'use client';

import { useState } from 'react';

const bulkFeatures = [
  {
    title: "Contact Management",
    description: "Upload and organize contacts with groups and tags",
    details: "CSV import/export, deduplication, segmentation, and opt-out management"
  },
  {
    title: "Campaign Scheduling",
    description: "Schedule campaigns for optimal delivery times",
    details: "Time zone aware scheduling, recurring campaigns, and delivery windows"
  },
  {
    title: "Personalization",
    description: "Dynamic content with customer data",
    details: "Merge tags, conditional content, and localized messaging"
  },
  {
    title: "Analytics & Reporting",
    description: "Real-time campaign performance tracking",
    details: "Delivery rates, open rates, click-throughs, and ROI analysis"
  },
  {
    title: "A/B Testing",
    description: "Test different message variations",
    details: "Split testing, performance comparison, and optimization recommendations"
  },
  {
    title: "Compliance Tools",
    description: "Stay compliant with regulations",
    details: "Opt-out management, consent tracking, and audit logs"
  }
];

export default function BulkSMSFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-14 md:py-28 bg-gray-50 dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg">
            Bulk SMS Campaign Management
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Powerful tools to manage and optimize your SMS marketing campaigns at scale.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {bulkFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all ${
                    activeFeature === index
                      ? 'bg-white dark:bg-white/10 border-2 border-primary-500 shadow-lg'
                      : 'bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary-300'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeFeature === index
                        ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column - Feature Details */}
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {bulkFeatures[activeFeature].title}
                  </h3>
                  <span className="px-4 py-1 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                    Feature Highlight
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {bulkFeatures[activeFeature].details}
                </p>
              </div>

              {/* Visualization */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Campaign Performance
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Real-time analytics dashboard
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      98.5%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Success Rate
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  {[
                    { label: 'Messages Sent', value: '25,000', percentage: '100%' },
                    { label: 'Delivered', value: '24,625', percentage: '98.5%' },
                    { label: 'Clicked', value: '4,925', percentage: '19.7%' },
                    { label: 'Replied', value: '1,231', percentage: '4.9%' }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-32 text-sm text-gray-600 dark:text-gray-300">
                        {metric.label}
                      </div>
                      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: metric.percentage }}
                        />
                      </div>
                      <div className="w-20 text-right">
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {metric.value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {metric.percentage}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}