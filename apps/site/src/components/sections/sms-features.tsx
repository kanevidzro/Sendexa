'use client';

//import { CheckIcon } from '@/icons/icons';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';

import {
  Tick04Icon,
} from '@hugeicons/core-free-icons';
const features = [
  {
    title: "High Deliverability",
    description: "99.9% delivery rate across all Ghanaian networks",
    details: "Our direct connections with MTN, Telecel, and AT ensure your messages reach their destination."
  },
  // {
  //   title: "GHSMS Support",
  //   description: "Support for Ghanaian Short Codes & Sender IDs",
  //   details: "Use custom sender IDs or get your own Ghanaian short code for brand recognition."
  // },
  {
    title: "Scheduled Messaging",
    description: "Schedule SMS campaigns for optimal timing",
    details: "Plan your messages to be sent at specific times, even outside business hours."
  },
  // {
  //   title: "Two-Way Messaging",
  //   description: "Receive and respond to customer messages",
  //   details: "Enable conversations with customers through our two-way SMS platform."
  // },
  // {
  //   title: "Local Language Support",
  //   description: "Support for Twi, Ga, Ewe and other Ghanaian languages",
  //   details: "Send messages in local languages with proper character encoding."
  // },
  {
    title: "API Integration",
    description: "Easy integration with your existing systems",
    details: "RESTful API with comprehensive documentation for developers."
  }
];

export default function SMSFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-14 md:py-28 bg-gray-50 dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg">
            Powerful SMS Features Built for Ghana
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Our platform is optimized for Ghana's unique telecommunications landscape, 
            ensuring reliable delivery and maximum impact.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Feature list */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all ${
                    activeFeature === index
                      ? 'bg-white dark:bg-white/10 border-2 border-primary-500 shadow-lg'
                      : 'bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary-300'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      activeFeature === index 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}>
                      <HugeiconsIcon icon={Tick04Icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                        {feature.description}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {feature.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side - Feature visualization */}
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {features[activeFeature].title}
                  </h3>
                  <span className="px-4 py-1 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {features[activeFeature].details}
                </p>
              </div>

              {/* Visualization component */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Network Coverage
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Real-time delivery status
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      99.9%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Delivery Rate
                    </div>
                  </div>
                </div>

                {/* Network bars visualization */}
                <div className="space-y-4">
                  {['MTN Ghana', 'Telecel Ghana', 'AT', 'Glo Ghana'].map((network, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-32 text-sm text-gray-600 dark:text-gray-300">
                        {network}
                      </div>
                      <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full"
                          style={{ width: `${95 - (i * 5)}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                        {95 - (i * 5)}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Messages sent today:
                    </span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      12,458
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}