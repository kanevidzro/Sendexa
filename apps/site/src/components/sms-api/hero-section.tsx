// components/sms-api/hero-section.tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden dark:bg-[#171F2E]">
      <div className="max-w-[120rem] mx-auto relative">
        <div className="wrapper">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center pb-16">
              <div className="rounded-full mb-6 max-w-fit mx-auto bg-linear-to-r from-[#FF58D580] to-[#4E6EFF80] p-0.5">
                <div className="bg-white dark:bg-dark-primary py-2 text-sm items-center gap-2 px-5 inline-flex dark:text-white/90 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p>Ghana's Most Reliable SMS Platform</p>
                </div>
              </div>

              <h1 className="text-gray-700 mx-auto font-bold mb-4 text-4xl sm:text-[50px] dark:text-white/90 sm:leading-[64px] max-w-[700px]">
                Powerful SMS API Built for Ghana
              </h1>
              <p className="max-w-[537px] text-center mx-auto dark:text-gray-400 text-gray-500 text-lg">
                Send bulk SMS, engage in two-way conversations, and run campaigns with 99.9% deliverability across all Ghanaian networks.
              </p>

              <div className="mt-9 flex sm:flex-row flex-col gap-3 relative z-30 items-center justify-center">
                <Link
                  href="https://auth.sendexa.co"
                  className="bg-primary-500 transition h-12 inline-flex items-center justify-center hover:bg-primary-600 px-8 py-3 rounded-full text-white text-sm font-medium"
                >
                  Get API Key Free
                  <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                <Link
                  href="#api-docs"
                  className="rounded-full flex h-12 gap-3 items-center text-sm border bg-white dark:bg-white/10 dark:border-white/[0.05] dark:text-white border-gray-100 px-6 py-3 font-medium"
                >
                  View API Docs
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="wrapper">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">4</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Network Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">&lt;1s</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Average Latency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}