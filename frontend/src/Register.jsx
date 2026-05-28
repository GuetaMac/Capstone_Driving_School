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
import logo from "./assets/logo.png";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [personalInfo, setPersonalInfo] = useState({
    address: "",
    contact_number: "",
    birthday: "",
    age: "",
    nationality: "",
    civil_status: "",
    gender: "",
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

  // Auto-calculate age from birthday
  useEffect(() => {
    if (personalInfo.birthday) {
      const today = new Date();
      const birthDate = new Date(personalInfo.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setPersonalInfo((prev) => ({
        ...prev,
        age: age.toString(),
      }));
    }
  }, [personalInfo.birthday]);

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

    // Validate personal information
    if (!personalInfo.address.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter your complete address.",
      });
      return;
    }

    if (!personalInfo.contact_number.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter your contact number.",
      });
      return;
    }

    // Validate phone format
    if (!/^(09|\+639)\d{9}$/.test(personalInfo.contact_number)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid Philippine phone number (09xxxxxxxxx or +639xxxxxxxxx)",
      });
      return;
    }

    if (!personalInfo.birthday) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter your birthday.",
      });
      return;
    }

    const ageNum = parseInt(personalInfo.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Age",
        text: "You must be at least 18 years old to register.",
      });
      return;
    }

    if (!personalInfo.nationality.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please enter your nationality.",
      });
      return;
    }

    if (!personalInfo.civil_status) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please select your civil status.",
      });
      return;
    }

    if (!personalInfo.gender) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please select your gender.",
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          name,
          email,
          password,
          branch_id: selectedBranch,
          // Add personal info
          address: personalInfo.address,
          contact_number: personalInfo.contact_number,
          birthday: personalInfo.birthday,
          age: personalInfo.age,
          nationality: personalInfo.nationality,
          civil_status: personalInfo.civil_status,
          gender: personalInfo.gender,
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
            Join us and start your driving journey!
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Student Registration
          </h2>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= 1
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle size={20} /> : "1"}
                </div>
                <span className="text-xs mt-2 font-semibold">Account</span>
              </div>
              <div
                className={`flex-1 h-1 ${
                  currentStep >= 2 ? "bg-red-600" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= 2
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle size={20} /> : "2"}
                </div>
                <span className="text-xs mt-2 font-semibold">Personal</span>
              </div>
            </div>
          </div>

          {/* Step 1: Account Information */}
          {currentStep === 1 && (
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

              {/* Next Button */}
              <button
                onClick={() => {
                  // Validation for Step 1
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

                  // All validations passed, go to step 2
                  setCurrentStep(2);
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200"
              >
                Next: Personal Information
              </button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Complete Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address *
                </label>
                <textarea
                  value={personalInfo.address}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  rows="3"
                  placeholder="House No., Street, Barangay, City, Province, ZipCode"
                  required
                />
              </div>

              {/* Contact Number & Birthday */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.contact_number}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        contact_number: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="09123456789"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday *
                  </label>
                  <input
                    type="date"
                    value={personalInfo.birthday}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        birthday: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Age & Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={personalInfo.age}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    placeholder="Auto-calculated"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.nationality}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        nationality: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Filipino"
                    required
                  />
                </div>
              </div>

              {/* Civil Status & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Civil Status *
                  </label>
                  <select
                    value={personalInfo.civil_status}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        civil_status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors appearance-none bg-white"
                    required
                  >
                    <option value="">Select Civil Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors appearance-none bg-white"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </div>
          )}

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
