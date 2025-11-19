import React, { useState, useEffect, useRef, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import {
  User,
  BarChart3,
  Users,
  Shield,
  Trash2,
  Settings,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  RefreshCw,
  XCircle,
  Plus,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Check,
  X,
  ChevronDown,
  Search,
  Filter,
  LogOut,
  ListCheckIcon,
  ListCheck,
  List,
  Menu,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Copy,
  Save,
  CalendarRange,
  Zap,
  Star,
  Car,
  Edit2,
  Bike,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Archive,
  RotateCcw,
  MapPin,
} from "lucide-react";
import Swal from "sweetalert2";
import { BsRecord } from "react-icons/bs";
import { PiStudentFill } from "react-icons/pi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { jwtDecode } from "jwt-decode";
import { FaPesoSign } from "react-icons/fa6";

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

const StatCard = ({ number, title, icon, color = "blue", trend }) => {
  const c = colorClasses[color] || colorClasses.blue;
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${c.bg} ${c.text} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{number}</div>
      <div className="text-gray-600 font-medium text-sm">{title}</div>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Student";

  const [summary, setSummary] = useState({
    total_enrollments: 0,
    total_earnings: 0,
    no_instructor_assigned: 0,
    unpaid_count: 0,
    total_expenses: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/enrollments/summary`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

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
    <div>
      {/* Header - Mobile Optimized */}
      <div className="p-4 sm:p-6 lg:p-8">
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
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-bold mb-2">Welcome back, {name}!</h1>
              <p className="text-red-100 text-sm leading-relaxed">
                Monitor your driving school operations and performance from your
                admin dashboard.
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
                    Monitor your driving school operations and track key metrics
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

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 lg:mb-4 flex items-center justify-center lg:justify-start">
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3 text-yellow-300" />
                Our Mission
              </h2>
              <p className="text-red-100 text-sm sm:text-base lg:text-lg leading-relaxed text-center lg:text-left max-w-4xl">
                Our mission is to educate every Filipino Motor Vehicle Driver on
                Road Safety and instill safe driving practices. We envision a
                safer road for every Filipino family, with zero fatalities
                brought about by road crash incidents.
              </p>
            </div>
            <div className="text-center lg:text-right lg:ml-8 mt-4 lg:mt-0">
              <div className="text-yellow-300 font-bold text-base lg:text-lg">
                First Safety
              </div>
              <div className="text-red-200 text-sm">Always Safe</div>
            </div>
          </div>
        </div>

        {/* Month Label */}
        <div className="mb-4 text-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700">
            {new Date().toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}{" "}
            Stats
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <StatCard
            number={summary?.total_enrollments || 0}
            title="Total Enrollments"
            icon={<Users className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="blue"
          />
          <StatCard
            number={`₱${(summary?.total_earnings || 0).toLocaleString()}`}
            title="Total Earnings"
            icon={<FaPesoSign className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="purple"
          />
          <StatCard
            number={summary?.no_instructor_assigned || 0}
            title="No Instructor Assigned"
            icon={<User className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="yellow"
          />
          <StatCard
            number={summary?.unpaid_count || 0}
            title="Unpaid Enrollments"
            icon={<CreditCard className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="green"
          />
          <StatCard
            number={`₱${(summary?.total_expenses || 0).toLocaleString()}`}
            title="Total Expenses"
            icon={<CreditCard className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="red"
          />
        </div>
      </div>
    </div>
  );

  // StatCard Component
  function StatCard({ number, title, icon, color }) {
    const colorClasses = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
      yellow: "bg-yellow-500 text-yellow-600 bg-yellow-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      red: "bg-red-500 text-red-600 bg-red-50",
    };

    const [iconBg, textColor, cardBg] = colorClasses[color].split(" ");

    return (
      <div
        className={`${cardBg} rounded-xl p-4 lg:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`${iconBg} p-2 lg:p-3 rounded-lg`}>
            <div className="text-white">{icon}</div>
          </div>
        </div>
        <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
          {number}
        </div>
        <div className={`${textColor} text-xs lg:text-sm font-medium`}>
          {title}
        </div>
      </div>
    );
  }
};

