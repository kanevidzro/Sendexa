"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  ApiIcon,
  ArrowMoveUpRightIcon,
  CheckmarkCircle03Icon,
  ComputerTerminal01Icon,
  Copy01Icon,
  SourceCodeSquareIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons";
import {
  GoIcon,
  NodeJSIcon,
  PhpIcon,
  JavaIcon,
  PythonIcon,
  RubyIcon,
} from "@/icons/icons";

const codeExamples = [
  {
    id: "sms",
    language: "curl",
    title: "Send SMS",
    description: "Simple SMS sending with CURL",
    code: `curl -X POST 'https://api.sendexa.co/v1/sms/send' \\
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "to": "233501234567",
    "from": "YourBrand",
    "content": "Hello from Sendexa!"
  }'`,
    features: [
      "Ghanaian number formatting",
      "MTN/Telecel routing",
      "Delivery reports",
    ],
  },
  {
    id: "otp",
    language: "curl",
    title: "OTP Verification",
    description: "Secure OTP generation and validation",
    code: `curl -X POST 'https://api.sendexa.co/v1/otp/request' \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "phone": "0555539152",
    "from": "YourApp",
    "message": "Your verification code is {code}",
    "pinLength": 6
  }'`,
    features: ["Bank-level security", "5-minute expiry", "Retry limits"],
  },
  {
    id: "email",
    language: "curl",
    title: "Transactional Email",
    description: "Send emails with template support",
    code: `curl -X POST 'https://api.sendexa.co/v1/email/send' \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "to": "user@example.com",
    "from": "hello@yourdomain.com",
    "fromName": "YourApp",
    "subject": "Welcome to YourApp",
    "html": "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
  }'`,
    features: ["Template engine", "Attachment support", "BCC/CC options"],
  },
];

