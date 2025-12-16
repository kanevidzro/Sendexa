
export const BILLING_PERIODS = [
  {
    label: 'Monthly',
    key: 'monthly',
    saving: null,
  },
  {
    label: 'Annually',
    key: 'yearly',
    saving: '20%',
  },
] as const;

const AMOUNTS = {
  starter: {
    monthly: 0,
    yearly: 0,
  },
  business: {
    monthly: 45,
    yearly: 432,
  },
  pro: {
    monthly: 95,
    yearly: 912,
  },
  enterprise: {
    monthly: null,
    yearly: null,
  },
};

export type TBILLING_PLAN = (typeof BILLING_PLANS)[number];
export const BILLING_PLANS = [
  {
    name: 'Starter',
    description:
      'Perfect for small businesses in Ghana starting with SMS & OTP services.',
    pricing: {
      monthly: {
        amount: AMOUNTS['starter']['monthly'],
        formattedPrice: 'GH₵' + AMOUNTS['starter']['monthly'],
        stripeId: null,
      },
      yearly: {
        amount: AMOUNTS['starter']['yearly'],
        formattedPrice: 'GH₵' + AMOUNTS['starter']['yearly'],
        stripeId: null,
      },
    },
    features: [
      '1,000 free SMS/month',
      '500 OTP messages/month',
      'Basic email support',
      'Ghanaian network coverage',
      'MTN, Telecel, AT support',
      'Web dashboard access',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Business',
    description:
      'For growing Ghanaian businesses needing reliable bulk messaging.',
    pricing: {
      monthly: {
        amount: AMOUNTS['business']['monthly'],
        formattedPrice: 'GH₵' + AMOUNTS['business']['monthly'],
        stripeId: process.env.NEXT_PUBLIC_BUSINESS_MONTHLY_PRICE_ID!,
      },
      yearly: {
        amount: AMOUNTS['business']['yearly'],
        formattedPrice: 'GH₵' + AMOUNTS['business']['yearly'],
        stripeId: process.env.NEXT_PUBLIC_BUSINESS_YEARLY_PRICE_ID!,
      },
    },
    features: [
      'Everything in Starter',
      '10,000 SMS/month',
      '5,000 OTP messages/month',
      'Bulk email campaigns',
      'Priority Ghanaian network routing',
      'WhatsApp Business API access',
      'Dedicated account manager',
      '24/7 phone support',
      'Delivery reports & analytics',
    ],
    cta: 'Choose Business Plan',
    popular: true,
  },
  {
    name: 'Pro',
    description:
      'For enterprises requiring high-volume messaging across Ghana.',
    pricing: {
      monthly: {
        amount: AMOUNTS['pro']['monthly'],
        formattedPrice: 'GH₵' + AMOUNTS['pro']['monthly'],
        stripeId: process.env.NEXT_PUBLIC_PRO_MONTHLY_PRICE_ID!,
      },
      yearly: {
        amount: AMOUNTS['pro']['yearly'],
        formattedPrice: 'GH₵' + AMOUNTS['pro']['yearly'],
        stripeId: process.env.NEXT_PUBLIC_PRO_YEARLY_PRICE_ID!,
      },
    },
    features: [
      'Everything in Business',
      'Unlimited SMS volume',
      'Unlimited OTP messages',
      'Advanced email marketing',
      'Multi-channel delivery (SMS, Email, WhatsApp)',
      'Ghanaian language support (Twi, Ga, Ewe)',
      'API access & webhooks',
      'SLA guarantee (99.9% uptime)',
      'Custom sender IDs',
      'Advanced security & compliance',
    ],
    cta: 'Choose Pro Plan',
    popular: false,
  },
  {
    name: 'Enterprise',
    description:
      'Tailored solutions for large corporations and government agencies.',
    pricing: {
      monthly: {
        amount: AMOUNTS['enterprise']['monthly'],
        formattedPrice: "Let's talk",
        stripeId: null,
      },
      yearly: {
        amount: AMOUNTS['enterprise']['yearly'],
        formattedPrice: "Let's talk",
        stripeId: null,
      },
    },
    features: [
      'Everything in Pro',
      'Dedicated Ghanaian servers',
      'On-premise deployment option',
      'Custom billing integration',
      '24/7 dedicated support team',
      'Advanced fraud detection',
      'Compliance with NCA regulations',
      'Custom development',
      'Training & onboarding',
      'Quarterly business reviews',
    ],
    cta: 'Contact Enterprise Sales',
    popular: false,
  },
];