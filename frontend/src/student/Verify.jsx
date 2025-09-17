import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Key, CheckCircle, AlertCircle } from "lucide-react";

function Verify() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        setMessage("Account verified successfully! Redirecting to login...");
        setMessageType("success");

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      setMessage(
        "Invalid verification code or error occurred. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage("Please enter your email address first.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resend-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setMessage("Verification code resent to your email!");
        setMessageType("success");
      } else {
        throw new Error("Failed to resend code");
      }
    } catch (error) {
      setMessage("Failed to resend code. Please try again.");
      setMessageType("error");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Verify Your Account
              </h1>
              <p className="text-red-100 text-sm md:text-base">
                Enter the verification code sent to your email
              </p>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-500 text-center text-lg font-mono tracking-widest"
                    value={code}
                    onChange={handleCodeChange}
                    maxLength="6"
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                    messageType === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={isLoading || !email || code.length !== 6}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Verify Account</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            <div className="mt-8 text-center space-y-4">
              <div className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendCode}
                  className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors"
                >
                  Resend Code
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>© 2025 1st Safety Driving School</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Secure Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
