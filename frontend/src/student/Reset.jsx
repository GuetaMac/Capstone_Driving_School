import { useState, useEffect } from "react";
import {
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Basic password validation
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            newPassword,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setMessage(data.message || "Password reset successful!");
        setMessageType("success");

        setTimeout(() => {
          localStorage.removeItem("resetEmail");
          window.location.href = "/login";
        }, 2000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to reset password");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Enter the verification code and your new password
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={handleCodeChange}
                  maxLength="6"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-lg font-mono tracking-widest"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Password must be at least 6 characters long
              </p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg flex items-start space-x-3 ${
                  messageType === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={isLoading || !code || !newPassword || code.length !== 6}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 1st Safety Driving School. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
