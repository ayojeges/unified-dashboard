"use client";

import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="p-4 md:p-6 pt-[72px] md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
