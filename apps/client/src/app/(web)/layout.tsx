//personal/src/app/(dashboard)/layout.tsx 
"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layout/Sidebar";
import { MobileHeader } from "@/layout/mobile-header";
import { DesktopHeader } from "@/layout/desktop-header";
import DashboardFooter from "@/layout/DashboardFooter";

interface DashboardLayoutProps {
  children: React.ReactNode;
  // dashboardType: "personal" | "business";
  // requiredPermissions?: string[];
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden sticky top-0 z-40">
            <MobileHeader />
          </div>
          <div className="hidden lg:block sticky top-0 z-40">
            <DesktopHeader />
          </div>
          <main className="flex-1 w-full">
            <div className="w-full max-w-full py-2 px-2 sm:px-6">
              {children}
            </div>
          </main>
          <div className="w-full">
            <DashboardFooter />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}