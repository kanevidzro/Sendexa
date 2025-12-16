import { getCurrentYear } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import {
  Facebook02Icon,
  GithubIcon,
  NewTwitterIcon,
  WhatsappIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-900">
      <span className="absolute top-0 -translate-x-1/2 left-1/2">
        <svg
          width="1260"
          height="457"
          viewBox="0 0 1260 457"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_11105_867)">
            <circle cx="630" cy="-173.299" r="230" fill="#3B2EFF" />
          </g>
          <defs>
            <filter
              id="filter0_f_11105_867"
              x="0"
              y="-803.299"
              width="1260"
              height="1260"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="200"
                result="effect1_foregroundBlur_11105_867"
              />
            </filter>
          </defs>
        </svg>
      </span>
      <div className="relative z-10 py-16 xl:py-24">
        <div className="container px-5 mx-auto sm:px-7">
          <div className="grid gap-y-8 gap-x-6 lg:grid-cols-12">
            <div className="lg:col-span-4 xl:col-span-4">
              <div>
                <Link href="/" className="block mb-6">
                  <Image
                    src="/images/exaweb.png"
                    alt="Sendexa Logo"
                    width={140}
                    height={36}
                  />
                </Link>
                <p className="block text-sm text-gray-400 mb-9">
                  Sendexa is Ghana&apos;s leading messaging platform for
                  developers and businesses. Send SMS, OTP, and Email APIs with
                  reliable delivery and competitive pricing.
                </p>
                <div className="flex space-x-3">
                  <a
                    href="https://twitter.com/sendexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200"
                    aria-label="Twitter"
                  >
                    <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                  </a>
                  <a
                    href="https://linkedin.com/company/sendexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <HugeiconsIcon icon={LinkedinIcon} size={20} />
                  </a>
                  <a
                    href="https://github.com/sendexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200"
                    aria-label="GitHub"
                  >
                    <HugeiconsIcon icon={GithubIcon} size={20} />
                  </a>
                  <a
                    href="https://facebook.com/sendexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <HugeiconsIcon icon={Facebook02Icon} size={20} />
                  </a>
                  <a
                    href="https://wa.me/233555539152"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200"
                    aria-label="WhatsApp"
                  >
                    <HugeiconsIcon icon={WhatsappIcon} size={20} />
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 xl:col-span-5">
              <div className="grid sm:grid-cols-3 gap-7">
                <div>
                  <span className="block mb-6 text-sm font-medium text-white">
                    Products
                  </span>
                  <nav className="flex flex-col space-y-3">
                    <Link
                      href="/products/sms"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      SMS API
                    </Link>
                    <Link
                      href="/products/otp"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      OTP API
                    </Link>
                    <Link
                      href="/products/email"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      Email API
                    </Link>
                    <Link
                      href="/pricing"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="https://docs.sendexa.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      API Documentation
                    </Link>
                  </nav>
                </div>
                <div>
                  <span className="block mb-6 text-sm font-medium text-white">
                    Solutions
                  </span>
                  <nav className="flex flex-col space-y-3">
                    <Link
                      href="/solutions/startups"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      For Startups
                    </Link>
                    <Link
                      href="/solutions/financial-institutions"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      Financial Institutions
                    </Link>
                    <Link
                      href="/solutions/schools"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      For Schools
                    </Link>
                    <Link
                      href="/solutions/ecommerce"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      E-commerce
                    </Link>
                  </nav>
                </div>
                <div>
                  <span className="block mb-6 text-sm font-medium text-white">
                    Company
                  </span>
                  <nav className="flex flex-col space-y-3">
                    <Link
                      href="/about"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/blog"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      Blog
                    </Link>
                    <Link
                      href="/contact"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      Contact
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms"
                      className="text-sm font-normal text-gray-400 transition hover:text-white"
                    >
                      Terms of Service
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div>
                <span className="block mb-6 text-sm font-medium text-white">
                  Contact Us
                </span>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 mt-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">+233 55 553 9152</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 mt-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">hello@sendexa.co</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 mt-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">Accra, Ghana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container relative z-10 px-5 mx-auto sm:px-7">
          <div className="flex flex-col sm:flex-row justify-between items-center py-5">
            <div className="text-left">
              <p className="text-sm text-gray-500">
                &copy; {getCurrentYear()} Sendexa. All Rights Reserved.
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-sm text-gray-500">
                A product of{" "}
                <span className="text-gray-400 font-medium">Xtottel</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
