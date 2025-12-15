
"use client";

import Image from 'next/image';
import { useState } from 'react';

const testimonials = [
  // {
  //   id: 1,
  //   name: 'Kwame Ofori',
  //   company: 'Fidelity Bank Ghana',
  //   image: '/images/users/user-1.png',
  //   testimonial:
  //     'Sendexa transformed our customer communication. Our OTP delivery rates improved from 85% to 99.5%, significantly reducing fraud cases.',
  // },
  {
    id: 2,
    name: 'Akosua Mensah',
    company: 'Jumia Ghana',
    image: '/images/users/user-2.png',
    testimonial:
      'The bulk SMS platform is incredibly reliable. We send 50,000+ promotional messages daily with near-perfect deliverability across Ghana.',
  },
  // {
  //   id: 3,
  //   name: 'Kofi Annan',
  //   company: 'MTN Mobile Money',
  //   image: '/images/users/user-3.png',
  //   testimonial:
  //     'Their API integration was seamless. We now process millions of transaction alerts monthly with Sendexa\'s reliable infrastructure.',
  // },
  {
    id: 4,
    name: 'Ama Serwaa',
    company: 'Ghana Health Service',
    image: '/images/users/user-4.png',
    testimonial:
      'During our vaccination campaign, Sendexa delivered over 2 million SMS alerts across all regions without a single failure.',
  },
  {
    id: 5,
    name: 'Yaw Boateng',
    company: 'FanMilk Ghana',
    image: '/images/users/user-1.png',
    testimonial:
      'The WhatsApp Business API integration helped us reduce customer response time from hours to minutes. Excellent service!',
  },
  {
    id: 6,
    name: 'Esi Coleman',
    company: 'Enterprise Insurance',
    image: '/images/users/user-2.png',
    testimonial:
      'Local language support for Twi and Ga messages increased our campaign engagement by 40%. Truly built for Ghana.',
  },
  // {
  //   id: 7,
  //   name: 'Nana Kwame',
  //   company: 'Ecobank Ghana',
  //   image: '/images/users/user-1.png',
  //   testimonial:
  //     'Sendexa\'s enterprise solution meets all our compliance requirements. Their 24/7 Ghana-based support is exceptional.',
  // },
  {
    id: 8,
    name: 'Adwoa Safo',
    company: 'Melcom Group',
    image: '/images/users/user-2.png',
    testimonial:
      'Scheduled SMS campaigns for our 50+ stores nationwide. The platform is intuitive and the results are measurable.',
  },
  {
    id: 9,
    name: 'Dr. Felix Anyah',
    company: 'Holy Trinity Hospital',
    image: '/images/users/user-3.png',
    testimonial:
      'Patient appointment reminders via SMS reduced no-shows by 65%. The service is reliable and cost-effective for healthcare.',
  },
];

export default function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false);

  const visibleTestimonials = showAll
    ? testimonials
    : testimonials.slice(0, 3);

  return (
    <section className="md:py-28 py-14 relative">
      <div className="wrapper">
        <div>
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="mb-3 font-bold text-center text-gray-800 text-3xl dark:text-white/90 md:text-title-lg">
              Trusted by Leading Ghanaian Companies
            </h2>
            <p className="max-w-xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
              Join hundreds of businesses across Ghana who rely on Sendexa for their critical communication needs.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 max-w-[72rem] mx-auto">
            {visibleTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>

          {/* Show More Button */}
          <div className="mt-8 text-center relative z-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 px-6 py-3.5 text-sm font-medium text-gray-800 bg-white border border-gray-200 dark:hover:bg-gray-900 rounded-full shadow-theme-xs hover:bg-gray-50 focus:outline-none"
            >
              <span>{showAll ? 'Show less...' : 'Show more testimonials...'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gradient overlay when collapsed */}
      {!showAll && (
        <div className="white-gradient h-[264px]  w-full absolute bottom-0"></div>
      )}
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <div className="p-2 bg-gray-50 dark:bg-white/5 dark:border-gray-800 dark:hover:border-white/10 border rounded-[20px] border-gray-100 hover:border-primary-200 transition">
      <div className="flex items-center p-3 mb-3 bg-white/90 dark:bg-white/[0.03] rounded-2xl">
        <div>
          <Image
            src={testimonial.image || '/placeholder.svg'}
            alt={testimonial.name}
            width={52}
            height={52}
            className="size-13 object-cover ring-2 ring-white dark:ring-gray-700 mr-4 rounded-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          />
        </div>
        <div>
          <h3 className="text-gray-800 font-base dark:text-white/90">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.company}
          </p>
        </div>
      </div>
      <div className="p-5 rounded-2xl bg-white/90 dark:bg-white/[0.03]">
        <p className="text-base leading-6 text-gray-700 dark:text-gray-400">
          "{testimonial.testimonial}"
        </p>
        <div className="flex items-center mt-4">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">5.0</span>
        </div>
      </div>
    </div>
  );
}