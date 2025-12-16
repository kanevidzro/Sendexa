import { NavItem } from "./nav.types";

export const navItems: NavItem[] = [
  {
    type: "link",
    label: "Home",
    href: "/",
  },

  {
    type: "dropdown",
    label: "Products",
    items: [
      {
        label: "SMS API",
        href: "/products/sms",
        description: "Send bulk and transactional SMS in Ghana",
        icon: "message",
      },
      {
        label: "OTP API",
        href: "/products/otp",
        description: "Secure one-time password verification",
        icon: "shield",
      },
      {
        label: "Email API",
        href: "/products/email",
        description: "Send emails for alerts and notifications",
        icon: "mail",
      },
    ],
  },

  {
    type: "dropdown",
    label: "Solutions",
    items: [
      {
        label: "Startups",
        href: "/solutions/startups",
        description: "Launch fast with SMS, OTP, and email APIs",
        icon: "rocket",
      },
      {
        label: "Banking & Fintech",
        href: "/solutions/banking-fintech",
        description:
          "Member alerts, OTP verification, and transaction messages",
        icon: "bank",
      },
      {
        label: "Schools",
        href: "/solutions/schools",
        description: "Student and parent communication via SMS and email",
        icon: "graduation",
      },
      {
        label: "E-commerce",
        href: "/solutions/ecommerce",
        description:
          "Order updates, delivery alerts, and customer notifications",
        icon: "cart",
      },
    ],
  },

  {
    type: "dropdown",
    label: "Developers",
    items: [
      {
        label: "Documentation",
        href: "https://docs.sendexa.co",
        description: "API guides, examples, and references",
        icon: "code",
      },
      {
        label: "API Status",
        href: "https://status.sendexa.co",
        description: "Live system uptime and incident reports",
      },
    ],
  },

  {
    type: "link",
    label: "Pricing",
    href: "/pricing",
  },

  {
    type: "dropdown",
    label: "Company",
    items: [
      {
        label: "About Sendexa",
        href: "/about",
        description: "Why we're building Sendexa in Ghana",
      },
      {
        label: "Blog",
        href: "/blog",
        description: "Guides, updates, and product news",
      },
      {
        label: "Contact",
        href: "/contact",
      },
    ],
  },
];
