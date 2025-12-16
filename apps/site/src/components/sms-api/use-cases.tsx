// components/sms-api/use-cases.tsx
const useCases = [
  {
    industry: "Banking & Finance",
    title: "Transaction Alerts & OTP",
    description: "Send instant transaction notifications and secure OTPs for banking operations",
    features: [
      "Mobile money transaction alerts",
      "Card transaction notifications",
      "Account login verification",
      "Fraud detection alerts"
    ],
    icon: "🏦"
  },
  {
    industry: "E-commerce",
    title: "Order Updates & Promotions",
    description: "Keep customers informed about their orders and promote new products",
    features: [
      "Order confirmation SMS",
      "Delivery status updates",
      "Flash sale announcements",
      "Abandoned cart reminders"
    ],
    icon: "🛒"
  },
  {
    industry: "Healthcare",
    title: "Appointment Reminders",
    description: "Reduce no-shows with automated appointment reminders",
    features: [
      "Appointment confirmations",
      "Medication reminders",
      "Test result notifications",
      "Health campaign alerts"
    ],
    icon: "🏥"
  },
  {
    industry: "Education",
    title: "School Notifications",
    description: "Communicate with students and parents effectively",
    features: [
      "School closure alerts",
      "Exam schedule updates",
      "Fee payment reminders",
      "Event notifications"
    ],
    icon: "🎓"
  },
  {
    industry: "Logistics",
    title: "Delivery Updates",
    description: "Provide real-time delivery tracking to customers",
    features: [
      "Pickup notifications",
      "Delivery status updates",
      "Driver assignment alerts",
      "Customer feedback requests"
    ],
    icon: "🚚"
  },
  {
    industry: "Government",
    title: "Public Announcements",
    description: "Broadcast important public service messages",
    features: [
      "Emergency alerts",
      "Public service announcements",
      "Voter education",
      "Social program updates"
    ],
    icon: "🏛️"
  }
];

export default function UseCases() {
  return (
    <section className="py-14 md:py-28 bg-gray-50 dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg">
            Industry-Specific Use Cases
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            See how businesses across Ghana are using our SMS API to improve communication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-300 transition-all hover:shadow-xl"
            >
              <div className="text-4xl mb-6">{useCase.icon}</div>
              
              <div className="mb-2">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                  {useCase.industry}
                </span>
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
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 text-base font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition shadow-lg hover:shadow-xl group"
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
}