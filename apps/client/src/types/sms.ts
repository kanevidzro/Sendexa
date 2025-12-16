// types/sms.ts
export interface SenderId {
  id: string;
  name: string;
  status: "APPROVED" | "PENDING" | "PRE_APPROVED" | "REJECTED";
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    smsMessages: number;
    bulkSends: number;
  };
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    contacts: number;
  };
}

export interface CreditBalance {
  balances: {
    smsBalance: number;
    walletBalance: number;
    SMS: number;
    WALLET: number;
    currency: string;
  };
}

export interface SendSMSRequest {
  recipient: string;
  message: string;
  senderId?: string;
  templateId?: string;
}

export interface SendSMSResponse {
  success: boolean;
  message: string;
  data?: {
    messageId: string;
    currentBalance: number;
    cost: number;
  };
  errorType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}