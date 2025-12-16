export const meta = {
  metadataBase: new URL('https://docs.sendexa.co'),
  title: {
    default: 'Sendexa for Developers',
    template: '%s | Sendexa Docs',
  },

  description:
    'Africa’s Leading Communication Platform — Build SMS, Email, Voice, WhatsApp, Push, and OTP experiences with simple, modern APIs.',

  authors: [{ name: 'Sendexa' }],
  keywords: [
    'Sendexa',
    'SMS API',
    'OTP API',
    'Email API',
    'Voice API',
    'WhatsApp API',
    'Push Notifications',
    'Developer Documentation',
    'Communication Platform',
    'CPaaS',
    'Africa',
    'Ghana',
  ],

  publisher: 'Sendexa',
  creator: 'Sendexa',

  openGraph: {
    type: 'website',
    title: 'Sendexa for Developers',
    description:
      'Africa’s Leading Communication Platform — Build reliable communication workflows with modern APIs.',
    images: [
      {
        url: '/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Sendexa Developer Documentation',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sendexa for Developers',
    description:
      'Explore Sendexa’s powerful SMS, Email, Voice, WhatsApp, OTP, and Push APIs.',
    images: ['/og_image.png'],
    creator: '@sendexa', // update if you have an official handle
  },

  // SEO Enhancements
  alternates: {
    canonical: 'https://docs.sendexa.co',
  },

  robots: 'index, follow',

  hreflang: {
    en: 'https://docs.sendexa.co',
  },

  icons: {
    icon: '/favicon.png',
  },
};
