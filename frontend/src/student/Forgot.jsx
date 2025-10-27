import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from "lucide-react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setMessage(data.message || "Password reset code sent to your email!");
        setMessageType("success");

        // Save email for reset page
        localStorage.setItem("resetEmail", email);

        // Redirect to reset page after 2 seconds
        setTimeout(() => {
          window.location.href = "/reset-password";
        }, 2000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send reset code");
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Forgot Password?
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your email address and we'll send you a code to reset your
              password
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
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
              onClick={handleSubmit}
              disabled={isLoading || !email}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Reset Code</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          1st Safety Driving School. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
