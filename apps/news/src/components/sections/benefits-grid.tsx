//import Image from "next/image";
import Link from "next/link";
//import React from "react";

export default function BenefitsGrid() {
  return (
    <section className="bg-gray-900 py-14 md:py-28">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="max-w-lg mx-auto mb-3 font-bold text-center text-white dark:text-white/90 text-3xl md:text-title-lg">
            Why Ghanaian Businesses Choose Sendexa
          </h2>
          <p className="max-w-2xl mx-auto text-base dark:font-normal leading-6 text-white/50">
            Built specifically for Ghana's communication landscape with local
            expertise and global reliability.
          </p>
        </div>

        <div className="max-w-[1008px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
            {/* First Card - Ghana Network Priority Routing */}
            <div className="lg:col-span-6">
              <div className="relative flex flex-col justify-between bg-gradient-to-br from-primary-700 to-primary-800 rounded-[20px] p-6 md:p-9 lg:p-13 h-full min-h-[400px] md:min-h-[450px]">
                <div className="relative z-10">
                  <div className="max-w-sm mb-6 md:mb-8">
                    <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                      Ghanaian Network Priority Routing
                    </h3>
                    <p className="text-base text-white/70">
                      Direct connections to all local carriers ensure your
                      messages reach every corner of Ghana, from Accra to
                      Tamale.
                    </p>
                  </div>
                </div>

                <div className="relative mt-auto">
                  <div className="absolute left-0 bottom-0 w-24 h-24 md:w-32 md:h-32">
                    <div className="relative w-full h-full">
                      {/* Ghana map placeholder - you should add an actual SVG */}
                    </div>
                  </div>

                  <div className="relative ml-20 md:ml-32">
                    <div className="flex items-center space-x-2 mb-2">
                      {["MTN", "Telecel", "AT", "Glo"].map((network) => (
                        <div
                          key={network}
                          className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs md:text-sm font-medium text-white"
                        >
                          {network}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">
                          National Coverage
                        </span>
                        <span className="text-white font-bold">99.9%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                          style={{ width: "99.9%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-600/10 rounded-full"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-600/10 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Second Card - Bank-Grade Security for OTP */}
            <div className="lg:col-span-6">
              <div className="benefits-bg rounded-[20px] p-6 md:p-12 overflow-hidden h-full min-h-[400px] md:min-h-[450px] flex flex-col">
                <div className="flex-1 flex flex-col">
                  <div className="mb-6 md:mb-8">
                    <div className="inline-flex p-3 md:p-4 bg-white/20 rounded-xl backdrop-blur-sm mb-4">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>

                    <h3 className="font-bold max-w-xs text-white text-2xl md:text-3xl mb-4">
                      Bank-Grade Security for OTP
                    </h3>
                    <p className="text-base max-w-sm text-white/70 mb-6">
                      Secure one-time passwords with encryption that meets
                      Ghanaian banking standards for financial transactions.
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-white font-bold text-lg mb-1">
                          256-bit
                        </div>
                        <div className="text-white/70 text-xs">Encryption</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-white font-bold text-lg mb-1">
                          99.95%
                        </div>
                        <div className="text-white/70 text-xs">
                          OTP Delivery
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <span className="text-white/80 text-sm">
                        Bank of Ghana Compliant
                      </span>
                    </div>
                  </div>
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>

            {/* Third Card - NCA Compliant & Regulated (Full Width) */}
            <div className="lg:col-span-12">
              <div className="lg:px-8 p-6 md:p-8 lg:p-12 bg-gradient-to-r from-primary-800 to-primary-900 relative rounded-[20px] h-full overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-12">
                  <div className="flex-1 max-w-lg">
                    <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                      NCA Compliant & Regulated
                    </h3>
                    <p className="text-base text-white/70 mb-6 lg:mb-8">
                      Fully licensed and compliant with National Communications
                      Authority regulations. Your communication is always legal
                      and protected.
                    </p>
                    <Link
                      href="/compliance"
                      className="inline-flex items-center font-medium text-sm md:text-base text-white rounded-full bg-accent-500 hover:bg-accent-600 transition py-3 px-6"
                    >
                      View Compliance Details
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-xl">
                          <div className="text-primary-800 font-bold text-lg">
                            NCA
                          </div>
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg mb-1">
                            Licensed Provider
                          </div>
                          <div className="text-white/70 text-sm">
                            Registration #: NCA-SMS/2024/001
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">
                            Compliance Score
                          </span>
                          <span className="text-white font-bold">100%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background blur shape */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
