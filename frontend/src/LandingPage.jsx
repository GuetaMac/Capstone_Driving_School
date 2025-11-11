import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logo.png";
import bg from "./assets/bg.jpg";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star,
  User,
  Clock,
  Building2,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const defaultTestimonials = [
    {
      student_name: "Sarah Johnson",
      comments:
        "The instructors were patient and helped me build confidence on the road. Passed my test first try!",
      course_name: "Standard Driving Course",
      instructor_name: "Mr. Rodriguez",
    },
    {
      student_name: "James Rodriguez",
      comments:
        "Great value for money. The lessons were structured well and I felt prepared for any situation.",
      course_name: "Defensive Driving Course",
      instructor_name: "Ms. Garcia",
    },
    {
      student_name: "Maria Chen",
      comments:
        "I was nervous about driving, but 1st Safety made the learning process enjoyable and stress-free.",
      course_name: "Beginner's Course",
      instructor_name: "Mr. Santos",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch branches
    axios
      .get(`${import.meta.env.VITE_API_URL}/branches`)
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
      });

    // Fetch all courses
    // Fetch all courses (only available ones for landing page)
    axios
      .get(`${import.meta.env.VITE_API_URL}/courses`)
      .then((res) => {
        // Filter to show only available courses
        const availableCourses = res.data.filter(
          (course) => course.is_available !== false
        );
        setAllCourses(availableCourses);
        setCourses(availableCourses); // Initially show all available courses
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
    // Fetch featured testimonials
    axios
      .get(`${import.meta.env.VITE_API_URL}/testimonials`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setTestimonials(res.data);
        } else {
          // Use default testimonials if no featured comments
          setTestimonials(defaultTestimonials);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        // Fallback to default testimonials
        setTestimonials(defaultTestimonials);
        setLoading(false);
      });
  }, []);

  const handleBranchFilter = (branchId) => {
    setSelectedBranch(branchId);

    if (branchId === "all") {
      // Show only available courses by default
      const availableCourses = allCourses.filter(
        (course) => course.is_available !== false
      );
      setCourses(availableCourses);
    } else {
      // Filter by branch and only show available courses
      const filtered = allCourses.filter(
        (course) =>
          course.branch_id === parseInt(branchId) &&
          course.is_available !== false
      );
      setCourses(filtered);
    }
  };

  const handleEnrollClick = (course) => {
    if (!isLoggedIn || userRole !== "student") {
      Swal.fire({
        title: "Login Required",
        text: "Please log in as a student to enroll in this course.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav
        className={`${
          isScrolled
            ? "bg-white text-gray-800 shadow-lg"
            : "bg-transparent text-white"
        } px-4 sm:px-6 py-3 flex justify-between items-center fixed w-full z-20 transition-all duration-300`}
      >
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
          />
          <span className="text-lg sm:text-xl font-extrabold tracking-wide">
            1ST SAFETY
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="space-x-6 lg:space-x-8 hidden md:flex text-sm font-medium">
          <a href="#home" className="hover:text-red-500 transition">
            Home
          </a>
          <a href="#about" className="hover:text-red-500 transition">
            About
          </a>
          <a href="#courses" className="hover:text-red-500 transition">
            Courses
          </a>
          <a href="#testimonials" className="hover:text-red-500 transition">
            Testimonials
          </a>
          <a href="#contact" className="hover:text-red-500 transition">
            Contact
          </a>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="space-x-3 sm:space-x-4 hidden md:flex">
          <Link
            to="/login"
            className="bg-red-500 text-white px-4 sm:px-5 py-2 rounded-full hover:bg-red-600 transition text-sm"
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`${
              isScrolled
                ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                : "border-white hover:bg-white hover:text-red-500"
            } border px-4 sm:px-5 py-2 rounded-full transition text-sm`}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden mobile-menu-container">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 hover:bg-opacity-20 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />
                  <span className="text-lg font-bold text-gray-800">
                    1ST SAFETY
                  </span>
                </div>
              </div>

              <div className="py-2">
                <a
                  href="#home"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#courses"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </a>
                <a
                  href="#testimonials"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </div>

              <div className="px-4 py-3 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center border border-red-500 text-red-500 py-2 rounded-full hover:bg-red-500 hover:text-white transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="h-screen relative flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="container mx-auto px-4 sm:px-6 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              Be safe. Be educated
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white text-opacity-90 mx-auto max-w-3xl leading-relaxed">
              SAFETY does not come with luck. It has to be PREPARED. It is not
              something that can happen on its own. You need to work towards it
              with the right measures, tools, and mindset. We educate our
              aspiring drivers that 1st priority is SAFETY!
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center px-4">
              <a
                href="#courses"
                className="bg-red-600 text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-red-700 transition flex items-center justify-center text-sm sm:text-base"
              >
                Explore Courses <ChevronRight size={18} className="ml-2" />
              </a>
              <a
                href="#contact"
                className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-white hover:text-red-600 transition flex items-center justify-center text-sm sm:text-base"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Expert Instructors
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Licensed professionals with years of teaching experience
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Classes available weekdays and weekends
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                High Pass Rate
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Over 95% of our students pass their driving test first time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
              <div
                className="relative cursor-pointer"
                onClick={() => setVideoOpen(true)}
              >
                <img
                  src="https://img.youtube.com/vi/rpQ9NQ5J968/hqdefault.jpg"
                  alt="Video Thumbnail"
                  className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white text-red-500 rounded-full p-3 sm:p-4 shadow-lg text-xl sm:text-2xl hover:scale-110 transition-transform">
                    ▶
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 lg:pl-8 xl:pl-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                About 1st Safety Driving School
              </h2>
              <div className="text-gray-600 mb-6 leading-relaxed space-y-4 text-sm sm:text-base">
                <p>
                  1st Safety Driving School (FSDS) is a family-owned entity. The
                  siblings who are currently managing the business were trained
                  and educated by their father, a long-time truck and jeepney
                  driver. Though each partner has a profession in a different
                  industry, they came together to build a service that inspires
                  aspiring drivers, just as their father once inspired them.
                </p>

                <p>
                  FSDS officially began operations on July 2, 2020, offering
                  various courses aimed at educating learners on road laws and
                  driving regulations. Just two years later, a second branch was
                  inaugurated in Tanauan City, Batangas.
                </p>

                <p>
                  Guided by the values passed on by their father, FSDS continues
                  to uphold its mission: to provide quality yet affordable
                  driving education for all aspiring drivers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                    <ChevronRight size={16} className="text-red-500" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">
                    10+ Certified Instructors
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                    <ChevronRight size={16} className="text-red-500" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">
                    Modern Vehicle Fleet
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                    <ChevronRight size={16} className="text-red-500" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">
                    5,000+ Successful Students
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                    <ChevronRight size={16} className="text-red-500" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">
                    LTO Accredited
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popup Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-3 text-white text-2xl sm:text-3xl font-bold z-50 hover:text-red-500 transition"
              onClick={() => setVideoOpen(false)}
            >
              &times;
            </button>
            <div
              className="relative"
              style={{ paddingBottom: "56.25%", height: 0 }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/rpQ9NQ5J968?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <section id="courses" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
            Our Driving Courses
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Choose your preferred branch location
          </p>

          {/* Branch Filter Tabs */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 bg-gray-100 p-2 rounded-xl">
              <button
                onClick={() => handleBranchFilter("all")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center gap-2 text-sm sm:text-base ${
                  selectedBranch === "all"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                All Branches
              </button>
              {branches.map((branch) => (
                <button
                  key={branch.branch_id}
                  onClick={() =>
                    handleBranchFilter(branch.branch_id.toString())
                  }
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center gap-2 text-sm sm:text-base ${
                    selectedBranch === branch.branch_id.toString()
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {branch.name}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  No courses available for this branch yet.
                </p>
                <button
                  onClick={() => handleBranchFilter("all")}
                  className="mt-4 text-red-600 hover:text-red-700 font-medium"
                >
                  View all courses
                </button>
              </div>
            ) : (
              courses.map((course) => (
                <div
                  key={course.course_id}
                  className="border rounded-lg p-4 sm:p-6 shadow hover:shadow-lg transition relative"
                >
                  {/* Branch Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full shadow-lg">
                      <MapPin className="w-3 h-3" />
                      {course.branch_name}
                    </span>
                  </div>

                  {course.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${course.image}`}
                      alt={course.name}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <h3 className="text-lg sm:text-xl font-semibold mb-1 text-red-600">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    ({course.codename})
                  </p>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base">
                    {course.description}
                  </p>
                  {(course.type || course.mode) && (
                    <p className="text-sm text-gray-500 mb-4">
                      {course.type && `Type: ${course.type}`}
                      {course.type && course.mode && " | "}
                      {course.mode && `Mode: ${course.mode}`}
                    </p>
                  )}
                  <p className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    ₱
                    {parseFloat(course.price).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>

                  <button
                    onClick={() => handleEnrollClick(course)}
                    className="w-full sm:w-auto bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition text-sm sm:text-base"
                  >
                    Enroll Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Enroll Modal */}
      {showEnrollModal && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-red-600">
              Enroll in {selectedCourse.name}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(`${import.meta.env.VITE_API_URL}/enroll`, {
                    course_id: selectedCourse.course_id,
                    user_id: userId,
                  })
                  .then(() => {
                    alert("Successfully enrolled!");
                    setShowEnrollModal(false);
                  })
                  .catch((err) => {
                    console.error(err);
                    alert("Enrollment failed.");
                  });
              }}
            >
              <p className="mb-4 text-gray-700 text-sm sm:text-base">
                Are you sure you want to enroll in{" "}
                <strong>{selectedCourse.name}</strong>?
              </p>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Real feedback from our satisfied students
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((item, index) => (
                <div
                  key={item.feedback_id || index}
                  className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-1 mb-4 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic text-sm sm:text-base leading-relaxed">
                    "{item.comments}"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-red-100 text-red-500 w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-semibold">
                      {item.student_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {item.student_name}
                      </p>
                      <p className="text-xs text-gray-500">Student</p>
                    </div>
                  </div>
                  {item.feedback_id && (
                    <div className="mt-3 flex justify-end">
                      <div className="bg-yellow-100 px-2 py-1 rounded-full">
                        <Star
                          size={12}
                          className="text-yellow-600"
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-red-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Ready to Start Your Driving Journey?
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
            Join thousands of satisfied students who have learned to drive
            safely and confidently with 1st Safety Driving School
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="#courses"
              className="bg-white text-red-500 px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition text-sm sm:text-base"
            >
              View Pricing
            </a>
            <a
              href="#contact"
              className="border-2 border-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-white hover:text-red-500 transition text-sm sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left side - Info */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Get In Touch
              </h2>
              <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">
                Have questions or ready to enroll? Reach out to our friendly
                team for assistance. We’d love to hear from you!
              </p>

              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start bg-white shadow-sm p-4 rounded-xl hover:shadow-md transition">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <MapPin size={22} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base mb-1">
                      Our Locations
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <a
                        href="https://www.google.com/maps?q=Unit+5,+155+Maharlika+Highway,+Brgy.+San+Nicolas,+San+Pablo+City,+Laguna"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:text-red-500 transition"
                      >
                        San Pablo City – Unit 5, 155 Maharlika Highway, Brgy.
                        San Nicolas
                      </a>
                      <a
                        href="https://www.google.com/maps?q=2nd+Floor,+DuPoint+Bldg.+(DESMARK/PREMIO),+J.P+Laurel+Highway,+Brgy.+Darasa,+Tanauan+City,+Batangas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 hover:text-red-500 transition"
                      >
                        Tanauan City – 2nd Floor, DuPoint Bldg.
                        (DESMARK/PREMIO), J.P Laurel Highway, Brgy. Darasa
                      </a>
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start bg-white shadow-sm p-4 rounded-xl hover:shadow-md transition">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Phone size={22} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base mb-1">
                      Call Us
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <span className="font-medium text-gray-700">
                        San Pablo Branch:
                      </span>
                      <br />
                      SMART - 0949 509 4742
                      <br />
                      GLOBE - 0915 920 9418
                      <br />
                      TEL - (049) 557 3332
                    </p>

                    <p className="text-gray-600 text-sm sm:text-base mt-3">
                      <span className="font-medium text-gray-700">
                        Tanauan Branch:
                      </span>
                      <br />
                      0995 910 3180
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start bg-white shadow-sm p-4 rounded-xl hover:shadow-md transition">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Mail size={22} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base mb-1">
                      Email Us
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base break-all">
                      <span className="font-medium text-gray-700">
                        San Pablo Branch:
                      </span>
                      <br />
                      1stsafetydriving@gmail.com
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base break-all mt-2">
                      <span className="font-medium text-gray-700">
                        Tanauan Branch:
                      </span>
                      <br />
                      1stsafetydrivingtanauan@gmail.com
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start bg-white shadow-sm p-4 rounded-xl hover:shadow-md transition">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Calendar size={22} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base mb-1">
                      Operating Hours
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Monday - Sunday: 8AM – 5PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side - Contact Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6">
              <a
                href="https://www.facebook.com/messages/t/111320033799629" // FB Page ng San Pablo branch
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-5 px-8 rounded-2xl shadow-md transition w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                >
                  <path d="M12 2C6.477 2 2 6.177 2 11.54c0 2.97 1.39 5.64 3.64 7.38V22l3.33-1.84c.96.27 1.98.42 3.03.42 5.523 0 10-4.177 10-9.54C22 6.177 17.523 2 12 2zm.21 12.9l-2.47-2.63-4.86 2.63 5.31-5.69 2.46 2.63 4.87-2.63-5.31 5.69z" />
                </svg>
                Message San Pablo Branch
              </a>

              <a
                href="https://www.facebook.com/messages/t/100798978911903" // FB Page ng Tanauan branch
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-5 px-8 rounded-2xl shadow-md transition w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                >
                  <path d="M12 2C6.477 2 2 6.177 2 11.54c0 2.97 1.39 5.64 3.64 7.38V22l3.33-1.84c.96.27 1.98.42 3.03.42 5.523 0 10-4.177 10-9.54C22 6.177 17.523 2 12 2zm.21 12.9l-2.47-2.63-4.86 2.63 5.31-5.69 2.46 2.63 4.87-2.63-5.31 5.69z" />
                </svg>
                Message Tanauan Branch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 sm:py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50"></div>
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full relative z-10 ring-2 ring-white/20"
                  />
                </div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  1ST SAFETY
                </span>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Your trusted partner in driving education since 2020. Building
                safer roads, one driver at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 ">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {["Home", "About", "Courses", "Testimonials", "Contact"].map(
                  (item) => (
                    <li key={item} className="group">
                      <a
                        href={`#${item.toLowerCase().replace(" ", "")}`}
                        className="text-gray-300 hover:text-white transition-all duration-300 text-sm sm:text-base flex items-center group-hover:translate-x-2"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 relative inline-block">
                Contact Info
              </h4>
              <ul className="space-y-4">
                {/* San Pablo Branch */}
                <li className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start mb-2">
                    <MapPin
                      size={18}
                      className="text-red-500 mr-3 mt-1 flex-shrink-0"
                    />
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">
                        San Pablo Branch
                      </p>
                      <span className="text-gray-300 text-sm">
                        Brgy. San Nicolas, San Pablo City, Laguna
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center ml-9">
                    <Phone
                      size={14}
                      className="text-red-500 mr-2 flex-shrink-0"
                    />
                    <span className="text-gray-300 text-xs sm:text-sm">
                      0949 509 4742 • 0915 920 9418
                    </span>
                  </div>
                  <div className="flex items-center ml-9 mt-1">
                    <Mail
                      size={14}
                      className="text-red-500 mr-2 flex-shrink-0"
                    />
                    <span className="text-gray-300 text-xs sm:text-sm break-all">
                      1stsafetydriving@gmail.com
                    </span>
                  </div>
                </li>

                {/* Tanauan Branch */}
                <li className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start mb-2">
                    <MapPin
                      size={18}
                      className="text-red-500 mr-3 mt-1 flex-shrink-0"
                    />
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">
                        Tanauan Branch
                      </p>
                      <span className="text-gray-300 text-sm">
                        Brgy. Darasa, Tanauan City, Batangas
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center ml-9">
                    <Phone
                      size={14}
                      className="text-red-500 mr-2 flex-shrink-0"
                    />
                    <span className="text-gray-300 text-xs sm:text-sm">
                      0995 910 3180
                    </span>
                  </div>
                  <div className="flex items-center ml-9 mt-1">
                    <Mail
                      size={14}
                      className="text-red-500 mr-2 flex-shrink-0"
                    />
                    <span className="text-gray-300 text-xs sm:text-sm break-all">
                      1stsafetydrivingtanauan@gmail.com
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700/50 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
                &copy; 2025 1st Safety Driving School. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
