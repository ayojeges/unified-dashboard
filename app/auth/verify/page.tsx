"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, ArrowLeft, MailCheck, Code2 } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          
          // Store auth state and redirect to projects page
          localStorage.setItem("isAuthenticated", "true");
          setTimeout(() => {
            window.location.href = "/projects";
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Network error during verification");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with back button and logo */}
      <header className="p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#64FFDA] to-[#00D4FF] flex items-center justify-center">
              <Code2 className="h-5 w-5 text-[#0A192F]" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Blueprint Creations</span>
          </Link>
        </div>
      </header>

      {/* Verification Status */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 h-12 w-12 rounded-lg flex items-center justify-center ${
              status === "loading" ? "bg-blue-100 dark:bg-blue-900" :
              status === "success" ? "bg-green-100 dark:bg-green-900" :
              "bg-red-100 dark:bg-red-900"
            }`}>
              {status === "loading" ? (
                <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
              ) : status === "success" ? (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === "loading" ? "Verifying Email" :
               status === "success" ? "Email Verified!" :
               "Verification Failed"}
            </CardTitle>
            <CardDescription>
              {status === "loading" ? "Please wait while we verify your email address..." :
               status === "success" ? "Your email has been successfully verified!" :
               "There was a problem verifying your email"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {message}
            </p>
            
            {status === "success" && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400">
                  You will be redirected to the dashboard in a moment...
                </p>
              </div>
            )}
            
            {status === "error" && token && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Token: <code className="text-xs bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">{token.substring(0, 20)}...</code>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {status === "error" && (
              <div className="space-y-3 w-full">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need help? Try these options:
                </p>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.reload()}
                  >
                    <Loader2 className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Link href="/auth/register" className="w-full">
                    <Button variant="ghost" className="w-full">
                      <MailCheck className="mr-2 h-4 w-4" />
                      Register Again
                    </Button>
                  </Link>
                  <Link href="/auth/login" className="w-full">
                    <Button className="w-full">
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            {status === "success" && (
              <div className="w-full">
                <Link href="/projects">
                  <Button className="w-full">
                    Go to Dashboard Now
                  </Button>
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading verification...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}