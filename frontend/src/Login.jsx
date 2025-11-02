import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Car,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import logo from "./assets/logo.png"; // adjust path as needed
import Swal from "sweetalert2";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get user info first to check role and verification status
      const preLogin = await axios.post(
        `${import.meta.env.VITE_API_URL}/check-user`,
        {
          identifier,
        }
      );

      const userRole = preLogin.data?.role;
      const isVerified = preLogin.data?.is_verified;
      const userEmail = preLogin.data?.email;

      // 3. Check if student is verified
      if (userRole === "student" && !isVerified) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Account Not Verified",
          text: "Please verify your email first before logging in.",
          showCancelButton: true,
          confirmButtonText: "Go to Verification",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#f59e0b",
          cancelButtonColor: "#6b7280",
        });

        if (result.isConfirmed) {
          navigate("/student/verify");
        }
        setLoading(false);
        return;
      }

      // 4. Proceed with login
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          identifier,
          password,
        }
      );

      const { token, user } = response.data;

      Swal.fire({
        icon: "success",
        title: "Login successful!",
        text: "Redirecting...",
        timer: 1500,
        showConfirmButton: false,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      setTimeout(() => {
        if (user.role === "manager") {
          navigate("/manager_dashboard");
        } else if (user.role === "administrative_staff") {
          navigate("/admin_dashboard");
        } else if (user.role === "student") {
          navigate("/student_dashboard");
        } else if (user.role === "instructor") {
          navigate("/instructor_dashboard");
        } else {
          Swal.fire({
            icon: "error",
            title: "Unknown Role",
            text: "Please contact support.",
          });
        }
      }, 1600);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      // Handle specific verification error from backend
      if (error.response?.data?.type === "unverified") {
        const result = await Swal.fire({
          icon: "warning",
          title: "Account Not Verified",
          text: "Please verify your email first before logging in.",
          showCancelButton: true,
          confirmButtonText: "Go to Verification",
          cancelButtonText: "Resend Code",
          confirmButtonColor: "#f59e0b",
          cancelButtonColor: "#3b82f6",
        });

        if (result.isConfirmed) {
          navigate("/student/verify");
        } else if (
          result.isDismissed &&
          result.dismiss === Swal.DismissReason.cancel
        ) {
          // Handle resend code
          try {
            await axios.post(`${import.meta.env.VITE_API_URL}/resend-code`, {
              email: error.response.data.email,
            });

            Swal.fire({
              icon: "success",
              title: "Code Sent!",
              text: "A new verification code has been sent to your email.",
              confirmButtonColor: "#16a34a",
            });
          } catch (resendError) {
            Swal.fire({
              icon: "error",
              title: "Failed to Resend",
              text: "Could not send verification code. Please try again.",
            });
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text:
            error.response?.data?.error ||
            "Invalid credentials. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img
              src={logo}
              alt="1st SAFETY Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">1st SAFETY</h1>
          <p className="text-lg font-semibold text-red-500 mb-1">
            DRIVING SCHOOL
          </p>
          <p className="text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Identifier Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your username or email"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3">
            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-red-500 hover:text-red-600 font-semibold hover:underline transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>

            {/* Verification Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Need to verify your account?{" "}
                <Link
                  to="/student/verify"
                  className="text-green-500 hover:text-green-600 font-semibold hover:underline transition-colors"
                >
                  Verify here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
