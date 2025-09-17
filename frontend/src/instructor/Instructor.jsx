import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import {
  User,
  BarChart3,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Plus,
  CheckCircle,
  AlertCircle,
  Settings,
  LogOut,
  Megaphone,
  FileText,
  MessageSquare,
  Car,
  Wrench,
  AlertTriangle,
  TrendingDown,
  Menu,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { BsExclamationOctagon } from "react-icons/bs";
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

const instructorQuestions = [
  "Instructor is knowledgeable",
  "Instructor is well prepared",
  "Explains clearly and answers questions",
  "Neat and properly dressed",
  "Good source of knowledge",
];

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
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Student";

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalAssigned, setTotalAssigned] = useState(0);
  const [theoreticalCount, setTheoreticalCount] = useState(0);
  const [practicalCount, setPracticalCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

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
      // Actual sign out logic here
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await Swal.fire({
        title: "Signed out",
        text: "You have been successfully signed out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect to login or landing page
      window.location.href = "/login"; // Adjust this based on your routing
    }
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/instructor/enrollments`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();

        const activeEnrollments = data.filter(
          (enr) => enr.status?.toLowerCase() !== "passed/completed"
        );

        setEnrollments(activeEnrollments);
        setTotalAssigned(activeEnrollments.length);

        let theoCount = 0,
          pracCount = 0,
          upcoming = 0;
        const today = new Date();

        activeEnrollments.forEach((enr) => {
          const courseNameLower = enr.course_name.toLowerCase();
          if (courseNameLower.includes("theoretical")) {
            theoCount += 1;
          } else {
            pracCount += 1;
          }

          const startDate = new Date(enr.start_date);
          if (startDate > today) upcoming += 1;
        });

        setTheoreticalCount(theoCount);
        setPracticalCount(pracCount);
        setUpcomingCount(upcoming);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();

    const intervalId = setInterval(fetchEnrollments, 30000); // auto-refresh every 30s
    return () => clearInterval(intervalId); // cleanup
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

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
                Track your assigned students, schedules, and teaching
                performance through your instructor dashboard.
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
                <Settings className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3 text-yellow-300" />
                Our Mission
              </h2>
              <p className="text-red-100 text-sm sm:text-base lg:text-lg leading-relaxed text-center lg:text-left max-w-4xl">
                Layunin naming turuan ang bawat Filipino Motor Vehicle Driver
                tungkol sa Road Safety at itanim sa kanila ang tamang
                pagmamaneho. Pangarap namin ang ligtas na kalsada para sa bawat
                pamilyang Pilipino na walang nasasawi dahil sa aksidente.
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            number={totalAssigned.toString()}
            title="Total Assigned Students"
            icon={<Users className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="blue"
          />
          <StatCard
            number={theoreticalCount.toString()}
            title="Theoretical Students"
            icon={<BookOpen className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="green"
          />
          <StatCard
            number={practicalCount.toString()}
            title="Practical (PDC) Students"
            icon={<User className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="purple"
          />
          <StatCard
            number={upcomingCount.toString()}
            title="Upcoming Schedules"
            icon={<Calendar className="w-5 h-5 lg:w-6 lg:h-6" />}
            color="yellow"
          />
        </div>
      </div>
    </div>
  );

  // StatCard Component
  function StatCard({ number, title, icon, color }) {
    const colorClasses = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
      yellow: "bg-yellow-500 text-yellow-600 bg-yellow-50",
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

const RecordsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/instructor/enrollments`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        const data = await res.json();
        setEnrollments(data);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleStatusUpdate = async (enrollmentId, newStatus, studentName) => {
    const result = await Swal.fire({
      title: `Update status?`,
      text: `Are you sure you want to update ${studentName}'s status to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, update it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/instructor/enrollments/${enrollmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setEnrollments((prev) =>
        prev.map((enrollment) =>
          enrollment.enrollment_id === enrollmentId
            ? { ...enrollment, status: newStatus }
            : enrollment
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `${studentName}'s status is now "${newStatus}".`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: `Failed to update ${studentName}'s status.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Student Records
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
          View and manage your assigned students
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg text-center">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No Students Assigned
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            You don't have any students assigned to you yet.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
              <h2 className="text-2xl font-bold">
                Assigned Students ({enrollments.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr
                      key={enrollment.enrollment_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="font-semibold text-gray-900">
                            {enrollment.student_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {enrollment.student_email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {enrollment.course_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {enrollment.start_time} - {enrollment.end_time}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(enrollment.start_date).toLocaleDateString()}
                          {enrollment.end_date && (
                            <>
                              {" "}
                              to{" "}
                              {new Date(
                                enrollment.end_date
                              ).toLocaleDateString()}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={enrollment.status || ""}
                          onChange={(e) =>
                            handleStatusUpdate(
                              enrollment.enrollment_id,
                              e.target.value,
                              enrollment.student_name
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="passed/completed">
                            Passed/Completed
                          </option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet View */}
          <div className="lg:hidden space-y-4">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 text-white mb-4">
              <h2 className="text-lg sm:text-xl font-bold">
                Assigned Students ({enrollments.length})
              </h2>
            </div>

            {enrollments.map((enrollment) => (
              <div
                key={enrollment.enrollment_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                {/* Student Header */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {enrollment.student_name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {enrollment.student_email}
                    </p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {enrollment.course_name}
                  </span>
                </div>

                {/* Schedule & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Schedule
                      </div>
                      <div className="text-sm font-medium">
                        {enrollment.start_time} - {enrollment.end_time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-red-500" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Date
                      </div>
                      <div className="text-sm font-medium">
                        {new Date(enrollment.start_date).toLocaleDateString()}
                        {enrollment.end_date && (
                          <>
                            {" "}
                            to{" "}
                            {new Date(enrollment.end_date).toLocaleDateString()}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Update Status
                  </label>
                  <select
                    value={enrollment.status || ""}
                    onChange={(e) =>
                      handleStatusUpdate(
                        enrollment.enrollment_id,
                        e.target.value,
                        enrollment.student_name
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="passed/completed">Passed/Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
const MaintenancePage = () => {
  const [vehicleName, setVehicleName] = useState("");
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/instructor/maintenance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!vehicleName.trim() || !description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields before submitting.",
      });
      return;
    }

    // Confirmation
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this maintenance report?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/instructor/maintenance`,
        { vehicle_name: vehicleName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your maintenance report has been submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setVehicleName("");
      setDescription("");
      fetchReports();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting the report.",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "text-green-700 bg-green-50 border-green-200";
      case "In Progress":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      default:
        return "text-red-700 bg-red-50 border-red-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header - Mobile Optimized */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg w-fit">
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Maintenance Reports
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Submit and track vehicle maintenance requests
            </p>
          </div>
        </div>
      </div>

      {/* Form Section - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 lg:mb-8">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            Submit New Report
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="w-4 h-4 inline mr-1" />
                Vehicle Name
              </label>
              <input
                type="text"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base"
                placeholder="Enter vehicle name or identifier"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Problem Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none text-sm sm:text-base"
                placeholder="Describe the maintenance issue or problem"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>

      {/* Reports List - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Recent Reports
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Track your submitted maintenance requests
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {reports.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                No reports submitted yet
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Your maintenance reports will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {report.vehicle_name}
                        </h4>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        {report.status}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                      {report.description}
                    </p>

                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">
                          {report.vehicle_name}
                        </h4>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        {report.status}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(report.created_at).toLocaleString()}
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

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/instructor/feedback`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setFeedbacks(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600 font-medium text-sm sm:text-base">
            Loading feedbacks...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section - Mobile Optimized */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-red-700">
              Instructor Feedbacks
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Review student evaluations and feedback
            </p>
          </div>
          <div className="bg-red-50 px-3 sm:px-4 py-2 rounded-lg w-fit">
            <span className="text-red-700 font-semibold text-lg sm:text-xl">
              {feedbacks.length}
            </span>
            <span className="text-red-600 ml-1 text-sm sm:text-base">
              Total Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.978 8.978 0 01-4.906-1.456l-3.815 1.372a.75.75 0 01-.954-.954l1.372-3.815A8.978 8.978 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No Feedback Available
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            There are currently no student evaluations to display.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.feedback_id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Feedback Header - Mobile Optimized */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {fb.student_name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center mt-2 sm:mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
                    <span className="inline-flex items-center text-xs sm:text-sm text-gray-600">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      {fb.course_name}
                    </span>
                    <span className="inline-flex items-center text-xs sm:text-sm text-gray-500">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0v1m6-1v1M6 7h12l1 1v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8l1-1z"
                        />
                      </svg>
                      {new Date(fb.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback Content - Mobile Optimized */}
              <div className="p-4 sm:p-6">
                {/* Instructor Evaluation */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-3 sm:mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600"
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
                    Instructor Evaluation
                  </h4>
                  <div className="grid gap-2 sm:gap-3">
                    {instructorQuestions.map((question, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 sm:p-4"
                      >
                        {/* Mobile Layout */}
                        <div className="block sm:hidden">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            {question}
                          </div>
                          <div className="flex justify-end">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                              {fb[`instructor_q${index + 1}`]}
                            </span>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center justify-between">
                          <span className="font-medium text-gray-700 text-sm">
                            {question}
                          </span>
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                              {fb[`instructor_q${index + 1}`]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Comments */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.978 8.978 0 01-4.906-1.456l-3.815 1.372a.75.75 0 01-.954-.954l1.372-3.815A8.978 8.978 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                      />
                    </svg>
                    Student Comment
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {fb.instructor_comments || (
                        <span className="text-gray-500 italic">
                          No comment provided.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Instructor = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Records", icon: <User className="w-5 h-5" /> },
    {
      name: "Report Maintenance",
      icon: <BsExclamationOctagon className="w-5 h-5" />,
    },
    { name: "Feedbacks", icon: <FcFeedback className="w-5 h-5" /> },
  ];

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
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
            <div className="text-gray-500 text-xs">Instructor Panel</div>
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

      <div className="flex">
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
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-xl border-r border-gray-200 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
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
                <div className="font-semibold text-gray-900">Instructor</div>
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
        <main className="flex-1 min-w-0">
          {/* Content Area */}
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Page Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-250px)]">
              {activePage === "Dashboard" && <DashboardPage />}
              {activePage === "Records" && <RecordsPage />}
              {activePage === "Report Maintenance" && <MaintenancePage />}
              {activePage === "Feedbacks" && <FeedbacksPage />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Instructor;
