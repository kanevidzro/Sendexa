
'use client';

import Image from "next/image";
import * as icons from '@/assets/homepage/use-cases';
import type { FC } from 'react';

interface UseCase {
  iconUrl: any; // Using 'any' since icon imports can vary
  title: string;
  description: string;
  features: string[];
  color: string;
}

const useCases: UseCase[] = [
  {
    iconUrl: icons.BankIcon,
    title: "Banking & Fintech",
    description: "OTP for transactions, balance alerts, fraud prevention",
    features: [
      "Mobile money transaction alerts",
      "Account login verification",
      "Credit card fraud alerts",
      "Loan disbursement notifications"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    iconUrl: icons.HealthIcon,
    title: "Healthcare",
    description: "Appointment reminders, test results, health alerts",
    features: [
      "Patient appointment reminders",
      "Medication schedule alerts",
      "Clinic opening hours",
      "Emergency health alerts"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    iconUrl: icons.EcommerceIcon,
    title: "E-commerce & Retail",
    description: "Order updates, delivery notifications, promotions",
    features: [
      "Order confirmation SMS",
      "Delivery tracking updates",
      "Flash sale announcements",
      "Customer feedback requests"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    iconUrl: icons.EducationIcon,
    title: "Education",
    description: "School alerts, fee reminders, exam results",
    features: [
      "School closure announcements",
      "Fee payment reminders",
      "Exam schedule updates",
      "Parent-teacher meeting alerts"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    iconUrl: icons.GovernmentIcon,
    title: "Government & NGOs",
    description: "Public announcements, aid distribution, voter education",
    features: [
      "Public service announcements",
      "Disaster relief updates",
      "Voter registration alerts",
      "Social program notifications"
    ],
    color: "from-indigo-500 to-blue-500"
  },
  {
    iconUrl: icons.LogisticsIcon,
    title: "Logistics & Transportation",
    description: "Delivery updates, vehicle tracking, driver communication",
    features: [
      "Package delivery updates",
      "Driver assignment notifications",
      "Route change alerts",
      "Customer pickup reminders"
    ],
    color: "from-teal-500 to-green-500"
  }
];

const UseCaseCard: FC<{ useCase: UseCase; index: number }> = ({ useCase, index }) => {
  const slug = useCase.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
  
  return (
    <div 
      key={index}
      className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-300 transition-all hover:shadow-xl"
    >
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${useCase.color} mb-6`}>
        <div className="text-white">
          <Image
            src={useCase.iconUrl}
            alt={useCase.title}
            width={48}
            height={48}
            className="w-8 h-8"
          />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
        {useCase.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {useCase.description}
      </p>
      
      <ul className="space-y-3">
        {useCase.features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-gray-500 dark:text-gray-400">
            <svg 
              className="w-4 h-4 mr-3 text-primary-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
        <a 
          href={`/solutions/${slug}`}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center group"
          aria-label={`View ${useCase.title} solutions`}
        >
          View {useCase.title} solutions
          <svg 
            className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

const UseCases: FC = () => {
  return (
    <section 
      className="py-14 md:py-28 bg-gray-50 dark:bg-dark-primary"
      aria-labelledby="use-cases-heading"
    >
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 
            id="use-cases-heading"
            className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg"
          >
            Trusted Across All Industries in Ghana
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            From banking to healthcare, Sendexa powers critical communications for businesses serving Ghana.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={useCase.title} useCase={useCase} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Don&apos;t see your industry? We customize solutions for unique needs.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 text-base font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition shadow-lg hover:shadow-xl group"
            aria-label="Get a custom solution"
          >
            Get Custom Solution
            <svg 
              className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