const sdkLanguages = [
  {
    name: "Node.js",
    icon: <NodeJSIcon />,
    docs: "/docs/node",
    version: "v2.1.0",
    color:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20",
  },
  {
    name: "Python",
    icon: <PythonIcon />,
    docs: "/docs/python",
    version: "v1.8.0",
    color:
      "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  },
  {
    name: "PHP",
    icon: <PhpIcon />,
    docs: "/docs/php",
    version: "v3.2.0",
    color:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
  },
  {
    name: "Java",
    icon: <JavaIcon />,
    docs: "/docs/java",
    version: "v2.5.0",
    color:
      "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
  },
  {
    name: "Go",
    icon: <GoIcon />,
    docs: "/docs/go",
    version: "v1.3.0",
    color:
      "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20",
  },
  {
    name: "Ruby",
    icon: <RubyIcon />,
    docs: "/docs/ruby",
    version: "v2.0.0",
    color:
      "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20",
  },
];

const apiFeatures = [
  {
    title: "RESTful API",
    description: "Clean, consistent REST API with JSON responses",
    icon: <HugeiconsIcon icon={ApiIcon} className="w-6 h-6" />,
  },
  {
    title: "Webhooks",
    description: "Real-time event notifications for delivery status",
    icon: <HugeiconsIcon icon={WebhookIcon} className="w-6 h-6" />,
  },
  {
    title: "SDK Libraries",
    description: "Official libraries for popular programming languages",
    icon: <HugeiconsIcon icon={SourceCodeSquareIcon} className="w-6 h-6" />,
  },
  {
    title: "CURL Examples",
    description: "Ready-to-use CURL commands for testing",
    icon: <HugeiconsIcon icon={ComputerTerminal01Icon} className="w-6 h-6" />,
  },
];

export default function DeveloperSection() {
  const [activeExample, setActiveExample] = useState("sms");
  const [copied, setCopied] = useState(false);

  const currentExample =
    codeExamples.find((ex) => ex.id === activeExample) || codeExamples[0];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(currentExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-8 md:py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-dark-primary dark:to-gray-900 overflow-hidden">
      <div className="wrapper px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-8 md:mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-2xl md:text-3xl lg:text-title-lg">
            Built for Developers
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400 px-4">
            Powerful APIs, comprehensive documentation, and SDKs for every
            stack. Integrate SMS, OTP, and Email in minutes.
          </p>
        </div>

        {/* SDK Languages */}
        <div className="max-w-4xl mx-auto mb-10 md:mb-16 px-2">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Official SDKs
            </h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Choose your language and start building
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {sdkLanguages.map((sdk) => (
              <a
                key={sdk.name}
                href={sdk.docs}
                className={`group relative bg-white dark:bg-white/5 border ${sdk.color} rounded-xl p-3 md:p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95`}
              >
                <div className="flex justify-center mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    {sdk.icon}
                  </div>
                </div>
                <div className="font-medium text-xs md:text-sm text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                  {sdk.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                  {sdk.version}
                </div>
                <div className="absolute -inset-1 rounded-xl border-2 border-transparent group-hover:border-primary-300/30 dark:group-hover:border-primary-500/30 transition-all duration-300 pointer-events-none"></div>
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Code Examples */}
            <div>
              <div className="lg:sticky lg:top-24">
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
                    Code Examples
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    See how easy it is to integrate Sendexa into your
                    application
                  </p>
                </div>

                {/* Code Example Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {codeExamples.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => setActiveExample(example.id)}
                      className={cn(
                        "px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex-1 min-w-[100px] text-center",
                        activeExample === example.id
                          ? "bg-primary-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10",
                      )}
                    >
                      {example.title}
                    </button>
                  ))}
                </div>

                {/* Code Block */}
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-gray-800">
                    <div className="flex items-center space-x-1 md:space-x-2 flex-wrap">
                      <div className="flex space-x-1 md:space-x-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="ml-1 md:ml-2 text-xs md:text-sm text-gray-300 truncate">
                        {currentExample.language} • {currentExample.title}
                      </span>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center text-xs md:text-sm text-gray-300 hover:text-white whitespace-nowrap ml-2"
                    >
                      {copied ? (
                        <>
                          <HugeiconsIcon
                            icon={CheckmarkCircle03Icon}
                            className="w-3 h-3 md:w-4 md:h-4 mr-1"
                          />
                          <span className="hidden sm:inline">Copied!</span>
                          <span className="inline sm:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <HugeiconsIcon
                            icon={Copy01Icon}
                            className="w-3 h-3 md:w-4 md:h-4 mr-1"
                          />
                          <span className="hidden sm:inline">Copy</span>
                          <span className="inline sm:hidden">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 md:p-4 overflow-x-auto">
                    <pre className="text-xs md:text-sm leading-relaxed">
                      <code className="text-gray-200 font-mono whitespace-pre-wrap break-all">
                        {currentExample.code}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-4 md:mt-6">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base">
                    Features in this example:
                  </h4>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {currentExample.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle03Icon}
                          className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1"
                        />
                        <span className="truncate max-w-[120px] md:max-w-none">
                          {feature}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - API Features & Documentation */}
            <div className="space-y-8 md:space-y-12">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
                  Everything You Need
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {apiFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 md:p-6 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="inline-flex p-2 md:p-3 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 mb-3 md:mb-4">
                        {feature.icon}
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1.5 md:mb-2 text-base md:text-lg">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation Links */}
              {/* <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-6 md:p-8 border border-primary-100 dark:border-primary-500/20">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
                  Comprehensive Documentation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
                  Dive deep into our API with detailed guides, tutorials, and reference documentation.
                </p>
                
                <div className="space-y-3 md:space-y-4">
                  <a
                    href="/docs/getting-started"
                    className="flex items-center justify-between p-3 md:p-4 bg-white dark:bg-white/5 rounded-xl hover:shadow-md transition-all duration-300 active:scale-98"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 dark:text-white truncate">
                        Getting Started Guide
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                        5-minute setup tutorial
                      </div>
                    </div>
                    <HugeiconsIcon icon={ArrowMoveUpRightIcon} className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </a>
                  
                  <a
                    href="/docs/api-reference"
                    className="flex items-center justify-between p-3 md:p-4 bg-white dark:bg-white/5 rounded-xl hover:shadow-md transition-all duration-300 active:scale-98"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 dark:text-white truncate">
                        API Reference
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                        Complete endpoint documentation
                      </div>
                    </div>
                    <HugeiconsIcon icon={ArrowMoveUpRightIcon} className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </a>
                  
                  <a
                    href="/docs/best-practices"
                    className="flex items-center justify-between p-3 md:p-4 bg-white dark:bg-white/5 rounded-xl hover:shadow-md transition-all duration-300 active:scale-98"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 dark:text-white truncate">
                        Best Practices
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                        Tips for optimal performance
                      </div>
                    </div>
                    <HugeiconsIcon icon={ArrowMoveUpRightIcon} className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </a>
                </div>
              </div> */}

              {/* Quick Start CTA */}
              <div className="mt-6 md:mt-8 text-center">
                <a
                  href="/dashboard?source=dev_section"
                  className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-98 w-full sm:w-auto"
                >
                  Get Your API Key
                  <HugeiconsIcon
                    icon={ArrowMoveUpRightIcon}
                    className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3"
                  />
                </a>
                <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Free trial includes 1,000 SMS and 500 OTP messages
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-20 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1 md:mb-2">
                99.9%
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                API Uptime
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1 md:mb-2">
                &lt;100ms
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Average Response
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1 md:mb-2">
                6
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                SDK Languages
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1 md:mb-2">
                24/7
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Dev Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
