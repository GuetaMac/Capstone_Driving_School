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
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  FileImage,
  AlertCircle,
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
  const [scheduleType, setScheduleType] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [scheduleId, setScheduleId] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [civilStatus, setCivilStatus] = useState("");

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/courses`)
      .then((res) => res.json())
      .then(setCourses)
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleBirthdayChange = (e) => {
    const selectedDate = e.target.value;
    setBirthday(selectedDate);
    if (selectedDate) {
      const calculatedAge = calculateAge(selectedDate);
      setAge(calculatedAge.toString());
    } else {
      setAge("");
    }
  };

  const isBeginnerCourse = (courseName) => {
    return courseName.toLowerCase().includes("beginner");
  };

  const isPracticalCourse = (courseName) => {
    return !courseName.toLowerCase().includes("theoretical");
  };

  const getScheduleDuration = (startTime, endTime) => {
    const start = parseInt(startTime.split(":")[0]);
    const end = parseInt(endTime.split(":")[0]);
    return end - start;
  };

  const categorizeSchedule = (schedule) => {
    const duration = getScheduleDuration(
      schedule.start_time,
      schedule.end_time
    );
    const startHour = parseInt(schedule.start_time.split(":")[0]);

    if (duration === 9) return { type: "2days", session: "day1" };
    if (duration === 4) {
      if (startHour === 8) return { type: "both", session: "morning" };
      if (startHour === 13) return { type: "both", session: "afternoon" };
    }
    return { type: "other", session: "other" };
  };

  useEffect(() => {
    if (scheduleType && courseSchedules.length > 0) {
      const filtered = courseSchedules.filter((schedule) => {
        const category = categorizeSchedule(schedule);
        if (scheduleType === "2days") {
          return category.type === "2days" || category.type === "both";
        } else if (scheduleType === "3days") {
          return category.type === "both";
        }
        return false;
      });
      setFilteredSchedules(filtered);
    } else if (
      !scheduleType &&
      courseSchedules.length > 0 &&
      isPracticalCourse(selectedCourse?.name)
    ) {
      const filtered = courseSchedules.filter((schedule) => {
        const category = categorizeSchedule(schedule);
        return category.type === "both";
      });
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(courseSchedules);
    }
  }, [scheduleType, courseSchedules, selectedCourse]);

  const fetchCourseSchedules = async (course_id, onlyTheory) => {
    try {
      const token = window.localStorage?.getItem("token");
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
    const token = window.localStorage?.getItem("token");
    if (!token) return alert("Please log in first.");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/check-active-enrollment`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (data.hasActive) {
        return alert(
          "You already have an active enrollment. Please complete it before enrolling in a new course."
        );
      }

      const onlyTheory = course.name.toLowerCase().includes("theoretical");
      setSelectedCourse(course);
      setAddress("");
      setContactNumber("");
      setReferenceNumber("");
      setProofImage(null);
      setScheduleId("");
      setScheduleType("");
      setFilteredSchedules([]);
      setSelectedSchedules([]);
      setSelectedDates([]);
      setBirthday("");
      setAge("");
      setNationality("");
      setCivilStatus("");
      setCurrentStep(1);
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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getSchedulesForDate = (date) => {
    const isBeginner = isBeginnerCourse(selectedCourse?.name);
    const isPractical = isPracticalCourse(selectedCourse?.name);

    const schedulesForDate = filteredSchedules.filter((sched) => {
      const schedDate = new Date(sched.start_date);
      return schedDate.toDateString() === date.toDateString();
    });

    if (isPractical && isBeginner && scheduleType === "2days") {
      if (selectedDates.length === 0) {
        return schedulesForDate.filter((s) => {
          const duration = getScheduleDuration(s.start_time, s.end_time);
          return duration === 9;
        });
      } else if (selectedDates.length === 1) {
        return schedulesForDate.filter((s) => {
          const duration = getScheduleDuration(s.start_time, s.end_time);
          return duration === 4;
        });
      }
    }

    return schedulesForDate;
  };

  const hasAvailableSlots = (schedules) => {
    return schedules.some((s) => s.slots > 0);
  };

  const handleDateClick = (date, schedules) => {
    if (schedules.length === 0) return;
    if (!hasAvailableSlots(schedules)) return;

    const dateStr = date.toISOString().split("T")[0];
    const isPractical = isPracticalCourse(selectedCourse.name);
    const isBeginner = isBeginnerCourse(selectedCourse.name);

    if (!isPractical) {
      setSelectedDates([{ date: dateStr, schedules }]);
      return;
    }

    if (isBeginner && scheduleType === "2days") {
      const requiredDays = 2;
      const existingIndex = selectedDates.findIndex((d) => d.date === dateStr);

      if (existingIndex >= 0) {
        setSelectedDates(selectedDates.filter((_, i) => i !== existingIndex));
      } else if (selectedDates.length < requiredDays) {
        const dayNumber = selectedDates.length + 1;

        if (dayNumber === 1) {
          const fullDaySchedules = schedules.filter((s) => {
            const duration = getScheduleDuration(s.start_time, s.end_time);
            return duration === 9;
          });

          if (fullDaySchedules.length === 0) {
            alert("Day 1 must be a full day session (8am-5pm)");
            return;
          }

          setSelectedDates([
            ...selectedDates,
            { date: dateStr, schedules: fullDaySchedules, dayNumber },
          ]);
        } else if (dayNumber === 2) {
          const fourHourSchedules = schedules.filter((s) => {
            const duration = getScheduleDuration(s.start_time, s.end_time);
            return duration === 4;
          });

          if (fourHourSchedules.length === 0) {
            alert("Day 2 must be a 4-hour session (morning or afternoon)");
            return;
          }

          setSelectedDates([
            ...selectedDates,
            { date: dateStr, schedules: fourHourSchedules, dayNumber },
          ]);
        }
      } else {
        alert("You can only select 2 days for the 2-day schedule");
      }
    } else {
      const requiredDays = isBeginner && scheduleType === "3days" ? 3 : 2;
      const existingIndex = selectedDates.findIndex((d) => d.date === dateStr);

      if (existingIndex >= 0) {
        setSelectedDates(selectedDates.filter((_, i) => i !== existingIndex));
      } else if (selectedDates.length < requiredDays) {
        const fourHourSchedules = schedules.filter((s) => {
          const duration = getScheduleDuration(s.start_time, s.end_time);
          return duration === 4;
        });

        if (fourHourSchedules.length === 0) {
          alert("Please select a 4-hour session (morning or afternoon)");
          return;
        }

        setSelectedDates([
          ...selectedDates,
          {
            date: dateStr,
            schedules: fourHourSchedules,
            dayNumber: selectedDates.length + 1,
          },
        ]);
      } else {
        alert(`You can only select ${requiredDays} days`);
      }
    }
  };

  const handleScheduleSelect = (dateStr, scheduleId) => {
    const updatedDates = selectedDates.map((d) => {
      if (d.date === dateStr) {
        return { ...d, selectedScheduleId: scheduleId };
      }
      return d;
    });
    setSelectedDates(updatedDates);
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const isOnlineTheory = selectedCourse.name
        .toLowerCase()
        .includes("online theoretical");

      if (isOnlineTheory) return true;

      const isPractical = isPracticalCourse(selectedCourse.name);
      const isBeginner = isBeginnerCourse(selectedCourse.name);

      if (isPractical && isBeginner && !scheduleType) {
        alert("Please choose a schedule type (2-day or 3-day)");
        return false;
      }

      if (isPractical) {
        const requiredDays = isBeginner
          ? scheduleType === "2days"
            ? 2
            : 3
          : 2;

        if (selectedDates.length !== requiredDays) {
          alert(`Please select ${requiredDays} schedule dates`);
          return false;
        }

        const allSchedulesSelected = selectedDates.every(
          (d) => d.selectedScheduleId
        );
        if (!allSchedulesSelected) {
          alert("Please select a time slot for each date");
          return false;
        }
      } else if (!isPractical && selectedDates.length === 0) {
        alert("Please select a schedule");
        return false;
      } else if (
        !isPractical &&
        selectedDates.length > 0 &&
        !selectedDates[0].selectedScheduleId
      ) {
        alert("Please select a time slot");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.localStorage?.getItem("token");
    if (!token) {
      return alert("You must be logged in.");
    }

    const isOnlineTheory = selectedCourse.name
      .toLowerCase()
      .includes("online theoretical");

    const formData = new FormData();
    formData.append("course_id", selectedCourse.course_id);

    if (!isOnlineTheory) {
      const isPractical = isPracticalCourse(selectedCourse.name);

      if (isPractical) {
        const scheduleIds = selectedDates.map((d) => d.selectedScheduleId);
        formData.append("schedule_ids", JSON.stringify(scheduleIds));
      } else {
        formData.append("schedule_id", selectedDates[0]?.selectedScheduleId);
      }
    }

    formData.append("address", address);
    formData.append("contact_number", contactNumber);
    formData.append("gcash_reference_number", referenceNumber);
    formData.append("proof_image", proofImage);
    formData.append("birthday", birthday);
    formData.append("age", age);
    formData.append("nationality", nationality);
    formData.append("civil_status", civilStatus);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Success! Your enrollment has been submitted.");
        setShowEnrollModal(false);
      } else {
        const data = await res.json();
        alert(data.error || "Enrollment failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isBeginner = isBeginnerCourse(selectedCourse?.name);
    const isPractical = isPracticalCourse(selectedCourse?.name);

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 sm:h-24 bg-gray-50"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const schedules = getSchedulesForDate(date);
      const dateStr = date.toISOString().split("T")[0];
      const isSelected = selectedDates.some((d) => d.date === dateStr);
      const isPast = date < today;
      const hasSchedules = schedules.length > 0;
      const hasSlots = hasAvailableSlots(schedules);
      const isFullyBooked = hasSchedules && !hasSlots;

      let scheduleBadge = null;
      if (
        hasSchedules &&
        !isPast &&
        isPractical &&
        isBeginner &&
        scheduleType === "2days"
      ) {
        const has9Hour = schedules.some(
          (s) => getScheduleDuration(s.start_time, s.end_time) === 9
        );
        const has4Hour = schedules.some(
          (s) => getScheduleDuration(s.start_time, s.end_time) === 4
        );

        if (selectedDates.length === 0 && has9Hour) {
          scheduleBadge = (
            <span className="text-[9px] sm:text-[10px] font-semibold text-blue-600">
              FULL
            </span>
          );
        } else if (selectedDates.length === 1 && has4Hour) {
          scheduleBadge = (
            <span className="text-[9px] sm:text-[10px] font-semibold text-purple-600">
              4HR
            </span>
          );
        }
      }

      days.push(
        <div
          key={day}
          onClick={() => !isPast && handleDateClick(date, schedules)}
          className={`h-16 sm:h-24 border p-1 transition-all ${
            isPast
              ? "bg-gray-100 cursor-not-allowed opacity-50"
              : isSelected
              ? "bg-red-100 border-red-500 border-2 cursor-pointer"
              : hasSchedules && hasSlots
              ? "bg-white hover:bg-green-50 border-green-200 cursor-pointer hover:shadow-md"
              : isFullyBooked
              ? "bg-red-50 border-red-200 cursor-not-allowed"
              : "bg-gray-50 cursor-not-allowed"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isSelected
                    ? "text-red-600"
                    : isFullyBooked
                    ? "text-red-400"
                    : "text-gray-700"
                }`}
              >
                {day}
              </span>
              {scheduleBadge}
            </div>
            {hasSchedules && !isPast && (
              <div className="flex-1 flex flex-col items-center justify-center gap-0.5 sm:gap-1">
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                    isSelected
                      ? "bg-red-600"
                      : hasSlots
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                {hasSlots && !isSelected && (
                  <span className="text-[8px] sm:text-[9px] text-gray-600 font-medium">
                    {schedules.reduce((sum, s) => sum + s.slots, 0)} slots
                  </span>
                )}
              </div>
            )}
            {isSelected && (
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 ml-auto" />
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const isOnlineTheoretical = selectedCourse?.name
    .toLowerCase()
    .includes("online theoretical");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-red-600 text-center">
          Available Courses
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No courses available.
            </p>
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

      {showEnrollModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 text-white relative">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 sm:p-2 transition"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <h2 className="text-lg sm:text-2xl font-bold mb-2 pr-8">
                Enroll in {selectedCourse.name}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                  GCash: 09171234567
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">
                    Downpayment: ₱{(selectedCourse.price * 0.5).toFixed(2)}
                  </span>
                </span>
              </div>
            </div>

            {!isOnlineTheoretical && (
              <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between w-full">
                  {["Schedule", "Personal Info", "Payment"].map(
                    (step, index) => (
                      <div key={index} className="flex items-center flex-1">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2">
                          <div
                            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-semibold text-xs sm:text-sm flex-shrink-0 ${
                              currentStep > index + 1
                                ? "bg-green-500 text-white"
                                : currentStep === index + 1
                                ? "bg-red-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {currentStep > index + 1 ? "✓" : index + 1}
                          </div>
                          <span
                            className={`text-[10px] sm:text-sm font-medium text-center sm:text-left ${
                              currentStep === index + 1
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                        {index < 2 && (
                          <div className="flex-1 h-0.5 bg-gray-300 mx-1 sm:mx-2 min-w-[20px] sm:min-w-[40px]"></div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {isOnlineTheoretical && (
              <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between w-full">
                  {["Personal Info", "Payment"].map((step, index) => (
                    <div key={index} className="flex items-center flex-1">
                      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2">
                        <div
                          className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-semibold text-xs sm:text-sm flex-shrink-0 ${
                            currentStep > index + 1
                              ? "bg-green-500 text-white"
                              : currentStep === index + 1
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {currentStep > index + 1 ? "✓" : index + 1}
                        </div>
                        <span
                          className={`text-[10px] sm:text-sm font-medium text-center sm:text-left ${
                            currentStep === index + 1
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {index < 1 && (
                        <div className="flex-1 h-0.5 bg-gray-300 mx-1 sm:mx-2 min-w-[20px] sm:min-w-[40px]"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {!isOnlineTheoretical && currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    {isPracticalCourse(selectedCourse.name) &&
                      isBeginnerCourse(selectedCourse.name) && (
                        <div className="space-y-3">
                          <label className="block text-base sm:text-lg font-semibold text-gray-800">
                            Choose Schedule Type
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {["2days", "3days"].map((type) => (
                              <div
                                key={type}
                                onClick={() => {
                                  setScheduleType(type);
                                  setSelectedSchedules([]);
                                  setSelectedDates([]);
                                }}
                                className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-all ${
                                  scheduleType === type
                                    ? "border-red-500 bg-red-50 shadow-md"
                                    : "border-gray-300 hover:border-red-300 hover:shadow"
                                }`}
                              >
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <input
                                    type="radio"
                                    name="scheduleType"
                                    value={type}
                                    checked={scheduleType === type}
                                    onChange={() => {
                                      setScheduleType(type);
                                      setSelectedSchedules([]);
                                      setSelectedDates([]);
                                    }}
                                    className="mt-1"
                                  />
                                  <div>
                                    <div className="font-bold text-gray-800 text-sm sm:text-base">
                                      {type === "2days"
                                        ? "2-Day Schedule"
                                        : "3-Day Schedule"}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                      {type === "2days" ? (
                                        <>
                                          Day 1: 8am-5pm (9hrs) • Day 2: 4hrs
                                          session
                                        </>
                                      ) : (
                                        <>3 sessions of 4 hours each</>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {(isPracticalCourse(selectedCourse.name)
                      ? isBeginnerCourse(selectedCourse.name)
                        ? scheduleType
                        : true
                      : true) && (
                      <div className="space-y-3 sm:space-y-4">
                        {isPracticalCourse(selectedCourse.name) &&
                          isBeginnerCourse(selectedCourse.name) &&
                          scheduleType === "2days" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs sm:text-sm text-blue-800">
                                  <p className="font-semibold mb-1">
                                    2-Day Schedule Instructions:
                                  </p>
                                  <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                      First, select your{" "}
                                      <strong>Day 1 (Full Day 8am-5pm)</strong>{" "}
                                      from the calendar below
                                    </li>
                                    <li>
                                      Then, select your{" "}
                                      <strong>Day 2 (4 hours)</strong> - choose
                                      morning OR afternoon session
                                    </li>
                                  </ol>
                                </div>
                              </div>
                            </div>
                          )}

                        {isPracticalCourse(selectedCourse.name) &&
                          isBeginnerCourse(selectedCourse.name) &&
                          scheduleType === "3days" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs sm:text-sm text-blue-800">
                                  <p className="font-semibold mb-1">
                                    3-Day Schedule Instructions:
                                  </p>
                                  <p>
                                    Select 3 dates with 4-hour sessions each.
                                    You can choose morning (8am-12pm) OR
                                    afternoon (1pm-5pm) for each day.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {isPracticalCourse(selectedCourse.name) &&
                          !isBeginnerCourse(selectedCourse.name) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs sm:text-sm text-blue-800">
                                  <p className="font-semibold mb-1">
                                    2-Day Schedule Instructions:
                                  </p>
                                  <p>
                                    Select 2 dates with 4-hour sessions each.
                                    You can choose morning (8am-12pm) OR
                                    afternoon (1pm-5pm) for each day.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <label className="block text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                            <span className="text-sm sm:text-base">
                              {isPracticalCourse(selectedCourse.name) &&
                              isBeginnerCourse(selectedCourse.name) &&
                              scheduleType === "2days" &&
                              selectedDates.length === 0
                                ? "Step 1: Select Day 1 (Full Day 8am-5pm)"
                                : isPracticalCourse(selectedCourse.name) &&
                                  isBeginnerCourse(selectedCourse.name) &&
                                  scheduleType === "2days" &&
                                  selectedDates.length === 1
                                ? "Step 2: Select Day 2 (4-hour session)"
                                : "Select Schedule Dates"}
                            </span>
                          </label>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                              <span>Available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                              <span>Full</span>
                            </div>
                            {isPracticalCourse(selectedCourse.name) &&
                              isBeginnerCourse(selectedCourse.name) &&
                              scheduleType === "2days" && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-100 px-1 rounded">
                                      FULL
                                    </span>
                                    <span>9hrs</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-xs font-semibold text-purple-600 bg-purple-100 px-1 rounded">
                                      4HR
                                    </span>
                                    <span>4hrs</span>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <button
                            type="button"
                            onClick={prevMonth}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                          >
                            ← Prev
                          </button>
                          <h3 className="text-base sm:text-xl font-bold text-gray-800">
                            {currentMonth.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </h3>
                          <button
                            type="button"
                            onClick={nextMonth}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                          >
                            Next →
                          </button>
                        </div>

                        <div className="bg-white border rounded-lg overflow-hidden">
                          <div className="grid grid-cols-7 bg-gray-100">
                            {[
                              "Sun",
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ].map((day) => (
                              <div
                                key={day}
                                className="text-center py-1.5 sm:py-2 font-semibold text-gray-700 text-[10px] sm:text-sm"
                              >
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7">
                            {renderCalendar()}
                          </div>
                        </div>

                        {selectedDates.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold text-red-800 mb-3 text-sm sm:text-base">
                              Selected Dates ({selectedDates.length})
                              {isPracticalCourse(selectedCourse.name) &&
                                isBeginnerCourse(selectedCourse.name) &&
                                scheduleType && (
                                  <span className="text-xs sm:text-sm font-normal text-red-600 ml-2">
                                    (Need {scheduleType === "2days" ? "2" : "3"}{" "}
                                    dates)
                                  </span>
                                )}
                            </h4>
                            <div className="space-y-2 sm:space-y-3">
                              {selectedDates.map((dateObj, index) => (
                                <div
                                  key={dateObj.date}
                                  className="bg-white p-2.5 sm:p-3 rounded-lg border border-red-200"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                                      Day {dateObj.dayNumber || index + 1}:{" "}
                                      {new Date(
                                        dateObj.date
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSelectedDates(
                                          selectedDates.filter(
                                            (_, i) => i !== index
                                          )
                                        )
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                  </div>
                                  <select
                                    value={dateObj.selectedScheduleId || ""}
                                    onChange={(e) =>
                                      handleScheduleSelect(
                                        dateObj.date,
                                        e.target.value
                                      )
                                    }
                                    className="w-full border rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm"
                                    required
                                  >
                                    <option value="">
                                      -- select time slot --
                                    </option>
                                    {dateObj.schedules.map((sched) => {
                                      const duration = getScheduleDuration(
                                        sched.start_time,
                                        sched.end_time
                                      );
                                      const sessionLabel =
                                        duration === 9
                                          ? "(Full Day)"
                                          : parseInt(
                                              sched.start_time.split(":")[0]
                                            ) === 8
                                          ? "(Morning)"
                                          : "(Afternoon)";
                                      const isFullyBooked = sched.slots <= 0;

                                      return (
                                        <option
                                          key={sched.schedule_id}
                                          value={sched.schedule_id}
                                          disabled={isFullyBooked}
                                        >
                                          {formatTime(sched.start_time)} -{" "}
                                          {formatTime(sched.end_time)}{" "}
                                          {sessionLabel}
                                          {isFullyBooked
                                            ? " - FULLY BOOKED"
                                            : ` (${sched.slots} slots)`}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {((isOnlineTheoretical && currentStep === 1) ||
                  (!isOnlineTheoretical && currentStep === 2)) && (
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3 sm:mb-4">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
                          Birthday
                        </label>
                        <input
                          type="date"
                          value={birthday}
                          onChange={handleBirthdayChange}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 focus:border-red-500 focus:outline-none text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
                          Age
                        </label>
                        <input
                          type="number"
                          value={age}
                          readOnly
                          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 bg-gray-100 text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
                          Nationality
                        </label>
                        <input
                          type="text"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 focus:border-red-500 focus:outline-none text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
                          Civil Status
                        </label>
                        <select
                          value={civilStatus}
                          onChange={(e) => setCivilStatus(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 focus:border-red-500 focus:outline-none text-sm sm:text-base"
                          required
                        >
                          <option value="">-- select civil status --</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Separated">Separated</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 focus:border-red-500 focus:outline-none text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 focus:border-red-500 focus:outline-none text-sm sm:text-base"
                        pattern="^09\d{9}$"
                        title="Must start with 09 and contain 11 digits"
                        placeholder="09XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                )}

                {((isOnlineTheoretical && currentStep === 2) ||
                  (!isOnlineTheoretical && currentStep === 3)) && (
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3 sm:mb-4">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      Payment Information
                    </h3>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                      <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">
                        Payment Instructions
                      </h4>
                      <ul className="text-xs sm:text-sm text-red-700 space-y-1 list-disc list-inside">
                        <li>
                          Send payment to GCash: <strong>09171234567</strong>
                        </li>
                        <li>
                          Amount:{" "}
                          <strong>
                            ₱{(selectedCourse.price * 0.5).toFixed(2)}
                          </strong>{" "}
                          (50% downpayment)
                        </li>
                        <li>Take a screenshot of the payment confirmation</li>
                        <li>
                          Enter the reference number and upload the screenshot
                          below
                        </li>
                      </ul>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
                        GCash Reference Number
                      </label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 sm:px-4 focus:border-red-500 focus:outline-none text-sm sm:text-base"
                        pattern="^\d{11}$"
                        title="Must be exactly 11 digits"
                        placeholder="Enter 11-digit reference number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <FileImage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                        Proof of Payment (Screenshot)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-red-500 transition-colors">
                        <input
                          id="proofImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProofImage(e.target.files[0])}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="proofImage"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          {proofImage ? (
                            <>
                              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                              <span className="text-green-600 font-semibold text-sm sm:text-base break-all px-2">
                                {proofImage.name}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500">
                                Click to change file
                              </span>
                            </>
                          ) : (
                            <>
                              <FileImage className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                              <span className="text-gray-600 font-semibold text-sm sm:text-base">
                                Click to upload screenshot
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500">
                                PNG, JPG up to 10MB
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                        Enrollment Summary
                      </h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Course:</span>
                          <span className="font-semibold text-gray-800 text-right ml-2">
                            {selectedCourse.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Price:</span>
                          <span className="font-semibold text-gray-800">
                            ₱{selectedCourse.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Downpayment (50%):
                          </span>
                          <span className="font-semibold text-red-600">
                            ₱{(selectedCourse.price * 0.5).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-gray-600">
                            Remaining Balance:
                          </span>
                          <span className="font-semibold text-gray-800">
                            ₱{(selectedCourse.price * 0.5).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 border-t">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
                    >
                      ← Back
                    </button>
                  )}

                  {(isOnlineTheoretical && currentStep < 2) ||
                  (!isOnlineTheoretical && currentStep < 3) ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto sm:ml-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold text-sm sm:text-base"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full sm:w-auto sm:ml-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Submit Enrollment
                    </button>
                  )}
                </div>
              </form>
            </div>
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
          // Check if online theoretical course
          const isOnlineTheoretical =
            (e.course_name ?? "").toLowerCase() ===
            "online theoretical driving course";

          // Check if has feedback from database
          const hasFeedback = e.has_feedback === true || e.has_feedback === 1;

          // Handle multiple schedules (practical courses)
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
                    {/* Schedule - only show if not OTDC */}
                    {!isOnlineTheoretical && (
                      <>
                        {hasMultipleSchedules ? (
                          <div className="text-gray-700">
                            <span className="text-sm font-medium block mb-2">
                              Schedules:
                            </span>
                            <div className="space-y-1 pl-2">
                              {e.multiple_schedules.map((sched, idx) => (
                                <div key={idx} className="text-sm">
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
                          <div className="flex flex-col lg:flex-row lg:items-center text-gray-700">
                            <span className="text-sm font-medium">
                              Schedule:
                            </span>
                            <span className="text-sm lg:ml-2 break-words">
                              {e.start_date
                                ? e.is_theoretical
                                  ? `${fmtDate(
                                      new Date(e.start_date)
                                    )} to ${fmtDate(
                                      new Date(
                                        new Date(e.start_date).getTime() +
                                          86400000
                                      )
                                    )} — ${fmtTime(e.start_time)} to ${fmtTime(
                                      e.end_time
                                    )}`
                                  : `${fmtDate(
                                      new Date(e.start_date)
                                    )} — ${fmtTime(e.start_time)} to ${fmtTime(
                                      e.end_time
                                    )}`
                                : "No Schedule"}
                            </span>
                          </div>
                        )}

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
