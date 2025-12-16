import { NavItem } from "./nav.types";

export const navItems: NavItem[] = [
  {
    type: "link",
    label: "Home",
    href: "/",
  },

  {
    type: "link",
    label: "Insights",
    href: "/blog/story",
  },
  {
    type: "link",
    label: "Press Releases",
    href: "/",
  },
  {
    type: "link",
    label: "Success Stories",
    href: "/",
  },

  {
    type: "link",
    label: "Product Updates",
    href: "/pricing",
  },

  {
    type: "dropdown",
    label: "More on Sendexa",
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
