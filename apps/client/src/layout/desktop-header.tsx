// desktop-header.tsx - UPDATED FOR CONSISTENT API INTEGRATION
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MessageSquareText,
  CreditCard,
  Settings,
  ShieldCheck,
  Loader2,
  LogOut,
  Clapperboard,
  User,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  isActive: boolean;
  business: {
    id: string;
    name: string;
    tier: string;
    country: string;
    phone: string;
    email: string;
    businessType: string;
    businessSector: string;
    accounts: Array<{
      id: string;
      type: string;
      balance: number;
      currency: string;
      isActive: boolean;
    }>;
  };
  role: {
    id: string;
    name: string;
    permissions: string[];
  };
}

interface ApiResponse {
  success: boolean;
  data?: {
    user: User;
  };
  error?: string;
}

export function DesktopHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Enhanced fetch user data with consistent API endpoint
  useEffect(() => {
    // const fetchUserData = async () => {
    //   try {
    //     const token = localStorage.getItem("accessToken");

    //     if (!token) {
    //       console.warn("No token found, redirecting to login");
    //       router.push("/login");
    //       return;
    //     }

    //     // Use consistent API endpoint with profile page
    //     const response = await fetch(`/api/user/profile`, {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     });

    //     console.log("Profile response status:", response.status);

    //     if (!response.ok) {
    //       if (response.status === 401) {
    //         // Token expired or invalid
    //         console.warn("Token invalid, redirecting to login");
    //         localStorage.removeItem("accessToken");
    //         localStorage.removeItem("user");
    //         toast.error("Session expired. Please login again.");
    //         router.push("/login");
    //         return;
    //       }
          
    //       // Try to get error message from response
    //       let errorMessage = `HTTP error! status: ${response.status}`;
    //       try {
    //         const errorData = await response.json();
    //         errorMessage = errorData.error || errorMessage;
    //       } catch {
    //         // Ignore JSON parse errors
    //       }
    //       throw new Error(errorMessage);
    //     }

    //     const result: ApiResponse = await response.json();
    //     console.log("Profile API result:", result);
        
    //     if (result.success && result.data) {
    //       setUser(result.data.user);
    //       // Store user data in localStorage for quick access
    //       localStorage.setItem("user", JSON.stringify(result.data.user));
    //     } else {
    //       throw new Error(result.error || "Failed to fetch user data");
    //     }
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   } catch (error: any) {
    //     console.error("Error fetching user data:", error);
        
    //     // Don't show toast for auth errors (already handled above)
    //     if (error.message && !error.message.includes("401")) {
    //       toast.error(error.message || "Failed to load user data");
    //     }
        
    //     // On any error, clear potentially invalid token
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("user");
        
    //     // Only redirect if it's an auth error
    //     if (error.message?.includes("401") || error.message?.includes("token")) {
    //       router.push("/login");
    //     }
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // fetchUserData();
  }, [router]);

  // Enhanced logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        // Call logout API with timeout
        const logoutPromise = fetch(`/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Logout timeout")), 5000)
        );

        await Promise.race([logoutPromise, timeoutPromise]);
      }

      // Clear all local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiry");

      // Clear session storage
      sessionStorage.clear();

      // Clear cookies more thoroughly
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: Clear storage even if API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      toast.success("Logged out successfully");
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Try to load user from localStorage first for immediate display
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && !user) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "US";
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || "US";
  };

  // Get full user name
  const getUserName = () => {
    if (!user) return "Loading...";
    return `${user.firstName} ${user.lastName}`;
  };

  // Get business name
  const getBusinessId = () => {
    if (!user) return "Loading...";
    return user.business?.id || "No Business";
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return "Loading...";
    return user.email;
  };

  // Quick action handlers
  const handleSendMessage = () => {
    router.push("/sms/send");
  };

  const handleBuyCredits = () => {
    router.push("/credits/buy");
  };

  const handleWatchDemo = () => {
    router.push("/get-started");
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-slate-200 px-6 backdrop-blur supports-[backdrop-filter]:bg-slate-200/60 md:flex">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">
      {/* Left: Business Name */}
      <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
        <Building className="h-5 w-5" />
        {getBusinessId()}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Watch Demo Button */}
        <Button
          variant="outline"
          className="text-sm font-medium flex items-center gap-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 focus:bg-red-500/20 focus:text-red-700 border-red-200"
          onClick={handleWatchDemo}
        >
          <Clapperboard className="h-4 w-4" />
          Watch Demo
        </Button>

        {/* Quick Create Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSendMessage}>
              <MessageSquareText className="w-4 h-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBuyCredits}>
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Credits
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer rounded-full ring-2 ring-muted-foreground/30 px-2 py-1 transition hover:ring-foreground hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                {getUserName()}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{getUserName()}</span>
                  <span className="text-xs text-muted-foreground">
                    {getUserEmail()}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/security")}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Security
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/business")}>
              <Settings className="w-4 h-4 mr-2" />
              Business
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 hover:text-red-700 focus:text-red-700"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}