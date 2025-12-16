/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  User,
  MessageSquare,
  CreditCard,
  Calendar,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface SMSDetails {
  id: string;
  recipient: string;
  message: string;
  status: "SENT" | "DELIVERED" | "FAILED" | "PENDING";
  type: string;
  cost: number;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    type: string;
    status: string;
  };
  template?: {
    id: string;
    name: string;
    category: string;
  };
  bulkSend?: {
    id: string;
    totalRecipients: number;
    status: string;
  };
  deliveryStatus?: {
    status: string;
    timestamp?: string;
    errorCode?: string;
    errorMessage?: string;
  };
  resendAttempts?: Array<{
    id: string;
    status: string;
    createdAt: string;
    errorMessage?: string;
  }>;
  externalId?: string;
  provider?: string;
}

interface SMSDetailsResponse {
  success: boolean;
  data: SMSDetails;
}

const getStatusIcon = (status: SMSDetails["status"]) => {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "FAILED":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "PENDING":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "SENT":
      return <Send className="h-5 w-5 text-blue-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: SMSDetails["status"]) => {
  const statusConfig = {
    DELIVERED: { variant: "success" as const, label: "DELIVERED" },
    SENT: { variant: "secondary" as const, label: "SENT" },
    FAILED: { variant: "destructive" as const, label: "FAILED" },
    PENDING: { variant: "outline" as const, label: "PENDING" }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: string) => {
  const typeConfig: { [key: string]: { variant: "default" | "secondary" | "outline", label: string } } = {
    TRANSACTIONAL: { variant: "default", label: "Transactional" },
    PROMOTIONAL: { variant: "secondary", label: "Promotional" },
    ALERT: { variant: "outline", label: "Alert" }
  };

  const config = typeConfig[type] || { variant: "outline", label: type };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

const InfoRow = ({ icon: Icon, label, value, className = "" }: {
  icon: any;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-center justify-between py-3 ${className}`}>
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <div className="text-right">
      {value}
    </div>
  </div>
);

export default function SmsDetailPage() {
  const params = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [sms, setSms] = useState<SMSDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSMSDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/sms/message/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }
        if (response.status === 404) {
          return notFound();
        }
        throw new Error(`Failed to fetch SMS details: ${response.status}`);
      }

      const result: SMSDetailsResponse = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load SMS details");
      }

      setSms(result.data);
    } catch (error: any) {
      console.error("Error fetching SMS details:", error);
      toast.error(error.message || "Failed to load SMS details");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchSMSDetails();
    }
  }, [isAuthenticated, params.id, fetchSMSDetails]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Authentication Required</p>
          <p className="text-muted-foreground">Please log in to view SMS details</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/reports/sms/history">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!sms) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/reports/sms/history">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SMS Details</h1>
          <p className="text-muted-foreground">
            Detailed information about this message
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Message Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              icon={CheckCircle2}
              label="Status"
              value={
                <div className="flex items-center gap-2">
                  {getStatusIcon(sms.status)}
                  {getStatusBadge(sms.status)}
                </div>
              }
            />

            <InfoRow
              icon={User}
              label="Recipient"
              value={<span className="font-medium">{sms.recipient}</span>}
            />

            <InfoRow
              icon={Send}
              label="Sender"
              value={
                <Badge variant="outline">
                  {sms.sender?.name || "Exa Test"}
                </Badge>
              }
            />

            <InfoRow
              icon={MessageSquare}
              label="Type"
              value={getTypeBadge(sms.type)}
            />

            <InfoRow
              icon={CreditCard}
              label="Cost"
              value={<span className="font-medium">{sms.cost} Credit(s)</span>}
            />

            <InfoRow
              icon={Calendar}
              label="Date Sent"
              value={
                <span className="font-medium">
                  {new Date(sms.createdAt).toLocaleString()}
                </span>
              }
            />

            {sms.externalId && (
              <InfoRow
                icon={BarChart3}
                label="Provider ID"
                value={<code className="text-xs bg-muted px-2 py-1 rounded">{sms.externalId}</code>}
              />
            )}

            {sms.provider && (
              <InfoRow
                icon={BarChart3}
                label="Provider"
                value={<Badge variant="outline">{sms.provider}</Badge>}
              />
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Message Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{sms.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Status */}
          {sms.deliveryStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Delivery Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className="font-medium">
                    {sms.deliveryStatus.status}
                  </Badge>
                </div>
                {sms.deliveryStatus.timestamp && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm font-medium">
                      {new Date(sms.deliveryStatus.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
                {sms.deliveryStatus.errorMessage && (
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Error</span>
                    <code className="text-xs bg-destructive/10 text-destructive p-2 rounded block">
                      {sms.deliveryStatus.errorMessage}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Template Information */}
          {sms.template && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{sms.template.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="outline">{sms.template.category}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bulk Send Information */}
          {sms.bulkSend && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Bulk Send
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Recipients</span>
                  <span className="font-medium">{sms.bulkSend.totalRecipients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline">{sms.bulkSend.status}</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resend Attempts */}
      {sms.resendAttempts && sms.resendAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Resend Attempts ({sms.resendAttempts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sms.resendAttempts.map((attempt, index) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Attempt {index + 1}</span>
                      <Badge variant="outline">{attempt.status}</Badge>
                    </div>
                    {attempt.errorMessage && (
                      <span className="text-xs text-destructive">
                        {attempt.errorMessage}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}