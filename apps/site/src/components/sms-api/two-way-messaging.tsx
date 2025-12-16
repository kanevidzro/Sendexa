// components/sms-api/two-way-messaging.tsx
export default function TwoWayMessaging() {
  return (
    <section className="py-14 md:py-28 bg-white dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 text-3xl dark:text-white/90 md:text-title-lg">
            Two-Way SMS Conversations
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Engage with customers in real-time conversations through SMS.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Features */}
            <div>
              <div className="space-y-6">
                <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Inbound SMS Handling
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Receive and process incoming messages via webhooks with real-time delivery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Auto-Replies & Templates
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Set up automated responses and message templates for common inquiries.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Conversation Threading
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Keep conversations organized with automatic threading and context preservation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visualization */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Real-Time Conversation Flow
                </h3>
                <div className="space-y-4">
                  {/* Incoming Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[70%]">
                      <p className="text-gray-800 dark:text-gray-200">Hi, what's my account balance?</p>
                    </div>
                  </div>

                  {/* Outgoing Auto-Reply */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary-100 dark:bg-primary-500/20 rounded-2xl rounded-tr-none px-4 py-3 max-w-[70%]">
                      <p className="text-gray-800 dark:text-gray-200">
                        Your current balance is GHS 1,250.50. Reply with:
                        1. Mini statement
                        2. Transfer funds
                        3. Talk to agent
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-500"></div>
                  </div>

                  {/* Customer Response */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[70%]">
                      <p className="text-gray-800 dark:text-gray-200">1</p>
                    </div>
                  </div>

                  {/* System Response */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary-100 dark:bg-primary-500/20 rounded-2xl rounded-tr-none px-4 py-3 max-w-[70%]">
                      <p className="text-gray-800 dark:text-gray-200">
                        Last 5 transactions:
                        1. GHS 100 deposit
                        2. GHS 50 withdrawal
                        3. GHS 200 transfer
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-500"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Response Rate</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">&lt;30s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">40%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Increase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}