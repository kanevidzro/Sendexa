'use client';

const regions = [
  { name: "Greater Accra", coverage: "100%", networks: ["MTN", "Telecel", "AT", "Glo"] },
  { name: "Ashanti", coverage: "99.8%", networks: ["MTN", "Telecel", "AT"] },
  { name: "Western", coverage: "99.5%", networks: ["MTN", "Telecel", "AT"] },
  { name: "Eastern", coverage: "99.6%", networks: ["MTN", "Telecel", "AT"] },
  { name: "Central", coverage: "99.4%", networks: ["MTN", "Telecel", "AT"] },
  { name: "Volta", coverage: "99.2%", networks: ["MTN", "Telecel"] },
  { name: "Northern", coverage: "98.9%", networks: ["MTN", "Telecel"] },
  { name: "Upper East", coverage: "98.7%", networks: ["MTN", "Telecel"] },
  { name: "Upper West", coverage: "98.5%", networks: ["MTN", "Telecel"] },
  { name: "Brong-Ahafo", coverage: "99.1%", networks: ["MTN", "Telecel", "AT"] },
];

export default function NetworkCoverage() {
  return (
    <section className="py-14 md:py-28 bg-white dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg">
            Ghana-Wide Network Coverage
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Direct connections to all mobile networks across all 16 regions of Ghana
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Coverage Map Visualization */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Real-time Coverage Map
                </h3>
                <div className="h-64 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-2xl relative overflow-hidden">
                  {/* Simplified Ghana map visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                      <div className="text-white/90">National Coverage</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">4</div>
                  <div className="text-gray-600 dark:text-gray-400">Mobile Networks</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">16</div>
                  <div className="text-gray-600 dark:text-gray-400">Regions Covered</div>
                </div>
              </div>
            </div>

            {/* Region Coverage Details */}
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Regional Coverage Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed coverage statistics across Ghana's regions
                </p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                {regions.map((region, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition"
                  >
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {region.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {region.networks.join(", ")}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: region.coverage }}
                        />
                      </div>
                      <div className="font-bold text-gray-800 dark:text-white w-16 text-right">
                        {region.coverage}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      Intelligent Routing
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically selects the strongest network in each region
                    </div>
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