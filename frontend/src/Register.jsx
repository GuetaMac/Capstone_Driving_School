import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/branches`
        );
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every((value) => value === true);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter your full name.",
      });
      return;
    }

    if (!email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter your email address.",
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (!password) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter a password.",
      });
      return;
    }

    // Check password strength
    if (!isPasswordStrong()) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        html: `
          <div style="text-align: left; padding: 10px;">
            <p style="margin-bottom: 10px;">Your password must meet all requirements:</p>
            <ul style="list-style: none; padding-left: 0;">
              <li style="color: ${
                passwordStrength.hasMinLength ? "green" : "red"
              };">
                ${
                  passwordStrength.hasMinLength ? "✓" : "✗"
                } At least 8 characters
              </li>
              <li style="color: ${
                passwordStrength.hasUpperCase ? "green" : "red"
              };">
                ${
                  passwordStrength.hasUpperCase ? "✓" : "✗"
                } One uppercase letter
              </li>
              <li style="color: ${
                passwordStrength.hasLowerCase ? "green" : "red"
              };">
                ${
                  passwordStrength.hasLowerCase ? "✓" : "✗"
                } One lowercase letter
              </li>
              <li style="color: ${
                passwordStrength.hasNumber ? "green" : "red"
              };">
                ${passwordStrength.hasNumber ? "✓" : "✗"} One number
              </li>
              <li style="color: ${
                passwordStrength.hasSpecialChar ? "green" : "red"
              };">
                ${
                  passwordStrength.hasSpecialChar ? "✓" : "✗"
                } One special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        `,
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (password !== retypePassword) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Passwords do not match!",
      });
      return;
    }

    if (!selectedBranch) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please select a branch.",
      });
      return;
    }

    setLoading(true);

    try {
      // Check system status
      const statusRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/system-status`
      );
      const systemStatus = statusRes.data.status;

      if (systemStatus === "offline" || systemStatus === "maintenance") {
        Swal.fire({
          icon: "warning",
          title: "System Unavailable",
          text: `The system is currently ${systemStatus}. Please try again later.`,
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          name,
          email,
          password,
          branch_id: selectedBranch,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Please check your email for verification.",
        confirmButtonColor: "#16a34a",
      });

      navigate("/student/verify");
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);

      // Check if email already exists
      if (error.response?.status === 400 && error.response?.data?.message) {
        Swal.fire({
          icon: "error",
          title: "Email Already Registered",
          text: error.response.data.message,
          confirmButtonColor: "#dc2626",
          footer:
            '<a href="/login" style="color: #dc2626;">Go to Login Page</a>',
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.response?.data?.message || "Please try again.",
          confirmButtonColor: "#dc2626",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              1S
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">1st SAFETY</h1>
          <p className="text-lg font-semibold text-red-500 mb-1">
            DRIVING SCHOOL
          </p>
          <p className="text-gray-600">
            Join us and start your driving journey!
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Student Registration
          </h2>

          <div className="space-y-5">
            {/* Full Name Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
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

              {/* Password Requirements */}
              {showPasswordRequirements && password && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-700">
                      Password Requirements:
                    </p>
                    <button
                      onClick={() => setShowPasswordRequirements(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <ul className="space-y-1 text-xs">
                    <li
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasMinLength
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasMinLength ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasUpperCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasUpperCase ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      One uppercase letter (A-Z)
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasLowerCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasLowerCase ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      One lowercase letter (a-z)
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasNumber
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasNumber ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      One number (0-9)
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.hasSpecialChar ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showRetypePassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showRetypePassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {retypePassword && password !== retypePassword && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
              {retypePassword && password === retypePassword && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Branch Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Branch
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors appearance-none bg-white"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
              >
                <option value="">Choose your preferred branch</option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-500 hover:text-red-600 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>1st Safety Driving School. Learn to drive safely.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
