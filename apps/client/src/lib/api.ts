/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts
import {
  CreditBalance,
  SenderId,
  Template,
  ContactGroup,
  SendSMSRequest,
  SendSMSResponse,
} from "@/types/sms";

class ApiService {
  private getToken(): string {
    if (typeof window === "undefined") return "";

    // Try accessToken first, fall back to bearerToken for backward compatibility
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("bearerToken") ||
      ""
    );
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = this.getToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Authentication failed");
    }

    return response;
  }

  // SMS-related API calls
  async sendSMS(data: SendSMSRequest): Promise<SendSMSResponse> {
    const response = await this.fetchWithAuth("/api/sms/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getSenderIds(): Promise<SenderId[]> {
    const response = await this.fetchWithAuth("/api/sender-ids");
    const result = await response.json();

    console.log("Sender IDs API response:", result); // Debug

    // Handle the exact structure from your API response
    if (result.success && result.data) {
      // If senderIds array exists in data
      if (Array.isArray(result.data.senderIds)) {
        return result.data.senderIds;
      }
      // If data is directly the array
      if (Array.isArray(result.data)) {
        return result.data;
      }
    }

    console.warn("Unexpected sender IDs response structure:", result);
    return [];
  }

  async getTemplates(): Promise<Template[]> {
    const response = await this.fetchWithAuth("/api/templates");
    const result = await response.json();
    return result.data?.templates || result.data || [];
  }

  async getContactGroups(): Promise<ContactGroup[]> {
    const response = await this.fetchWithAuth("/api/contacts/groups/all");
    const result = await response.json();

    // Handle different response structures
    if (result.success && result.data) {
      if (Array.isArray(result.data.groups)) {
        return result.data.groups;
      }
      if (Array.isArray(result.data)) {
        return result.data;
      }
    }

    console.warn("Unexpected contact groups response structure:", result);
    return [];
  }

  async getGroupContacts(groupId: string): Promise<any[]> {
    const response = await this.fetchWithAuth(
      `/api/contacts/groups/${groupId}`
    );
    const result = await response.json();

    console.log("Group contacts API response:", result); // Debug

    // Handle different response structures
    if (result.success) {
      // If contacts array exists in data
      if (result.data && Array.isArray(result.data.contacts)) {
        return result.data.contacts;
      }
      // If data is directly the array of contacts
      if (result.data && Array.isArray(result.data)) {
        return result.data;
      }
      // If the response itself is the array
      if (Array.isArray(result.contacts)) {
        return result.contacts;
      }

      // If contacts array exists in data.group.contacts (your current API structure)
      if (
        result.data &&
        result.data.group &&
        Array.isArray(result.data.group.contacts)
      ) {
        return result.data.group.contacts;
      }
    }

    console.warn("Unexpected group contacts response structure:", result);
    return [];
  }

  async getCreditBalance(): Promise<CreditBalance> {
    const response = await this.fetchWithAuth("/api/credit/balances");
    const result = await response.json();

    console.log("Credit balance response:", result); // Debug

    if (result.success && result.data) {
      // Handle different balance structures
      if (result.data.balances) {
        // If the API returns the balances object directly
        const balanceData = result.data.balances;
        return {
          balances: {
            smsBalance: balanceData.smsBalance || balanceData.SMS || 0,
            walletBalance: balanceData.walletBalance || balanceData.WALLET || 0,
            SMS: balanceData.SMS || balanceData.smsBalance || 0,
            WALLET: balanceData.WALLET || balanceData.walletBalance || 0,
            currency: balanceData.currency || "GHS",
          },
        };
      }

      // If the API returns smsBalance and walletBalance at the data level
      if (result.data.smsBalance !== undefined) {
        return {
          balances: {
            smsBalance: result.data.smsBalance || 0,
            walletBalance: result.data.walletBalance || 0,
            SMS: result.data.smsBalance || 0,
            WALLET: result.data.walletBalance || 0,
            currency: result.data.currency || "GHS",
          },
        };
      }
    }

    console.warn("Unexpected credit balance response structure:", result);
    return {
      balances: {
        smsBalance: 0,
        walletBalance: 0,
        SMS: 0,
        WALLET: 0,
        currency: "GHS",
      },
    };
  }

  // Wallet-related API calls
  async getWalletOverview(): Promise<any> {
    const response = await this.fetchWithAuth("/api/wallet/overview");
    const result = await response.json();
    return result.data;
  }

  async transferToSMS(amount: number): Promise<any> {
    const response = await this.fetchWithAuth("/api/credit/transfer/sms", {
      method: "POST",
      body: JSON.stringify({ amount, description: "Transfer to SMS account" }),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
