import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-14 md:py-28 bg-gradient-to-r from-primary-500 to-blue-600">
      <div className="wrapper">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 font-bold text-center text-white text-3xl md:text-4xl">
            Start Sending with Ghana's Most Reliable Platform
          </h2>
          <p className="max-w-2xl mx-auto mb-10 leading-6 text-white/90 text-lg">
            Join thousands of Ghanaian businesses that trust Sendexa for their
            critical communications. Get started with 1,000 free SMS today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://auth.sendexa.co"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-primary-600 bg-white hover:bg-gray-50 rounded-full transition shadow-xl hover:shadow-2xl"
            >
              Start Free Trial
              <svg
                className="w-5 h-5 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/30 hover:border-white rounded-full transition"
            >
              Schedule Demo
              <svg
                className="w-5 h-5 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/80 text-sm">Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80 text-sm">Ghana Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4</div>
              <div className="text-white/80 text-sm">Network Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1K+</div>
              <div className="text-white/80 text-sm">Businesses</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
