import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Hub | Blueprint Creations",
  description: "Email Campaign Dashboard - All Products",
};

export default function EmailHubPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <iframe
        src="https://dashboard-ten-coral-27.vercel.app/"
        className="w-full h-full border-0 rounded-lg"
        title="Email Hub Dashboard"
        allow="clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
