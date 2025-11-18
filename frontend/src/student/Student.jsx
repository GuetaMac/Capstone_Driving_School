import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  User,
  BarChart3,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  LogOut,
  Menu,
  X,
  MessageSquare,
  FileText,
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  FileImage,
  AlertCircle,
  Star,
  Send,
  Building,
  Home,
  Car,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { FcFeedback } from "react-icons/fc";

// Helper function for Tailwind color classes for StatCard and QuickAction
const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    hoverBorder: "hover:border-blue-300",
    hoverBg: "hover:bg-blue-50",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
    hoverBorder: "hover:border-green-300",
    hoverBg: "hover:bg-green-50",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
    hoverBorder: "hover:border-purple-300",
    hoverBg: "hover:bg-purple-50",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-100",
    hoverBorder: "hover:border-yellow-300",
    hoverBg: "hover:bg-yellow-50",
  },
};

const StatCard = ({
  number,
  title,
  icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-100",
  trend,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`${iconBg} ${iconColor} p-2.5 rounded-md group-hover:scale-105 transition-transform duration-300`}
        >
          {icon}
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-xs font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="text-base font-semibold text-gray-800 mb-2 break-words whitespace-pre-line leading-snug">
        {number}
      </div>
      <div className="text-gray-500 font-medium text-xs">{title}</div>
    </div>
  );
};

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Student";
  const branchId = user?.branch_id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loadingEnroll, setLoadingEnroll] = useState(true);
  const [errorEnroll, setErrorEnroll] = useState(null);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await Swal.fire({
        title: "Signed out",
        text: "You have been successfully signed out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/announcements`,
          {
            params: { branch_id: branchId },
          }
        );
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };

    if (branchId) fetchAnnouncements();
  }, [branchId]);

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!token) {
        setErrorEnroll("Please login first");
        setLoadingEnroll(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/enrollments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch enrollment.");
        const data = await res.json();
        if (data.length > 0) {
          setEnrollment(data[0]);
        }
      } catch (err) {
        console.error("⚠ Error fetching enrollment:", err);
        setErrorEnroll(err.message);
      } finally {
        setLoadingEnroll(false);
      }
    };
    fetchEnrollment();
  }, [token]);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const fmtTime = (t) => {
    const [h, m] = t.split(":");
    const dt = new Date();
    dt.setHours(h, m);
    return dt
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  // Handle schedule label for multiple schedules
  let scheduleLabel = "—";

  if (enrollment) {
    const hasMultipleSchedules =
      enrollment.multiple_schedules && enrollment.multiple_schedules.length > 0;

    if (hasMultipleSchedules) {
      // Multiple schedules - show summary
      const schedCount = enrollment.multiple_schedules.length;
      const firstSched = enrollment.multiple_schedules[0];
      const lastSched = enrollment.multiple_schedules[schedCount - 1];

      scheduleLabel = `${schedCount} sessions: ${fmtDate(
        new Date(firstSched.start_date)
      )} - ${fmtDate(new Date(lastSched.start_date))}`;
    } else if (
      enrollment.start_date &&
      enrollment.start_time &&
      enrollment.end_time
    ) {
      // Single schedule
      const start = new Date(enrollment.start_date);
      const startTime = enrollment.start_time;
      const endTime = enrollment.end_time;

      if (enrollment.is_theoretical) {
        const nextDay = new Date(start);
        nextDay.setDate(start.getDate() + 1);
        scheduleLabel = `${fmtDate(start)} to ${fmtDate(nextDay)} — ${fmtTime(
          startTime
        )} to ${fmtTime(endTime)}`;
      } else {
        scheduleLabel = `${fmtDate(start)} — ${fmtTime(startTime)} to ${fmtTime(
          endTime
        )}`;
      }
    }
  }

  return (
    <div>
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Top Row - Date & Sign Out */}
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <div className="text-xs text-gray-500">Today</div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2 rounded-lg transition-colors duration-200 flex items-center shadow-sm border border-red-200"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-xl font-bold mb-2">
                  Welcome back, {name}!
                </h1>
                <p className="text-red-100 text-sm leading-relaxed">
                  Track your driving progress, schedules, and performance all in
                  one place.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:block mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <Shield className="w-9 h-9 lg:w-11 lg:h-11 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 tracking-tight">
                      Welcome back, {name}!
                    </h1>
                    <p className="text-gray-600 text-base lg:text-lg font-medium tracking-wide">
                      Monitor your driving school operations and track key
                      metrics
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl px-5 py-3 border-2 border-gray-200 shadow-md">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Today
                  </div>
                  <div className="text-base lg:text-lg font-bold text-gray-900">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mission Statement - Mobile Optimized */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 flex items-center justify-center lg:justify-start">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 text-yellow-300" />
                Our Mission
              </h2>
              <p className="text-red-100 text-sm sm:text-base lg:text-lg leading-relaxed text-center lg:text-left max-w-4xl">
                Our mission is to educate every Filipino Motor Vehicle Driver on
                Road Safety and instill safe driving practices. We envision a
                safer road for every Filipino family, with zero fatalities
                brought about by road crash incidents.
              </p>
            </div>
            <div className="text-center lg:text-right lg:ml-8">
              <div className="text-yellow-300 font-bold text-base sm:text-lg">
                First Safety
              </div>
              <div className="text-red-200 text-sm">Always Safe</div>
            </div>
          </div>
        </div>

        {/* Stats - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            number={enrollment?.instructor_name || "-"}
            title="Instructor"
            icon={<User className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-100"
          />
          <StatCard
            number={enrollment?.course_name || "—"}
            title="Course"
            icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconColor="text-teal-600"
            iconBg="bg-teal-100"
          />
          <StatCard
            number={
              enrollment?.status
                ? enrollment.status.charAt(0).toUpperCase() +
                  enrollment.status.slice(1)
                : "Pending"
            }
            title="Status"
            icon={<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatCard
            number={scheduleLabel}
            title="Schedule"
            icon={<Shield className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconColor="text-rose-600"
            iconBg="bg-rose-100"
          />
        </div>

        {/* Announcements - Mobile Optimized */}
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-red-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Announcements
            </h2>
          </div>
          {announcements.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                No announcements available
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Check back later for updates from your branch.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {announcements.map((a) => (
                <div
                  key={a.announcement_id}
                  className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight break-words">
                        {a.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base break-words">
                        {a.content}
                      </p>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Posted on{" "}
                        {new Date(a.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [studentBranch, setStudentBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (studentBranch) {
      setLoading(true);
      fetch(
        `${import.meta.env.VITE_API_URL}/courses?branch_id=${studentBranch}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCourses(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          setLoading(false);
        });
    }
  }, [studentBranch]);

  useEffect(() => {
    const token = window.localStorage?.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/student-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setStudentBranch(data.branch_id);
        })
        .catch((err) => console.error("Error fetching student branch:", err));
    }
  }, []);

  const handleEnrollClick = (course) => {
    // Navigate to enrollment page with course data
    navigate("/enroll", { state: { course } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-red-600 text-center">
          Available Courses
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-500 text-lg">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                No courses available for your branch.
              </p>
              <p className="text-gray-400 text-sm">
                Please contact the school for more information.
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.course_id}
                className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {course.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${course.image}`}
                    alt={course.name}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-base sm:text-lg">
                      No Image
                    </span>
                  </div>
                )}

                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-red-600">
                    {course.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3">
                    ({course.codename})
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 flex-1">
                    {course.description}
                  </p>

                  {(course.type || course.mode) && (
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      {course.type && `Type: ${course.type}`}
                      {course.type && course.mode && " | "}
                      {course.mode && `Mode: ${course.mode}`}
                    </p>
                  )}

                  <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    ₱{course.price}
                  </p>

                  <button
                    onClick={() => handleEnrollClick(course)}
                    className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold text-sm sm:text-base"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const EnrollmentPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [instructorRating, setInstructorRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [formData, setFormData] = useState({});

  const questions = {
    training_course: [
      "Objectives were clearly defined",
      "Topics were organized",
      "Participation was encouraged",
      "Useful experience and knowledge",
      "Help me promote road safety",
    ],
    instructor_evaluation: [
      "Instructor is knowledgeable",
      "Instructor is well prepared",
      "Explains clearly and answers questions",
      "Neat and properly dressed",
      "Good source of knowledge",
    ],
    admin_staff: [
      "Neat and properly dressed",
      "Polite and approachable",
      "Knowledgeable on our service provided",
    ],
    classroom: [
      "Clean",
      "No unpleasant smell or odor",
      "Sufficient lighting",
      "Ideal room temperature",
      "Classroom is ideal venue for learning",
    ],
    vehicle: [
      "Clean",
      "No unpleasant smell or odor",
      "Adequate air-conditioning (for Sedan)",
    ],
  };

  const categoryIcons = {
    training_course: <FileText className="w-5 h-5" />,
    instructor_evaluation: <User className="w-5 h-5" />,
    admin_staff: <Building className="w-5 h-5" />,
    classroom: <Home className="w-5 h-5" />,
    vehicle: <Car className="w-5 h-5" />,
  };

  const categoryColors = {
    training_course: "from-blue-500 to-blue-600",
    instructor_evaluation: "from-purple-500 to-purple-600",
    admin_staff: "from-green-500 to-green-600",
    classroom: "from-orange-500 to-orange-600",
    vehicle: "from-cyan-500 to-cyan-600",
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your enrollments.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/enrollments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load enrollments");
        const data = await res.json();
        setEnrollments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleOpenFeedback = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setInstructorRating(0);
    setHoveredStar(0);
    setFormData({});
    setShowFeedbackModal(true);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitFeedback = async () => {
    if (!selectedEnrollment) return;

    if (instructorRating === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Rating Required",
        text: "Please provide a star rating for the instructor.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    // Validate all required fields
    let isValid = true;
    Object.entries(questions).forEach(([category, items]) => {
      items.forEach((_, qIndex) => {
        const fieldName = `${category}_q${qIndex + 1}`;
        if (!formData[fieldName]) {
          isValid = false;
        }
      });
    });

    if (!isValid) {
      await Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please answer all questions before submitting.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    // Ask for confirmation
    const confirmResult = await Swal.fire({
      title: "Submit Feedback?",
      text: "Are you sure you want to submit your feedback?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
    });

    if (!confirmResult.isConfirmed) return;

    const token = localStorage.getItem("token");
    const payload = { ...formData, instructor_rating: instructorRating };

    setSubmitting(true);
    try {
      const enrollmentIdNum = Number(selectedEnrollment.enrollment_id);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/feedback/${enrollmentIdNum}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || "Failed to submit feedback"
        );
      }

      // Update enrollments state
      setEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          Number(enrollment.enrollment_id) === enrollmentIdNum
            ? { ...enrollment, has_feedback: true }
            : enrollment
        )
      );

      // Close modal first
      setShowFeedbackModal(false);
      setInstructorRating(0);
      setFormData({});

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Your feedback has been submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Feedback submission error:", err);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: `There was an error submitting your feedback: ${err.message}`,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "No Date";
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const fmtTime = (t) => {
    if (!t) return "No Time";
    const [h, m] = t.split(":");
    const dt = new Date();
    dt.setHours(h, m);
    return dt
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  const StarRating = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setInstructorRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                  star <= (hoveredStar || instructorRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700 ml-2">
          {instructorRating > 0 ? `${instructorRating} / 5` : "Not rated"}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-red-600 mx-auto mb-4"></div>
            <BookOpen className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading your enrollments
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we fetch your courses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-8 shadow-2xl">
              <BookOpen className="w-20 h-20 text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              No Enrollments Yet
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Start your learning
              journey today!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-red-600 font-bold text-2xl mb-2">Step 1</div>
              <p className="text-sm text-gray-600">Browse available courses</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-yellow-600 font-bold text-2xl mb-2">
                Step 2
              </div>
              <p className="text-sm text-gray-600">
                Select your preferred course
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-green-600 font-bold text-2xl mb-2">
                Step 3
              </div>
              <p className="text-sm text-gray-600">
                Complete enrollment and start learning
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Enrollments
          </h1>
          <p className="text-gray-600">
            {enrollments.length} course{enrollments.length !== 1 ? "s" : ""}{" "}
            enrolled
          </p>
        </div>

        <div className="space-y-6">
          {enrollments.map((e) => {
            const isOnlineTheoretical =
              (e.course_name ?? "").toLowerCase() ===
              "online theoretical driving course";
            const hasFeedback = e.has_feedback === true || e.has_feedback === 1;
            const hasMultipleSchedules =
              e.multiple_schedules && e.multiple_schedules.length > 0;

            let imageUrl = "";
            if (e.course_image) {
              imageUrl = e.course_image.startsWith("http")
                ? e.course_image
                : `${import.meta.env.VITE_API_URL}${e.course_image}`;
            }

            return (
              <div
                key={e.enrollment_id ?? Math.random()}
                className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {imageUrl && (
                    <div className="lg:w-64 flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={e.course_name ?? "Course"}
                        className="w-full h-48 lg:h-full object-cover"
                        onError={(evt) =>
                          (evt.currentTarget.style.display = "none")
                        }
                      />
                    </div>
                  )}

                  <div className="flex-grow p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {e.course_name ?? "Unnamed Course"}
                      </h2>
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap ${
                          (e.payment_status ?? "").toLowerCase() === "paid" ||
                          (e.payment_status ?? "").toLowerCase() ===
                            "fully paid"
                            ? "bg-green-100 text-green-800"
                            : (e.payment_status ?? "").toLowerCase() ===
                              "partially paid"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(e.payment_status ?? "unpaid").replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      {!isOnlineTheoretical && (
                        <>
                          {hasMultipleSchedules ? (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                              <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-gray-800">
                                  Schedules:
                                </span>
                              </div>
                              <div className="space-y-2 pl-7">
                                {e.multiple_schedules.map((sched, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-gray-700"
                                  >
                                    <span className="font-medium">
                                      Day {sched.day_number}:
                                    </span>{" "}
                                    {fmtDate(new Date(sched.start_date))} —{" "}
                                    {fmtTime(sched.start_time)} to{" "}
                                    {fmtTime(sched.end_time)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
                              <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold text-gray-800 block mb-1">
                                  Schedule
                                </span>
                                <span className="text-sm text-gray-700">
                                  {e.start_date
                                    ? e.is_theoretical
                                      ? `${fmtDate(
                                          new Date(e.start_date)
                                        )} to ${fmtDate(
                                          new Date(
                                            new Date(e.start_date).getTime() +
                                              86400000
                                          )
                                        )} — ${fmtTime(
                                          e.start_time
                                        )} to ${fmtTime(e.end_time)}`
                                      : `${fmtDate(
                                          new Date(e.start_date)
                                        )} — ${fmtTime(
                                          e.start_time
                                        )} to ${fmtTime(e.end_time)}`
                                    : "No Schedule"}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-gray-800 block">
                                Instructor
                              </span>
                              <span className="text-sm text-gray-700">
                                {e.instructor_name ?? "Not assigned yet"}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                              (e.status ?? "").toLowerCase() ===
                              "passed/completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {e.status ?? "pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(e.status ?? "").toLowerCase() === "passed/completed" &&
                      !isOnlineTheoretical && (
                        <button
                          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                            hasFeedback
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white hover:shadow-lg"
                          }`}
                          onClick={() => !hasFeedback && handleOpenFeedback(e)}
                          disabled={hasFeedback}
                        >
                          {hasFeedback ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Feedback Submitted
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-5 h-5" />
                              Give Feedback
                            </>
                          )}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 sm:p-8 relative">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white pr-12">
                Training Course Evaluation
              </h2>
              <p className="text-red-100 mt-2 text-sm sm:text-base">
                {selectedEnrollment?.course_name ?? "Course"}
              </p>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 sm:p-8">
              <div className="space-y-8">
                {/* Instructor Rating */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-yellow-400 rounded-full p-3 shadow-md">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        Rate Your Instructor
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 font-medium">
                        {selectedEnrollment?.instructor_name ?? "Instructor"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center sm:justify-start">
                    <StarRating />
                  </div>
                </div>

                {/* Question Categories */}
                {Object.entries(questions).map(
                  ([category, items], categoryIndex) => (
                    <div key={categoryIndex} className="space-y-4">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2">
                        <div
                          className={`bg-gradient-to-r ${categoryColors[category]} rounded-lg p-2.5 text-white shadow-md`}
                        >
                          {categoryIcons[category]}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">
                          {category.replace(/_/g, " ")}
                        </h3>
                      </div>

                      <div className="space-y-6">
                        {items.map((question, qIndex) => (
                          <div
                            key={qIndex}
                            className="bg-gray-50 rounded-xl p-4 sm:p-5"
                          >
                            <p className="font-semibold text-sm sm:text-base text-gray-800 mb-3">
                              {qIndex + 1}. {question}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
                              {[
                                "Strongly Agree",
                                "Agree",
                                "Neutral",
                                "Disagree",
                                "Strongly Disagree",
                              ].map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-white transition-all"
                                >
                                  <input
                                    type="radio"
                                    name={`${category}_q${qIndex + 1}`}
                                    value={option}
                                    checked={
                                      formData[`${category}_q${qIndex + 1}`] ===
                                      option
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        e.target.name,
                                        e.target.value
                                      )
                                    }
                                    className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500 flex-shrink-0"
                                  />
                                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Comments */}
                <div className="space-y-6 pt-4">
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100">
                    <label className="flex items-center gap-2 font-semibold mb-3 text-sm sm:text-base text-gray-800">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      Comments about Instructor
                    </label>
                    <textarea
                      value={formData.instructor_comments || ""}
                      onChange={(e) =>
                        handleInputChange("instructor_comments", e.target.value)
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                      rows="3"
                      placeholder="Share your thoughts..."
                    ></textarea>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                    <label className="flex items-center gap-2 font-semibold mb-3 text-sm sm:text-base text-gray-800">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      Additional Comments & Recommendations
                    </label>
                    <textarea
                      value={formData.comments || ""}
                      onChange={(e) =>
                        handleInputChange("comments", e.target.value)
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm sm:text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      rows="4"
                      placeholder="Any suggestions..."
                    ></textarea>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t-2">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                    onClick={() => setShowFeedbackModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitFeedback}
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/student/feedback`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch feedbacks", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-6">
          My Submitted Feedback
        </h2>

        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="bg-red-50 rounded-full p-6 mb-6">
            <MessageSquare className="w-16 h-16 text-red-600" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Feedback Yet
          </h3>

          <p className="text-gray-600 text-center max-w-md mb-6">
            You haven't submitted any feedback yet. After completing your
            courses, you can share your experience to help us improve our
            services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Rate Courses</p>
              <p className="text-xs text-gray-500 mt-1">
                Share your learning experience
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <ClipboardList className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Rate Instructors
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Evaluate teaching quality
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <MessageSquare className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Give Comments</p>
              <p className="text-xs text-gray-500 mt-1">Suggest improvements</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        All Submitted Feedback
      </h2>

      {feedbacks.map((fb) => (
        <div
          key={fb.feedback_id}
          className="bg-white shadow rounded p-5 mb-6 border"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {fb.course_name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Submitted on {new Date(fb.created_at).toLocaleDateString()}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            {/* Training Course */}
            <div>
              <h4 className="font-semibold mb-1">Training Course</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Objectives defined: {fb.training_course_q1}</li>
                <li>Topics organized: {fb.training_course_q2}</li>
                <li>Participation encouraged: {fb.training_course_q3}</li>
                <li>Useful knowledge: {fb.training_course_q4}</li>
                <li>Promotes road safety: {fb.training_course_q5}</li>
              </ul>
            </div>

            {/* Instructor */}
            <div>
              <h4 className="font-semibold mb-1">Instructor</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Knowledgeable: {fb.instructor_q1}</li>
                <li>Well prepared: {fb.instructor_q2}</li>
                <li>Explains clearly: {fb.instructor_q3}</li>
                <li>Neat & dressed properly: {fb.instructor_q4}</li>
                <li>Good knowledge source: {fb.instructor_q5}</li>
              </ul>
            </div>

            {/* Admin Staff */}
            <div>
              <h4 className="font-semibold mb-1">Admin Staff</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Neat & dressed properly: {fb.admin_q1}</li>
                <li>Polite & approachable: {fb.admin_q2}</li>
                <li>Knowledgeable: {fb.admin_q3}</li>
              </ul>
            </div>

            {/* Classroom */}
            <div>
              <h4 className="font-semibold mb-1">Classroom</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Clean: {fb.classroom_q1}</li>
                <li>No odor: {fb.classroom_q2}</li>
                <li>Good lighting: {fb.classroom_q3}</li>
                <li>Comfortable temperature: {fb.classroom_q4}</li>
                <li>Ideal for learning: {fb.classroom_q5}</li>
              </ul>
            </div>

            {/* Vehicle */}
            <div>
              <h4 className="font-semibold mb-1">Vehicle</h4>
              <ul className="list-disc ml-5 space-y-1">
                <li>Clean: {fb.vehicle_q1}</li>
                <li>No odor: {fb.vehicle_q2}</li>
                <li>Good A/C (Sedan): {fb.vehicle_q3}</li>
              </ul>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-4 text-sm text-gray-800">
            <p className="mb-2">
              <strong>Instructor Comments:</strong>{" "}
              {fb.instructor_comments || "None"}
            </p>
            <p>
              <strong>Additional Comments:</strong> {fb.comments || "None"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Student = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Student"; // fallback kung wala

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      await Swal.fire({
        title: "Signed out",
        text: "You have been successfully signed out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header - Static (Not Fixed) */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-white-600 to-white-700 rounded-lg flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-7 h-7 object-contain rounded-full"
            />
          </div>
          <div>
            <div className="font-bold text-sm">1st Safety</div>
            <div className="text-gray-500 text-xs">Driving School</div>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on Desktop, Overlay on Mobile */}
      <div
        className={`
          fixed top-0 bottom-0 left-0 z-50
          w-64 bg-white shadow-xl border-r border-gray-200
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header */}
        <div className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8 rounded-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-lg">1st Safety</div>
              <div className="text-red-100 text-sm">Driving School</div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{name}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {[
            { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
            { name: "Courses", icon: <User className="w-5 h-5" /> },
            { name: "Enrollment Details", icon: <Users className="w-5 h-5" /> },
            {
              name: "Submitted Feedbacks",
              icon: <FcFeedback className="w-5 h-5" />,
            },
          ].map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => handleNavClick(name)}
              className={`flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm cursor-pointer transition-colors
        ${
          activePage === name
            ? "bg-red-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
            >
              <span className="mr-3">{icon}</span>
              <span className="truncate">{name}</span>
            </button>
          ))}
          {/* Sign Out Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-64px)]">
            {activePage === "Dashboard" && <DashboardPage />}
            {activePage === "Courses" && <CoursesPage />}
            {activePage === "Enrollment Details" && <EnrollmentPage />}
            {activePage === "Submitted Feedbacks" && <FeedbacksPage />}
          </div>
        </main>
      </div>
    </div>
  );
};
export default Student;
