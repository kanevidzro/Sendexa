export type AnnouncementVariant = "info" | "success" | "warning" | "promotion";

export interface AnnouncementMessage {
  id: string;
  variant: AnnouncementVariant;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  autoClose?: number;
}

export const announcements: AnnouncementMessage[] = [
  // {
  //   id: "free-sms-launch",
  //   variant: "promotion",
  //   title: "🎉 Get 1,000 FREE SMS credits",
  //   description: "Sign up today and start sending immediately",
  //   ctaLabel: "Claim Free Credits",
  //   ctaHref: "/signup?promo=1000free",
  //   autoClose: 0,
  // },
  {
    id: "maintenance",
    variant: "warning",
    title: "Scheduled maintenance tonight",
    description: "Short downtime expected at 11:30 PM",
    ctaLabel: "Learn More",
    ctaHref: "/signup?promo=1000free",
    autoClose: 0,
  },
];
