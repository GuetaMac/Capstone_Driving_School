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

  let scheduleLabel = "—";
  if (
    enrollment?.start_date &&
    enrollment?.start_time &&
    enrollment?.end_time
  ) {
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

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Welcome {name}!
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Easily track your driving progress, schedules, and performance
                  through your student dashboard.
                </p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xs sm:text-sm text-gray-500">Today</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-2 text-red-600 hover:text-red-800 flex items-center justify-center sm:justify-end text-sm mx-auto sm:mx-0 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </button>
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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseSchedules, setCourseSchedules] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [scheduleId, setScheduleId] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/courses`)
      .then((res) => res.json())
      .then(setCourses)
      .catch((err) => console.error("❌ Error fetching courses:", err));
  }, []);

  const fetchCourseSchedules = async (course_id, onlyTheory) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/schedules?course_id=${course_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = await res.json();
      data = data.filter((s) =>
        onlyTheory ? s.is_theoretical : !s.is_theoretical
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      data = data.filter((s) => {
        const start = new Date(s.start_date);
        const end = new Date(s.end_date || s.start_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return (s.is_theoretical ? end : start) >= today;
      });

      setCourseSchedules(data);
    } catch {
      setCourseSchedules([]);
    }
  };

  const handleEnrollClick = async (course) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first.");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/check-active-enrollment`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.hasActive) {
        return Swal.fire({
          title: "You already have an active enrollment.",
          text: "Please complete it before enrolling in a new course.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }

      const onlyTheory = course.name.toLowerCase().includes("theoretical");
      setSelectedCourse(course);
      setAddress("");
      setContactNumber("");
      setReferenceNumber("");
      setProofImage(null);
      setScheduleId("");
      fetchCourseSchedules(course.course_id, onlyTheory);
      setShowEnrollModal(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while checking enrollment status.");
    }
  };

  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  const formatDate = (d) =>
    d
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .replace(/,/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire("Unauthorized", "You must be logged in.", "warning");
    }

    const isOnlineTheory = selectedCourse.name
      .toLowerCase()
      .includes("online theoretical");

    if (!isOnlineTheory && !scheduleId) {
      return Swal.fire("Missing Info", "Please select a schedule.", "info");
    }

    const formData = new FormData();
    formData.append("course_id", selectedCourse.course_id);

    if (!isOnlineTheory) {
      formData.append("schedule_id", scheduleId);
    }

    formData.append("address", address);
    formData.append("contact_number", contactNumber);
    formData.append("gcash_reference_number", referenceNumber);
    formData.append("proof_image", proofImage);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        Swal.fire("Success!", "Your enrollment has been submitted.", "success");
        setShowEnrollModal(false);
      } else {
        const data = await res.json();
        Swal.fire("Error", data.error || "Enrollment failed.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-600 text-center">
        Available Courses
      </h1>

      {/* Responsive Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No courses available.
          </p>
        ) : (
          courses.map((course) => (
            <div
              key={course.course_id}
              className="flex flex-col border rounded-lg p-4 sm:p-6 shadow hover:shadow-lg transition"
            >
              {course.image ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${course.image}`}
                  alt={course.name}
                  className="w-full h-40 sm:h-48 object-cover rounded mb-3 sm:mb-4"
                />
              ) : (
                <div className="w-full h-40 sm:h-48 bg-gray-200 rounded mb-3 sm:mb-4 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h3 className="text-lg sm:text-xl font-semibold mb-1 text-red-600">
                {course.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                ({course.codename})
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-2">
                {course.description}
              </p>

              {(course.type || course.mode) && (
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  {course.type && `Type: ${course.type}`}
                  {course.type && course.mode && " | "}
                  {course.mode && `Mode: ${course.mode}`}
                </p>
              )}

              <p className="text-base sm:text-lg font-bold text-gray-800 mb-4">
                ₱{course.price}
              </p>

              <button
                onClick={() => handleEnrollClick(course)}
                className="mt-auto px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
              >
                Enroll Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showEnrollModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-lg sm:text-xl font-bold mb-2 text-red-600">
              Enroll in {selectedCourse.name}
            </h2>

            <p className="text-xs sm:text-sm text-gray-700 mb-1">
              <strong>GCash Number:</strong> 09171234567
            </p>
            <p className="text-xs sm:text-sm text-gray-700 mb-4">
              <strong>Downpayment:</strong> ₱
              {(selectedCourse.price * 0.5).toFixed(2)} (50% of ₱
              {selectedCourse.price})
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Schedule */}
              {!selectedCourse.name
                .toLowerCase()
                .includes("online theoretical") && (
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">
                    Select Schedule
                  </label>
                  {courseSchedules.length > 0 ? (
                    <select
                      value={scheduleId}
                      onChange={(e) => setScheduleId(e.target.value)}
                      className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base"
                      required
                    >
                      <option value="">-- choose schedule --</option>
                      {courseSchedules.map((sched) => {
                        const start = new Date(sched.start_date);
                        const startStr = formatDate(start);
                        if (sched.is_theoretical) {
                          const end = new Date(sched.end_date);
                          const endStr = formatDate(end);
                          return (
                            <option
                              key={sched.schedule_id}
                              value={sched.schedule_id}
                            >
                              {startStr} to {endStr} -{" "}
                              {formatTime(sched.start_time)} to{" "}
                              {formatTime(sched.end_time)}
                            </option>
                          );
                        }
                        return (
                          <option
                            key={sched.schedule_id}
                            value={sched.schedule_id}
                          >
                            {startStr} - {formatTime(sched.start_time)} to{" "}
                            {formatTime(sched.end_time)}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500">
                      No schedules available.
                    </p>
                  )}
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base"
                  pattern="^09\d{9}$"
                  title="Must start with 09 and contain 11 digits"
                  required
                />
              </div>

              {/* GCash Reference Number */}
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  GCash Reference Number
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base"
                  pattern="^\d{11}$"
                  title="Must be exactly 11 digits"
                  required
                />
              </div>

              {/* Proof of Payment */}
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Proof of Payment (Image)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <label
                    htmlFor="proofImage"
                    className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded cursor-pointer hover:bg-red-600 text-sm sm:text-base"
                  >
                    Choose File
                  </label>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {proofImage ? proofImage.name : "No file selected"}
                  </span>
                </div>
                <input
                  id="proofImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofImage(e.target.files[0])}
                  className="hidden"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-3 sm:px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
                >
                  Submit Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

  // Define the questions object
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

  const generateCertificate = async (enrollmentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/enrollments/${enrollmentId}/generate-certificate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to generate certificate");
      const data = await res.json();
      alert("Certificate generated successfully!");

      if (data.downloadUrl) {
        const link = document.createElement("a");
        link.href = `${import.meta.env.VITE_API_URL}${data.downloadUrl}`;
        link.download = data.fileName ?? "certificate.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleOpenFeedback = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedEnrollment) return;

    const token = localStorage.getItem("token");
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    const confirmResult = await Swal.fire({
      title: "Submit Feedback?",
      text: "Are you sure you want to submit your feedback?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    setSubmitting(true);
    try {
      const enrollmentIdNum = Number(selectedEnrollment.enrollment_id);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/${enrollmentIdNum}`,
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
        const responseText = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          throw new Error(
            `HTTP ${res.status}: ${res.statusText}. Response: ${responseText}`
          );
        }
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP ${res.status}: ${res.statusText}`
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your feedback has been submitted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      // update local state (use numeric compare to avoid === type mismatch)
      setEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          Number(enrollment.enrollment_id) === enrollmentIdNum
            ? { ...enrollment, has_feedback: true }
            : enrollment
        )
      );

      setSelectedEnrollment((prev) =>
        prev && Number(prev.enrollment_id) === enrollmentIdNum
          ? { ...prev, has_feedback: true }
          : prev
      );

      setShowFeedbackModal(false);
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `There was an error submitting your feedback: ${err.message}`,
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

  if (loading) return <p className="p-4 lg:p-8">Loading your enrollments…</p>;
  if (error) return <p className="text-red-600 p-4 lg:p-8">{error}</p>;
  if (!enrollments || enrollments.length === 0)
    return <p className="p-4 lg:p-8">You have no enrollments yet.</p>;

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">
        My Enrollments
      </h1>
      <div className="space-y-4 lg:space-y-6">
        {enrollments.map((e) => {
          const start = e.start_date ? new Date(e.start_date) : null;
          const scheduleLabel = e.is_theoretical
            ? start
              ? `${fmtDate(start)} to ${fmtDate(
                  new Date(start.getTime() + 86400000)
                )} — ${fmtTime(e.start_time)} to ${fmtTime(e.end_time)}`
              : "No Schedule"
            : start
            ? `${fmtDate(start)} — ${fmtTime(e.start_time)} to ${fmtTime(
                e.end_time
              )}`
            : "No Schedule";

          let imageUrl = "";
          if (e.course_image) {
            imageUrl = e.course_image.startsWith("http")
              ? e.course_image
              : `${import.meta.env.VITE_API_URL}${e.course_image}`;
          }

          // Check if online theoretical course
          const isOnlineTheoretical =
            (e.course_name ?? "").toLowerCase() ===
            "online theoretical driving course";

          // Check if has feedback from database
          const hasFeedback = e.has_feedback === true || e.has_feedback === 1;

          return (
            <div
              key={e.enrollment_id ?? Math.random()}
              className="bg-white shadow-lg rounded-xl p-4 lg:p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                {imageUrl && (
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <img
                      src={imageUrl}
                      alt={e.course_name ?? "Course"}
                      className="w-full max-w-xs lg:w-32 lg:h-32 object-cover rounded-lg shadow-md"
                      onError={(evt) =>
                        (evt.currentTarget.style.display = "none")
                      }
                    />
                  </div>
                )}

                <div className="flex-grow">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 text-center lg:text-left">
                    {e.course_name ?? "Unnamed Course"}
                  </h2>

                  <div className="space-y-2 mb-4">
                    {/* Schedule and Instructor only show if not OTDC */}
                    {!isOnlineTheoretical && (
                      <>
                        <div className="flex flex-col lg:flex-row lg:items-center text-gray-700">
                          <span className="text-sm font-medium">Schedule:</span>
                          <span className="text-sm lg:ml-2 break-words">
                            {scheduleLabel}
                          </span>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center text-gray-700">
                          <span className="text-sm font-medium">
                            Instructor:
                          </span>
                          <span className="text-sm lg:ml-2">
                            {e.instructor_name ?? "Wala pa"}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Status:
                      </span>
                      <span className="text-sm lg:ml-2 mt-1 lg:mt-0 inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold capitalize w-fit">
                        {e.status ?? "pending"}
                      </span>
                    </div>
                  </div>

                  {(e.status ?? "").toLowerCase() === "passed/completed" && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 lg:px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm text-sm lg:text-base"
                        onClick={() => generateCertificate(e.enrollment_id)}
                      >
                        Generate Certificate
                      </button>

                      {/* Feedback button - disabled if feedback already submitted */}
                      <button
                        className={`px-4 lg:px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm text-sm lg:text-base ${
                          hasFeedback
                            ? "bg-gray-400 cursor-not-allowed text-gray-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        onClick={() => !hasFeedback && handleOpenFeedback(e)}
                        disabled={hasFeedback}
                      >
                        {hasFeedback ? "Feedback Submitted" : "Give Feedback"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 self-start lg:self-auto text-center lg:text-right">
                  <span
                    className={`inline-block px-3 lg:px-4 py-2 rounded-lg font-semibold text-xs lg:text-sm ${
                      (e.payment_status ?? "").toLowerCase() === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {(e.payment_status ?? "unpaid").replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 lg:p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg lg:text-xl font-bold mb-4">
              Training Course Evaluation –{" "}
              {selectedEnrollment?.course_name ?? "Course"}
            </h2>
            <form onSubmit={handleSubmitFeedback}>
              {Object.entries(questions).map(
                ([category, items], categoryIndex) => (
                  <div key={categoryIndex} className="mb-6">
                    <h3 className="text-base lg:text-lg font-bold capitalize mb-2">
                      {category.replace(/_/g, " ")}
                    </h3>
                    {items.map((question, qIndex) => (
                      <div key={qIndex} className="mb-4">
                        <p className="font-semibold text-sm lg:text-base">
                          {qIndex + 1}. {question}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 lg:gap-4 mt-2">
                          {[
                            "Strongly Agree",
                            "Agree",
                            "Neutral",
                            "Disagree",
                            "Strongly Disagree",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-2 text-sm lg:text-base"
                            >
                              <input
                                type="radio"
                                name={`${category}_q${qIndex + 1}`}
                                value={option}
                                required
                                className="flex-shrink-0"
                              />{" "}
                              <span className="whitespace-nowrap">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              <div className="mb-4">
                <label className="block font-semibold mb-1 text-sm lg:text-base">
                  Comments about Instructor:
                </label>
                <textarea
                  name="instructor_comments"
                  className="w-full border rounded p-2 text-sm lg:text-base"
                  rows="3"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1 text-sm lg:text-base">
                  Additional Comments/Recommendations:
                </label>
                <textarea
                  name="comments"
                  className="w-full border rounded p-2 text-sm lg:text-base"
                  rows="4"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white text-sm lg:text-base order-2 sm:order-1"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white text-sm lg:text-base order-1 sm:order-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
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

    fetch(`${import.meta.env.VITE_API_URL}/api/student/feedback`, {
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

  if (loading) return <p className="p-6">Loading feedback...</p>;

  if (feedbacks.length === 0)
    return <p className="p-6">You have not submitted any feedback yet.</p>;

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
            <div className="text-gray-500 text-xs">Driving School</div>
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
              <div className="font-semibold text-gray-900">{name}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {[
            { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
            { name: "Courses", icon: <User className="w-5 h-5" /> },
            {
              name: "Enrollment Details",
              icon: <Users className="w-5 h-5" />,
            },
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
