"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

type VerificationState = "verifying" | "success" | "error" | "already_verified";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerificationState>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("=== Email Verification Debug ===");
    console.log("Token from URL:", token);
    console.log("Token length:", token?.length);

    if (!token) {
      setState("error");
      setErrorMessage("Verification token is missing.");
      setShowResendForm(true);
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log("Calling API with token:", token);
        const response = await authService.verifyEmail(token);
        console.log("✅ Verification response:", response);
        setState("success");
      } catch (error: any) {
        console.error("❌ Verification error:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error status:", error.response?.status);

        const errorCode = error.response?.data?.error?.code;
        const errorMsg = error.response?.data?.error?.message;

        if (errorCode === "ALREADY_VERIFIED") {
          setState("already_verified");
        } else {
          setState("error");
          setErrorMessage(
            errorMsg ||
              "Verification failed. The link may be invalid or expired."
          );
          setShowResendForm(true);
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setResendMessage("Please enter your email address.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");

    try {
      await authService.resendVerification(email);
      setResendMessage("✅ Verification email sent! Please check your inbox.");
      setEmail("");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message;
      setResendMessage(
        errorMsg || "❌ Failed to send verification email. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/auth/login");
  };

  if (state === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Verifying your email...
          </h2>
          <p className="text-gray-600 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. Your account is now
            pending admin approval.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> An administrator will review your
              account. You'll receive an email once your account is approved and
              you can log in.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (state === "already_verified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <svg
              className="h-10 w-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Already Verified
          </h2>
          <p className="text-gray-600 mb-6">
            Your email address has already been verified. You can proceed to
            login.
          </p>

          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
        </div>

        {showResendForm && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 text-center">
                Don't worry! You can request a new verification link below.
              </p>
            </div>

            <form onSubmit={handleResendVerification} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resendLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send New Verification Link"
                )}
              </button>

              {resendMessage && (
                <div
                  className={`text-sm text-center p-3 rounded ${
                    resendMessage.includes("✅")
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {resendMessage}
                </div>
              )}
            </form>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push("/auth/register")}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Register New Account
          </button>

          <button
            onClick={handleContinue}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Back to Login
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Need help?{" "}
            <a
              href="mailto:support@yourdomain.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