const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [rescheduleCurrentMonth, setRescheduleCurrentMonth] = useState(
    new Date()
  );
  const [loadingRescheduleSchedules, setLoadingRescheduleSchedules] =
    useState(false);

  useEffect(() => {
    fetchEnrollments();
    fetchInstructors();
  }, [showArchived]);
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let data;
      if (token) {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/admin/enrollments?show_archived=${showArchived}`, // ✅ ADD QUERY PARAM
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        data = response.data;
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/enrollments`
        );
        data = await response.json();
      }

      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/enrollments`
        );
        const data = await response.json();
        setEnrollments(data);
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/instructors`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInstructors(data);
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/instructors`
        );
        const data = await response.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/instructors`
        );
        const data = await response.json();
        setInstructors(data);
      } catch (fallbackError) {
        console.error("Fallback instructor fetch failed:", fallbackError);
      }
    }
  };

  const assignInstructor = async (enrollmentId, instructorId, resetSelect) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({
          title: "Error",
          text: "You need to be logged in to assign instructors.",
          icon: "error",
        });
        if (resetSelect) resetSelect();
        return;
      }

      const result = await Swal.fire({
        title: "Assign Instructor?",
        text: "Do you want to assign this instructor to the student?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, assign",
      });

      if (!result.isConfirmed) {
        if (resetSelect) resetSelect();
        return;
      }

      await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/admin/enrollments/${enrollmentId}/assign-instructor`,
        { instructor_id: instructorId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        title: "Success!",
        text: "Instructor assigned successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchEnrollments();
    } catch (error) {
      console.error("Error assigning instructor:", error);
      await Swal.fire({
        title: "Error",
        text: "Failed to assign instructor. Instructor may already be assigned.",
        icon: "error",
      });

      if (resetSelect) resetSelect();
    }
  };

  // ✅ Calendar helper functions for reschedule
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getSchedulesForDate = (date, schedules) => {
    if (!date) return [];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return schedules.filter((s) => {
      const schedDate = s.start_date.split("T")[0];
      return schedDate === dateStr;
    });
  };

  const isDateSelected = (date, selectedSchedules) => {
    if (!date) return false;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return selectedSchedules.some((s) => {
      const schedDate = s.start_date.split("T")[0];
      return schedDate === dateStr;
    });
  };

  const previousRescheduleMonth = () => {
    setRescheduleCurrentMonth(
      new Date(
        rescheduleCurrentMonth.getFullYear(),
        rescheduleCurrentMonth.getMonth() - 1
      )
    );
  };

  const nextRescheduleMonth = () => {
    setRescheduleCurrentMonth(
      new Date(
        rescheduleCurrentMonth.getFullYear(),
        rescheduleCurrentMonth.getMonth() + 1
      )
    );
  };

  const updateAmountPaid = async (enrollmentId, value, resetValue) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to update amounts.");
        if (resetValue) resetValue();
        return;
      }

      const result = await Swal.fire({
        title: `Update the amount paid to ₱${value}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Update",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        await axios.patch(
          `${
            import.meta.env.VITE_API_URL
          }/admin/enrollments/${enrollmentId}/amount-paid`,
          { amount_paid: value },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await Swal.fire(" Success", "Amount paid updated.", "success");
        fetchEnrollments();
      } else {
        if (resetValue) resetValue();
      }
    } catch (error) {
      console.error("Error updating amount:", error);
      await Swal.fire("❌ Error", "Error updating amount paid.", "error");
      if (resetValue) resetValue();
    }
  };

  const updatePaymentStatus = async (enrollmentId, status, resetStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to update payment status.");
        if (resetStatus) resetStatus();
        return;
      }

      const currentEnrollment = enrollments.find(
        (e) => e.enrollment_id === enrollmentId
      );

      // Prevent changing from "Fully Paid" back to "Not Fully Paid"
      if (
        currentEnrollment?.payment_status?.toLowerCase() === "fully paid" &&
        status === "Not Fully Paid"
      ) {
        await Swal.fire({
          title: "Cannot Change Status",
          text: "Payment status cannot be changed from 'Fully Paid' to 'Not Fully Paid'.",
          icon: "error",
        });
        if (resetStatus) resetStatus();
        return;
      }

      // ✅ DAGDAG CONFIRMATION DIALOG
      const result = await Swal.fire({
        title: `Update payment status to "${status}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Update",
        cancelButtonText: "No",
      });

      if (!result.isConfirmed) {
        if (resetStatus) resetStatus();
        return;
      }

      // ✅ ACTUAL UPDATE REQUEST (TO NAWALA MO!)
      await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/admin/enrollments/${enrollmentId}/payment-status`,
        { payment_status: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire("✅ Success", "Payment status updated.", "success");
      fetchEnrollments();
    } catch (error) {
      console.error("Error updating payment status:", error);
      await Swal.fire("❌ Error", "Error updating payment status.", "error");
      if (resetStatus) resetStatus();
    }
  };

  const updateEnrollmentStatus = async (
    enrollmentId,
    newStatus,
    resetStatus
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({
          title: "Error",
          text: "You need to be logged in to update status.",
          icon: "error",
        });
        if (resetStatus) resetStatus();
        return;
      }

      const statusLabel =
        newStatus === "passed/completed" ? "Passed/Completed" : "Failed";

      const result = await Swal.fire({
        title: `Mark as ${statusLabel}?`,
        text: `Are you sure you want to mark this student as ${statusLabel}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:
          newStatus === "passed/completed" ? "#10b981" : "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, mark as ${statusLabel}`,
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        if (resetStatus) resetStatus();
        return;
      }

      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/admin/enrollments/${enrollmentId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        title: "Success!",
        text: `Student status updated to ${statusLabel}.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchEnrollments();
    } catch (error) {
      console.error("Error updating enrollment status:", error);
      await Swal.fire({
        title: "Error",
        text:
          error.response?.data?.error ||
          "Failed to update status. Please try again.",
        icon: "error",
      });
      if (resetStatus) resetStatus();
    }
  };

  const archiveEnrollment = async (enrollmentId, studentName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({
          title: "Authentication Error",
          text: "You need to be logged in.",
          icon: "error",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Archive Enrollment?",
        text: `Archive the enrollment for ${studentName}? This will hide it from the list.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Yes, archive",
      });

      if (!result.isConfirmed) return;

      await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/admin/enrollments/${enrollmentId}/archive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        title: "Archived!",
        text: "Enrollment has been archived.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchEnrollments();
    } catch (error) {
      console.error("Error archiving:", error);
      await Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Failed to archive.",
        icon: "error",
      });
    }
  };

  const unarchiveEnrollment = async (enrollmentId, studentName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({
          title: "Authentication Error",
          text: "You need to be logged in.",
          icon: "error",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Restore Enrollment?",
        text: `Restore the enrollment for ${studentName}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        confirmButtonText: "Yes, restore",
      });

      if (!result.isConfirmed) return;

      await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/admin/enrollments/${enrollmentId}/unarchive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        title: "Restored!",
        text: "Enrollment has been restored.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchEnrollments();
    } catch (error) {
      console.error("Error unarchiving:", error);
      await Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Failed to restore.",
        icon: "error",
      });
    }
  };

  const handleReschedule = async (enrollment) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({
          title: "Error",
          text: "You need to be logged in to reschedule.",
          icon: "error",
        });
        return;
      }

      // Reset month to current when starting reschedule
      setRescheduleCurrentMonth(new Date());

      // Get course details
      const courseRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/courses/${enrollment.course_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const course = courseRes.data;
      const scheduleConfig = course.schedule_config
        ? typeof course.schedule_config === "string"
          ? JSON.parse(course.schedule_config)
          : course.schedule_config
        : [{ day: 1, hours: 4, time: "flexible" }];

      const requiredSchedules =
        course.required_schedules || scheduleConfig.length;

      // ✅ GET CURRENT SCHEDULES OF STUDENT
      const currentSchedulesRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/enrollments/${
          enrollment.enrollment_id
        }/schedules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const currentSchedules = currentSchedulesRes.data;

      if (currentSchedules.length === 0) {
        await Swal.fire({
          title: "No Schedules Found",
          text: "This student has no existing schedules to reschedule.",
          icon: "info",
        });
        return;
      }

      // ✅ ASK ADMIN WHICH DAYS TO RESCHEDULE
      const daySelectionHtml = `
  <div class="text-left">
    <p class="mb-4 text-gray-700">Select which day(s) to reschedule:</p>
    <div class="space-y-3">
      ${currentSchedules
        .map((sched, index) => {
          const date = new Date(sched.start_date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return `
          <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input 
              type="checkbox" 
              value="${index}" 
              class="day-checkbox w-4 h-4 text-blue-600 rounded mr-3"
              checked
            />
            <div class="flex-1">
              <div class="font-semibold text-gray-900">Day ${index + 1}</div>
              <div class="text-sm text-gray-600">${date}</div>
              <div class="text-xs text-gray-500">${fmtTime(
                sched.start_time
              )} - ${fmtTime(sched.end_time)}</div>
            </div>
          </label>
        `;
        })
        .join("")}
    </div>
  </div>
`;

      const daySelectionResult = await Swal.fire({
        title: "Select Days to Reschedule",
        html: daySelectionHtml,
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        width: "600px",
        preConfirm: () => {
          const checkboxes = document.querySelectorAll(".day-checkbox:checked");
          const selectedIndices = Array.from(checkboxes).map((cb) =>
            parseInt(cb.value)
          );

          if (selectedIndices.length === 0) {
            Swal.showValidationMessage(
              "Please select at least one day to reschedule"
            );
            return false;
          }

          return selectedIndices;
        },
      });

      if (!daySelectionResult.isConfirmed) return;

      const daysToReschedule = daySelectionResult.value;

      // ✅ BUILD NEW SCHEDULES ARRAY (KEEP UNCHANGED, REPLACE SELECTED)
      const newScheduleIds = [...currentSchedules.map((s) => s.schedule_id)];

      // Get all available schedules
      setLoadingRescheduleSchedules(true);

      // ✅ Check if theoretical course BEFORE the calendar loop
      const isTheoreticalCourse =
        course.is_theoretical === 1 ||
        course.mode === "ftof" ||
        course.course_name?.toLowerCase().includes("theoretical");

      const schedRes = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/schedules/with-availability?course_id=${enrollment.course_id}${
          isTheoreticalCourse ? "&is_theoretical=true" : ""
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let allSchedules = schedRes.data;
      setLoadingRescheduleSchedules(false);

      if (allSchedules.length === 0) {
        await Swal.fire({
          title: "No Schedules Available",
          text: "There are no available schedules for this course at the moment.",
          icon: "info",
        });
        return;
      }

      // Filter out past schedules
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      allSchedules = allSchedules.filter((s) => {
        const scheduleDateStr = s.start_date.split("T")[0];
        const [year, month, day] = scheduleDateStr.split("-").map(Number);
        const schedDate = new Date(year, month - 1, day);
        schedDate.setHours(0, 0, 0, 0);
        return schedDate >= today && s.slots > 0;
      });

      // Helper functions
      const getScheduleDuration = (startTime, endTime) => {
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);
        const durationInMinutes =
          endHour * 60 + endMin - (startHour * 60 + startMin);
        const clockHours = durationInMinutes / 60;
        return clockHours >= 8 ? clockHours - 1 : clockHours;
      };

      const filterSchedulesForDay = (
        schedules,
        dayConfig,
        selectedSchedules = []
      ) => {
        return schedules.filter((s) => {
          const duration = getScheduleDuration(s.start_time, s.end_time);

          if (
            selectedSchedules.some((sel) => sel.schedule_id === s.schedule_id)
          )
            return false;

          if (selectedSchedules.length > 0) {
            const lastDate = new Date(
              selectedSchedules[selectedSchedules.length - 1].start_date
            );
            const currentDate = new Date(s.start_date);
            if (currentDate <= lastDate) return false;
          }

          if (Math.abs(dayConfig.hours - duration) > 0.05) return false;

          if (dayConfig.time && dayConfig.time !== "flexible") {
            const startHour = parseInt(s.start_time.split(":")[0]);
            if (dayConfig.time === "morning" && startHour !== 8) return false;
            if (dayConfig.time === "afternoon" && startHour !== 13)
              return false;
          }

          return true;
        });
      };

      // ✅ SELECT SCHEDULES WITH CALENDAR VIEW
      // ✅ SELECT SCHEDULES WITH CALENDAR VIEW
      const selectedSchedules = [];

      // ✅ ONLY LOOP THROUGH SELECTED DAYS
      for (let i = 0; i < daysToReschedule.length; i++) {
        const dayIndex = daysToReschedule[i];
        const currentConfig = scheduleConfig[dayIndex];

        let selectedScheduleId = null;
        let userCancelled = false;

        // Keep showing calendar until user selects a schedule or cancels
        while (!selectedScheduleId && !userCancelled) {
          const availableForDay = filterSchedulesForDay(
            allSchedules,
            currentConfig,
            selectedSchedules
          );

          if (availableForDay.length === 0) {
            await Swal.fire({
              title: "No Schedules Available",
              text: `No available schedules found for Day ${dayIndex + 1}.`,
              icon: "error",
            });
            return;
          }

          // ✅ CALENDAR VIEW HTML
          const calendarHTML = `
          <div class="text-left">
            <!-- Month Navigation -->
            <div class="flex items-center justify-between mb-4 px-2">
              <button type="button" id="prevMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <h4 id="monthYear" class="text-xl font-bold text-gray-800"></h4>
              <button type="button" id="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Calendar Grid -->
            <div class="border border-gray-300 rounded-lg overflow-hidden">
              <!-- Day Headers -->
              <div class="grid grid-cols-7 bg-gray-100">
                ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                  .map(
                    (day) =>
                      `<div class="p-3 text-center font-semibold text-gray-700 text-sm border-r border-gray-300 last:border-r-0">${day}</div>`
                  )
                  .join("")}
              </div>
              <!-- Calendar Days -->
              <div id="calendarDays" class="grid grid-cols-7"></div>
            </div>
          </div>
        `;

          const result = await Swal.fire({
            title: `Select Schedule for Day ${dayIndex + 1}`,
            html: calendarHTML,
            showCancelButton: dayIndex > 0,
            showConfirmButton: false,
            cancelButtonText: "Back",
            width: "700px",
            didOpen: () => {
              let currentMonth = new Date(rescheduleCurrentMonth);

              const updateCalendar = () => {
                const monthYearEl = document.getElementById("monthYear");
                monthYearEl.textContent = currentMonth.toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                );

                const daysEl = document.getElementById("calendarDays");
                const days = getDaysInMonth(currentMonth);

                daysEl.innerHTML = days
                  .map((date, index) => {
                    if (!date) {
                      return '<div class="min-h-24 p-2 border-r border-b border-gray-300 bg-gray-50"></div>';
                    }

                    const daySchedules = getSchedulesForDate(
                      date,
                      availableForDay
                    );
                    const isPast = date < new Date().setHours(0, 0, 0, 0);
                    const isSelected = isDateSelected(date, selectedSchedules);

                    let dayHTML = `<div class="min-h-24 p-2 border-r border-b border-gray-300 ${
                      isPast ? "bg-gray-100 opacity-50" : ""
                    } ${
                      isSelected ? "bg-red-100 border-2 border-red-500" : ""
                    }">`;
                    dayHTML += `<div class="text-sm font-semibold mb-1 ${
                      isPast ? "text-gray-400" : "text-gray-700"
                    }">${date.getDate()}</div>`;

                    if (daySchedules.length > 0 && !isPast) {
                      dayHTML += '<div class="space-y-1">';
                      daySchedules.forEach((schedule) => {
                        const isAlreadySelected = selectedSchedules.some(
                          (s) => s.schedule_id === schedule.schedule_id
                        );

                        // ✅ Check availability based on course type
                        const isUnavailable = isTheoreticalCourse
                          ? schedule.slots === 0
                          : schedule.available_vehicles === 0 ||
                            schedule.available_vehicles === undefined;

                        dayHTML += `
    <button 
      type="button"
      data-schedule='${JSON.stringify(schedule)}'
      class="schedule-btn w-full text-left p-1.5 rounded text-xs transition-all ${
        isUnavailable
          ? "bg-red-300 cursor-not-allowed opacity-50"
          : isAlreadySelected
          ? "bg-green-500 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }"
      ${isUnavailable ? "disabled" : ""}
    >
      <div class="font-semibold">${fmtTime(schedule.start_time)} - ${fmtTime(
                          schedule.end_time
                        )}</div>
      <div class="text-xs opacity-90">
        <span>${schedule.slots} slot${schedule.slots !== 1 ? "s" : ""}</span>
        ${
          !isTheoreticalCourse && schedule.available_vehicles !== undefined
            ? ` | <span class="font-semibold">🚗 ${schedule.available_vehicles}</span>`
            : ""
        }
      </div>
    </button>
  `;
                      });
                      dayHTML += "</div>";
                    }

                    dayHTML += "</div>";
                    return dayHTML;
                  })
                  .join("");

                // Add click handlers for schedule buttons
                document.querySelectorAll(".schedule-btn").forEach((btn) => {
                  btn.addEventListener("click", () => {
                    const schedule = JSON.parse(btn.dataset.schedule);
                    selectedScheduleId = schedule.schedule_id;
                    Swal.clickConfirm();
                  });
                });
              };

              // Initial render
              updateCalendar();

              // Month navigation
              document
                .getElementById("prevMonth")
                .addEventListener("click", () => {
                  currentMonth = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  );
                  updateCalendar();
                });

              document
                .getElementById("nextMonth")
                .addEventListener("click", () => {
                  currentMonth = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  );
                  updateCalendar();
                });
            },
            preConfirm: () => {
              return selectedScheduleId;
            },
          });

          if (!result.isConfirmed) {
            if (selectedSchedules.length > 0) {
              selectedSchedules.pop();
              dayIndex -= 2;
              userCancelled = false;
              break;
            } else {
              return;
            }
          } else {
            // User selected a schedule
            selectedSchedules.push(
              availableForDay.find((s) => s.schedule_id === selectedScheduleId)
            );
          }
        }

        if (userCancelled) {
          return;
        }
      }

      // ✅ UPDATE THE NEW SCHEDULE IDS ARRAY
      daysToReschedule.forEach((dayIndex, i) => {
        newScheduleIds[dayIndex] = selectedSchedules[i].schedule_id;
      });

      // ✅ CONFIRMATION
      const summaryHtml = daysToReschedule
        .map((dayIndex, i) => {
          const sched = selectedSchedules[i];
          const date = new Date(sched.start_date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return `
      <div class="p-3 mb-2 border rounded-lg ${
        currentSchedules[dayIndex].schedule_id === sched.schedule_id
          ? "bg-gray-50"
          : "bg-blue-50"
      }">
        <div class="font-semibold text-sm text-gray-500 mb-1">Day ${
          dayIndex + 1
        }</div>
        <div class="font-semibold">${date}</div>
        <div class="text-sm text-gray-600">${fmtTime(
          sched.start_time
        )} - ${fmtTime(sched.end_time)}</div>
      </div>
    `;
        })
        .join("");

      const confirmResult = await Swal.fire({
        title: "Confirm Reschedule",
        html: `
        <div class="text-left">
          <p class="mb-3 text-gray-700">Reschedule <strong>${enrollment.student_name}</strong> to:</p>
          ${summaryHtml}
        </div>
      `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, reschedule",
        cancelButtonText: "Cancel",
      });

      if (!confirmResult.isConfirmed) return;

      // Send reschedule request
      // Send reschedule request
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/enrollments/${
          enrollment.enrollment_id
        }/reschedule`,
        { new_schedule_ids: newScheduleIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        title: "Success!",
        text: "Student has been rescheduled successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchEnrollments();
    } catch (error) {
      console.error("Error rescheduling:", error);
      await Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Failed to reschedule.",
        icon: "error",
      });
    }
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const fmtTime = (t) => {
    if (!t) return "N/A";
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
  const formatSchedule = (e) => {
    console.log("🔍 Formatting schedule for:", e.student_name);
    console.log("📅 Raw start_date:", e.start_date);
    if (e.course_name === "ONLINE THEORETICAL DRIVING COURSE") {
      return "Online Course - Self-paced";
    }

    if (e.multiple_schedules && e.multiple_schedules.length > 0) {
      const scheduleDetails = e.multiple_schedules
        .map((s) => {
          // ✅ USE SAME AS STUDENT
          const formattedDate = new Date(s.start_date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          );

          const startTime = fmtTime(s.start_time)
            .replace(":00", "")
            .replace(" ", "");
          const endTime = fmtTime(s.end_time)
            .replace(":00", "")
            .replace(" ", "");

          return `${formattedDate} (${startTime}-${endTime})`;
        })
        .join(" | ");

      return scheduleDetails;
    }

    if (!e.start_date || !e.start_time || !e.end_time) {
      return e.schedule || "Schedule TBD";
    }

    const dateStr = e.start_date.split("T")[0];
    const dateParts = dateStr.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const startDate = new Date(year, month, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const startTime = fmtTime(e.start_time).replace(":00", "").replace(" ", "");
    const endTime = fmtTime(e.end_time).replace(":00", "").replace(" ", "");

    return `${startDate} (${startTime}-${endTime})`;
  };
  const getAvailableYears = () => {
    const years = new Set();
    enrollments.forEach((enrollment) => {
      if (enrollment.start_date) {
        const year = new Date(enrollment.start_date).getFullYear();
        years.add(year);
      }
      if (enrollment.created_at) {
        const year = new Date(enrollment.created_at).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const months = [
    { value: 0, name: "January" },
    { value: 1, name: "February" },
    { value: 2, name: "March" },
    { value: 3, name: "April" },
    { value: 4, name: "May" },
    { value: 5, name: "June" },
    { value: 6, name: "July" },
    { value: 7, name: "August" },
    { value: 8, name: "September" },
    { value: 9, name: "October" },
    { value: 10, name: "November" },
    { value: 11, name: "December" },
  ];

  const groupEnrollmentsBySchedule = (enrollments) => {
    const groups = enrollments.reduce((acc, enrollment) => {
      // ✅ Handle online courses separately
      if (
        enrollment.course_name?.toLowerCase().includes("online") &&
        enrollment.course_name?.toLowerCase().includes("theoretical")
      ) {
        const onlineKey = "online_course";
        if (!acc[onlineKey]) {
          acc[onlineKey] = {
            schedule: "Online Course - Self-paced",
            sortDate: new Date(0), // Put online courses first
            enrollments: [],
          };
        }
        acc[onlineKey].enrollments.push(enrollment);
        return acc;
      }

      // ✅ NEW: Use multiple_schedules to create unique group key
      let scheduleKey;
      let sortDate = new Date();

      if (
        enrollment.multiple_schedules &&
        enrollment.multiple_schedules.length > 0
      ) {
        // Create key based on ALL schedule dates for this enrollment
        const scheduleDates = enrollment.multiple_schedules
          .map((s) => s.start_date.split("T")[0])
          .sort()
          .join("_");
        scheduleKey = `multi_${scheduleDates}_${enrollment.course_id}`;

        // Use first schedule date for sorting
        const firstDateStr =
          enrollment.multiple_schedules[0].start_date.split("T")[0];
        const [year, month, day] = firstDateStr.split("-");
        sortDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Fallback to old method for single schedules
        scheduleKey = `${enrollment.start_date || "tbd"}_${
          enrollment.start_time || "tbd"
        }_${enrollment.end_time || "tbd"}_${
          enrollment.is_theoretical || false
        }`;

        if (enrollment.start_date) {
          const dateStr = enrollment.start_date.split("T")[0];
          const [year, month, day] = dateStr.split("-");
          sortDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
        }
      }

      if (!acc[scheduleKey]) {
        acc[scheduleKey] = {
          schedule: formatSchedule(enrollment),
          sortDate: sortDate,
          enrollments: [],
        };
      }
      acc[scheduleKey].enrollments.push(enrollment);
      return acc;
    }, {});

    return Object.values(groups).sort((a, b) => a.sortDate - b.sortDate);
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Auto-hide completed AND fully paid enrollments
    const isCompleted =
      enrollment.status?.toLowerCase() === "completed" ||
      enrollment.status?.toLowerCase() === "passed/completed";
    const isFullyPaid =
      enrollment.payment_status?.toLowerCase() === "fully paid";

    if (isCompleted && isFullyPaid) {
      return false;
    }

    const matchesSearch =
      (enrollment.student_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        enrollment.course_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) ??
      false;

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "paid" &&
        enrollment.payment_status?.toLowerCase() === "fully paid") ||
      (filterStatus === "unpaid" &&
        enrollment.payment_status?.toLowerCase() !== "fully paid") ||
      (filterStatus === "assigned" && enrollment.instructor_id) ||
      (filterStatus === "unassigned" && !enrollment.instructor_id) ||
      (filterStatus === "pending" &&
        enrollment.status?.toLowerCase() === "pending") ||
      (filterStatus === "approved" &&
        enrollment.status?.toLowerCase() === "approved") ||
      (filterStatus === "completed" &&
        enrollment.status?.toLowerCase() === "completed");

    let matchesDate = true;
    if (selectedMonth !== "all" || selectedYear !== "all") {
      const enrollmentDate = enrollment.start_date
        ? new Date(enrollment.start_date)
        : enrollment.created_at
        ? new Date(enrollment.created_at)
        : null;

      if (enrollmentDate) {
        const enrollmentMonth = enrollmentDate.getMonth();
        const enrollmentYear = enrollmentDate.getFullYear();

        const monthMatches =
          selectedMonth === "all" ||
          enrollmentMonth === parseInt(selectedMonth);
        const yearMatches =
          selectedYear === "all" || enrollmentYear === parseInt(selectedYear);

        matchesDate = monthMatches && yearMatches;
      } else {
        matchesDate = selectedMonth === "all" && selectedYear === "all";
      }
    }

    return matchesSearch && matchesFilter && matchesDate;
  });

  const groupedEnrollments = groupEnrollmentsBySchedule(filteredEnrollments);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "fully paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "not fully paid":
        return "bg-red-100 text-red-800 border-red-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "passed/completed":
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isOnlineTheoretical = (courseName) => {
    return (
      courseName?.toLowerCase().includes("online") &&
      courseName?.toLowerCase().includes("theoretical")
    );
  };

  const assignedInstructorIds = enrollments
    .filter((e) => e.instructor_id !== null)
    .map((e) => e.instructor_id);

  const hasAdminFeatures = localStorage.getItem("token");
  const availableYears = getAvailableYears();

  const renderEnrollmentRow = (e) => (
    <tr key={e.enrollment_id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-700">
                {e.student_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "N/A"}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {e.student_name || "N/A"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{e.course_name || "N/A"}</div>
      </td>
      <td className="px-6 py-4">
        {isOnlineTheoretical(e.course_name) ? (
          <span className="text-sm text-gray-500 italic">N/A (Online)</span>
        ) : hasAdminFeatures ? (
          <select
            value={e.instructor_id || ""}
            onChange={(ev) => {
              const instructorId = ev.target.value;
              const reset = () => (ev.target.value = e.instructor_id || "");
              assignInstructor(e.enrollment_id, instructorId, reset);
            }}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="" disabled>
              {e.instructor_name ? "Change Instructor" : "Assign Instructor"}
            </option>
            {instructors.map((i) => (
              <option key={i.user_id} value={i.user_id}>
                {i.name}
              </option>
            ))}
          </select>
        ) : e.instructor_name ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {e.instructor_name}
          </span>
        ) : (
          <span className="text-sm text-gray-500">Not assigned</span>
        )}
      </td>
      {hasAdminFeatures && (
        <>
          <td className="px-6 py-4">
            {e.proof_of_payment ? (
              <a
                href={`${import.meta.env.VITE_API_URL}/uploads/${
                  e.proof_of_payment
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${
                    e.proof_of_payment
                  }`}
                  alt="Proof of Payment"
                  className="h-12 w-12 object-cover rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all hover:scale-105"
                />
              </a>
            ) : (
              <span className="text-gray-400 italic text-sm">No proof</span>
            )}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">₱</span>
              <input
                type="number"
                defaultValue={e.amount_paid || ""}
                onBlur={(ev) => {
                  const value = parseFloat(ev.target.value);
                  if (!isNaN(value)) {
                    const reset = () => (ev.target.value = e.amount_paid || "");
                    updateAmountPaid(e.enrollment_id, value, reset);
                  }
                }}
                className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </td>
          <td className="px-6 py-4">
            <select
              defaultValue={e.payment_status || "Not Fully Paid"}
              onChange={(ev) => {
                const value = ev.target.value;
                const reset = () =>
                  (ev.target.value = e.payment_status || "Not Fully Paid");
                updatePaymentStatus(e.enrollment_id, value, reset);
              }}
              className={`text-sm border rounded-full px-3 py-1 font-medium ${getStatusColor(
                e.payment_status
              )}`}
              disabled={e.payment_status?.toLowerCase() === "fully paid"}
            >
              <option
                value="Not Fully Paid"
                disabled={e.payment_status?.toLowerCase() === "fully paid"}
              >
                Not Fully Paid
              </option>
              <option value="Fully Paid">Fully Paid</option>
            </select>
          </td>
        </>
      )}
      <td className="px-6 py-4">
        {hasAdminFeatures && isOnlineTheoretical(e.course_name) ? (
          <select
            value={e.status || "approved"}
            onChange={(ev) => {
              const value = ev.target.value;
              const reset = () => (ev.target.value = e.status || "approved");
              updateEnrollmentStatus(e.enrollment_id, value, reset);
            }}
            className={`text-sm border rounded-full px-3 py-1 font-medium ${getStatusColor(
              e.status
            )}`}
          >
            <option value="approved">Approved</option>
            <option value="passed/completed">Passed/Completed</option>
            <option value="failed">Failed</option>
          </select>
        ) : (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              e.status
            )}`}
          >
            {e.status || "N/A"}
          </span>
        )}
      </td>
      {hasAdminFeatures && (
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {/* ✅ DAGDAG TO - Reschedule Button */}
            {!isOnlineTheoretical(e.course_name) && (
              <button
                onClick={() => handleReschedule(e)}
                className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                title="Reschedule student"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Reschedule
              </button>
            )}
            {showArchived ? (
              <button
                onClick={() =>
                  unarchiveEnrollment(e.enrollment_id, e.student_name)
                }
                className="inline-flex items-center justify-center px-3 py-1.5 border border-green-300 text-xs sm:text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex-1 sm:flex-initial"
                title="Restore enrollment"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Restore
              </button>
            ) : (
              <button
                onClick={() =>
                  archiveEnrollment(e.enrollment_id, e.student_name)
                }
                className="inline-flex items-center justify-center px-3 py-1.5 border border-orange-300 text-xs sm:text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 flex-1 sm:flex-initial"
                title="Archive enrollment"
              >
                <Archive className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Archive
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );

  const renderMobileCard = (e) => (
    <div
      key={e.enrollment_id}
      className="bg-gray-50 rounded-lg p-3 sm:p-4 ml-2 sm:ml-4 border-l-4 border-red-400"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center flex-1 min-w-0">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-200 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
            <span className="text-xs sm:text-sm font-medium text-red-700">
              {e.student_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "N/A"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
              {e.student_name || "N/A"}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {e.course_name || "N/A"}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(
            hasAdminFeatures ? e.payment_status : e.status
          )}`}
        >
          {hasAdminFeatures ? e.payment_status || "N/A" : e.status || "N/A"}
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {/* Instructor */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Instructor:
          </span>
          {isOnlineTheoretical(e.course_name) ? (
            <span className="text-xs sm:text-sm text-gray-500 italic">
              N/A (Online)
            </span>
          ) : hasAdminFeatures ? (
            <select
              value={e.instructor_id || ""}
              onChange={(ev) => {
                const instructorId = ev.target.value;
                const reset = () => (ev.target.value = e.instructor_id || "");
                assignInstructor(e.enrollment_id, instructorId, reset);
              }}
              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 w-full sm:w-auto"
            >
              <option value="" disabled>
                {e.instructor_name ? "Change" : "Assign"}
              </option>
              {instructors.map((i) => (
                <option key={i.user_id} value={i.user_id}>
                  {i.name}
                </option>
              ))}
            </select>
          ) : e.instructor_name ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {e.instructor_name}
            </span>
          ) : (
            <span className="text-xs sm:text-sm text-gray-500">
              Not assigned
            </span>
          )}
        </div>

        {hasAdminFeatures && (
          <>
            {/* Amount */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                Amount:
              </span>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-500 mr-1">₱</span>
                <input
                  type="number"
                  defaultValue={e.amount_paid || ""}
                  onBlur={(ev) => {
                    const value = parseFloat(ev.target.value);
                    if (!isNaN(value)) {
                      const reset = () =>
                        (ev.target.value = e.amount_paid || "");
                      updateAmountPaid(e.enrollment_id, value, reset);
                    }
                  }}
                  className="w-full sm:w-24 text-xs sm:text-sm border border-gray-300 rounded px-2 py-1"
                />
              </div>
            </div>

            {/* Payment Proof */}
            {e.proof_of_payment && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Payment Proof:
                </span>

                <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${
                    e.proof_of_payment
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${
                      e.proof_of_payment
                    }`}
                    alt="Proof"
                    className="h-12 w-12 sm:h-10 sm:w-10 object-cover rounded-lg border-2 border-gray-200 hover:border-red-400 transition-colors"
                  />
                </a>
              </div>
            )}
          </>
        )}

        {/* Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Status:
          </span>
          {hasAdminFeatures && isOnlineTheoretical(e.course_name) ? (
            <select
              value={e.status || "approved"}
              onChange={(ev) => {
                const value = ev.target.value;
                const reset = () => (ev.target.value = e.status || "approved");
                updateEnrollmentStatus(e.enrollment_id, value, reset);
              }}
              className={`text-xs sm:text-sm border rounded-full px-2 py-1 font-medium w-full sm:w-auto ${getStatusColor(
                e.status
              )}`}
            >
              <option value="approved">Approved</option>
              <option value="passed/completed">Passed/Completed</option>
              <option value="failed">Failed</option>
            </select>
          ) : (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                e.status
              )}`}
            >
              {e.status || "N/A"}
            </span>
          )}
        </div>

        {/* Actions */}
        {hasAdminFeatures && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-gray-200">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              Actions:
            </span>
            <div className="flex gap-2">
              {!isOnlineTheoretical(e.course_name) && (
                <button
                  onClick={() => handleReschedule(e)}
                  className="inline-flex items-center justify-center px-3 py-1.5 border border-blue-300 text-xs sm:text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex-1 sm:flex-initial"
                  title="Reschedule student"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Reschedule
                </button>
              )}
              <button
                onClick={() =>
                  archiveEnrollment(e.enrollment_id, e.student_name)
                }
                className="inline-flex items-center justify-center px-3 py-1.5 border border-orange-300 text-xs sm:text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 flex-1 sm:flex-initial"
                title="Archive enrollment"
              >
                <Archive className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Archive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Enrollment Management
              </h1>
            </div>

            {/* ✅ ADD THIS TOGGLE BUTTON */}
            {hasAdminFeatures && (
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showArchived
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Archive className="h-4 w-4" />
                {showArchived ? "Show Active" : "Show Archived"}
              </button>
            )}
          </div>
          <p className="text-gray-600">
            {hasAdminFeatures
              ? showArchived
                ? "View archived enrollments"
                : "Manage student enrollments, instructor assignments, and payment tracking"
              : "View student enrollments and their details"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New Enrollees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    enrollments.filter((e) => {
                      const isCompleted =
                        e.status?.toLowerCase() === "completed" ||
                        e.status?.toLowerCase() === "passed/completed";
                      const isFullyPaid =
                        e.payment_status?.toLowerCase() === "fully paid";
                      return !(isCompleted && isFullyPaid);
                    }).length
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed & Paid
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    enrollments.filter((e) => {
                      const isCompleted =
                        e.status?.toLowerCase() === "completed" ||
                        e.status?.toLowerCase() === "passed/completed";
                      const isFullyPaid =
                        e.payment_status?.toLowerCase() === "fully paid";
                      return isCompleted && isFullyPaid;
                    }).length
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {hasAdminFeatures ? "Pending Payment" : "Pending"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {hasAdminFeatures
                    ? enrollments.filter(
                        (e) => e.payment_status?.toLowerCase() !== "fully paid"
                      ).length
                    : enrollments.filter((e) => e.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* First row: Search and Status filter */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="lg:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Enrollments</option>
                    {hasAdminFeatures ? (
                      <>
                        <option value="paid">Fully Paid</option>
                        <option value="unpaid">Pending Payment</option>
                        <option value="assigned">With Instructor</option>
                        <option value="unassigned">No Instructor</option>
                      </>
                    ) : (
                      <>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Second row: Date filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Months</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Clear filters button */}
              {(searchTerm ||
                filterStatus !== "all" ||
                selectedMonth !== "all" ||
                selectedYear !== "all") && (
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setSelectedMonth("all");
                      setSelectedYear("all");
                    }}
                    className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Filter summary */}
            {(searchTerm ||
              filterStatus !== "all" ||
              selectedMonth !== "all" ||
              selectedYear !== "all") && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {filterStatus}
                  </span>
                )}
                {selectedMonth !== "all" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Month:{" "}
                    {
                      months.find((m) => m.value === parseInt(selectedMonth))
                        ?.name
                    }
                  </span>
                )}
                {selectedYear !== "all" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Year: {selectedYear}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  ({filteredEnrollments.length} result
                  {filteredEnrollments.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Grouped Enrollments - Desktop View */}
        <div className="hidden lg:block space-y-8 mb-8">
          {groupedEnrollments.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Schedule Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center text-white">
                  <Calendar className="h-5 w-5 mr-3" />
                  <h3 className="text-lg font-semibold">{group.schedule}</h3>
                  <span className="ml-auto bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-white-500">
                    {group.enrollments.length} students
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      {hasAdminFeatures && (
                        <>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Proof
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Status
                          </th>
                        </>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress{" "}
                      </th>
                      {hasAdminFeatures && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {group.enrollments.map(renderEnrollmentRow)}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Grouped Enrollments - Mobile View */}
        <div className="lg:hidden space-y-6 mb-8">
          {groupedEnrollments.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Schedule Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3">
                <div className="flex items-center text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  <h3 className="font-semibold text-sm">{group.schedule}</h3>
                  <span className="ml-auto bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {group.enrollments.length}
                  </span>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="p-4 space-y-4">
                {group.enrollments.map(renderMobileCard)}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {groupedEnrollments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No enrollments found
            </h3>
            <p className="text-gray-500">
              {searchTerm ||
              filterStatus !== "all" ||
              selectedMonth !== "all" ||
              selectedYear !== "all"
                ? "Try adjusting your search or filters"
                : "No enrollments have been created yet"}
            </p>
          </div>
        )}

        {/* Assigned Instructors Section - Only show for admin users */}
        {hasAdminFeatures && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Assigned Instructors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors
                .filter((i) => assignedInstructorIds.includes(i.user_id))
                .map((i) => {
                  const assignedStudents = enrollments.filter(
                    (e) =>
                      e.instructor_id === i.user_id &&
                      e.status?.toLowerCase() !== "completed" &&
                      e.status?.toLowerCase() !== "passed/completed"
                  );

                  if (assignedStudents.length === 0) return null;

                  return (
                    <div
                      key={i.user_id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {i.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {assignedStudents.length} active student
                            {assignedStudents.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {assignedStudents.map((e) => (
                          <div
                            key={e.enrollment_id}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {e.student_name}
                              </div>
                              <div className="text-gray-600">
                                {e.course_name}
                              </div>
                              <div className="flex items-center text-gray-500 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span className="text-xs">
                                  {formatSchedule(e)}
                                </span>
                              </div>
                              <div className="mt-2">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                    e.status
                                  )}`}
                                >
                                  {e.status || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>

            {instructors.filter((i) => {
              const activeStudents = enrollments.filter(
                (e) =>
                  e.instructor_id === i.user_id &&
                  e.status?.toLowerCase() !== "completed" &&
                  e.status?.toLowerCase() !== "passed/completed"
              );
              return (
                assignedInstructorIds.includes(i.user_id) &&
                activeStudents.length > 0
              );
            }).length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No active students assigned to instructors
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Schedules = ({ currentUser }) => {
  const [activeMode, setActiveMode] = useState("single");
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
    is_theoretical: false,
    slots: "",
  });

  const [filters, setFilters] = useState({
    selectedMonth: new Date().getMonth(), // 0-11
    selectedYear: new Date().getFullYear(),
    scheduleType: "all", // "all", "practical", "theoretical"
    specificDate: "", // for exact date search
  });

  const getAvailableMonthsYears = () => {
    const monthsYears = new Set();
    schedules.forEach((schedule) => {
      const date = new Date(schedule.start_date);
      monthsYears.add(`${date.getFullYear()}-${date.getMonth()}`);
    });
    return Array.from(monthsYears).sort();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const getFilteredSchedules = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return schedules
      .filter((schedule) => {
        // Convert DB date to local date
        const scheduleDate = new Date(schedule.start_date);
        const localYear = scheduleDate.getFullYear();
        const localMonth = scheduleDate.getMonth();
        const localDay = scheduleDate.getDate();

        // Create clean local date for comparison
        const cleanScheduleDate = new Date(localYear, localMonth, localDay);

        // Get local date string for specific date filter
        const localDateStr = `${localYear}-${String(localMonth + 1).padStart(
          2,
          "0"
        )}-${String(localDay).padStart(2, "0")}`;

        // DEBUG - tanggalin mo after
        if (filters.specificDate) {
          console.log("DB date:", schedule.start_date);
          console.log("Local date string:", localDateStr);
          console.log("Filter date:", filters.specificDate);
          console.log("Match?", localDateStr === filters.specificDate);
          console.log("---");
        }

        // Check if schedule is in the future or today
        if (cleanScheduleDate < today) return false;

        // Check if has available slots
        if (schedule.slots <= 0) return false;

        // Filter by selected month and year (use local date)
        const matchesMonthYear =
          localYear === filters.selectedYear &&
          localMonth === filters.selectedMonth;

        // Filter by specific date if set (use local date string)
        const matchesSpecificDate =
          !filters.specificDate || localDateStr === filters.specificDate;

        // Filter by type
        const matchesType =
          filters.scheduleType === "all" ||
          (filters.scheduleType === "practical" && !schedule.is_theoretical) ||
          (filters.scheduleType === "theoretical" && schedule.is_theoretical);

        return matchesMonthYear && matchesSpecificDate && matchesType;
      })
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  };
  const [bulkForm, setBulkForm] = useState({
    start_date: "",
    end_date: "",
    selected_days: [],
    start_time: "",
    end_time: "",
    is_theoretical: false,
    slots: "",
  });

  const [templates, setTemplates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState("");
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    icon: "🚗",
    start_time: "",
    end_time: "",
    is_theoretical: false,
    slots: "",
    color: "from-blue-500 to-blue-600",
  });

  useEffect(() => {
    const defaultTemplates = [
      {
        id: 1,
        name: "Full Day Practical",
        start_time: "08:00",
        end_time: "17:00",
        is_theoretical: false,
        slots: 4,
        color: "from-green-500 to-green-600",
      },
      {
        id: 2,
        name: "Morning Session",
        start_time: "08:00",
        end_time: "12:00",
        is_theoretical: false,
        slots: 4,
        color: "from-red-500 to-red-600",
      },
      {
        id: 3,
        name: "Afternoon Session",
        start_time: "13:00",
        end_time: "17:00",
        is_theoretical: false,
        slots: 4,
        color: "from-green-500 to-green-600",
      },
      {
        id: 4,
        name: "Theoretical Course",
        start_time: "08:00",
        end_time: "16:00",
        is_theoretical: true,
        slots: 20,
        color: "from-yellow-500 to-yellow-600",
      },
      {
        id: 5,
        name: "Theoretical Extended",
        start_time: "08:00",
        end_time: "17:00",
        is_theoretical: true,
        slots: 20,
        color: "from-red-500 to-red-600",
      },
    ];
    setTemplates(defaultTemplates);
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const token = window.localStorage?.getItem("token");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSchedules(data);
    } catch {
      setMessage("❌ Error fetching schedules.");
    }
  };

  const applyTemplate = (template) => {
    if (activeMode === "single") {
      setForm({
        ...form,
        start_time: template.start_time,
        end_time: template.end_time,
        is_theoretical: template.is_theoretical,
        slots: template.slots,
      });
    } else {
      setBulkForm({
        ...bulkForm,
        start_time: template.start_time,
        end_time: template.end_time,
        is_theoretical: template.is_theoretical,
        slots: template.slots,
      });
    }
    Swal.fire({
      icon: "success",
      title: "Template Applied!",
      text: `"${template.name}" settings loaded`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const saveTemplate = () => {
    if (
      !newTemplate.name ||
      !newTemplate.start_time ||
      !newTemplate.end_time ||
      !newTemplate.slots
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all template fields",
      });
      return;
    }

    const template = {
      id: Date.now(),
      ...newTemplate,
    };

    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);

    setNewTemplate({
      name: "",
      icon: "🚗",
      start_time: "",
      end_time: "",
      is_theoretical: false,
      slots: "",
      color: "from-blue-500 to-blue-600",
    });
    setShowTemplateManager(false);

    Swal.fire({
      icon: "success",
      title: "Template Saved!",
      text: `"${template.name}" added to templates`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const deleteTemplate = (id) => {
    Swal.fire({
      title: "Delete Template?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTemplates = templates.filter((t) => t.id !== id);
        setTemplates(updatedTemplates);
        Swal.fire("Deleted!", "Template has been removed.", "success");
      }
    });
  };

  const handleSingleSubmit = async () => {
    setMessage("");

    if (!form.date || !form.start_time || !form.end_time || !form.slots) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const duration = calculateDuration(form.start_time, form.end_time);
    if (duration.hours <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Time Range",
        text: "End time must be after start time!",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Create Schedule?",
      html: `
        <div class="text-left">
          <p><strong>Date:</strong> ${form.date}</p>
          <p><strong>Time:</strong> ${form.start_time} - ${form.end_time}</p>
          <p><strong>Duration:</strong> ${duration.hours} hour(s)</p>
          <p><strong>Slots:</strong> ${form.slots}</p>
          <p><strong>Type:</strong> ${
            form.is_theoretical ? "Theoretical" : "Practical"
          }</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/schedules`,
        {
          branch_id: currentUser?.branch_id || 1,
          created_by: currentUser?.user_id || 1,
          ...form,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Schedule Added!",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({
        date: "",
        start_time: "",
        end_time: "",
        is_theoretical: false,
        slots: "",
      });

      fetchSchedules();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    }
  };

  const handleBulkSubmit = async () => {
    setMessage("");

    if (
      !bulkForm.start_date ||
      !bulkForm.end_date ||
      !bulkForm.start_time ||
      !bulkForm.end_time ||
      !bulkForm.slots ||
      bulkForm.selected_days.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all fields and select at least one day",
      });
      return;
    }

    const duration = calculateDuration(bulkForm.start_time, bulkForm.end_time);
    if (duration.hours <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Time Range",
        text: "End time must be after start time!",
      });
      return;
    }

    const dates = generateDateRange(
      bulkForm.start_date,
      bulkForm.end_date,
      bulkForm.selected_days
    );

    if (dates.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Dates Generated",
        text: "No matching dates found in the selected range",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Create Multiple Schedules?",
      html: `
        <div class="text-left">
          <p><strong>Total Schedules:</strong> ${dates.length}</p>
          <p><strong>Dates:</strong> ${bulkForm.start_date} to ${
        bulkForm.end_date
      }</p>
          <p><strong>Days:</strong> ${getDayNames(bulkForm.selected_days).join(
            ", "
          )}</p>
          <p><strong>Time:</strong> ${bulkForm.start_time} - ${
        bulkForm.end_time
      }</p>
          <p><strong>Slots per schedule:</strong> ${bulkForm.slots}</p>
          <p><strong>Type:</strong> ${
            bulkForm.is_theoretical ? "Theoretical" : "Practical"
          }</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, create ${dates.length} schedules!`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      Swal.fire({
        title: "Creating Schedules...",
        html: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const promises = dates.map((date) =>
        axios.post(
          `${import.meta.env.VITE_API_URL}/schedules`,
          {
            branch_id: currentUser?.branch_id || 1,
            created_by: currentUser?.user_id || 1,
            date: date,
            start_time: bulkForm.start_time,
            end_time: bulkForm.end_time,
            is_theoretical: bulkForm.is_theoretical,
            slots: bulkForm.slots,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(promises);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${dates.length} schedules created successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setBulkForm({
        start_date: "",
        end_date: "",
        selected_days: [],
        start_time: "",
        end_time: "",
        is_theoretical: false,
        slots: "",
      });

      fetchSchedules();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || err.message,
      });
    }
  };

  const generateDateRange = (startDate, endDate, selectedDays) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = date.getDay();
      if (selectedDays.includes(dayOfWeek)) {
        dates.push(new Date(date).toISOString().split("T")[0]);
      }
    }

    return dates;
  };

  const getDayNames = (days) => {
    const names = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days.map((d) => names[d]);
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return { hours: 0, minutes: 0 };

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    const durationMin = endTotalMin - startTotalMin;
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;

    return { hours, minutes };
  };

  const formatTime12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatTime12HourShort = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}${period}`;
  };

  const toggleDay = (day) => {
    if (bulkForm.selected_days.includes(day)) {
      setBulkForm({
        ...bulkForm,
        selected_days: bulkForm.selected_days.filter((d) => d !== day),
      });
    } else {
      setBulkForm({
        ...bulkForm,
        selected_days: [...bulkForm.selected_days, day].sort(),
      });
    }
  };

  const colorOptions = [
    { value: "from-blue-500 to-blue-600", label: "Blue" },
    { value: "from-green-500 to-green-600", label: "Green" },
    { value: "from-purple-500 to-purple-600", label: "Purple" },
    { value: "from-pink-500 to-rose-600", label: "Pink" },
    { value: "from-yellow-500 to-orange-600", label: "Orange" },
    { value: "from-red-500 to-red-600", label: "Red" },
  ];

  const iconOptions = [
    "🚗",
    "🚙",
    "📚",
    "🌅",
    "🌆",
    "⭐",
    "🔥",
    "⚡",
    "🎯",
    "📖",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };
  const getSchedulesForDate = (date) => {
    if (!date) return [];

    // Get local date string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return schedules.filter((schedule) => {
      // Get date from DB and extract date part only
      const schedDateStr = schedule.start_date.split("T")[0];

      const schedDate = new Date(schedule.start_date);
      const localYear = schedDate.getFullYear();
      const localMonth = String(schedDate.getMonth() + 1).padStart(2, "0");
      const localDay = String(schedDate.getDate()).padStart(2, "0");
      const localDateStr = `${localYear}-${localMonth}-${localDay}`;

      return localDateStr === dateStr;
    });
  };
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const previousMonth = () => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() - 1
      )
    );
  };

  const nextMonth = () => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + 1
      )
    );
  };

  const goToToday = () => {
    setCurrentCalendarDate(new Date());
  };

  // Get schedules for current calendar month only
  const getSchedulesForCurrentMonth = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.start_date);
      scheduleDate.setHours(0, 0, 0, 0);

      return (
        scheduleDate.getFullYear() === year &&
        scheduleDate.getMonth() === month &&
        schedule.slots > 0 &&
        scheduleDate >= today
      );
    });
  };

  const handleDeleteSchedule = async (scheduleId) => {
    const result = await Swal.fire({
      title: "Delete Schedule?",
      text: "This action cannot be undone. All bookings for this schedule will be affected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      setSchedules((prevSchedules) =>
        prevSchedules.filter((s) => s.schedule_id !== scheduleId)
      );

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/schedules/${scheduleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Schedule has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchSchedules();
    } catch (err) {
      fetchSchedules();

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to delete schedule",
      });
    }
  };

  const CalendarView = () => (
    <div>
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b-2 border-red-200 p-2 sm:p-3 mb-3 sm:mb-4 rounded-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-1.5 sm:p-2 hover:bg-white/50 rounded-lg transition-all"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <div className="text-center">
            <h4 className="text-base sm:text-lg font-bold text-gray-800">
              {currentCalendarDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h4>
          </div>

          <button
            onClick={nextMonth}
            className="p-1.5 sm:p-2 hover:bg-white/50 rounded-lg transition-all"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-center mt-2 sm:mt-3">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Today
          </button>
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-1.5 sm:p-2 text-center font-bold text-gray-700 text-xs sm:text-sm border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {getDaysInMonth(currentCalendarDate).map((date, index) => {
            const daySchedules = getSchedulesForDate(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-24 sm:min-h-32 md:min-h-40 p-1 sm:p-2 md:p-3 border-r border-b border-gray-200 last:border-r-0 transition-all hover:bg-blue-50 ${
                  !date ? "bg-gray-50" : "bg-white"
                } ${isTodayDate ? "bg-red-50 border-red-300" : ""}`}
              >
                {date && (
                  <>
                    <div
                      className={`text-xs sm:text-sm font-bold mb-1 ${
                        isTodayDate
                          ? "text-red-600 bg-red-100 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
                          : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    {daySchedules.length > 0 && (
                      <div className="space-y-1">
                        {daySchedules.slice(0, 2).map((schedule) => (
                          <div
                            key={schedule.schedule_id}
                            className={`p-1 sm:p-1.5 rounded text-[9px] sm:text-xs shadow-sm ${
                              schedule.slots === 0
                                ? "bg-red-500 text-white"
                                : schedule.is_theoretical
                                ? "bg-yellow-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            <div className="font-semibold truncate">
                              {schedule.is_theoretical
                                ? "📚 Theore"
                                : "🚗 Practical"}
                            </div>
                            <div className="text-[8px] sm:text-[9px] opacity-90 flex items-center gap-0.5">
                              <Users className="w-2 h-2 sm:w-3 sm:h-3" />
                              {schedule.slots} slots
                            </div>
                            <div className="text-[8px] sm:text-[9px] opacity-85 flex items-center gap-0.5">
                              <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                              <span className="hidden sm:inline">
                                {formatTime12HourShort(schedule.start_time)} -{" "}
                                {formatTime12HourShort(schedule.end_time)}
                              </span>
                              <span className="sm:hidden">
                                {formatTime12HourShort(schedule.start_time)}
                              </span>
                            </div>
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-[8px] sm:text-[10px] text-red-600 font-bold text-center bg-red-100 rounded py-1">
                            +{daySchedules.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2 justify-center text-[10px] sm:text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Practical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Theoretical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-100 border border-red-600 rounded-full"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );

  const currentMonthSchedules = getFilteredSchedules();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-600 to-red-600 rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent mb-2">
            Schedule Manager
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">
            Create schedules faster with templates and bulk creation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setActiveMode("single")}
              className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                activeMode === "single"
                  ? "bg-gradient-to-r from-red-600 to-red-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Single Schedule</span>
                <span className="sm:hidden">Single</span>
              </div>
            </button>
            <button
              onClick={() => setActiveMode("bulk")}
              className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                activeMode === "bulk"
                  ? "bg-gradient-to-r from-red-600 to-red-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CalendarRange className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Bulk Creation</span>
                <span className="sm:hidden">Bulk</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-xl"></div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Quick Templates
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {templates.map((template) => (
              <div key={template.id} className="relative group">
                <button
                  onClick={() => applyTemplate(template)}
                  className={`w-full p-2 sm:p-3 md:p-4 bg-gradient-to-r ${template.color} rounded-lg sm:rounded-xl text-white shadow-md hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">
                    {template.icon}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm mb-1">
                    {template.name}
                  </div>
                  <div className="text-[10px] sm:text-xs opacity-90">
                    {formatTime12Hour(template.start_time)}-
                    {formatTime12Hour(template.end_time)}
                  </div>
                  <div className="text-[10px] sm:text-xs opacity-90">
                    {template.slots} slots
                  </div>
                </button>
                {template.id > 5 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form and Calendar Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Forms */}
          {activeMode === "single" && (
            <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 bg-red-100 rounded-xl">
                  <Plus className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Single Schedule
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={form.start_time}
                      onChange={(e) =>
                        setForm({ ...form, start_time: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={form.end_time}
                      onChange={(e) =>
                        setForm({ ...form, end_time: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Available Slots
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.slots}
                    onChange={(e) =>
                      setForm({ ...form, slots: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter number of slots"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={form.is_theoretical}
                    onChange={(e) =>
                      setForm({ ...form, is_theoretical: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-xs font-medium text-gray-700">
                    Theoretical Course
                  </label>
                </div>

                <button
                  onClick={handleSingleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Schedule
                </button>
              </div>
            </div>
          )}

          {activeMode === "bulk" && (
            <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 bg-purple-100 rounded-xl">
                  <CalendarRange className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Bulk Creation
                </h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={bulkForm.start_date}
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, start_date: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={bulkForm.end_date}
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, end_date: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Select Days of Week
                  </label>
                  <div className="grid grid-cols-7 gap-1">
                    {[
                      { day: 0, name: "Sun", short: "S" },
                      { day: 1, name: "Mon", short: "M" },
                      { day: 2, name: "Tue", short: "T" },
                      { day: 3, name: "Wed", short: "W" },
                      { day: 4, name: "Thu", short: "T" },
                      { day: 5, name: "Fri", short: "F" },
                      { day: 6, name: "Sat", short: "S" },
                    ].map(({ day, name, short }) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-1.5 rounded-lg font-semibold text-xs transition-all ${
                          bulkForm.selected_days.includes(day)
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="hidden sm:block">{name}</div>
                        <div className="sm:hidden">{short}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected:{" "}
                    {bulkForm.selected_days.length === 0
                      ? "None"
                      : getDayNames(bulkForm.selected_days).join(", ")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={bulkForm.start_time}
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, start_time: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={bulkForm.end_time}
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, end_time: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Slots per Schedule
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bulkForm.slots}
                    onChange={(e) =>
                      setBulkForm({ ...bulkForm, slots: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter number of slots"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={bulkForm.is_theoretical}
                    onChange={(e) =>
                      setBulkForm({
                        ...bulkForm,
                        is_theoretical: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-xs font-medium text-gray-700">
                    Theoretical Course
                  </label>
                </div>

                {bulkForm.start_date &&
                  bulkForm.end_date &&
                  bulkForm.selected_days.length > 0 && (
                    <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-900 text-sm">
                          Preview
                        </span>
                      </div>
                      <p className="text-xs text-green-800">
                        This will create{" "}
                        <strong>
                          {
                            generateDateRange(
                              bulkForm.start_date,
                              bulkForm.end_date,
                              bulkForm.selected_days
                            ).length
                          }{" "}
                          schedules
                        </strong>
                      </p>
                    </div>
                  )}

                <button
                  onClick={handleBulkSubmit}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <CalendarRange className="w-4 h-4" />
                  Create Multiple Schedules
                </button>
              </div>
            </div>
          )}

          {/* Calendar beside the form */}
          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-xl">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Calendar View
              </h2>
            </div>
            <CalendarView />
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.startsWith("✅")
                ? "bg-green-50 border-2 border-green-200 text-green-800"
                : "bg-red-50 border-2 border-red-200 text-red-800"
            }`}
          >
            {message.startsWith("✅") ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Upcoming Sessions for Current Month */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-xl">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                {filters.specificDate ? (
                  <>
                    {(() => {
                      const [year, month, day] = filters.specificDate
                        .split("-")
                        .map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                    })()}
                  </>
                ) : (
                  <>
                    {monthNames[filters.selectedMonth]} {filters.selectedYear}
                  </>
                )}{" "}
                Schedules
              </h2>
            </div>
            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] sm:text-xs font-medium self-start sm:ml-auto">
              {getFilteredSchedules().length} schedules
            </span>
          </div>

          {/* Enhanced Filter Section */}
          <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Filter Schedules
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Month Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  value={filters.selectedMonth}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      selectedMonth: parseInt(e.target.value),
                      specificDate: "", // clear specific date when changing month
                    })
                  }
                  className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={filters.selectedYear}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      selectedYear: parseInt(e.target.value),
                      specificDate: "", // clear specific date when changing year
                    })
                  }
                  className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Specific Date (Optional)
                </label>
                <input
                  type="date"
                  value={filters.specificDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      // Fix: Use the date string directly without timezone conversion
                      const [year, month, day] = e.target.value.split("-");
                      setFilters({
                        ...filters,
                        specificDate: e.target.value,
                        selectedMonth: parseInt(month) - 1, // month is 0-indexed
                        selectedYear: parseInt(year),
                      });
                    } else {
                      setFilters({
                        ...filters,
                        specificDate: "",
                      });
                    }
                  }}
                  className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Course Type
                </label>
                <select
                  value={filters.scheduleType}
                  onChange={(e) =>
                    setFilters({ ...filters, scheduleType: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Courses</option>
                  <option value="practical">🚗 Practical (PDC)</option>
                  <option value="theoretical">📚 Theoretical (TDC)</option>
                </select>
              </div>
            </div>

            {/* Stats and Clear Button */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <div className="flex gap-2 flex-1">
                <div className="px-3 py-1.5 bg-green-100 rounded-lg">
                  <span className="text-xs text-gray-600">PDC: </span>
                  <span className="text-sm font-bold text-green-700">
                    {
                      getFilteredSchedules().filter((s) => !s.is_theoretical)
                        .length
                    }
                  </span>
                </div>
                <div className="px-3 py-1.5 bg-purple-100 rounded-lg">
                  <span className="text-xs text-gray-600">TDC: </span>
                  <span className="text-sm font-bold text-purple-700">
                    {
                      getFilteredSchedules().filter((s) => s.is_theoretical)
                        .length
                    }
                  </span>
                </div>
                <div className="px-3 py-1.5 bg-blue-100 rounded-lg">
                  <span className="text-xs text-gray-600">Total: </span>
                  <span className="text-sm font-bold text-blue-700">
                    {getFilteredSchedules().length}
                  </span>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(filters.specificDate || filters.scheduleType !== "all") && (
                <button
                  onClick={() =>
                    setFilters({
                      selectedMonth: new Date().getMonth(),
                      selectedYear: new Date().getFullYear(),
                      scheduleType: "all",
                      specificDate: "",
                    })
                  }
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-all flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {currentMonthSchedules.length === 0 ? (
              <div className="text-center py-6 sm:py-8 md:py-12">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-100 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium">
                  No upcoming schedules for this month
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Create schedules to see them here
                </p>
              </div>
            ) : (
              currentMonthSchedules
                .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                .map((schedule) => (
                  <div
                    key={schedule.schedule_id}
                    className="p-3 sm:p-4 md:p-5 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 rounded-lg sm:rounded-xl hover:shadow-lg hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`p-1.5 sm:p-2 rounded-lg ${
                          schedule.is_theoretical
                            ? "bg-purple-100 text-purple-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {schedule.is_theoretical ? (
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">
                          {schedule.is_theoretical
                            ? "Theoretical"
                            : "Practical"}{" "}
                          Course
                        </h4>
                        <div className="flex flex-col gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span>
                              {new Date(schedule.start_date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span>
                              {formatTime12Hour(schedule.start_time)} -{" "}
                              {formatTime12Hour(schedule.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span>{schedule.slots} slots</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteSchedule(schedule.schedule_id)
                        }
                        className="p-1.5 sm:p-2 hover:bg-red-100 rounded-lg transition-all group"
                        title="Delete schedule"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [instructorStats, setInstructorStats] = useState([]);
  const [showInstructorStats, setShowInstructorStats] = useState(false);

  // Helper function to render stars
  const renderStars = (rating) => {
    if (!rating)
      return <span className="text-xs text-gray-500 italic">No rating</span>;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
        <span className="ml-1 text-xs font-semibold text-gray-700">
          {rating}/5
        </span>
      </div>
    );
  };

  // Calculate average rating
  const calculateAverageRating = (feedbackData) => {
    const validRatings = feedbackData.filter((fb) => fb.instructor_rating);
    if (validRatings.length === 0) return 0;
    const total = validRatings.reduce(
      (sum, fb) => sum + fb.instructor_rating,
      0
    );
    return (total / validRatings.length).toFixed(1);
  };

  // Calculate instructor statistics
  const calculateInstructorStats = (feedbackData) => {
    const stats = {};

    const feedbackWithRatings = feedbackData.filter(
      (fb) => fb.instructor_rating
    );

    feedbackWithRatings.forEach((fb) => {
      if (!stats[fb.instructor_name]) {
        stats[fb.instructor_name] = {
          name: fb.instructor_name,
          totalRating: 0,
          count: 0,
          ratings: [],
        };
      }

      stats[fb.instructor_name].totalRating += fb.instructor_rating;
      stats[fb.instructor_name].count += 1;
      stats[fb.instructor_name].ratings.push(fb.instructor_rating);
    });

    const instructorArray = Object.values(stats).map((instructor) => ({
      ...instructor,
      averageRating: (instructor.totalRating / instructor.count).toFixed(2),
    }));

    instructorArray.sort((a, b) => b.averageRating - a.averageRating);

    return instructorArray;
  };

  // Extract unique years from feedback data
  const extractAvailableYears = (data) => {
    const years = data.map((fb) => new Date(fb.created_at).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/feedback`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedbackList(data);
        setFilteredFeedback(data);
        setAvailableYears(extractAvailableYears(data));
      })
      .catch((err) => console.error("Error loading feedback:", err));
  }, []);

  // Filter feedback based on selected month and year
  useEffect(() => {
    let filtered = [...feedbackList];

    if (selectedMonth) {
      filtered = filtered.filter(
        (fb) =>
          new Date(fb.created_at).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (fb) => new Date(fb.created_at).getFullYear() === parseInt(selectedYear)
      );
    }

    setFilteredFeedback(filtered);
  }, [selectedMonth, selectedYear, feedbackList]);

  // Calculate instructor stats whenever filtered feedback changes
  useEffect(() => {
    if (filteredFeedback.length > 0) {
      const stats = calculateInstructorStats(filteredFeedback);
      setInstructorStats(stats);
    } else {
      setInstructorStats([]);
    }
  }, [filteredFeedback]);

  const handleResetFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  const averageRating = calculateAverageRating(filteredFeedback);
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              Student Feedback Management
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg mb-4">
              Review and manage student course evaluations
            </p>

            {/* Filters Section */}
            <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter Feedback
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Months</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                  <button
                    onClick={handleResetFilters}
                    disabled={!selectedMonth && !selectedYear}
                    className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {(selectedMonth || selectedYear) && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  <strong>Active Filters:</strong>{" "}
                  {selectedMonth &&
                    `${months.find((m) => m.value === selectedMonth)?.label} `}
                  {selectedYear && selectedYear}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <span className="text-red-700 font-medium text-sm sm:text-base">
                  Total Feedback: {filteredFeedback.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Performance Rankings */}
        {instructorStats.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowInstructorStats(!showInstructorStats)}
              className="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="hidden sm:inline">
                {showInstructorStats ? "Hide" : "View"} Instructor Performance
                Statistics {(selectedMonth || selectedYear) && "(Filtered)"}
              </span>
              <span className="sm:hidden">
                {showInstructorStats ? "Hide" : "View"} Rankings{" "}
                {(selectedMonth || selectedYear) && "(Filtered)"}
              </span>
            </button>
          </div>
        )}

        {showInstructorStats && instructorStats.length > 0 && (
          <div className="mb-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden sm:inline">
                Instructor Performance Rankings
              </span>
              <span className="sm:hidden">Rankings</span>
            </h3>
            {(selectedMonth || selectedYear) && (
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Showing results for{" "}
                {selectedMonth &&
                  months.find((m) => m.value === selectedMonth)?.label}{" "}
                {selectedYear}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {instructorStats.map((instructor, index) => (
                <div
                  key={instructor.name}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300"
                      : index === 2
                      ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <div className="text-xl sm:text-2xl">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                          {instructor.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {instructor.count} review
                          {instructor.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            star <= Math.round(instructor.averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-base sm:text-lg font-bold text-slate-800">
                      {instructor.averageRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredFeedback.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-16 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
              {feedbackList.length === 0
                ? "No Feedback Available"
                : "No Feedback Matches Your Filters"}
            </h3>
            <p className="text-slate-500 text-sm sm:text-base">
              {feedbackList.length === 0
                ? "Student feedback will appear here once submitted."
                : "Try adjusting your filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredFeedback.map((fb) => (
              <div
                key={fb.feedback_id}
                className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  {/* Date Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                      <p className="text-xs font-medium text-slate-600">
                        {new Date(fb.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
                  </div>

                  {/* Student Info */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-semibold text-xs sm:text-sm">
                          {fb.student_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="truncate">{fb.student_name}</span>
                    </h3>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
                          Course
                        </p>
                        <p className="font-semibold text-slate-800 text-sm sm:text-base break-words">
                          {fb.course_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
                          Instructor
                        </p>
                        <p className="font-semibold text-slate-800 text-sm sm:text-base break-words">
                          {fb.instructor_name}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                          Instructor Rating
                        </p>
                        {renderStars(fb.instructor_rating)}
                      </div>
                    </div>
                  </div>

                  {/* Comments Preview */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                      Feedback Comments
                    </p>
                    <p className="text-slate-700 leading-relaxed line-clamp-3 text-sm sm:text-base">
                      {fb.comments}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedFeedback(fb)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform group-hover:scale-[1.02] shadow-sm hover:shadow-md text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      View Complete Feedback
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-red-500 via-red-500 to-red-600"></div>
              </div>
            ))}
          </div>
        )}

        {selectedFeedback && (
          <FeedbackDetailsModal
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
          />
        )}
      </div>
    </div>
  );
};

const FeedbackDetailsModal = ({ feedback, onClose }) => {
  if (!feedback) return null;

  const renderStars = (rating) => {
    if (!rating)
      return (
        <span className="text-sm text-gray-500 italic">No rating provided</span>
      );

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-6 h-6 sm:w-7 sm:h-7 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
        <span className="ml-2 text-base sm:text-lg font-bold text-gray-700">
          {rating}/5
        </span>
      </div>
    );
  };

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

  const answerMap = {
    training_course: [
      feedback.training_course_q1,
      feedback.training_course_q2,
      feedback.training_course_q3,
      feedback.training_course_q4,
      feedback.training_course_q5,
    ],
    instructor_evaluation: [
      feedback.instructor_q1,
      feedback.instructor_q2,
      feedback.instructor_q3,
      feedback.instructor_q4,
      feedback.instructor_q5,
    ],
    admin_staff: [feedback.admin_q1, feedback.admin_q2, feedback.admin_q3],
    classroom: [
      feedback.classroom_q1,
      feedback.classroom_q2,
      feedback.classroom_q3,
      feedback.classroom_q4,
      feedback.classroom_q5,
    ],
    vehicle: [feedback.vehicle_q1, feedback.vehicle_q2, feedback.vehicle_q3],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start sm:items-center p-4 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 my-4 sm:my-0">
        <div className="flex justify-between items-center mb-4 sm:mb-5 sticky top-0 bg-white pb-2 border-b border-gray-100">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            Feedback Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-xl sm:text-2xl p-1"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Student
              </p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {feedback.student_name}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Course
              </p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {feedback.course_name}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Instructor
              </p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {feedback.instructor_name}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                Instructor Rating
              </p>
              {renderStars(feedback.instructor_rating)}
            </div>
          </div>
        </div>

        {feedback.instructor_rating && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                  Student Rating for {feedback.instructor_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Overall instructor performance rating
                </p>
              </div>
              {renderStars(feedback.instructor_rating)}
            </div>
          </div>
        )}

        {Object.entries(questions).map(([category, items], index) => (
          <div key={index} className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold capitalize text-red-700 mb-3 sticky top-16 bg-white py-1">
              {category.replace(/_/g, " ")}
            </h3>
            <div className="space-y-3">
              {items.map((question, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"
                >
                  <p className="font-medium text-gray-800 text-sm sm:text-base mb-2">
                    {i + 1}. {question}
                  </p>
                  <div className="ml-2 sm:ml-4">
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                      Answer:{" "}
                    </span>
                    <span className="text-gray-700 text-sm sm:text-base">
                      {answerMap[category]?.[i] || "No answer"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-2">
              Instructor Comments:
            </h4>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {feedback.instructor_comments || "None"}
            </p>
          </div>

          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-2">
              Additional Comments:
            </h4>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {feedback.comments || "None"}
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendancePage = () => {
  const [instructors, setInstructors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  const today = new Date().toISOString().split("T")[0];

  // Get available years from attendance data
  const getAvailableYears = () => {
    const years = attendance.map((record) =>
      new Date(record.date).getFullYear()
    );
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears;
  };

  // Get month options
  const months = [
    { value: "", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Mark attendance with SweetAlert2 confirmation
  const confirmMarkAttendance = (id, status) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to mark this instructor as ${status.toUpperCase()}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "present" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, mark ${status}`,
    }).then((result) => {
      if (result.isConfirmed) {
        markAttendance(id, status);
      }
    });
  };

  // Mark attendance
  const markAttendance = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/instructors/${id}/attendance`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${status.toUpperCase()} marked successfully.`,
        confirmButtonColor: "#3b82f6",
      });

      await loadAttendance();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error marking attendance.";

      // Error alert
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Load instructors
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in.");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/instructors`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInstructors(res.data);

        if (res.data.length === 0) {
          setError("No instructors found for your branch.");
        }
      } catch (err) {
        console.error("❌ Error loading instructors:", err);
        setError(err.response?.data?.message || "Error loading instructors.");
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, []);

  // Load attendance records
  const loadAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/instructors/attendance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendance(res.data);
    } catch (err) {
      console.error("❌ Error loading attendance:", err);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const getTodayStats = () => {
    const todayAttendance = attendance.filter(
      (record) => record.date === today
    );
    const present = todayAttendance.filter(
      (record) => record.status === "present"
    ).length;
    const absent = todayAttendance.filter(
      (record) => record.status === "absent"
    ).length;
    const total = instructors.length;
    const pending = total - todayAttendance.length;

    return { present, absent, pending, total };
  };

  const filteredAttendance = attendance.filter((record) => {
    const matchesName = record.instructor_name
      .toLowerCase()
      .includes(filterName.toLowerCase());

    // Year and Month filtering
    const recordDate = new Date(record.date);
    const recordYear = recordDate.getFullYear().toString();
    const recordMonth = String(recordDate.getMonth() + 1).padStart(2, "0");

    const matchesYear = filterYear ? recordYear === filterYear : true;
    const matchesMonth = filterMonth ? recordMonth === filterMonth : true;

    const matchesTab = activeTab === "today" ? record.date === today : true;

    return matchesName && matchesYear && matchesMonth && matchesTab;
  });

  // Calculate instructor totals based on current filters
  const getInstructorTotals = () => {
    // Filter without status to get total count for each instructor
    const attendanceForTotals = attendance.filter((record) => {
      const matchesName = record.instructor_name
        .toLowerCase()
        .includes(filterName.toLowerCase());

      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear().toString();
      const recordMonth = String(recordDate.getMonth() + 1).padStart(2, "0");

      const matchesYear = filterYear ? recordYear === filterYear : true;
      const matchesMonth = filterMonth ? recordMonth === filterMonth : true;

      const matchesTab = activeTab === "today" ? record.date === today : true;

      return matchesName && matchesYear && matchesMonth && matchesTab;
    });

    // Group by instructor
    const instructorTotals = {};
    attendanceForTotals.forEach((record) => {
      const key = `${record.user_id}`;
      if (!instructorTotals[key]) {
        instructorTotals[key] = {
          total: 0,
          present: 0,
          absent: 0,
        };
      }
      instructorTotals[key].total++;
      if (record.status === "present") {
        instructorTotals[key].present++;
      } else {
        instructorTotals[key].absent++;
      }
    });

    return instructorTotals;
  };

  const stats = getTodayStats();
  const instructorTotals = getInstructorTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin h-5 w-5 text-blue-600" />
          <span className="text-gray-600">Loading instructors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Instructor Attendance
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage daily attendance records
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 justify-center sm:justify-end">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="text-center sm:text-right">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Present
                </p>
                <p className="text-xl sm:text-3xl font-bold text-green-600">
                  {stats.present}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Absent
                </p>
                <p className="text-xl sm:text-3xl font-bold text-red-600">
                  {stats.absent}
                </p>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Missing
                </p>
                <p className="text-xl sm:text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total
                </p>
                <p className="text-xl sm:text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Mark Attendance Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Mark Attendance
              </h2>

              {instructors.length > 0 ? (
                <div className="space-y-3">
                  {instructors.map((ins) => {
                    const hasTodayAttendance = attendance.some(
                      (rec) => rec.user_id === ins.id && rec.date === today
                    );

                    const todayRecord = attendance.find(
                      (rec) => rec.user_id === ins.id && rec.date === today
                    );

                    return (
                      <div
                        key={ins.id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {ins.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              @{ins.username}
                            </p>
                          </div>
                          {hasTodayAttendance && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                todayRecord?.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {todayRecord?.status?.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              confirmMarkAttendance(ins.id, "present")
                            }
                            disabled={hasTodayAttendance}
                            className={`flex-1 py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                              hasTodayAttendance
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                            Present
                          </button>
                          <button
                            onClick={() =>
                              confirmMarkAttendance(ins.id, "absent")
                            }
                            disabled={hasTodayAttendance}
                            className={`flex-1 py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                              hasTodayAttendance
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          >
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                            Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    No instructors found for your branch.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Records Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Attendance Records
                </h2>
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("today")}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === "today"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === "all"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Records
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {/* Search Name */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search instructor..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                {/* Year Dropdown */}
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="">All Years</option>
                  {getAvailableYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Month Dropdown */}
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setFilterName("");
                    setFilterYear("");
                    setFilterMonth("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAttendance.length > 0 ? (
                        filteredAttendance.map((record) => {
                          const instructorTotal = instructorTotals[
                            record.user_id
                          ] || {
                            total: 0,
                            present: 0,
                            absent: 0,
                          };

                          return (
                            <tr
                              key={record.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                {new Date(record.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                                {record.instructor_name}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    record.status === "present"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {record.status === "present" ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {record.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                <div className="flex flex-col space-y-1">
                                  {/* Show total count */}
                                  <div className="font-medium text-blue-600"></div>
                                  {/* Show present/absent breakdown */}
                                  <div className="text-xs text-gray-500">
                                    <span className="text-green-600">
                                      {instructorTotal.present}P
                                    </span>
                                    {" / "}
                                    <span className="text-red-600">
                                      {instructorTotal.absent}A
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-3 sm:px-6 py-12 text-center"
                          >
                            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 text-sm">
                              No attendance records found
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Try adjusting your filters
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaintenancePage = () => {
  const [reports, setReports] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/maintenance`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setReports(response.data);

      // Extract unique years with date normalization
      const years = [
        ...new Set(
          response.data.map((report) => {
            let dateString = report.created_at;
            if (dateString.includes(" ") && !dateString.includes("T")) {
              dateString = dateString.replace(" ", "T");
            }
            const date = new Date(dateString);
            return date.getFullYear();
          })
        ),
      ].sort((a, b) => b - a);

      setAvailableYears(years);
    } catch (error) {
      console.error("Error fetching maintenance reports:", error);
    }
  };

  // 🆕 Filtered reports with date normalization
  const filteredReports = reports.filter((report) => {
    if (!report.created_at) return false;

    // Normalize date format
    let dateString = report.created_at;
    if (dateString.includes(" ") && !dateString.includes("T")) {
      dateString = dateString.replace(" ", "T");
    }

    const reportDate = new Date(dateString);
    if (isNaN(reportDate.getTime())) return false;

    const reportMonth = reportDate.getMonth();
    const reportYear = reportDate.getFullYear();
    const reportStatus = report.status || "Pending";

    const monthMatch =
      selectedMonth === "all" || reportMonth === parseInt(selectedMonth);
    const yearMatch =
      selectedYear === "all" || reportYear === parseInt(selectedYear);
    const statusMatch =
      selectedStatus === "all" || reportStatus === selectedStatus;

    return monthMatch && yearMatch && statusMatch;
  });

  const handleResetFilters = () => {
    setSelectedMonth("all");
    setSelectedYear("all");
    setSelectedStatus("all");
  };

  const handleUpdateClick = (report) => {
    const reportId = report.maintenance_id;
    setEditingId(reportId);
    setEditingData({
      ...editingData,
      [reportId]: {
        status: report.status || "Pending",
        price: report.price || "",
      },
    });
  };

  const handleCancel = (report) => {
    const reportId = report.maintenance_id;
    setEditingId(null);
    const newEditingData = { ...editingData };
    delete newEditingData[reportId];
    setEditingData(newEditingData);
  };

  const updateEditingData = (report, field, value) => {
    const reportId = report.maintenance_id;
    setEditingData({
      ...editingData,
      [reportId]: {
        ...editingData[reportId],
        [field]: value,
      },
    });
  };

  const handleSave = async (report) => {
    const reportId = report.maintenance_id;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/maintenance/${reportId}`,
        {
          status: editingData[reportId].status,
          price: editingData[reportId].price,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Maintenance report updated successfully",
          confirmButtonColor: "#dc2626",
        });

        setEditingId(null);
        const newEditingData = { ...editingData };
        delete newEditingData[reportId];
        setEditingData(newEditingData);

        fetchReports();
      }
    } catch (error) {
      console.error("Error updating maintenance report:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update maintenance report",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "bg-amber-100 text-amber-800 border-amber-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };

    return `px-3 py-1 rounded-full text-sm font-medium border ${
      statusColors[status] || statusColors["Pending"]
    }`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "In Progress":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l2-2a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Resolved":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const months = [
    { value: "all", label: "All Months" },
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-2 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-6 sm:h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  Vehicle Maintenance Reports
                </h2>
                <p className="text-slate-600 text-sm sm:text-lg">
                  Track and manage vehicle maintenance requests and repairs
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 px-3 sm:px-4 py-2 rounded-full">
                  <span className="text-red-700 font-medium text-sm sm:text-base">
                    Total Reports: {reports.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🆕 Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter Reports
              </h3>
              {(selectedMonth !== "all" ||
                selectedYear !== "all" ||
                selectedStatus !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Month Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                >
                  {months.map((month) => (
                    <option key={month.label} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="w-full p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200">
                  <p className="text-xs sm:text-sm text-slate-600">
                    Showing Results
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-indigo-600">
                    {filteredReports.length}{" "}
                    <span className="text-sm sm:text-base text-slate-500">
                      of {reports.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h3 className="text-lg sm:text-xl font-bold text-red-500">
              Maintenance Records
            </h3>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Monitor and update maintenance status and costs
            </p>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {filteredReports.map((report) => {
              const isEditing = editingId === report.maintenance_id;
              const currentData = editingData[report.maintenance_id] || {};
              const uniqueKey = `${selectedMonth}-${selectedYear}-${report.maintenance_id}`;

              return (
                <div key={uniqueKey} className="border-b border-slate-100 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-slate-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {report.vehicle_name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                        Issue Description
                      </p>
                      <p className="text-slate-700 text-sm mt-1">
                        {report.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Date Reported
                        </p>
                        <p className="text-slate-700 text-sm font-medium">
                          {new Date(report.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Reported By
                        </p>
                        <p className="font-medium text-slate-800 text-sm">
                          {report.instructor_name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                        Status
                      </p>
                      {isEditing ? (
                        <select
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                          value={currentData.status || "Pending"}
                          onChange={(e) =>
                            updateEditingData(report, "status", e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-2 ${getStatusBadge(
                            report.status || "Pending"
                          )}`}
                        >
                          {getStatusIcon(report.status || "Pending")}
                          {report.status || "Pending"}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                        Repair Cost
                      </p>
                      {isEditing ? (
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-500 text-sm">
                            ₱
                          </span>
                          <input
                            type="number"
                            className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            value={currentData.price || ""}
                            placeholder="0.00"
                            onChange={(e) =>
                              updateEditingData(report, "price", e.target.value)
                            }
                          />
                        </div>
                      ) : report.price != null ? (
                        <div className="font-semibold text-slate-800 text-sm">
                          ₱
                          {parseFloat(report.price).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-sm">
                          Not set
                        </span>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(report)}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow text-sm"
                          >
                            <svg
                              className="w-4 h-4"
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
                            Save
                          </button>
                          <button
                            onClick={() => handleCancel(report)}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow text-sm"
                          >
                            <svg
                              className="w-4 h-4"
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
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUpdateClick(report)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-6 font-semibold text-red-500 text-sm uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="text-left p-6 font-semibold text-red-500 text-sm uppercase tracking-wider">
                    Issue Description
                  </th>
                  <th className="text-left p-6 font-semibold text-red-500 text-sm uppercase tracking-wider">
                    Date Reported
                  </th>
                  <th className="text-left p-6 font-semibold text-red-500 text-sm uppercase tracking-wider">
                    Reported By
                  </th>
                  <th className="text-left p-6 font-semibold text-red-500 text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-6 font-semibold text-red-500 text-sm uppercase tracking-wider">
                    Repair Cost
                  </th>
                  <th className="text-left p-6 font-semibold text-red-500 text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => {
                  const isEditing = editingId === report.maintenance_id;
                  const currentData = editingData[report.maintenance_id] || {};
                  const uniqueKey = `${selectedMonth}-${selectedYear}-${report.maintenance_id}`;

                  return (
                    <tr
                      key={uniqueKey}
                      className="hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-slate-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {report.vehicle_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-slate-700 leading-relaxed max-w-xs">
                          {report.description}
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="text-slate-700">
                          <p className="font-medium">
                            {new Date(report.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(report.created_at).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-medium text-slate-800">
                          {report.instructor_name}
                        </p>
                      </td>
                      <td className="p-6">
                        {isEditing ? (
                          <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={currentData.status || "Pending"}
                            onChange={(e) =>
                              updateEditingData(
                                report,
                                "status",
                                e.target.value
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-2 ${getStatusBadge(
                              report.status || "Pending"
                            )}`}
                          >
                            {getStatusIcon(report.status || "Pending")}
                            {report.status || "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="p-6">
                        {isEditing ? (
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-500 text-sm">
                              ₱
                            </span>
                            <input
                              type="number"
                              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                              value={currentData.price || ""}
                              placeholder="0.00"
                              onChange={(e) =>
                                updateEditingData(
                                  report,
                                  "price",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ) : report.price != null ? (
                          <div className="font-semibold text-slate-800">
                            ₱
                            {parseFloat(report.price).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(report)}
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
                              >
                                <svg
                                  className="w-4 h-4"
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
                                Save
                              </button>
                              <button
                                onClick={() => handleCancel(report)}
                                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
                              >
                                <svg
                                  className="w-4 h-4"
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
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleUpdateClick(report)}
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Update
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="p-8 sm:p-16 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                {reports.length === 0
                  ? "No Maintenance Reports"
                  : "No matching reports"}
              </h3>
              <p className="text-slate-500 text-sm sm:text-base">
                {reports.length === 0
                  ? "Maintenance reports will appear here once submitted."
                  : "Try adjusting your filter settings"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const searchInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/student-records`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRecords(res.data);

        // Extract unique years - use local timezone
        const years = [
          ...new Set(
            res.data.map((rec) => {
              let dateString = rec.enrollment_date;
              if (dateString.includes(" ") && !dateString.includes("T")) {
                dateString = dateString.replace(" ", "T");
              }
              const date = new Date(dateString);
              return date.getFullYear();
            })
          ),
        ].sort((a, b) => b - a);

        setAvailableYears(years);
      } catch (err) {
        console.error("❌ Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleSearch = () => {
    setSearchName(searchInputRef.current.value);
  };

  const handleClearSearch = () => {
    searchInputRef.current.value = "";
    setSearchName("");
  };

  const handleResetFilters = () => {
    startTransition(() => {
      setSelectedMonth("all");
      setSelectedYear("all");
      searchInputRef.current.value = "";
      setSearchName("");
      setSelectedStatus("all"); // 👈 DAGDAG TO
    });
  };
  //  Proper filtering with date normalization
  const filteredRecords = records.filter((rec) => {
    if (!rec.enrollment_date) return false;

    // Normalize date format
    let dateString = rec.enrollment_date;
    if (dateString.includes(" ") && !dateString.includes("T")) {
      dateString = dateString.replace(" ", "T");
    }

    const enrollmentDate = new Date(dateString);
    if (isNaN(enrollmentDate.getTime())) return false;

    const recordMonth = enrollmentDate.getMonth();
    const recordYear = enrollmentDate.getFullYear();

    const monthMatch =
      selectedMonth === "all" || recordMonth === parseInt(selectedMonth);
    const yearMatch =
      selectedYear === "all" || recordYear === parseInt(selectedYear);

    const nameMatch =
      searchName === "" ||
      (rec.student_name &&
        rec.student_name.toLowerCase().includes(searchName.toLowerCase()));

    // 👇 DAGDAG STATUS FILTER
    const statusMatch =
      selectedStatus === "all" ||
      (rec.status && rec.status.toLowerCase() === selectedStatus.toLowerCase());

    return monthMatch && yearMatch && nameMatch && statusMatch; // 👈 DAGDAG statusMatch
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading records...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const months = [
    { value: "all", label: "All Months" },
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Student Records
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage all student enrollment records
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                Filter Records
              </h3>
              {(selectedMonth !== "all" ||
                selectedYear !== "all" ||
                searchName !== "" ||
                selectedStatus !== "all") && (
                <button
                  onClick={handleResetFilters}
                  disabled={isPending}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                >
                  {isPending ? "Resetting..." : "Reset Filters"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {" "}
              {/* 👈 3 TO 4 */}
              {/* Search Box with Button - FULL WIDTH */}
              <div className="col-span-full">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Search by Name
                </label>
                <div className="flex gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Type student name..."
                    defaultValue=""
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>
              {/* Month Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    startTransition(() => setSelectedMonth(e.target.value))
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                >
                  {months.map((month) => (
                    <option key={month.label} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Year Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    startTransition(() => setSelectedYear(e.target.value))
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    startTransition(() => setSelectedStatus(e.target.value))
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="passed/completed">Passed/Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4">
              <div className="w-full p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedStatus === "all"
                    ? "Showing Results of Student Information"
                    : `Showing Results of ${
                        selectedStatus.charAt(0).toUpperCase() +
                        selectedStatus.slice(1)
                      } Status`}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">
                  {filteredRecords.length}{" "}
                  <span className="text-sm sm:text-base text-gray-500">
                    of {records.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <tr>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Student No.
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Contact
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Address
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Birthday
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Age
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Gender
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Civil Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Nationality
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold whitespace-nowrap">
                    Pregnant
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold whitespace-nowrap">
                    PWD
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Course
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Enrollment Date
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold whitespace-nowrap">
                    Payment Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Amount Paid
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold whitespace-nowrap">
                    Branch
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec, index) => {
                    // Create unique key that includes filter state
                    const uniqueKey = `${selectedMonth}-${selectedYear}-${rec.user_id}-${index}`;

                    return (
                      <tr
                        key={uniqueKey}
                        className={`hover:bg-red-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold text-red-600 whitespace-nowrap">
                          {rec.student_number || (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {rec.student_name || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.email || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.contact_number || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                          {rec.address || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.birthday
                            ? new Date(rec.birthday).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.age || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.gender || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.civil_status || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.nationality || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center whitespace-nowrap">
                          {rec.gender === "Female" ? (
                            rec.is_pregnant === "true" ||
                            rec.is_pregnant === true ? (
                              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 shadow-sm">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 shadow-sm">
                                No
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center whitespace-nowrap">
                          {rec.is_pwd === true || rec.is_pwd === "true" ? (
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 shadow-sm">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 shadow-sm">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-xs truncate font-semibold">
                          {rec.course_name || "N/A"}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {(() => {
                            let dateString = rec.enrollment_date;
                            if (
                              dateString.includes(" ") &&
                              !dateString.includes("T")
                            ) {
                              dateString = dateString.replace(" ", "T");
                            }
                            return new Date(dateString).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            );
                          })()}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                              rec.payment_status === "Paid" ||
                              rec.payment_status === "Fully Paid"
                                ? "bg-green-100 text-green-800"
                                : rec.payment_status === "Partial" ||
                                  rec.payment_status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {rec.payment_status || "Pending"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold text-green-600 whitespace-nowrap">
                          ₱{parseFloat(rec.amount_paid || 0).toFixed(2)}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center whitespace-nowrap">
                          {rec.status ? (
                            <span
                              className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                rec.status.toLowerCase() ===
                                  "passed/completed" ||
                                rec.status.toLowerCase() === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : rec.status.toLowerCase() === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : rec.status.toLowerCase() === "approved"
                                  ? "bg-blue-100 text-blue-800"
                                  : rec.status.toLowerCase() === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {rec.status}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          {rec.branch_name || "N/A"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="18" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          {records.length === 0
                            ? "No records found"
                            : "No records match your filters"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {records.length === 0
                            ? "Start by adding student enrollments"
                            : "Try adjusting your filter settings"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userBranchId, setUserBranchId] = useState(null);
  const [formData, setFormData] = useState({
    car_name: "",
    vehicle_category: "car",
    type: "manual",
    total_units: 1,
  });

  useEffect(() => {
    // Get branch_id from JWT token
    const token = window.localStorage?.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // Debug
        setUserBranchId(decoded.branch_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = window.localStorage?.getItem("token");
      const decoded = jwtDecode(token);

      const [vehicleRes, branchRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/branches`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const vehicleData = await vehicleRes.json();
      const branchData = await branchRes.json();

      // Filter vehicles by user's branch (double check)
      const filteredVehicles =
        decoded.role === "admin"
          ? vehicleData.filter((v) => v.branch_id === decoded.branch_id)
          : vehicleData;

      setVehicles(filteredVehicles);
      setBranches(branchData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.car_name || !formData.total_units) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!userBranchId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Branch ID not found. Please log in again.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      const token = window.localStorage?.getItem("token");
      // Include branch_id from JWT token
      const dataToSend = {
        ...formData,
        branch_id: userBranchId,
      };

      console.log("Sending data:", dataToSend); // Debug

      const res = await fetch(`${import.meta.env.VITE_API_URL}/vehicles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("Response status:", res.status); // Debug

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Vehicle added successfully",
          confirmButtonColor: "#10b981",
        });
        setShowAddForm(false);
        setFormData({
          car_name: "",
          vehicle_category: "car",
          type: "manual",
          total_units: 1,
        });
        fetchData();
      } else {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.error || "Failed to add vehicle",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Check console for details.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleUpdate = async (vehicleId) => {
    const vehicle = vehicles.find((v) => v.vehicle_id === vehicleId);

    try {
      const token = window.localStorage?.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/vehicles/${vehicleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicle),
        }
      );

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Vehicle updated successfully",
          confirmButtonColor: "#10b981",
        });
        setEditingId(null);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleDelete = async (vehicleId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Vehicle?",
      text: "This action cannot be undone",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = window.localStorage?.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/vehicles/${vehicleId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Vehicle deleted successfully",
          confirmButtonColor: "#10b981",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "car":
      case "sedan":
      case "suv":
      case "van":
      case "jeep":
      case "pickup":
      case "auv":
        return Car;
      case "motorcycle":
      case "tricycle":
        return Bike;
      default:
        return Car;
    }
  };
  const getBranchName = (branchId) => {
    return branches.find((b) => b.branch_id === branchId)?.name || "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Loading vehicles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-1 sm:mb-2">
                Vehicle Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage available vehicles for your branch
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm sm:text-base font-semibold whitespace-nowrap"
            >
              {showAddForm ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {showAddForm ? "Cancel" : "Add Vehicle"}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
                Add New Vehicle
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    value={formData.car_name}
                    onChange={(e) =>
                      setFormData({ ...formData, car_name: e.target.value })
                    }
                    placeholder="e.g. Toyota Vios"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Category
                  </label>
                  <select
                    value={formData.vehicle_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle_category: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="car">Car/Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                    <option value="jeep">Jeep</option>
                    <option value="pickup">Pick-up</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="tricycle">Tricycle</option>
                    <option value="auv">AUV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Total Units
                  </label>
                  <input
                    type="number"
                    value={formData.total_units}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_units: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    onClick={handleAdd}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold text-sm sm:text-base"
                  >
                    Add Vehicle
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:gap-4">
            {vehicles.map((vehicle) => {
              const Icon = getCategoryIcon(vehicle.vehicle_category);
              const isEditing = editingId === vehicle.vehicle_id;

              return (
                <div
                  key={vehicle.vehicle_id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all bg-white"
                >
                  {isEditing ? (
                    // EDITING MODE
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800">
                          Edit Vehicle
                        </h3>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Vehicle Name
                          </label>
                          <input
                            type="text"
                            value={vehicle.car_name}
                            onChange={(e) =>
                              setVehicles(
                                vehicles.map((v) =>
                                  v.vehicle_id === vehicle.vehicle_id
                                    ? { ...v, car_name: e.target.value }
                                    : v
                                )
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Total Units
                          </label>
                          <input
                            type="number"
                            value={vehicle.total_units}
                            onChange={(e) =>
                              setVehicles(
                                vehicles.map((v) =>
                                  v.vehicle_id === vehicle.vehicle_id
                                    ? {
                                        ...v,
                                        total_units: parseInt(e.target.value),
                                      }
                                    : v
                                )
                              )
                            }
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleUpdate(vehicle.vehicle_id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            fetchData();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Left Side - Icon and Info */}
                      <div className="flex gap-3 flex-1">
                        <div className="p-3 bg-red-100 rounded-lg flex-shrink-0 h-fit">
                          <Icon className="w-6 h-6 text-red-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {vehicle.car_name}{" "}
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                              {vehicle.total_units}{" "}
                              {vehicle.total_units === 1 ? "Unit" : "Units"}
                            </span>
                          </h3>

                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                              {getBranchName(vehicle.branch_id)}
                            </span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold capitalize">
                              {vehicle.vehicle_category}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold capitalize">
                              {vehicle.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Buttons */}
                      <div className="flex sm:flex-col gap-2 sm:w-32">
                        <button
                          onClick={() => setEditingId(vehicle.vehicle_id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.vehicle_id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {vehicles.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Car className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg font-semibold">
                No vehicles added yet
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Click "Add Vehicle" to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const Admin_Staff = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehiclesOpen, setVehiclesOpen] = useState(false);
  const [branchName, setBranchName] = useState(""); // ← NEW: Store branch name

  // ← NEW: Get user info and branch name
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.branch_id) {
      fetchBranchName(user.branch_id);
    }
  }, []);

  // ← NEW: Fetch branch name from API
  const fetchBranchName = async (branchId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/branches/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      // ✅ Use 'name' instead of 'branch_name' to match backend
      if (data.name) {
        setBranchName(data.name);
      }
    } catch (error) {
      console.error("Error fetching branch:", error);
    }
  };

  const navigationItems = [
    { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Enrollments", icon: <User className="w-5 h-5" /> },
    { name: "Student Records", icon: <List className="w-5 h-5" /> },
    { name: "Schedules", icon: <Users className="w-5 h-5" /> },
    { name: "FeedbackPage", icon: <BarChart3 className="w-5 h-5" /> },
    {
      name: "Attendance",
      icon: <ListCheck className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    setSidebarOpen(false);
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
      {/* Mobile Header */}
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

      {/* Sidebar */}
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
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm">
                Administrative Staff
              </div>
              {branchName ? (
                <div className="flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 mr-1 text-red-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600 truncate">
                    {branchName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center mt-0.5">
                  <div className="w-2.5 h-2.5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin mr-1.5"></div>
                  <span className="text-xs text-gray-400">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {/* Regular Navigation Items */}
          {navigationItems.map(({ name, icon }) => (
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

          {/* Vehicles Dropdown */}
          <div>
            <button
              onClick={() => setVehiclesOpen(!vehiclesOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium text-sm cursor-pointer transition-colors
                ${
                  activePage === "Vehicles" || activePage === "Maintenance"
                    ? "bg-red-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center">
                <Car className="w-5 h-5 mr-3" />
                <span className="truncate">Vehicles</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  vehiclesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {vehiclesOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => handleNavClick("Vehicles")}
                  className={`flex items-center w-full px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors
                    ${
                      activePage === "Vehicles"
                        ? "bg-red-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Car className="w-4 h-4 mr-3" />
                  <span className="truncate">Vehicle List</span>
                </button>
                <button
                  onClick={() => handleNavClick("Maintenance")}
                  className={`flex items-center w-full px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors
                    ${
                      activePage === "Maintenance"
                        ? "bg-red-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  <span className="truncate">Maintenance</span>
                </button>
              </div>
            )}
          </div>

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
            {activePage === "Enrollments" && <EnrollmentsPage />}
            {activePage === "Student Records" && <Records />}
            {activePage === "Schedules" && <Schedules />}
            {activePage === "FeedbackPage" && <FeedbackPage />}
            {activePage === "Attendance" && <AttendancePage />}
            {activePage === "Maintenance" && <MaintenancePage />}
            {activePage === "Vehicles" && <VehiclesPage />}
          </div>
        </main>
      </div>
    </div>
  );
};
export default Admin_Staff;
