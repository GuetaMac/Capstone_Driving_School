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
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Menu, X } from "lucide-react";

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [courses, setCourses] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/courses")
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
  }, []);

  const handleEnrollClick = (course) => {
    if (!isLoggedIn || userRole !== "student") {
      alert("Please log in as a student to enroll.");
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "The instructors were patient and helped me build confidence on the road. Passed my test first try!",
      rating: 5,
    },
    {
      name: "James Rodriguez",
      text: "Great value for money. The lessons were structured well and I felt prepared for any situation.",
      rating: 5,
    },
    {
      name: "Maria Chen",
      text: "I was nervous about driving, but 1st Safety made the learning process enjoyable and stress-free.",
      rating: 5,
    },
  ];

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
                    15+ Certified Instructors
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
                    Government Accredited
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-10 text-center">
            Our Driving Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">
                No courses available.
              </p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.course_id}
                  className="border rounded-lg p-4 sm:p-6 shadow hover:shadow-lg transition"
                >
                  {course.image ? (
                    <img
                      src={`http://localhost:5000${course.image}`}
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
                  <p className="text-gray-700 mb-2 text-sm sm:text-base line-clamp-3">
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
                    ₱{course.price}
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
                  .post("http://localhost:5000/enroll", {
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Don't just take our word for it - hear from some of our satisfied
              students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center space-x-1 mb-4 text-yellow-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic text-sm sm:text-base">
                  "{item.text}"
                </p>
                <div className="flex items-center">
                  <div className="bg-red-100 text-red-500 w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">Student</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <section id="contact" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
            <div className="w-full lg:w-1/2 lg:pr-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                Get In Touch
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Have questions or ready to enroll? Reach out to our friendly
                team for assistance.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <MapPin size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                      Our Location
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      123 Driving Avenue, Metro City
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <Phone size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                      Call Us
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      (0912) 345-6789
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <Mail size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                      Email Us
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base break-all">
                      support@1stsafetydrivingschool.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <Calendar size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                      Operating Hours
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Monday-Saturday: 8AM - 6PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 lg:pl-8">
              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">
                  Send Us a Message
                </h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  />
                  <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm sm:text-base">
                    <option value="">Select Course</option>
                    <option>Beginner Course</option>
                    <option>Intermediate Course</option>
                    <option>Advanced Course</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 sm:py-3 rounded font-bold hover:bg-red-600 transition text-sm sm:text-base"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                />
                <span className="text-lg sm:text-xl font-extrabold tracking-wide">
                  1ST SAFETY
                </span>
              </div>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Your trusted partner in driving education since 2020.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                >
                  <span className="sr-only">Facebook</span>
                  <FaFacebook className="text-white text-sm" />
                </a>
                <a
                  href="#"
                  className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                >
                  <span className="sr-only">Instagram</span>
                  <FaInstagram className="text-white text-sm" />
                </a>
                <a
                  href="#"
                  className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition"
                >
                  <span className="sr-only">Twitter</span>
                  <FaTwitter className="text-white text-sm" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#courses"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Courses
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Beginner Course
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Intermediate Course
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Advanced Course
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Defensive Driving
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition text-sm sm:text-base"
                  >
                    Refresher Lessons
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Contact Info
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin
                    size={16}
                    className="text-red-500 mr-2 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-400 text-sm sm:text-base">
                    123 Driving Avenue, Metro City
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone
                    size={16}
                    className="text-red-500 mr-2 flex-shrink-0"
                  />
                  <span className="text-gray-400 text-sm sm:text-base">
                    (0912) 345-6789
                  </span>
                </li>
                <li className="flex items-start">
                  <Mail
                    size={16}
                    className="text-red-500 mr-2 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-400 text-sm sm:text-base break-all">
                    support@1stsafetydrivingschool.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 sm:pt-8 mt-6 sm:mt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              &copy; 2025 1st Safety Driving School. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
