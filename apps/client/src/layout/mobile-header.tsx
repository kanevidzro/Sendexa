// mobile-header.tsx - UPDATED FOR CONSISTENT API INTEGRATION
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User,
  Plus,
  MessageSquareText,
  CreditCard,
  ShieldCheck,
  Loader2,
  Settings,
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

export function MobileHeader() {
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

    //     console.log("Mobile header - Profile response status:", response.status);

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
    //     console.log("Mobile header - Profile API result:", result);
        
    //     if (result.success && result.data) {
    //       setUser(result.data.user);
    //       // Store user data in localStorage for quick access
    //       localStorage.setItem("user", JSON.stringify(result.data.user));
    //     } else {
    //       throw new Error(result.error || "Failed to fetch user data");
    //     }
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   } catch (error: any) {
    //     console.error("Mobile header - Error fetching user data:", error);
        
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
      console.error("Mobile header - Logout error:", error);
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
  const getBusinessName = () => {
    if (!user) return "No Business";
    return user.business?.name || "No Business";
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

  const handleProfile = () => {
    router.push("/settings/profile");
  };

  const handleSecurity = () => {
    router.push("/settings/security");
  };

  const handleBusinessSettings = () => {
    router.push("/settings/business");
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        {/* Left: Sidebar trigger + logo */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={100}
            height={40}
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Right: Loading state */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      {/* Left: Sidebar trigger + logo */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Image
          src="https://cdn.sendexa.co/images/logo/exaweb.png"
          alt="Sendexa Logo"
          width={100}
          height={40}
          className="h-7 w-auto object-contain"
        />
      </div>

      {/* Right: Quick Actions + Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-9 w-9 border-muted-foreground/30 hover:border-foreground"
            >
              <Plus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSendMessage}>
              <MessageSquareText className="mr-2 size-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBuyCredits}>
              <CreditCard className="mr-2 size-4" />
              Buy Credits
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer rounded-full ring-2 ring-muted-foreground/30 p-0.5 transition hover:ring-foreground hover:bg-accent">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col space-y-1 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-sm truncate">
                    {getUserName()}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {getUserEmail()}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Building className="h-3 w-3" />
                    {getBusinessName()}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile}>
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSecurity}>
              <ShieldCheck className="mr-2 size-4" />
              Security
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBusinessSettings}>
              <Settings className="mr-2 size-4" />
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
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 size-4" />
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