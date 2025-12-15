"use client";

import { MinusIcon, PlusIcon } from "@/icons/icons";
import { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [activeItem, setActiveItem] = useState<number | null>(1);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Which Ghanaian networks do you support?",
      answer:
        "We have direct connections with all major Ghanaian mobile networks including MTN Ghana, Telecel Ghana, AT, and Glo Ghana. This ensures maximum deliverability across the country.",
    },
    {
      id: 2,
      question: "Can I get a Ghanaian short code?",
      answer:
        "Yes! We can help you obtain and manage a Ghanaian short code through the National Communications Authority (NCA). Our team handles the entire application process and compliance requirements.",
    },
    {
      id: 3,
      question: "How do you ensure message delivery in remote areas?",
      answer:
        "We use multiple routing paths and maintain agreements with all network operators. For remote areas, we implement intelligent routing that automatically selects the strongest available network signal.",
    },
    {
      id: 4,
      question: "Do you support Ghanaian languages?",
      answer:
        "Absolutely! Our platform fully supports Unicode characters for Ghanaian languages including Twi, Ga, Ewe, Dagbani, and others. We ensure proper encoding for SMS and email communications.",
    },
    {
      id: 5,
      question: "What are your delivery rates in Ghana?",
      answer:
        "We maintain a 99.9% delivery rate across Ghana. Our real-time monitoring system identifies and retries failed deliveries, with detailed reports available in your dashboard.",
    },
    {
      id: 6,
      question: "How do you handle NCA regulations?",
      answer:
        "We are fully compliant with NCA regulations. Our platform includes built-in compliance features for sender ID registration, message content guidelines, and consumer protection measures.",
    },
    {
      id: 7,
      question: "Can I send OTP messages for mobile money transactions?",
      answer:
        "Yes, we specialize in secure OTP delivery for financial services. Our platform is used by several banks and fintech companies in Ghana for transaction authentication.",
    },
    {
      id: 8,
      question: "Do you offer WhatsApp Business API services in Ghana?",
      answer:
        "Yes, we are an official WhatsApp Business Solution Provider for Ghana. We can help you set up and manage WhatsApp messaging for customer support and notifications.",
    },
  ];

  const toggleItem = (itemId: number) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  return (
    <section id="faq" className="py-14 md:py-28 dark:bg-[#171f2e]">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 text-3xl dark:text-white/90 md:text-title-lg">
            Frequently Asked Questions
          </h2>
          <p className="max-w-md mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Everything you need to know about our SMS, OTP, and email services in Ghana.
          </p>
        </div>
        <div className="max-w-[800px] mx-auto">
          <div className="space-y-4">
            {faqItems.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Still have questions about our Ghana-focused services?
            </p>
            <a
              href="mailto:support@sendexa.co"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition"
            >
              Contact Ghana Support Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  item,
  isActive,
  onToggle,
}: {
  item: FAQItem;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="pb-5 border-b border-gray-200 dark:border-gray-800">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-white/90">
          {item.question}
        </span>
        <span className="flex-shrink-0 ml-6">
          {isActive ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      {isActive && (
        <div className="mt-5">
          <p className="text-base leading-7 text-gray-500 dark:text-gray-400">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}