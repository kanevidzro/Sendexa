/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Types for API responses
interface OTPStats {
  totals: {
    sent: number;
    failed: number;
    delivered: number;
    pending: number;
    used: number;
    expired: number;
    active: number;
    blocked: number;
    cost: number;
    averageCost: number;
  };
  recent: {
    sent: number;
    failed: number;
    delivered: number;
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

interface OTPHistory {
  id: string;
  phone: string;
  status: "delivered" | "failed" | "pending" | "SENT" | "DELIVERED" | "FAILED" | "PENDING";
  code: string;
  senderId: string;
  sender?: {
    id: string;
    name: string;
  };
  senderName?: string;
  cost: number;
  channel: string;
  createdAt: string;
  codeStatus: "active" | "expired" | "used" | "blocked" | "ACTIVE" | "EXPIRED" | "USED" | "BLOCKED";
  date?: string;
}

// interface OTPSummary {
//   totalCost: number;
//   totalMessages: number;
// }

interface OTPAnalytics {
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

const getStatusBadge = (status: OTPHistory["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Custom hook for OTP API calls
const useOTP = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchOTPHistory = useCallback(async (
    page = 1,
    limit = 20,
    status = "all",
    codeStatus = "all",
    search = ""
  ) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && status !== "all" && { status }),
        ...(codeStatus && codeStatus !== "all" && { codeStatus }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/otp/history?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return null;
        }
        throw new Error(`Failed to fetch OTP history: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load OTP history");
      }

      return result;
    } catch (error: any) {
      console.error("Error fetching OTP history:", error);
      toast.error(error.message || "Failed to load OTP history");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOTPStats = useCallback(async (period = "month") => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const response = await fetch(`/api/otp/stats?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return null;
        }
        throw new Error(`Failed to fetch OTP stats: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load OTP statistics");
      }

      return result;
    } catch (error: any) {
      console.error("Error fetching OTP stats:", error);
      toast.error(error.message || "Failed to load OTP statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOTPAnalytics = useCallback(async (
    period = "month", 
    startDate?: string, 
    endDate?: string,
    groupBy = "day"
  ) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const params = new URLSearchParams({
        period,
        groupBy,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/otp/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return null;
        }
        throw new Error(`Failed to fetch OTP analytics: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error("Failed to load OTP analytics");
      }

      return result;
    } catch (error: any) {
      console.error("Error fetching OTP analytics:", error);
      toast.error(error.message || "Failed to load OTP analytics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    fetchOTPHistory,
    fetchOTPStats,
    fetchOTPAnalytics,
  };
};

export default function OtpOverviewPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { fetchOTPStats, fetchOTPHistory, fetchOTPAnalytics, isLoading: apiLoading } = useOTP();
  
  const [otpStats, setOtpStats] = useState<OTPStats | null>(null);
  const [otpHistory, setOtpHistory] = useState<OTPHistory[]>([]);
  const [otpAnalytics, setOtpAnalytics] = useState<OTPAnalytics | null>(null);
  const [summary, setSummary] = useState({ totalCost: 0, totalMessages: 0 });
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const isLoading = authLoading || apiLoading;

  const fetchOTPData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const [statsResponse, historyResponse, analyticsResponse] = await Promise.all([
        fetchOTPStats(selectedPeriod),
        fetchOTPHistory(1, 5),
        fetchOTPAnalytics(selectedPeriod)
      ]);

      if (statsResponse?.data) {
        setOtpStats(statsResponse.data);
      } else {
        // Set fallback stats
        setOtpStats({
          totals: { 
            sent: 0, 
            failed: 0, 
            delivered: 0, 
            pending: 0,
            used: 0, 
            expired: 0,
            active: 0,
            blocked: 0,
            cost: 0, 
            averageCost: 0 
          },
          recent: { 
            sent: 0, 
            failed: 0,
            delivered: 0,
            failureRate: 0 
          },
          byStatus: [],
          byCodeStatus: [],
          comparison: {
            total: { current: 0, previous: 0, change: 0 },
            delivered: { current: 0, previous: 0, change: 0 },
            failed: { current: 0, previous: 0, change: 0 },
            verified: { current: 0, previous: 0, change: 0 },
            cost: { current: 0, previous: 0, change: 0 }
          }
        });
      }

      if (historyResponse?.data) {
        const transformedHistory = historyResponse.data.messages.map((otp: OTPHistory) => ({
          ...otp,
          senderName: otp.sender?.name || otp.senderId || "N/A",
          date: new Date(otp.createdAt).toISOString().split('T')[0]
        }));
        setOtpHistory(transformedHistory);
        setSummary({
          totalCost: historyResponse.data.summary.totalCost || 0,
          totalMessages: historyResponse.data.summary.total || 0
        });
      } else {
        setOtpHistory([]);
        setSummary({ totalCost: 0, totalMessages: 0 });
      }

      if (analyticsResponse?.data) {
        setOtpAnalytics(analyticsResponse.data);
      } else {
        setOtpAnalytics(null);
      }
    } catch (error) {
      console.error("Error fetching OTP data:", error);
      // Error handling is already done in the hook
    }
  }, [isAuthenticated, fetchOTPStats, fetchOTPHistory, fetchOTPAnalytics, selectedPeriod]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOTPData();
  }, [fetchOTPData]);

  // Transform analytics data for charts
  const getChartData = () => {
    if (!otpAnalytics?.timeline) return [];

    if (otpAnalytics.timeline.length > 0 && otpAnalytics.timeline[0].date !== 'all') {
      const periodStart = new Date(otpAnalytics.period.start);
      const periodEnd = new Date(otpAnalytics.period.end);
      const allDates = getAllDatesInRange(periodStart, periodEnd);
      
      const dateMap = new Map();
      
      allDates.forEach(date => {
        dateMap.set(date, {
          name: formatDate(date),
          date: date,
          sent: 0,
          verified: 0,
          failed: 0,
          pending: 0
        });
      });

      otpAnalytics.timeline.forEach(item => {
        if (dateMap.has(item.date)) {
          const dayData = dateMap.get(item.date);
          dayData.sent = item.sent || 0;
          dayData.verified = item.used || item.delivered || 0;
          dayData.failed = item.failed || 0;
          dayData.pending = item.pending || 0;
        }
      });

      return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    } else {
      return [{
        name: 'All Time',
        sent: otpAnalytics?.totals?.messages || 0,
        verified: otpStats?.totals.used || otpStats?.totals.delivered || 0,
        failed: otpStats?.totals.failed || 0,
        pending: otpStats?.totals.pending || 0
      }];
    }
  };

  const getAllDatesInRange = (start: Date, end: Date): string[] => {
    const dates: string[] = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTotalSent = () => otpStats?.totals.sent || 0;
  const getTotalVerified = () => otpStats?.totals.used || 0;
  const getTotalFailed = () => otpStats?.totals.failed || 0;
  const getTotalPending = () => otpStats?.totals.pending || 0;

  const getSuccessRate = () => {
    const sent = getTotalSent();
    const verified = getTotalVerified();
    return sent > 0 ? ((verified / sent) * 100).toFixed(1) : "0.0";
  };

  const getFailureRate = () => {
    const sent = getTotalSent();
    const failed = getTotalFailed();
    return sent > 0 ? ((failed / sent) * 100).toFixed(1) : "0.0";
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      case 'year': return 'This year';
      default: return 'Last 30 days';
    }
  };

  const handleRefresh = () => {
    fetchOTPData();
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
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
          <p className="text-muted-foreground">Please log in to view OTP dashboard</p>
        </div>
      </div>
    );
  }

  if (isLoading && !otpStats) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-[180px] bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="h-[350px] animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OTP Overview</h1>
          <p className="text-muted-foreground">
            Monitor your one-time password verification performance for {getPeriodLabel().toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total OTPs Sent
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{getTotalSent().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {getPeriodLabel()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified OTPs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{getTotalVerified().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{getSuccessRate()}% success rate</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{getTotalPending().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active OTPs</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{getTotalFailed().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{getFailureRate()}% failure rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>OTP Volume - {getPeriodLabel()}</CardTitle>
            <CardDescription>Daily sent and verified OTPs</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={Math.floor(chartData.length / 7)}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      const formattedName = name === 'sent' ? 'Sent' : name === 'verified' ? 'Verified' : name;
                      return [value, formattedName];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="sent" fill="#8884d8" radius={[4, 4, 0, 0]} name="Sent" />
                  <Bar dataKey="verified" fill="#82ca9d" radius={[4, 4, 0, 0]} name="Verified" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No OTP data available for the selected period
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Verification Rate - {getPeriodLabel()}</CardTitle>
            <CardDescription>Daily success rate percentage</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={chartData.map((d) => ({
                    name: d.name,
                    rate: d.sent > 0 ? ((d.verified / d.sent) * 100) : 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={Math.floor(chartData.length / 7)}
                  />
                  <YAxis unit="%" />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, "Success rate"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={{ fill: '#ff7300', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No verification data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards for Code Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active OTPs</CardTitle>
            <Badge variant="outline" className="bg-blue-50">Current</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{otpStats?.totals.active || 0}</div>
            <p className="text-xs text-muted-foreground">Not yet expired or used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired OTPs</CardTitle>
            <Badge variant="outline" className="bg-orange-50">Expired</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{otpStats?.totals.expired || 0}</div>
            <p className="text-xs text-muted-foreground">Past expiry time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked OTPs</CardTitle>
            <Badge variant="outline" className="bg-red-50">Blocked</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{otpStats?.totals.blocked || 0}</div>
            <p className="text-xs text-muted-foreground">Max attempts exceeded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <Badge variant="outline">Cost</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(otpStats?.totals.cost || 0)} Credits</div>
            <p className="text-xs text-muted-foreground">Average: {(otpStats?.totals.averageCost || 0)} per OTP</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recent OTPs</h1>
        <p className="text-muted-foreground">
          Last 5 OTP verification attempts
        </p>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Sender ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Code Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otpHistory.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.senderName}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.channel}</Badge>
                  </TableCell>
                  <TableCell>{report.cost}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        report.codeStatus === 'used' ? 'bg-green-50 text-green-700' :
                        report.codeStatus === 'active' ? 'bg-blue-50 text-blue-700' :
                        report.codeStatus === 'expired' ? 'bg-orange-50 text-orange-700' :
                        'bg-red-50 text-red-700'
                      }
                    >
                      {report.codeStatus.charAt(0).toUpperCase() + report.codeStatus.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {otpHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Activity className="h-12 w-12 mb-4 opacity-50" />
                      <p>No OTP history found</p>
                      <p className="text-sm">
                        Send your first OTP to get started
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardHeader>

        {otpHistory.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{otpHistory.length}</strong> of{" "}
              <strong>{summary?.totalMessages || 0}</strong>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Link href={`/otp/reports`}>View All</Link>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}