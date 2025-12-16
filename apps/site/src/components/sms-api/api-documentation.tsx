// components/sms-api/api-documentation.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const endpoints = [
  {
    id: 'send-sms',
    method: 'POST',
    path: '/v1/sms/send',
    title: 'Send SMS',
    description: 'Send a single SMS message',
    curl: `curl -X POST 'https://api.sendexa.co/v1/sms/send' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "to": "233501234567",
    "from": "YourBrand",
    "content": "Hello from Sendexa!"
  }'`,
    response: `{
  "id": "msg_123456789",
  "to": "233501234567",
  "from": "YourBrand",
  "content": "Hello from Sendexa!",
  "status": "queued",
  "created_at": "2024-01-15T10:30:00Z"
}`
  },
  {
    id: 'send-bulk',
    method: 'POST',
    path: '/v1/sms/bulk',
    title: 'Send Bulk SMS',
    description: 'Send SMS to multiple recipients',
    curl: `curl -X POST 'https://api.sendexa.co/v1/sms/bulk' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "messages": [
      {
        "to": "233501234567",
        "content": "Hello {name}! Your order is ready."
      }
    ],
    "merge_fields": {
      "name": "John"
    }
  }'`,
    response: `{
  "id": "bulk_123456789",
  "total_recipients": 1000,
  "queued": 1000,
  "failed": 0,
  "estimated_completion": "2024-01-15T10:35:00Z"
}`
  },
  {
    id: 'check-status',
    method: 'GET',
    path: '/v1/sms/{message_id}',
    title: 'Check Status',
    description: 'Get delivery status of a message',
    curl: `curl -X GET 'https://api.sendexa.co/v1/sms/msg_123456789' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
    response: `{
  "id": "msg_123456789",
  "to": "233501234567",
  "status": "delivered",
  "delivered_at": "2024-01-15T10:30:05Z",
  "network": "MTN",
  "cost": "0.015"
}`
  },
  {
    id: 'receive-sms',
    method: 'POST',
    path: 'Webhook',
    title: 'Receive SMS',
    description: 'Handle incoming messages via webhook',
    curl: `Webhook URL: https://yourdomain.com/webhooks/sms
Method: POST
Content-Type: application/json

Payload:
{
  "id": "inbound_123456789",
  "from": "233501234567",
  "to": "YourShortCode",
  "content": "Hello, I need help!",
  "received_at": "2024-01-15T10:30:00Z"
}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Webhook received"
}`
  }
];

export default function APIDocumentation() {
  const [activeEndpoint, setActiveEndpoint] = useState('send-sms');
  const [copied, setCopied] = useState(false);

  const currentEndpoint = endpoints.find(ep => ep.id === activeEndpoint) || endpoints[0];

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api-docs" className="py-14 md:py-28 bg-white dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg">
            API Documentation
          </h2>
          <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Clean, consistent API with comprehensive documentation and examples.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Endpoints List */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setActiveEndpoint(endpoint.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl transition-all border',
                      activeEndpoint === endpoint.id
                        ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-500'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-primary-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'px-2 py-1 rounded text-xs font-mono font-bold',
                        endpoint.method === 'POST' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400' :
                        endpoint.method === 'GET' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400' :
                        'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-400'
                      )}>
                        {endpoint.method}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {endpoint.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {endpoint.path}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {endpoint.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <a href="/docs" className="flex items-center justify-between text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-2 hover:bg-white dark:hover:bg-white/10 rounded">
                    <span>Full API Reference</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  <a href="/docs/webhooks" className="flex items-center justify-between text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-2 hover:bg-white dark:hover:bg-white/10 rounded">
                    <span>Webhooks Guide</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  <a href="/docs/error-codes" className="flex items-center justify-between text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-2 hover:bg-white dark:hover:bg-white/10 rounded">
                    <span>Error Codes</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Code Examples */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Request Example */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Request Example</h3>
                    <button
                      onClick={() => copyToClipboard(currentEndpoint.curl)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-mono">
                      curl
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-gray-200 text-sm font-mono whitespace-pre">
                        {currentEndpoint.curl}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Response Example */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Response</h3>
                    <button
                      onClick={() => copyToClipboard(currentEndpoint.response)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-mono">
                      JSON Response
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-gray-200 text-sm font-mono whitespace-pre">
                        {currentEndpoint.response}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Parameters */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Parameters</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Parameter</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Required</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono text-gray-800 dark:text-gray-200">to</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">String</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Yes</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Recipient phone number (233 format)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono text-gray-800 dark:text-gray-200">from</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">String</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Yes</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Sender ID or short code</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono text-gray-800 dark:text-gray-200">content</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">String</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Yes</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Message content (max 160 chars)</td>
                        </tr>
                      </tbody>
                    </table>
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