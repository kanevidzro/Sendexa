// components/sms-api/pricing.tsx
const plans = [
  {
    name: "Starter",
    description: "Perfect for small businesses and startups",
    price: "₵0.015",
    unit: "per SMS",
    features: [
      "Up to 10,000 SMS/month",
      "Basic SMS sending",
      "Delivery reports",
      "Email support",
      "99.5% deliverability",
      "MTN & Telecel networks"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Business",
    description: "For growing businesses with higher volumes",
    price: "₵0.012",
    unit: "per SMS",
    features: [
      "Up to 100,000 SMS/month",
      "Bulk SMS campaigns",
      "Two-way messaging",
      "Priority support",
      "99.8% deliverability",
      "All 4 Ghana networks",
      "Scheduled messages",
      "Basic analytics"
    ],
    cta: "Start Business Plan",
    popular: true
  },
  {
    name: "Enterprise",
    description: "For large-scale operations and custom needs",
    price: "Custom",
    unit: "volume pricing",
    features: [
      "Unlimited volume",
      "Custom sender IDs",
      "Dedicated account manager",
      "24/7 phone support",
      "99.9% deliverability SLA",
      "Custom integrations",
      "Advanced analytics",
      "White-label options"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section className="py-14 md:py-28 bg-gray-50 dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Pay only for what you use. No hidden fees, no monthly commitments.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 border transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'bg-white dark:bg-white/10 border-2 border-primary-500 scale-105'
                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gray-800 dark:text-white">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {plan.unit}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.name === "Enterprise" ? "/contact" : "https://auth.sendexa.co"}
                  className={`block w-full text-center py-3 px-6 rounded-full font-medium transition ${
                    plan.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              All plans include free webhook support, REST API access, and detailed documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/pricing"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                View detailed pricing →
              </a>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <a
                href="/contact"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Need a custom plan? Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}