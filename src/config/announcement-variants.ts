import { AnnouncementVariant } from "@/config/announcements";

export const variantStyles: Record<
  AnnouncementVariant,
  {
    background: string;
    button: string;
    icon: string;
  }
> = {
  info: {
    background: "bg-blue-600",
    button: "bg-white text-blue-700 hover:bg-gray-100",
    icon: "text-blue-100",
  },
  success: {
    background: "bg-green-600",
    button: "bg-white text-green-700 hover:bg-gray-100",
    icon: "text-green-100",
  },
  warning: {
    background: "bg-amber-600",
    button: "bg-white text-amber-800 hover:bg-gray-100",
    icon: "text-amber-100",
  },
  promotion: {
    background: "bg-accent-600",
    button: "bg-white text-accent-700 hover:bg-gray-100",
    icon: "text-accent-100",
  },
};
