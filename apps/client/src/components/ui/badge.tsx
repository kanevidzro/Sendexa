import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Clock, AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { Crown, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        active:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
        pending:
          "border-transparent bg-pending text-pending-foreground hover:bg-pending/80",
        approved:
          "border-transparent bg-approved text-approved-foreground hover:bg-approved/80",
        rejected:
          "border-transparent bg-rejected text-rejected-foreground hover:bg-rejected/80",
        outline: "text-foreground",
        status: "",
        role: "",
      },
      status: {
        paid: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        approved:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        active:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        delivered:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        processed:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        success:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        pending:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        failed:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        rejected:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        canceled:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        suspended:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        APPROVED:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        PENDING:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        REJECTED:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        PRE_APPROVED:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        SENT: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        DELIVERED:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        FAILED:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        live: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        test: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      },
      role: {
        owner:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
        admin:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        member:
          "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800",
      },
    },
    compoundVariants: [
      {
        variant: "status",
        status: "SENT",
        className: "[&>svg]:text-blue-500 dark:[&>svg]:text-blue-400",
      },
      {
        variant: "status",
        status: "DELIVERED",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "FAILED",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "PENDING",
        className: "[&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-400",
      },
      {
        variant: "status",
        status: "APPROVED",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "PRE_APPROVED",
        className: "[&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-400",
      },
      {
        variant: "status",
        status: "REJECTED",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "paid",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "active",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "approved",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "success",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "delivered",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "processed",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "pending",
        className: "[&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-400",
      },
      {
        variant: "status",
        status: "failed",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "rejected",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "canceled",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "suspended",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "live",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "test",
        className: "[&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-400",
      },
      // Role variants
      {
        variant: "role",
        role: "owner",
        className: "[&>svg]:text-purple-500 dark:[&>svg]:text-purple-400",
      },
      {
        variant: "role",
        role: "admin",
        className: "[&>svg]:text-blue-500 dark:[&>svg]:text-blue-400",
      },
      {
        variant: "role",
        role: "member",
        className: "[&>svg]:text-gray-500 dark:[&>svg]:text-gray-400",
      },
    ],
    defaultVariants: {
      variant: "default",
    },
  }
);

const statusIcons = {
  paid: <CheckCircle size={14} />,
  approved: <CheckCircle size={14} />,
  active: <CheckCircle size={14} />,
  delivered: <CheckCircle size={14} />,
  processed: <CheckCircle size={14} />,
  pending: <Clock size={14} />,
  failed: <AlertCircle size={14} />,
  canceled: <XCircle size={14} />,
  rejected: <XCircle size={14} />,
  suspended: <XCircle size={14} />,
  APPROVED: <CheckCircle size={14} />,
  PENDING: <Clock size={14} />,
  REJECTED: <XCircle size={14} />,
  PRE_APPROVED: <Clock size={14} />,
  SENT: <Clock size={14} />,
  DELIVERED: <CheckCircle size={14} />,
  FAILED: <XCircle size={14} />,
  refunded: <XCircle size={14} />,
  success: <CheckCircle size={14} />,
  live: <CheckCircle size={14} />,
  test: <Clock size={14} />,
};

const roleIcons = {
  owner: <Crown size={14} />,
  admin: <Shield size={14} />,
  member: <User size={14} />,
};

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  status,
  role,
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, status, role, className }),
        variant === "status" && status && "border",
        variant === "role" && role && "border"
      )}
      {...props}
    >
      {variant === "status" && status && statusIcons[status]}
      {variant === "role" && role && roleIcons[role]}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };