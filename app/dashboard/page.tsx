"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page (which is the dashboard)
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Redirecting to dashboard...</h2>
        <p className="mt-2 text-gray-600">
          If you are not redirected automatically,{" "}
          <a href="/" className="text-blue-600 hover:text-blue-500 font-medium">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}