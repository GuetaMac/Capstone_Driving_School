import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
          "http://localhost:5000/api/instructor/enrollments",
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
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome {name}!
              </h1>
              <p className="text-gray-600 text-lg">
                Easily track your driving progress, schedules, and performance
                through your student dashboard.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Today</div>
              <div className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="mt-2 text-red-600 hover:text-red-800 flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-yellow-300" />
              Our Mission
            </h2>
            <p className="text-red-100 text-lg leading-relaxed max-w-4xl">
              Layunin naming turuan ang bawat Filipino Motor Vehicle Driver
              tungkol sa Road Safety at itanim sa kanila ang tamang pagmamaneho.
              Pangarap namin ang ligtas na kalsada para sa bawat pamilyang
              Pilipino na walang nasasawi dahil sa aksidente.
            </p>
          </div>
          <div className="text-right ml-8">
            <div className="text-yellow-300 font-bold text-lg">
              First Safety
            </div>
            <div className="text-red-200 text-sm">Always Safe</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          number={totalAssigned.toString()}
          title="Total Assigned Students"
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend=""
        />
        <StatCard
          number={theoreticalCount.toString()}
          title="Theoretical Students"
          icon={<BookOpen className="w-6 h-6" />}
          color="green"
          trend=""
        />
        <StatCard
          number={practicalCount.toString()}
          title="Practical (PDC) Students"
          icon={<User className="w-6 h-6" />}
          color="purple"
          trend=""
        />
        <StatCard
          number={upcomingCount.toString()}
          title="Upcoming Schedules"
          icon={<Calendar className="w-6 h-6" />}
          color="yellow"
          trend=""
        />
      </div>
    </div>
  );
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
          "http://localhost:5000/api/instructor/enrollments",
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
        `http://localhost:5000/api/instructor/enrollments/${enrollmentId}/status`,
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
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Student Records
        </h1>
        <p className="text-gray-600 text-lg">
          View and manage your assigned students
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Students Assigned
          </h3>
          <p className="text-gray-600">
            You don't have any students assigned to you yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                            {new Date(enrollment.end_date).toLocaleDateString()}
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
        "http://localhost:5000/api/instructor/maintenance",
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
        "http://localhost:5000/api/instructor/maintenance",
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Wrench className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Maintenance Reports
            </h1>
          </div>
          <p className="text-gray-600">
            Submit and track vehicle maintenance requests
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Submit New Report
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car className="w-4 h-4 inline mr-1" />
                  Vehicle Name
                </label>
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Describe the maintenance issue or problem"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Reports
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Track your submitted maintenance requests
            </p>
          </div>

          <div className="p-6">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  No reports submitted yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Your maintenance reports will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
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
                ))}
              </div>
            )}
          </div>
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
          "http://localhost:5000/api/instructor/feedback",
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">
              Loading feedbacks...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-700">
                Instructor Feedbacks
              </h1>
              <p className="mt-2 text-gray-600">
                Review student evaluations and feedback
              </p>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg">
              <span className="text-red-700 font-semibold">
                {feedbacks.length}
              </span>
              <span className="text-red-600 ml-1">Total Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Feedback Available
            </h3>
            <p className="text-gray-500">
              There are currently no student evaluations to display.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((fb) => (
              <div
                key={fb.feedback_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Feedback Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {fb.student_name}
                      </h3>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="inline-flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-1"
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
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
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
                </div>

                {/* Feedback Content */}
                <div className="p-6">
                  {/* Instructor Evaluation */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-red-600"
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
                    <div className="grid gap-3">
                      {instructorQuestions.map((question, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">
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
                    <h4 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-red-600"
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
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
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
    </div>
  );
};

const Instructor = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl border-r border-gray-200 min-h-screen">
          {/* Brand Header */}
          <div className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
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
            {[
              { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
              { name: "Records", icon: <User className="w-5 h-5" /> },
              {
                name: "Report Maintenance",
                icon: <BsExclamationOctagon className="w-5 h-5" />,
              },
              { name: "Feedbacks", icon: <FcFeedback className="w-5 h-5" /> },
            ].map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => setActivePage(name)}
                className={`flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm cursor-pointer
                  ${
                    activePage === name
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="mr-3">{icon}</span> {name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          {activePage === "Dashboard" && <DashboardPage />}
          {activePage === "Records" && <RecordsPage />}
          {activePage === "Report Maintenance" && <MaintenancePage />}
          {activePage === "Feedbacks" && <FeedbacksPage />}
        </main>
      </div>
    </div>
  );
};

export default Instructor;
