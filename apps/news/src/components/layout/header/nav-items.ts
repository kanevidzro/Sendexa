
import { NavItem } from "./nav.types";

export const navItems: NavItem[] = [
  {
    type: "link",
    label: "Insights & Stories",
    href: "/",
  },
  {
    type: "link",
    label: "Product Updates",
    href: "/updates",
  },
  {
    type: "link",
    label: "Success Stories",
    href: "/customers",
  },
  {
    type: "link",
    label: "Press & Media",
    href: "/press",
  },
  {
    type: "dropdown",
    label: "More on Sendexa",
    items: [
      {
        label: "Developer Guides",
        href: "/guides",
        // description: "Tutorials and real-world API use cases",
      },
      {
        label: "Tech & Engineering",
        href: "/engineering",
        // description: "Behind the scenes of our systems and architecture",
      },
      {
        label: "Founder’s Notes",
        href: "/founder",
        // description: "Lessons, decisions, and startup insights",
      },
      {
        label: "Life at Sendexa",
        href: "/inside-sendexa",
        // description: "Our culture, team, and journey in Ghana",
      },
    ],
  },
];
