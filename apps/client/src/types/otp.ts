// types/otp.ts
export interface OTPHistory {
  id: string;
  phone: string;
  status: "delivered" | "failed" | "pending" | "SENT" | "DELIVERED" | "FAILED" | "PENDING";
  code: string;
  senderId: string;
  sender?: {
    id: string;
    name: string;
    type: string;
  };
  cost: number;
  channel: string;
  createdAt: string;
  codeStatus: "active" | "expired" | "used" | "blocked" | "ACTIVE" | "EXPIRED" | "USED" | "BLOCKED";
}

export interface OTPStats {
  totals: {
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
    total: number;
    active: number;
    verified: number;
    used: number;
    expired: number;
    blocked: number;
    cost: number;
    averageCost: number;
  };
  recent: {
    sent: number;
    delivered: number;
    failed: number;
    failureRate: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  byCodeStatus: Array<{
    codeStatus: string;
    count: number;
    percentage: number;
  }>;
  comparison: {
    total: { current: number; previous: number; change: number };
    delivered: { current: number; previous: number; change: number };
    failed: { current: number; previous: number; change: number };
    verified: { current: number; previous: number; change: number };
    cost: { current: number; previous: number; change: number };
  };
}

export interface OTPAnalytics {
  period: {
    start: string;
    end: string;
    days: number;
  };
  timeline: Array<{
    date: string;
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
    cost: number;
    used?: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  codeStatusBreakdown: Array<{
    codeStatus: string;
    count: number;
    percentage: number;
  }>;
  totals: {
    messages: number;
    cost: number;
  };
}

export interface OTPHistoryResponse {
  success: boolean;
  data: {
    messages: OTPHistory[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    summary: {
      total: number;
      sent: number;
      delivered: number;
      failed: number;
      pending: number;
      active: number;
      verified: number;
      used: number;
      expired: number;
      blocked: number;
      totalCost: number;
    };
  };
}

export interface OTPStatsResponse {
  success: boolean;
  data: OTPStats;
}

export interface OTPAnalyticsResponse {
  success: boolean;
  data: OTPAnalytics;
}