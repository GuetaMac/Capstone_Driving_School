import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Car,
} from "lucide-react";

const EnrollmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCourse = location.state?.course;

  const [course, setCourse] = useState(initialCourse);
  const [currentStep, setCurrentStep] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hasActiveEnrollment, setHasActiveEnrollment] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [studentBranch, setStudentBranch] = useState(null);

  // Pre-enrollment state
  const [hasStudentPermit, setHasStudentPermit] = useState(null);
  const [studentPermitProof, setStudentPermitProof] = useState(null);
  const [discountType, setDiscountType] = useState("none"); // 'none', 'pwd', 'senior'
  const [discountProof, setDiscountProof] = useState(null);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    address: "",
    contact_number: "",
    birthday: "",
    age: "",
    nationality: "",
    civil_status: "",
    gender: "",
    is_pregnant: "false",
  });

  // Payment Info State
  const [paymentInfo, setPaymentInfo] = useState({
    gcash_reference_number: "",
    proof_image: null,
  });

  if (!initialCourse) {
    navigate("/student_dashboard");
    return null;
  }

  // Parse schedule configuration from course
  const scheduleConfig = course?.schedule_config
    ? typeof course.schedule_config === "string"
      ? JSON.parse(course.schedule_config)
      : course.schedule_config
    : [{ day: 1, hours: 4, time: "flexible" }];

  const requiredSchedules = course?.required_schedules || 1;

  // Calculate prices with PWD discount
  // Calculate prices with discount
  const originalPrice = parseFloat(course.price);
  const getDiscountAmount = () => {
    if (discountType === "pwd" || discountType === "senior") {
      return originalPrice * 0.2; // 20% discount
    }
    return 0;
  };
  const discountAmount = getDiscountAmount();
  const discountedPrice = originalPrice - discountAmount;
  const downpaymentAmount = discountedPrice * 0.5;

  const isTheoretical = course.mode === "ftof";
  const isOnlineTheoretical = course.mode === "online";
  const requiresStudentPermit = !isTheoretical && !isOnlineTheoretical;

  // Get vehicle category directly from course data
  const getVehicleCategory = () => {
    if (course?.vehicle_category) {
      return course.vehicle_category;
    }
    return null;
  };

  const isScheduleDateValid = (newSchedule) => {
    if (selectedSchedules.length === 0) return true;

    // Extract date strings properly
    const lastSelectedDateStr =
      selectedSchedules[selectedSchedules.length - 1].start_date.split("T")[0];
    const newScheduleDateStr = newSchedule.start_date.split("T")[0];

    const [lastYear, lastMonth, lastDay] = lastSelectedDateStr
      .split("-")
      .map(Number);
    const [newYear, newMonth, newDay] = newScheduleDateStr
      .split("-")
      .map(Number);

    const lastSelectedDate = new Date(lastYear, lastMonth - 1, lastDay);
    const newScheduleDate = new Date(newYear, newMonth - 1, newDay);

    lastSelectedDate.setHours(0, 0, 0, 0);
    newScheduleDate.setHours(0, 0, 0, 0);

    return newScheduleDate > lastSelectedDate;
  };
  useEffect(() => {
    checkActiveEnrollment();
    fetchFullCourseDetails();
    fetchStudentBranch();
    fetchPreviousEnrollmentInfo();
  }, []);

  useEffect(() => {
    if (!isOnlineTheoretical && course) {
      fetchSchedules();
    }
  }, [currentMonth, course]);

  useEffect(() => {
    if (!isOnlineTheoretical && course) {
      fetchSchedules();
    }
  }, [currentMonth, course]);

  // 👇 ILAGAY MO TO DITO - AUTO CALCULATE AGE
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

      if (personalInfo.age !== age.toString()) {
        setPersonalInfo((prev) => ({
          ...prev,
          age: age.toString(),
        }));
      }
    }
  }, [personalInfo.birthday]);

  const fetchFullCourseDetails = async () => {
    setLoadingCourse(true);
    try {
      const token = window.localStorage?.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/${initialCourse.course_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setCourse(data);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoadingCourse(false);
    }
  };

  const fetchStudentBranch = async () => {
    try {
      const token = window.localStorage?.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/student-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStudentBranch(data.branch_id);
      }
    } catch (error) {
      console.error("Error fetching student branch:", error);
    }
  };
  const fetchPreviousEnrollmentInfo = async () => {
    try {
      const token = window.localStorage?.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/student-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.ok && data) {
        let formattedBirthday = "";
        if (data.birthday) {
          const date = new Date(data.birthday);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          formattedBirthday = `${year}-${month}-${day}`;
        }

        // Auto-fill from user's profile (from users table)
        setPersonalInfo({
          address: data.address || "",
          contact_number: data.contact_number || "",
          birthday: formattedBirthday,
          age: data.age?.toString() || "",
          nationality: data.nationality || "",
          civil_status: data.civil_status || "",
          gender: data.gender || "",
          is_pregnant: "false", // Default value, user can change if needed
        });

        console.log("✅ Auto-filled personal info from user registration");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  const checkActiveEnrollment = async () => {
    setCheckingEnrollment(true);
    try {
      const token = window.localStorage?.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/check-active-enrollment`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.hasActive) {
        setHasActiveEnrollment(true);
        await Swal.fire({
          icon: "warning",
          title: "Active Enrollment Found",
          text: "You already have an active enrollment. Please complete or finish your current enrollment before enrolling in a new course.",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
        navigate("/student_dashboard");
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    } finally {
      setCheckingEnrollment(false);
    }
  };
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const token = window.localStorage?.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/schedules/with-availability?course_id=${course.course_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      let filtered = data.filter((s) =>
        isTheoretical ? s.is_theoretical : !s.is_theoretical
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((s) => {
        // Extract date string from DB and parse properly
        const scheduleDateStr = s.start_date.split("T")[0];
        const [year, month, day] = scheduleDateStr.split("-").map(Number);
        const schedDate = new Date(year, month - 1, day);
        schedDate.setHours(0, 0, 0, 0);

        return schedDate >= today && s.slots > 0;
      });

      setSchedules(filtered);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      await Swal.fire({
        icon: "error",
        title: "Error Loading Schedules",
        text: "Failed to load available schedules. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScheduleDuration = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    const durationInMinutes = endTotalMin - startTotalMin;
    const clockHours = durationInMinutes / 60;
    // Only subtract 1hr for lunch if duration >= 8
    if (clockHours >= 8) {
      return clockHours - 1;
    }
    return clockHours;
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

  const formatDate = (dateStr) => {
    console.log("=== FORMAT DATE DEBUG ===");
    console.log("Input dateStr:", dateStr);

    // Extract YYYY-MM-DD from database string (ignore timezone)
    const scheduleDateStr = dateStr.split("T")[0];
    console.log("After split:", scheduleDateStr);

    const [year, month, day] = scheduleDateStr.split("-").map(Number);
    console.log("Parsed values:", { year, month, day });

    // Create date in LOCAL timezone
    const date = new Date(year, month - 1, day);
    console.log("Created date object:", date);
    console.log("Date string:", date.toDateString());

    const result = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    console.log("Final result:", result);
    console.log("========================");

    return result;
  };

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
    // Use local date without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return getFilteredSchedules().filter((s) => {
      const schedDate = s.start_date.split("T")[0];
      return schedDate === dateStr;
    });
  };

  const isDateSelected = (date) => {
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

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const getFilteredSchedules = () => {
    if (selectedSchedules.length >= requiredSchedules) {
      return [];
    }
    const currentDayIndex = selectedSchedules.length;
    const currentConfig = scheduleConfig[currentDayIndex];
    if (!currentConfig) return [];
    return schedules.filter((s) => {
      const duration = getScheduleDuration(s.start_time, s.end_time);
      const alreadySelected = selectedSchedules.some(
        (selected) => selected.schedule_id === s.schedule_id
      );
      if (alreadySelected) return false;
      // Allow for floating point difference (e.g. 3 vs 3.000...01)
      if (Math.abs(currentConfig.hours - duration) > 0.05) return false;
      if (currentConfig.time && currentConfig.time !== "flexible") {
        const startHour = parseInt(s.start_time.split(":")[0]);
        if (
          currentConfig.time.includes("am") ||
          currentConfig.time.includes("pm")
        ) {
          const timeMatch = currentConfig.time.match(
            /(\d{1,2}):?(\d{2})?\s*(am|pm)/i
          );
          if (timeMatch) {
            let configHour = parseInt(timeMatch[1]);
            const period = timeMatch[3].toLowerCase();
            if (period === "pm" && configHour !== 12) {
              configHour += 12;
            } else if (period === "am" && configHour === 12) {
              configHour = 0;
            }
            if (startHour !== configHour) return false;
          }
        } else if (currentConfig.time === "morning") {
          if (startHour !== 8) return false;
        } else if (currentConfig.time === "afternoon") {
          if (startHour !== 13) return false;
        }
      }
      return true;
    });
  };

  const handleScheduleSelect = async (schedule) => {
    // ✅ Check if no vehicles available
    if (schedule.available_vehicles === 0) {
      await Swal.fire({
        icon: "warning",
        title: "No Vehicles Available",
        text: "All vehicles are booked for this time slot. Please choose a different schedule.",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!isScheduleDateValid(schedule)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Schedule Selection",
        text: "Please select schedules in chronological order.",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    if (selectedSchedules.length >= requiredSchedules) {
      await Swal.fire({
        icon: "info",
        title: "Schedule Limit Reached",
        text: `You can only select ${requiredSchedules} schedule(s) for this course.`,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    setSelectedSchedules([...selectedSchedules, schedule]);
  };

  const handleRemoveSchedule = (index) => {
    setSelectedSchedules(selectedSchedules.filter((_, i) => i !== index));
  };

  const handleNextToPersonalInfo = async () => {
    if (selectedSchedules.length !== requiredSchedules) {
      await Swal.fire({
        icon: "warning",
        title: "Schedule Selection Required",
        text: `Please select ${requiredSchedules} schedule(s) for this course.`,
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    setCurrentStep(2);
  };

  const handleNextToPayment = async () => {
    const {
      address,
      contact_number,
      birthday,
      age,
      nationality,
      civil_status,
      gender,
    } = personalInfo;

    if (
      !address ||
      !contact_number ||
      !birthday ||
      !age ||
      !nationality ||
      !civil_status ||
      !gender
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!/^(09|\+639)\d{9}$/.test(contact_number)) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid Philippine phone number (09xxxxxxxxx or +639xxxxxxxxx)",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Age",
        text: "Please enter a valid age (18-100)",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    if (
      gender === "Female" &&
      !isOnlineTheoretical &&
      personalInfo.is_pregnant === "true"
    ) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Medical Certificate Required",
        text: "You indicated that you are pregnant. You will need to bring a medical certificate from your doctor. Do you want to continue?",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Continue",
        cancelButtonText: "Cancel",
      });
      if (!result.isConfirmed) return;
    }

    setCurrentStep(isOnlineTheoretical ? 2 : 3);
  };

  const handleSubmitEnrollment = async () => {
    if (!paymentInfo.gcash_reference_number || !paymentInfo.proof_image) {
      await Swal.fire({
        icon: "warning",
        title: "Payment Information Required",
        text: "Please provide GCash reference number and proof of payment",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    const gcashRef = paymentInfo.gcash_reference_number.replace(/\s/g, "");
    if (!/^\d{13}$/.test(gcashRef)) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Reference Number",
        text: "GCash reference number must be exactly 13 digits",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
      return;
    }

    setSubmitting(true);

    try {
      const token = window.localStorage?.getItem("token");
      const formData = new FormData();

      formData.append("course_id", course.course_id);
      formData.append("address", personalInfo.address);
      formData.append("contact_number", personalInfo.contact_number);
      formData.append("birthday", personalInfo.birthday);
      formData.append("age", personalInfo.age);
      formData.append("nationality", personalInfo.nationality);
      formData.append("civil_status", personalInfo.civil_status);
      formData.append("gender", personalInfo.gender);
      formData.append("is_pregnant", personalInfo.is_pregnant);
      formData.append(
        "gcash_reference_number",
        paymentInfo.gcash_reference_number
      );
      formData.append("proof_image", paymentInfo.proof_image);

      // Add discount info
      formData.append("discount_type", discountType);
      if (discountProof) {
        formData.append("discount_proof", discountProof);
      }
      if (studentPermitProof) {
        formData.append("student_permit_proof", studentPermitProof);
      }

      const vehicleCategory = getVehicleCategory();
      if (vehicleCategory && course.type) {
        formData.append("vehicle_category", vehicleCategory);
        formData.append("vehicle_type", course.type);
      }

      const amountPaid = isOnlineTheoretical
        ? discountedPrice
        : downpaymentAmount;
      formData.append(
        "payment_type",
        isOnlineTheoretical ? "full" : "downpayment"
      );
      formData.append("amount_paid", amountPaid.toFixed(2));

      if (selectedSchedules.length > 0) {
        const scheduleIds = selectedSchedules.map((s) => s.schedule_id);
        formData.append("schedule_ids", JSON.stringify(scheduleIds));
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Enrollment Successful!",
          text: "Your enrollment has been submitted successfully.",
          confirmButtonColor: "#10b981",
          confirmButtonText: "Go to Dashboard",
        });
        navigate("/student_dashboard");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Enrollment Failed",
          text: data.error || "Something went wrong. Please try again.",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Failed to submit enrollment. Please check your internet connection and try again.",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const getScheduleInstructions = () => {
    return scheduleConfig
      .map((config, index) => {
        let timeStr = "any time";

        if (config.time && config.time !== "flexible") {
          if (config.time.includes("am") || config.time.includes("pm")) {
            timeStr = config.time;
          } else if (config.time === "morning") {
            timeStr = "8:00am start";
          } else if (config.time === "afternoon") {
            timeStr = "1:00pm start";
          }
        }

        return `Day ${index + 1}: ${config.hours} hours (${timeStr})`;
      })
      .join("\n• ");
  };

  // Get GCash details based on student's branch
  const getGCashDetails = () => {
    if (studentBranch === 1) {
      // Tanuan Branch
      return {
        number: "09959103180",
        name: "CH******N CE***E C.",
      };
    } else if (studentBranch === 2) {
      // San Pablo Branch
      return {
        number: "09495094742",
        name: "CH******N CE***E C.",
      };
    }
    // Default fallback
    return {
      number: "09123456789",
      name: "Driving School",
    };
  };

  const gcashDetails = getGCashDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/student_dashboard")}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-4 sm:mb-6 font-semibold text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Back to Dashboard</span>
          <span className="xs:hidden">Back</span>
        </button>

        {checkingEnrollment || loadingCourse ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                {checkingEnrollment
                  ? "Checking enrollment status..."
                  : "Loading course details..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mb-2">
                Enroll in {course?.name || "Course"}
              </h1>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">
                {course?.description || ""}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  ₱{course?.price || "0"}
                </p>
                {course?.type && !isTheoretical && !isOnlineTheoretical && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <Car className="w-3 h-3 mr-1" />
                    {course.type.charAt(0).toUpperCase() +
                      course.type.slice(1)}{" "}
                    Transmission
                  </span>
                )}
              </div>
            </div>

            {!isOnlineTheoretical && currentStep > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 1
                          ? "bg-red-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {currentStep > 1 ? (
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        <Calendar className="w-4 h-4 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <span className="text-xs mt-1 sm:mt-2 font-semibold">
                      Schedule
                    </span>
                  </div>
                  <div
                    className={`flex-1 h-1 ${
                      currentStep >= 2 ? "bg-red-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 2
                          ? "bg-red-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {currentStep > 2 ? (
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        <User className="w-4 h-4 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <span className="text-xs mt-1 sm:mt-2 font-semibold">
                      Personal Info
                    </span>
                  </div>
                  <div
                    className={`flex-1 h-1 ${
                      currentStep >= 3 ? "bg-red-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 3
                          ? "bg-red-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs mt-1 sm:mt-2 font-semibold">
                      Payment
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isOnlineTheoretical && currentStep > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 1
                          ? "bg-red-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {currentStep > 1 ? (
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        <User className="w-4 h-4 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <span className="text-xs mt-1 sm:mt-2 font-semibold">
                      Personal Info
                    </span>
                  </div>
                  <div
                    className={`flex-1 h-1 ${
                      currentStep >= 2 ? "bg-red-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        currentStep >= 2
                          ? "bg-red-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs mt-1 sm:mt-2 font-semibold">
                      Payment
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Before You Enroll
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="border-2 border-blue-300 rounded-xl p-4 sm:p-5 bg-blue-50">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      Discount Eligibility
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-800 mb-4">
                      Are you eligible for any discount? We offer 20% discount
                      for:
                    </p>
                    <ul className="text-xs sm:text-sm text-blue-800 mb-4 list-disc list-inside">
                      <li>Persons with Disability (PWD)</li>
                      <li>Senior Citizens (60 years old and above)</li>
                    </ul>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="discount_type"
                          value="none"
                          checked={discountType === "none"}
                          onChange={(e) => {
                            setDiscountType(e.target.value);
                            setDiscountProof(null); // Clear proof when switching
                          }}
                          className="w-4 h-4"
                        />
                        <span className="font-semibold text-sm sm:text-base">
                          No discount
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="discount_type"
                          value="pwd"
                          checked={discountType === "pwd"}
                          onChange={(e) => setDiscountType(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="font-semibold text-sm sm:text-base">
                          Person with Disability (PWD)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="discount_type"
                          value="senior"
                          checked={discountType === "senior"}
                          onChange={(e) => setDiscountType(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="font-semibold text-sm sm:text-base">
                          Senior Citizen (60+)
                        </span>
                      </label>
                    </div>

                    {/* Show upload field if discount selected */}
                    {discountType !== "none" && (
                      <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload Valid ID / Proof *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (!file.type.startsWith("image/")) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Invalid File Type",
                                  text: "Please upload an image file only (JPG, PNG, etc.)",
                                  confirmButtonColor: "#dc2626",
                                });
                                e.target.value = "";
                                return;
                              }
                              const maxSize = 5 * 1024 * 1024; // 5MB
                              if (file.size > maxSize) {
                                Swal.fire({
                                  icon: "error",
                                  title: "File Too Large",
                                  text: "Please upload an image smaller than 5MB",
                                  confirmButtonColor: "#dc2626",
                                });
                                e.target.value = "";
                                return;
                              }
                              setDiscountProof(file);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          required
                        />
                        {discountProof && (
                          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            File selected: {discountProof.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 mt-2">
                          Please upload a clear photo of your{" "}
                          {discountType === "pwd"
                            ? "PWD ID"
                            : "Senior Citizen ID or valid ID showing birthdate"}
                        </p>
                      </div>
                    )}

                    {discountType !== "none" && (
                      <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-xs sm:text-sm text-green-800 font-semibold">
                          Great! You'll get 20% discount (₱
                          {discountAmount.toFixed(2)} off)
                        </p>
                        <p className="text-xs sm:text-sm text-green-700 mt-1">
                          Your price:{" "}
                          <span className="line-through">
                            ₱{originalPrice.toFixed(2)}
                          </span>{" "}
                          <span className="font-bold text-sm sm:text-lg">
                            ₱{discountedPrice.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {requiresStudentPermit && (
                    <div className="border-2 border-orange-300 rounded-xl p-4 sm:p-5 bg-orange-50">
                      <h3 className="font-bold text-orange-900 mb-3 text-sm sm:text-base">
                        Student Permit Required
                      </h3>
                      <p className="text-xs sm:text-sm text-orange-800 mb-4">
                        This course requires a valid Student Permit from LTO. Do
                        you have one?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="has_permit"
                            checked={hasStudentPermit === true}
                            onChange={() => setHasStudentPermit(true)}
                            className="w-4 h-4"
                          />
                          <span className="font-semibold text-sm sm:text-base">
                            Yes, I have it
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="has_permit"
                            checked={hasStudentPermit === false}
                            onChange={() => setHasStudentPermit(false)}
                            className="w-4 h-4"
                          />
                          <span className="font-semibold text-sm sm:text-base">
                            No, not yet
                          </span>
                        </label>
                      </div>

                      {hasStudentPermit === true && (
                        <div className="space-y-3">
                          <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                            <p className="text-xs sm:text-sm text-green-800 font-semibold">
                              Perfect! You can proceed with enrollment.
                            </p>
                            <p className="text-xs text-orange-700 mt-2">
                              <strong>Important:</strong> Please bring your
                              Student Permit when you attend your scheduled
                              class.
                            </p>
                          </div>

                          {/* ✅ FILE UPLOAD FOR STUDENT PERMIT */}
                          <div className="p-3 bg-white border border-orange-300 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Upload Student Permit Photo *
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  if (!file.type.startsWith("image/")) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "Invalid File Type",
                                      text: "Please upload an image file only (JPG, PNG, etc.)",
                                      confirmButtonColor: "#dc2626",
                                    });
                                    e.target.value = "";
                                    return;
                                  }
                                  const maxSize = 5 * 1024 * 1024; // 5MB
                                  if (file.size > maxSize) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "File Too Large",
                                      text: "Please upload an image smaller than 5MB",
                                      confirmButtonColor: "#dc2626",
                                    });
                                    e.target.value = "";
                                    return;
                                  }
                                  setStudentPermitProof(file);
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              required
                            />
                            {studentPermitProof && (
                              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                File selected: {studentPermitProof.name}
                              </p>
                            )}
                            <p className="text-xs text-gray-600 mt-2">
                              Please upload a clear photo of your LTO Student
                              Permit
                            </p>
                          </div>
                        </div>
                      )}

                      {hasStudentPermit === false && (
                        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                          <p className="text-xs sm:text-sm text-red-800 font-semibold">
                            Sorry, you cannot enroll without a Student Permit.
                          </p>
                          <p className="text-xs text-red-700 mt-2">
                            Please visit your nearest LTO office to apply for a
                            Student Permit first, then come back to enroll in
                            this course.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (requiresStudentPermit && hasStudentPermit !== true) {
                        await Swal.fire({
                          icon: "error",
                          title: "Student Permit Required",
                          text: "You need a Student Permit to enroll in this course. Please get one from LTO first.",
                          confirmButtonColor: "#dc2626",
                          confirmButtonText: "OK",
                        });
                        return;
                      }

                      // ✅ VALIDATE STUDENT PERMIT PROOF
                      if (
                        requiresStudentPermit &&
                        hasStudentPermit === true &&
                        !studentPermitProof
                      ) {
                        await Swal.fire({
                          icon: "error",
                          title: "Student Permit Photo Required",
                          text: "Please upload a photo of your Student Permit to continue.",
                          confirmButtonColor: "#dc2626",
                          confirmButtonText: "OK",
                        });
                        return;
                      }

                      // Validate discount proof if discount selected
                      if (discountType !== "none" && !discountProof) {
                        await Swal.fire({
                          icon: "error",
                          title: "Proof Required",
                          text: `Please upload your ${
                            discountType === "pwd"
                              ? "PWD ID"
                              : "Senior Citizen ID"
                          } to claim the discount.`,
                          confirmButtonColor: "#dc2626",
                          confirmButtonText: "OK",
                        });
                        return;
                      }

                      setCurrentStep(isOnlineTheoretical ? 1 : 1);
                    }}
                    disabled={
                      requiresStudentPermit && hasStudentPermit !== true
                    }
                    className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isOnlineTheoretical
                      ? "Continue to Personal Information"
                      : "Continue to Schedule Selection"}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && !isOnlineTheoretical && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Select Schedule
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-semibold text-blue-900">
                      📅 Schedule Requirements:
                    </p>
                    <p className="text-xs sm:text-sm text-blue-800 mt-2 leading-relaxed whitespace-pre-line">
                      Please select{" "}
                      <strong>{requiredSchedules} schedule(s)</strong>:
                      {"\n• " + getScheduleInstructions()}
                    </p>
                  </div>

                  {loading ? (
                    <div className="text-center py-6 sm:py-8">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-red-600"></div>
                      <p className="text-gray-500 mt-2 text-xs sm:text-sm">
                        Loading schedules...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <button
                          onClick={previousMonth}
                          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all touch-manipulation"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                        </button>
                        <h4 className="text-sm sm:text-base lg:text-xl font-bold text-gray-800">
                          {currentMonth.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </h4>
                        <button
                          onClick={nextMonth}
                          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all touch-manipulation"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                        </button>
                      </div>

                      <div className="border border-gray-300 rounded-lg overflow-hidden overflow-x-auto">
                        <div className="grid grid-cols-7 bg-gray-100 min-w-[280px] sm:min-w-[400px]">
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
                              className="p-1.5 sm:p-2 lg:p-3 text-center font-semibold text-gray-700 text-xs sm:text-sm border-r border-gray-300 last:border-r-0"
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 min-w-[280px] sm:min-w-[400px]">
                          {getDaysInMonth(currentMonth).map((date, index) => {
                            const daySchedules = date
                              ? getSchedulesForDate(date)
                              : [];
                            const isSelected = date
                              ? isDateSelected(date)
                              : false;
                            const isPast =
                              date && date < new Date().setHours(0, 0, 0, 0);

                            return (
                              <div
                                key={index}
                                className={`min-h-16 sm:min-h-20 lg:min-h-24 p-1 sm:p-1.5 lg:p-2 border-r border-b border-gray-300 last:border-r-0 ${
                                  !date ? "bg-gray-50" : ""
                                } ${isPast ? "bg-gray-100 opacity-50" : ""} ${
                                  isSelected
                                    ? "bg-red-100 border-2 border-red-500"
                                    : ""
                                }`}
                              >
                                {date && (
                                  <>
                                    <div
                                      className={`text-xs sm:text-sm font-semibold mb-1 ${
                                        isPast
                                          ? "text-gray-400"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {date.getDate()}
                                    </div>
                                    {daySchedules.length > 0 && !isPast && (
                                      <div className="space-y-1">
                                        {daySchedules.map((schedule) => {
                                          const isValidDate =
                                            isScheduleDateValid(schedule);
                                          const isAlreadySelected =
                                            selectedSchedules.some(
                                              (s) =>
                                                s.schedule_id ===
                                                schedule.schedule_id
                                            );

                                          return (
                                            <button
                                              key={schedule.schedule_id}
                                              onClick={() =>
                                                handleScheduleSelect(schedule)
                                              }
                                              disabled={
                                                schedule.available_vehicles ===
                                                  0 ||
                                                (!isValidDate &&
                                                  selectedSchedules.length > 0)
                                              }
                                              className={`w-full text-left p-1 sm:p-1.5 rounded text-[9px] sm:text-xs transition-all touch-manipulation ${
                                                schedule.available_vehicles ===
                                                0
                                                  ? "bg-red-300 cursor-not-allowed opacity-50"
                                                  : !isValidDate &&
                                                    selectedSchedules.length > 0
                                                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                                                  : isAlreadySelected
                                                  ? "bg-green-500 text-white"
                                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                                              }`}
                                              title={
                                                schedule.available_vehicles ===
                                                0
                                                  ? "No vehicles available"
                                                  : !isValidDate &&
                                                    selectedSchedules.length > 0
                                                  ? "Select schedules in chronological order"
                                                  : ""
                                              }
                                            >
                                              <div className="font-semibold leading-tight">
                                                {formatTime(
                                                  schedule.start_time
                                                )}{" "}
                                                -{" "}
                                                {formatTime(schedule.end_time)}
                                              </div>
                                              <div className="text-[8px] sm:text-xs opacity-90 mt-0.5 flex items-center justify-between">
                                                <span>
                                                  {schedule.slots} slots
                                                </span>
                                                {schedule.available_vehicles !==
                                                  undefined && (
                                                  <span className="font-semibold">
                                                    🚗{" "}
                                                    {
                                                      schedule.available_vehicles
                                                    }
                                                  </span>
                                                )}
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {getFilteredSchedules().length === 0 &&
                        selectedSchedules.length < requiredSchedules && (
                          <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-xs sm:text-sm">
                              No schedules available for this month.
                            </p>
                          </div>
                        )}
                    </>
                  )}

                  {selectedSchedules.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-red-800 mb-3 text-sm sm:text-base">
                        Selected Schedules ({selectedSchedules.length}/
                        {requiredSchedules})
                      </h4>
                      <div className="space-y-2">
                        {selectedSchedules.map((schedule, index) => (
                          <div
                            key={index}
                            className="bg-white p-2.5 sm:p-3 rounded-lg border border-red-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 text-xs sm:text-sm">
                                Day {index + 1}:{" "}
                                {formatDate(schedule.start_date)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                {formatTime(schedule.start_time)} -{" "}
                                {formatTime(schedule.end_time)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSchedule(index)}
                              className="text-red-600 hover:text-red-800 font-semibold text-xs sm:text-sm self-start sm:self-center touch-manipulation"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleNextToPersonalInfo}
                    className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold text-sm sm:text-base touch-manipulation"
                  >
                    Next: Personal Information
                  </button>
                </div>
              </div>
            )}

            {((currentStep === 2 && !isOnlineTheoretical) ||
              (currentStep === 1 && isOnlineTheoretical)) && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                      rows="3"
                      placeholder="House No., Street, Barangay, City, Province"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="09123456789"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Birthday *
                      </label>
                      <input
                        type="date"
                        value={personalInfo.birthday}
                        onChange={(e) => {
                          const birthday = e.target.value;
                          let calculatedAge = "";

                          if (birthday) {
                            const today = new Date();
                            const birthDate = new Date(birthday);
                            let age =
                              today.getFullYear() - birthDate.getFullYear();
                            const monthDiff =
                              today.getMonth() - birthDate.getMonth();

                            // Adjust age if birthday hasn't occurred this year yet
                            if (
                              monthDiff < 0 ||
                              (monthDiff === 0 &&
                                today.getDate() < birthDate.getDate())
                            ) {
                              age--;
                            }

                            calculatedAge = age.toString();
                          }

                          setPersonalInfo({
                            ...personalInfo,
                            birthday: birthday,
                            age: calculatedAge,
                          });
                        }}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        value={personalInfo.age}
                        readOnly
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm sm:text-base"
                        placeholder="Auto-calculated from birthday"
                        min="18"
                        max="100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Filipino"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  {personalInfo.gender === "Female" && !isOnlineTheoretical && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Are you pregnant?
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="is_pregnant"
                            value="true"
                            checked={personalInfo.is_pregnant === "true"}
                            onChange={(e) =>
                              setPersonalInfo({
                                ...personalInfo,
                                is_pregnant: e.target.value,
                              })
                            }
                            className="text-red-600 w-4 h-4"
                          />
                          <span className="text-sm sm:text-base">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="is_pregnant"
                            value="false"
                            checked={personalInfo.is_pregnant === "false"}
                            onChange={(e) =>
                              setPersonalInfo({
                                ...personalInfo,
                                is_pregnant: e.target.value,
                              })
                            }
                            className="text-red-600 w-4 h-4"
                          />
                          <span className="text-sm sm:text-base">No</span>
                        </label>
                      </div>
                      {personalInfo.is_pregnant === "true" && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                          <p className="text-xs sm:text-sm text-yellow-800">
                            ⚠️ <strong>Important:</strong> You will need to
                            bring a medical certificate from your doctor
                            authorizing you to take this driving course.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        setCurrentStep(isOnlineTheoretical ? 0 : 1)
                      }
                      className="flex-1 px-4 sm:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold text-sm sm:text-base touch-manipulation"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextToPayment}
                      className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold text-sm sm:text-base touch-manipulation"
                    >
                      Next: Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {((currentStep === 3 && !isOnlineTheoretical) ||
              (currentStep === 2 && isOnlineTheoretical)) && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Payment Details
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h3 className="font-bold text-blue-800 mb-3 text-sm sm:text-base">
                      GCash Payment Information
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm text-blue-900">
                      <p>
                        <strong>GCash Number:</strong> {gcashDetails.number}
                      </p>
                      <p>
                        <strong>Account Name:</strong> {gcashDetails.name}
                      </p>
                      {discountType !== "none" && (
                        <p className="text-green-700 font-semibold">
                          <strong>
                            {discountType === "pwd" ? "PWD" : "Senior Citizen"}{" "}
                            Discount Applied:
                          </strong>{" "}
                          -₱{discountAmount.toFixed(2)} (20% off)
                        </p>
                      )}
                      <p className="text-sm sm:text-lg font-bold text-blue-900">
                        <strong>Original Price:</strong>{" "}
                        {discountType !== "none" && (
                          <span className="line-through text-gray-500">
                            ₱{originalPrice.toFixed(2)}
                          </span>
                        )}
                        {discountType === "none" &&
                          `₱${originalPrice.toFixed(2)}`}
                      </p>
                      {discountType !== "none" && (
                        <p className="text-sm sm:text-lg font-bold text-green-700">
                          <strong>Your Price:</strong> ₱
                          {discountedPrice.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {!isOnlineTheoretical && (
                      <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-blue-900 text-sm sm:text-lg">
                              50% Downpayment Required
                            </div>
                            <div className="text-xs sm:text-sm text-blue-800 mt-2">
                              Pay now:{" "}
                              <span className="font-bold text-sm sm:text-lg">
                                ₱{downpaymentAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-blue-700 mt-1">
                              Remaining Balance: ₱
                              {(discountedPrice - downpaymentAmount).toFixed(2)}
                              <br />
                              <span className="text-orange-600 font-semibold">
                                (To be paid before your scheduled class)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isOnlineTheoretical && (
                      <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 bg-yellow-500 rounded-lg">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-yellow-900 text-sm sm:text-lg mb-2">
                              Full Payment Required
                            </div>
                            <div className="text-xs sm:text-sm text-yellow-800 mb-3">
                              Amount to Pay:{" "}
                              <span className="font-bold text-sm sm:text-lg">
                                ₱{discountedPrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="bg-white p-2 sm:p-3 rounded-lg border border-yellow-200">
                              <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-xs sm:text-sm">
                                Important: Send Proof to our Facebook Page
                              </div>
                              <div className="text-xs sm:text-sm text-gray-700 space-y-2">
                                <p>After payment, please:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-2">
                                  <li>
                                    Screenshot your enrollment details as proof
                                  </li>
                                  <li>
                                    Screenshot your GCash payment confirmation
                                  </li>
                                  <li>
                                    Send both screenshots to our Facebook page
                                  </li>
                                  <li>
                                    Message us to discuss the online theoretical
                                    course process
                                  </li>
                                </ol>
                                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                                  <p className="font-semibold text-blue-900 text-xs sm:text-sm">
                                    Based on your branch:
                                  </p>
                                  <div className="mt-2 space-y-1 text-xs sm:text-sm">
                                    <p>
                                      <strong>Tanuan Branch:</strong>{" "}
                                      <a
                                        href="https://m.me/100798978911903"
                                        className="text-blue-600 hover:underline break-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        1stSafetyDrivingSchoolTanuan
                                      </a>
                                    </p>

                                    <p>
                                      <strong>San Pablo Branch:</strong>{" "}
                                      <a
                                        href="https://m.me/111320033799629"
                                        className="text-blue-600 hover:underline break-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        1stSafetyDrivingSchoolSanPablo
                                      </a>
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-2">
                                    You can also find the Messenger link on our
                                    website's contact page
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GCash Reference Number * (13 digits)
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.gcash_reference_number}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 13);
                        setPaymentInfo({
                          ...paymentInfo,
                          gcash_reference_number: value,
                        });
                      }}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="1234567890123"
                      maxLength="13"
                      required
                    />
                    {paymentInfo.gcash_reference_number && (
                      <div className="mt-2">
                        {paymentInfo.gcash_reference_number.length === 13 ? (
                          <p className="text-xs sm:text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Valid reference number
                          </p>
                        ) : (
                          <p className="text-xs sm:text-sm text-orange-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {paymentInfo.gcash_reference_number.length}/13
                            digits entered
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Proof of Payment (Screenshot) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Check if file is an image
                          if (!file.type.startsWith("image/")) {
                            Swal.fire({
                              icon: "error",
                              title: "Invalid File Type",
                              text: "Please upload an image file only (JPG, PNG, etc.)",
                              confirmButtonColor: "#dc2626",
                              confirmButtonText: "OK",
                            });
                            e.target.value = ""; // Clear the input
                            return;
                          }

                          // Optional: Check file size (e.g., max 5MB)
                          const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                          if (file.size > maxSize) {
                            Swal.fire({
                              icon: "error",
                              title: "File Too Large",
                              text: "Please upload an image smaller than 5MB",
                              confirmButtonColor: "#dc2626",
                              confirmButtonText: "OK",
                            });
                            e.target.value = ""; // Clear the input
                            return;
                          }

                          setPaymentInfo({
                            ...paymentInfo,
                            proof_image: file,
                          });
                        }
                      }}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                    {paymentInfo.proof_image && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs sm:text-sm text-green-800">
                          ✓ File selected: {paymentInfo.proof_image.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">
                      Enrollment Summary
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Course:</span>
                        <span className="font-semibold text-gray-800">
                          {course.name}
                        </span>
                      </div>
                      {!isOnlineTheoretical && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Selected Schedules:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedSchedules.length} day(s)
                          </span>
                        </div>
                      )}

                      {!isTheoretical &&
                        !isOnlineTheoretical &&
                        course.vehicle_category && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Type:</span>
                            <span className="font-semibold text-gray-800 capitalize">
                              {course.vehicle_category} -{" "}
                              {course.type?.charAt(0).toUpperCase() +
                                course.type?.slice(1)}{" "}
                              Transmission
                            </span>
                          </div>
                        )}
                      {discountType !== "none" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Original Price:
                            </span>
                            <span className="line-through text-gray-500">
                              ₱{originalPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {discountType === "pwd"
                                ? "PWD"
                                : "Senior Citizen"}{" "}
                              Discount (20%):
                            </span>
                            <span className="text-green-600 font-semibold">
                              -₱{discountAmount.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-300">
                        <span className="text-gray-600 font-semibold">
                          Amount to Pay Now:
                        </span>
                        <span className="font-bold text-red-600 text-sm sm:text-lg">
                          ₱
                          {isOnlineTheoretical
                            ? discountedPrice.toFixed(2)
                            : downpaymentAmount.toFixed(2)}
                        </span>
                      </div>
                      {!isOnlineTheoretical && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Remaining Balance:
                          </span>
                          <span className="font-semibold text-orange-600">
                            ₱{(discountedPrice - downpaymentAmount).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    {requiresStudentPermit && (
                      <div className="mt-4 p-3 bg-orange-50 border border-orange-300 rounded-lg">
                        <p className="text-xs sm:text-sm text-orange-800">
                          <strong>Remember to bring:</strong> Student Permit
                        </p>
                      </div>
                    )}

                    {discountType !== "none" && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-300 rounded-lg">
                        <p className="text-xs sm:text-sm text-blue-800">
                          <strong>Remember to bring:</strong>{" "}
                          {discountType === "pwd"
                            ? "PWD ID"
                            : "Senior Citizen ID or valid ID"}
                        </p>
                      </div>
                    )}
                    {personalInfo.gender === "Female" &&
                      !isOnlineTheoretical &&
                      personalInfo.is_pregnant === "true" && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                          <p className="text-xs sm:text-sm text-yellow-800">
                            <strong>Remember to bring:</strong> Medical
                            Certificate from your doctor
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        setCurrentStep(isOnlineTheoretical ? 1 : 2)
                      }
                      className="flex-1 px-4 sm:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold text-sm sm:text-base touch-manipulation"
                      disabled={submitting}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitEnrollment}
                      disabled={submitting}
                      className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs sm:text-sm">
                            Submitting...
                          </span>
                        </span>
                      ) : (
                        "Submit Enrollment"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnrollmentPage;
