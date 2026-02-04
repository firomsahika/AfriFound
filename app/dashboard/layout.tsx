import React from "react"
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadMessageCount } from "@/lib/actions/messages";
import { getUnreadNotificationCount } from "@/lib/actions/profile";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [unreadMessages, unreadNotifications] = await Promise.all([
    getUnreadMessageCount(),
    getUnreadNotificationCount(),
  ]);

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      {/* Mobile Nav */}
      <MobileNav user={user} unreadMessages={unreadMessages} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          unreadMessages={unreadMessages}
          unreadNotifications={unreadNotifications}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
