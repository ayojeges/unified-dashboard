"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    if (!isAuthenticated || isAuthenticated !== "true") {
      // Redirect to login if not authenticated
      router.push("/auth/login");
    }
  }, [router]);

  // Check authentication on client side
  if (typeof window !== "undefined") {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated || isAuthenticated !== "true") {
      return null; // Or a loading spinner
    }
  }

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
