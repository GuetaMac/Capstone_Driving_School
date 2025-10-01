import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Swal from "sweetalert2";
import { BsRecord } from "react-icons/bs";
import { PiStudentFill } from "react-icons/pi";

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
          `${import.meta.env.VITE_API_URL}/api/admin/enrollments/summary`,
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

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6 lg:mb-8">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome {name}!
              </h1>
              <p className="text-gray-600 text-sm lg:text-lg">
                Easily track your driving progress, schedules, and performance
                through your student dashboard.
              </p>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-sm text-gray-500">Today</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={handleSignOut}
                className="mt-2 text-red-600 hover:text-red-800 flex items-center text-sm mx-auto lg:mx-0 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </button>
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
            icon={<DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />}
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

  useEffect(() => {
    fetchEnrollments();
    fetchInstructors();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Try authenticated API first, fallback to simple endpoint
      let data;
      if (token) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/enrollments`,
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
      // Fallback to simple fetch
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
          `${import.meta.env.VITE_API_URL}/api/instructors`,
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
      // Fallback
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
        }/api/admin/enrollments/${enrollmentId}/assign-instructor`,
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
          }/api/admin/enrollments/${enrollmentId}/amount-paid`,
          { amount_paid: value },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await Swal.fire("✅ Success", "Amount paid updated.", "success");
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

      if (status === "Fully Paid") {
        const result = await Swal.fire({
          title: 'Are you sure you want to mark as "Fully Paid"?',
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (result.isConfirmed) {
          await axios.patch(
            `${
              import.meta.env.VITE_API_URL
            }/api/admin/enrollments/${enrollmentId}/payment-status`,
            { payment_status: status },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          await Swal.fire("✅ Success", "Payment status updated.", "success");
          fetchEnrollments();
        } else {
          if (resetStatus) resetStatus();
        }
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      await Swal.fire("❌ Error", "Error updating payment status.", "error");
      if (resetStatus) resetStatus();
    }
  };

  const deleteEnrollment = async (enrollmentId, studentName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({
          title: "Error",
          text: "You need to be logged in to delete enrollments.",
          icon: "error",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Delete Enrollment?",
        text: `Are you sure you want to delete the enrollment for ${studentName}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/enrollments/${enrollmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Enrollment has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchEnrollments();
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      await Swal.fire({
        title: "Error",
        text: "Failed to delete enrollment. Please try again.",
        icon: "error",
      });
    }
  };

  // Utility functions
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
    if (e.course_name === "ONLINE THEORETICAL DRIVING COURSE") {
      return "Online Course - Self-paced";
    }

    if (!e.start_date || !e.start_time || !e.end_time) {
      return e.schedule || "Schedule TBD";
    }

    const start = new Date(e.start_date);
    const startDate = fmtDate(start);
    const endDate = fmtDate(new Date(start.getTime() + 86400000));
    const timeRange = `${fmtTime(e.start_time)} to ${fmtTime(e.end_time)}`;

    return e.is_theoretical
      ? `${startDate} to ${endDate} — ${timeRange}`
      : `${startDate} — ${timeRange}`;
  };

  // Get unique years from enrollments
  const getAvailableYears = () => {
    const years = new Set();
    enrollments.forEach((enrollment) => {
      if (enrollment.start_date) {
        const year = new Date(enrollment.start_date).getFullYear();
        years.add(year);
      }
      // Also check enrollment date if available
      if (enrollment.created_at) {
        const year = new Date(enrollment.created_at).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
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

  // Group enrollments by schedule and sort by date
  const groupEnrollmentsBySchedule = (enrollments) => {
    const groups = enrollments.reduce((acc, enrollment) => {
      const scheduleKey =
        enrollment.course_name?.toLowerCase().includes("online") &&
        enrollment.course_name?.toLowerCase().includes("theoretical")
          ? "online_course"
          : `${enrollment.start_date || "tbd"}_${
              enrollment.start_time || "tbd"
            }_${enrollment.end_time || "tbd"}_${
              enrollment.is_theoretical || false
            }`;

      if (!acc[scheduleKey]) {
        acc[scheduleKey] = {
          schedule: formatSchedule(enrollment),
          sortDate: enrollment.start_date
            ? new Date(enrollment.start_date)
            : new Date(),
          enrollments: [],
        };
      }
      acc[scheduleKey].enrollments.push(enrollment);
      return acc;
    }, {});

    // Sort groups by date (earliest to latest)
    return Object.values(groups).sort((a, b) => a.sortDate - b.sortDate);
  };

  const assignedInstructorIds = enrollments
    .filter((e) => e.instructor_id !== null)
    .map((e) => e.instructor_id);

  const filteredEnrollments = enrollments.filter((enrollment) => {
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
      (filterStatus === "paid" && enrollment.payment_status === "Fully Paid") ||
      (filterStatus === "unpaid" &&
        enrollment.payment_status === "not fully paid") ||
      (filterStatus === "assigned" && enrollment.instructor_id) ||
      (filterStatus === "unassigned" && !enrollment.instructor_id) ||
      (filterStatus === "pending" && enrollment.status === "pending") ||
      (filterStatus === "approved" && enrollment.status === "approved") ||
      (filterStatus === "completed" && enrollment.status === "completed");

    // Date filtering
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
        // If no date available and filters are set, exclude from results
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
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
        {e.course_name?.toLowerCase().includes("online") &&
        e.course_name?.toLowerCase().includes("theoretical") ? (
          <span className="text-sm text-gray-500 italic">N/A (Online)</span>
        ) : e.instructor_name ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {e.instructor_name}
          </span>
        ) : hasAdminFeatures ? (
          <select
            defaultValue=""
            onChange={(ev) => {
              const instructorId = ev.target.value;
              const reset = () => (ev.target.value = "");
              assignInstructor(e.enrollment_id, instructorId, reset);
            }}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="" disabled>
              Assign Instructor
            </option>
            {instructors
              .filter((instructor) => {
                const assignedEnrollment = enrollments.find(
                  (en) => en.instructor_id === instructor.user_id
                );
                return (
                  !assignedEnrollment ||
                  assignedEnrollment.status?.toLowerCase() ===
                    "passed/completed"
                );
              })
              .map((i) => (
                <option key={i.user_id} value={i.user_id}>
                  {i.name}
                </option>
              ))}
          </select>
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
            >
              <option value="Not Fully Paid">Not Fully Paid</option>
              <option value="Fully Paid">Fully Paid</option>
            </select>
          </td>
        </>
      )}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            e.status
          )}`}
        >
          {e.status || "N/A"}
        </span>
      </td>
      {hasAdminFeatures && (
        <td className="px-6 py-4">
          <button
            onClick={() => deleteEnrollment(e.enrollment_id, e.student_name)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            title="Delete enrollment"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </td>
      )}
    </tr>
  );

  const renderMobileCard = (e) => (
    <div
      key={e.enrollment_id}
      className="bg-gray-50 rounded-lg p-4 ml-4 border-l-4 border-indigo-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-indigo-700">
              {e.student_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "N/A"}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {e.student_name || "N/A"}
            </h4>
            <p className="text-sm text-gray-600">{e.course_name || "N/A"}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            hasAdminFeatures ? e.payment_status : e.status
          )}`}
        >
          {hasAdminFeatures ? e.payment_status || "N/A" : e.status || "N/A"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Instructor:</span>
          {e.course_name?.toLowerCase().includes("online") &&
          e.course_name?.toLowerCase().includes("theoretical") ? (
            <span className="text-sm text-gray-500 italic">N/A (Online)</span>
          ) : e.instructor_name ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {e.instructor_name}
            </span>
          ) : hasAdminFeatures ? (
            <select
              defaultValue=""
              onChange={(ev) => {
                const instructorId = ev.target.value;
                const reset = () => (ev.target.value = "");
                assignInstructor(e.enrollment_id, instructorId, reset);
              }}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="" disabled>
                Assign
              </option>
              {instructors
                .filter((i) => {
                  const assignedEnrollment = enrollments.find(
                    (en) => en.instructor_id === i.user_id
                  );
                  return (
                    !assignedEnrollment ||
                    assignedEnrollment.status?.toLowerCase() ===
                      "passed/completed"
                  );
                })
                .map((i) => (
                  <option key={i.user_id} value={i.user_id}>
                    {i.name}
                  </option>
                ))}
            </select>
          ) : (
            <span className="text-sm text-gray-500">Not assigned</span>
          )}
        </div>

        {hasAdminFeatures && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-1">₱</span>
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
                  className="w-24 text-sm border border-gray-300 rounded px-2 py-1"
                />
              </div>
            </div>

            {e.proof_of_payment && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Proof:</span>
                <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${
                    e.proof_of_payment
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${
                      e.proof_of_payment
                    }`}
                    alt="Proof"
                    className="h-10 w-10 object-cover rounded-lg border-2 border-gray-200"
                  />
                </a>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              e.status
            )}`}
          >
            {e.status || "N/A"}
          </span>
        </div>

        {hasAdminFeatures && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Actions:</span>
            <button
              onClick={() => deleteEnrollment(e.enrollment_id, e.student_name)}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              title="Delete enrollment"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Enrollment Management
            </h1>
          </div>
          <p className="text-gray-600">
            {hasAdminFeatures
              ? "Manage student enrollments, instructor assignments, and payment tracking"
              : "View student enrollments and their details"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.length}
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
                  Assigned Instructors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignedInstructorIds.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {hasAdminFeatures ? "Fully Paid" : "Completed"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {hasAdminFeatures
                    ? enrollments.filter(
                        (e) => e.payment_status === "Fully Paid"
                      ).length
                    : enrollments.filter((e) => e.status === "completed")
                        .length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Check className="h-6 w-6 text-emerald-600" />
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
                        (e) =>
                          e.payment_status?.toLowerCase() === "not fully paid"
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
                  <span className="ml-auto bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-red-500">
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
                        Status
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
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
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
                    (e) => e.instructor_id === i.user_id
                  );
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
                            {assignedStudents.length} students
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

            {assignedInstructorIds.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No instructors assigned yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const Schedules = ({ currentUser }) => {
  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
    is_theoretical: false,
    slots: "",
  });
  const [message, setMessage] = useState("");
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/schedules`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSchedules(data);
      } catch {
        setMessage("❌ Error fetching schedules.");
      }
    };
    fetchSchedules();
  }, []); // fetch once on mount

  const handleSubmit = async () => {
    setMessage("");

    // Basic validation
    if (!form.date || !form.start_time || !form.end_time || !form.slots) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }

    // Show confirmation first
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this schedule?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "Cancel",
    });

    // if cancelled, stop
    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/schedules`,
        {
          branch_id: currentUser?.branch_id || 1,
          created_by: currentUser?.user_id || 1,
          ...form,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Schedule Added",
        text: "Schedule added successfully!",
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
      // refetch para makita agad
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/schedules`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSchedules(data);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // today para sa comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // filter lang ng upcoming schedules
  const upcomingSchedules = schedules.filter((schedule) => {
    if (schedule.is_theoretical) {
      const endDate = new Date(schedule.end_date);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    } else {
      const startDate = new Date(schedule.start_date);
      startDate.setHours(0, 0, 0, 0);
      return startDate >= today;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent mb-2">
            Schedule Manager
          </h1>
          <p className="text-gray-600 text-lg">
            Create and manage your training sessions
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 mb-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-xl">
              <Plus className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Schedule
            </h2>
          </div>

          <div className="space-y-6">
            {/* Date Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                {form.is_theoretical ? "Start Date" : "Date"}
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50"
                required
              />
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  End Time
                </label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({ ...form, end_time: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Slots Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="w-4 h-4" />
                Available Slots
              </label>
              <input
                type="number"
                min="1"
                value={form.slots}
                onChange={(e) => setForm({ ...form, slots: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50"
                placeholder="Enter number of slots"
                required
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <input
                type="checkbox"
                checked={form.is_theoretical}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_theoretical: e.target.checked,
                  })
                }
                className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500"
              />
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <BookOpen className="w-4 h-4 text-purple-600" />
                2-day Seminar (Theoretical)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Schedule
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                message.startsWith("✅")
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message.startsWith("✅") ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Schedules List */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Upcoming Sessions
            </h3>
          </div>

          <div className="space-y-4">
            {upcomingSchedules.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No schedules available
                </p>
                <p className="text-gray-400 text-sm">
                  Create your first schedule to get started
                </p>
              </div>
            ) : (
              upcomingSchedules.map((schedule) => (
                <div
                  key={schedule.schedule_id}
                  className="group p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            schedule.is_theoretical
                              ? "bg-purple-100 text-purple-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {schedule.is_theoretical ? (
                            <BookOpen className="w-4 h-4" />
                          ) : (
                            <Users className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {schedule.is_theoretical
                              ? "Theoretical Seminar"
                              : "Practical Session"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {schedule.is_theoretical
                              ? `${formatDate(
                                  schedule.start_date
                                )} - ${formatDate(schedule.end_date)}`
                              : formatDate(schedule.start_date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {schedule.slots === 0
                              ? "Fully Booked"
                              : `${schedule.slots} slots available`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        schedule.is_theoretical
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {schedule.is_theoretical
                        ? "2-Day Seminar"
                        : "Single Session"}
                    </div>
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
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/feedback`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFeedbackList(data))
      .catch((err) => console.error("Error loading feedback:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              Student Feedback Management
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-0">
              Review and manage student course evaluations
            </p>
            <div className="mt-4 sm:mt-6 flex items-center gap-4">
              <div className="bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <span className="text-red-700 font-medium text-sm sm:text-base">
                  Total Feedback: {feedbackList.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {feedbackList.length === 0 ? (
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
              No Feedback Available
            </h3>
            <p className="text-slate-500 text-sm sm:text-base">
              Student feedback will appear here once submitted.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {feedbackList.map((fb) => (
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

  // Define questions (same as in original)
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

        {/* Student Info Section - Mobile Optimized */}
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
            <div className="sm:col-span-2">
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Instructor
              </p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {feedback.instructor_name}
              </p>
            </div>
          </div>
        </div>

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
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/instructors/${id}/attendance`,
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
          `${import.meta.env.VITE_API_URL}/api/admin/instructors`,
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
        `${import.meta.env.VITE_API_URL}/api/admin/instructors/attendance`,
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
                  Pending
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
  const [editingData, setEditingData] = useState({}); // Store editing data by ID

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/maintenance`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching maintenance reports:", error);
    }
  };

  const handleUpdateClick = (report) => {
    // Use maintenance_id as the primary ID consistently
    const reportId = report.maintenance_id;
    console.log("Setting editing ID:", reportId, "for report:", report);
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
    // Remove the editing data for this report
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
    const confirmResult = await Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update this maintenance report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const dataToSave = editingData[reportId];
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/maintenance/${reportId}`,
        dataToSave,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "The maintenance report has been successfully updated.",
        timer: 1500,
        showConfirmButton: false,
      });

      setEditingId(null);
      // Remove the editing data for this report
      const newEditingData = { ...editingData };
      delete newEditingData[reportId];
      setEditingData(newEditingData);

      fetchReports();
    } catch (err) {
      console.error("Error updating report:", err);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was a problem updating the report. Please try again.",
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
            {reports.map((report) => {
              const isEditing = editingId === report.id;
              const currentData = editingData[report.id] || {};

              return (
                <div key={report.id} className="border-b border-slate-100 p-4">
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
                        <p className="text-xs text-slate-500">
                          {new Date(report.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          Reported By
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">
                              {report.instructor_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium text-slate-800 text-sm">
                            {report.instructor_name}
                          </p>
                        </div>
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
                {reports.map((report) => {
                  const isEditing = editingId === report.maintenance_id;
                  const currentData = editingData[report.maintenance_id] || {};

                  return (
                    <tr
                      key={report.maintenance_id}
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
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {report.instructor_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium text-slate-800">
                            {report.instructor_name}
                          </p>
                        </div>
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

          {reports.length === 0 && (
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
                No Maintenance Reports
              </h3>
              <p className="text-slate-500 text-sm sm:text-base">
                Maintenance reports will appear here once submitted.
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

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/student-records`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecords(res.data);
      } catch (err) {
        console.error("❌ Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading records...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Records</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200 shadow-lg rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Branch</th>
              <th className="px-4 py-2 border">Course</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((rec) => (
                <tr key={rec.user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {rec.student_name || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{rec.email || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {rec.contact_number || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{rec.address || "N/A"}</td>
                  <td className="px-4 py-2 border">{rec.branch_id || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {rec.course_name || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Admin_Staff = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Enrollments", icon: <User className="w-5 h-5" /> },
    { name: "Records", icon: <List className="w-5 h-5" /> },
    { name: "Schedules", icon: <Users className="w-5 h-5" /> },
    { name: "FeedbackPage", icon: <BarChart3 className="w-5 h-5" /> },
    {
      name: "Attendance",
      icon: <ListCheck className="w-5 h-5" />,
    },
    { name: "Maintenance", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header - Static (Not Fixed) */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-white-600 to-white-700 rounded-lg flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-7 h-7 object-contain rounded-full"
            />
          </div>
          <div>
            <div className="font-bold text-sm">First Safety</div>
            <div className="text-gray-500 text-xs">Admin Panel</div>
          </div>
        </div>
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
              <div className="font-bold text-lg">First Safety</div>
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
              <div className="font-semibold text-gray-900">
                Administrative Staff
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
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
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-64px)]">
            {activePage === "Dashboard" && <DashboardPage />}
            {activePage === "Enrollments" && <EnrollmentsPage />}
            {activePage === "Records" && <Records />}
            {activePage === "Schedules" && <Schedules />}
            {activePage === "FeedbackPage" && <FeedbackPage />}
            {activePage === "Attendance" && <AttendancePage />}
            {activePage === "Maintenance" && <MaintenancePage />}
          </div>
        </main>
      </div>
    </div>
  );
};
export default Admin_Staff;
