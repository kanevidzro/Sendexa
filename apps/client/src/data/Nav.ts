//
// Nav.ts
import {
  Activity04Icon,
  Comment01Icon,
  ContactBookIcon,
  DashboardBrowsingIcon,
  Files02Icon,
  ShoppingCart02Icon,
  SmsCodeIcon,
} from '@hugeicons/core-free-icons';
//import { HugeiconsIcon } from '@hugeicons/react';

export type BadgeType = "beta" | "new" | "soon" | "updated";



export interface NavItem {
  title: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any; // HugeIcons icon component
  badge?: BadgeType;
  items?: NavItem[];
}

export interface NavigationData {
  navMain: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  badge?: BadgeType;
  items?: NavItem[];

  // NEW:
  roles?: ("developer" | "business" | "enterprise" | "aggregator")[];
  feature?: "sms" | "otp" | "chat" | "phonebook" | "templates" | "reports" | "developers";
}


export const navigationData: NavigationData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/home",
      icon: DashboardBrowsingIcon,
    },
    {
      title: "Recharge",
      url: "/recharge",
      icon: ShoppingCart02Icon,
      items: [
        {
          title: "Buy Credits",
          url: "/recharge/credits",
        },
        {
          title: "Topup Wallet",
          url: "/recharge/wallet",
          badge: "new",
        },
        {
          title: "Invoices",
          url: "/invoices",
          badge: "updated",
        },
      ],
    },
    {
      title: "SMS",
      url: "/sms",
      icon: Comment01Icon,
      //   badge: "updated",
      items: [
        {
          title: "Sender IDs",
          url: "/sms/sender-ids",
          //   badge: "updated",
        },
        {
          title: "Quick SMS",
          url: "/sms/send",
        },
        {
          title: "SMS History",
          url: "/sms/history",
        },
      ],
    },
    {
      title: "OTP",
      url: "/otp",
      icon: SmsCodeIcon,
      items: [
        {
          title: "Overview",
          url: "/otp/overview",
        },
        {
          title: "Reports",
          url: "/otp/reports",
        },
      ],
    },
    {
      title: "Phonebook",
      url: "/phonebook",
      icon: ContactBookIcon,
      badge: "new",
      items: [
        {
          title: "Contacts",
          url: "/phonebook/contacts",
        },
        {
          title: "Groups",
          url: "/phonebook/groups",
          //   badge: "new",
        },
      ],
    },
    //templates hub
    {
      title: "Templates",
      url: "/templates",
      icon: Files02Icon,
      badge: "beta",
      items: [
        //sms templates
        {
          title: "My Templates",
          url: "/templates/sms",
        },
        {
          title: "Templates Library",
          url: "/templates/library",
        },
      ],
    },

    //audit logs (beta)
    // {
    //   title: "Activity Logs",
    //   url: "/activity-logs",
    //   icon: Activity04Icon,
    //   badge: "beta",
    // },
  ],
};

// Badge configuration
export const badgeConfig: Record<
  BadgeType,
  { label: string; className: string }
> = {
  beta: {
    label: "Beta",
    className: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
  },
  new: {
    label: "New",
    className: "bg-green-500/20 text-green-300 border border-green-400/30",
  },
  soon: {
    label: "Soon",
    className: "bg-purple-500/20 text-purple-300 border border-purple-400/30",
  },
  updated: {
    label: "Updated",
    className: "bg-orange-500/20 text-orange-300 border border-orange-400/30",
  },
};
