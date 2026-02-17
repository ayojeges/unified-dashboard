import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unified Dashboard",
  description: "A modern unified dashboard built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-muted/20">
            {/* Add padding-top on mobile for fixed header */}
            <div className="p-4 md:p-6 pt-[72px] md:pt-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
