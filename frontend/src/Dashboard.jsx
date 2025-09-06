import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Edit2,
  Trash2,
  PlusCircle,
  MegaphoneIcon,
  Settings,
  LucideBookOpen,
  Plus,
  Edit3,
  Building,
  Calendar,
  Filter,
  RefreshCw,
  XCircle,
  CheckCircle,
  X,
  Check,
  AlertCircle,
  Book,
  Car,
  ListCheck,
} from "lucide-react";
import {
  User,
  BarChart3,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  Eye,
  EyeOff,
  LogOut,
  BookOpen,
  Award,
  TrendingDown,
  Activity,
  Star,
  AlertTriangle,
  UserX,
  Info,
  Lightbulb,
  Search,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Swal from "sweetalert2";
import { GiChecklist } from "react-icons/gi";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

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
  const userData = JSON.parse(localStorage.getItem("user"));
  const name = userData?.name || "Student";

  const [stats, setStats] = useState({
    total_enrollments: 0,
    total_tdc: 0,
    total_pdc: 0,
    total_earnings: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
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
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome {name}!</h1>
          <p className="text-gray-600 text-lg">
            Monitor your driving school operations and track key metrics
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <button
            onClick={handleSignOut}
            className="mt-2 text-red-600 hover:text-red-800 flex items-center text-sm"
          >
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </button>
        </div>
      </div>

      {/* Mission Statement Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 mb-8 text-white shadow-xl flex justify-between">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-yellow-300" /> Our Mission
          </h2>
          <p className="text-red-100 text-lg leading-relaxed">
            Our mission is to educate every Filipino Motor Vehicle Driver on
            Road Safety and instill safe driving practices. We envision a safer
            road for every Filipino family, with zero fatalities brought about
            by road crash incidents.
          </p>
        </div>
        <div className="text-right ml-8">
          <div className="text-yellow-300 font-bold text-lg">First Safety</div>
          <div className="text-red-200 text-sm">Always Safe</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          number={stats.total_enrollments}
          title="Total Enrollments"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          number={stats.total_tdc}
          title="Theoretical Driving Course"
          icon={<Book className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          number={stats.total_pdc}
          title="Practical Driving Course"
          icon={<Car className="w-6 h-6" />}
          color="yellow"
        />
        <StatCard
          number={`₱${stats.total_earnings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          title="Total Earnings"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
        />
      </div>
    </div>
  );
};

const RecordsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "instructor",
    branch_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchBranches();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/accounts");
      setAccounts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/branches");
      setBranches(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: editingId ? "Update Account?" : "Add New Account?",
      text: editingId
        ? "Are you sure you want to update this account?"
        : "Do you want to add this account?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: editingId ? "Yes, update it!" : "Yes, add it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/accounts/${editingId}`,
          form
        );
        Swal.fire("Updated!", "Account updated successfully.", "success");
      } else {
        await axios.post("http://localhost:5000/api/accounts", form);
        Swal.fire("Added!", "Account added successfully.", "success");
      }

      setForm({
        name: "",
        username: "",
        password: "",
        role: "instructor",
        branch_id: "",
      });
      setEditingId(null);
      fetchAccounts();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  const handleEdit = (acc) => {
    setForm({
      name: acc.name,
      username: acc.username,
      password: "", // Leave empty, optional to retype password
      role: acc.role,
      branch_id: acc.branch_id,
    });
    setEditingId(acc.id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/accounts/${id}`);
      Swal.fire("Deleted!", "Account has been deleted.", "success");
      fetchAccounts();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete the account.", "error");
    }
  };

  const AccountList = ({ accounts }) => {
    const [selectedBranch, setSelectedBranch] = useState("All");

    // Kunin lahat ng unique branches para sa dropdown
    const branches = [
      "All",
      ...new Set(accounts.map((acc) => acc.branch_name).filter(Boolean)),
    ];

    // Filtered accounts based on role and selected branch
    const filteredAccounts = accounts.filter(
      (acc) =>
        (acc.role === "instructor" || acc.role === "administrative_staff") &&
        (selectedBranch === "All" || acc.branch_name === selectedBranch)
    );

    return (
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Account List</h2>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">
                Filter by Branch:
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Username
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Branch
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {acc.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {acc.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 capitalize">
                      {acc.role.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {acc.branch_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(acc)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-6">
                      No accounts found for this branch.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Add or Edit Account Form */}
      <div className="bg-white shadow-md rounded-lg mb-8">
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-semibold">
            {editingId ? "Edit Account" : "Add New Account"}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2"
              placeholder="e.g. Juan Dela Cruz"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter your username"
            />
          </div>
          <div className="flex flex-col relative">
            <label className="mb-1 font-medium">
              Password {editingId && "(Leave blank to keep unchanged)"}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-300 rounded-md p-2 pr-10"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="instructor">Instructor</option>
              <option value="administrative_staff">Administrative Staff</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Branch</label>
            <select
              value={form.branch_id}
              onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-full flex justify-end space-x-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    username: "",
                    password: "",
                    role: "instructor",
                    branch_id: "",
                  });
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {editingId ? "Update Account" : "Add Account"}
            </button>
          </div>
        </form>
      </div>

      <AccountList accounts={accounts} />
    </div>
  );
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_id: null,
    name: "",
    codeName: "",
    type: "",
    mode: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    const action = form.course_id ? "update" : "add";
    const confirmResult = await Swal.fire({
      title: `Are you sure you want to ${action} this course?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it`,
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("codeName", form.codeName);
      formData.append("type", form.type);
      formData.append("mode", form.mode);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (image) formData.append("image", image);

      if (form.course_id) {
        await axios.put(
          `http://localhost:5000/courses/${form.course_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("Updated!", "Course updated successfully.", "success");
      } else {
        await axios.post("http://localhost:5000/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Added!", "Course added successfully.", "success");
      }

      setForm({
        course_id: null,
        name: "",
        codeName: "",
        type: "",
        mode: "",
        description: "",
        price: "",
      });
      setImage(null);
      setImagePreview(null);
      fetchCourses();
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handleEdit = async (course) => {
    const result = await Swal.fire({
      title: `Edit Course "${course.name}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, edit",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setForm({
      course_id: course.course_id,
      name: course.name,
      codeName: course.codename,
      type: course.type,
      mode: course.mode || "",
      description: course.description,
      price: course.price,
    });
    setImagePreview(course.image_url || null);
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This course will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/courses/${id}`);
      Swal.fire("Deleted!", "The course has been deleted.", "success");
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      Swal.fire("Error", "Failed to delete the course.", "error");
    }
  };

  const isTheoretical = form.name.trim().toLowerCase().includes("theoretical");

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
          <PlusCircle className="mr-2 text-red-600" />
          {form.course_id ? "Update Course" : "Add New Course"}
        </h2>

        <form
          onSubmit={handleAddOrUpdate}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code Name
              </label>
              <input
                type="text"
                name="codeName"
                value={form.codeName}
                onChange={handleChange}
                placeholder="e.g. TDC101"
                required
                className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-base py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-base py-2 px-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {!isTheoretical && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-base py-2 px-3"
                >
                  <option value="">Select Type</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="manual_automatic">Manual/Automatic</option>
                </select>
              </div>
            )}
            {isTheoretical && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode
                </label>
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-base py-2 px-3"
                >
                  <option value="">Select Mode</option>
                  <option value="ftof">Face-to-Face</option>
                  <option value="online">Online</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₱)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-base py-2 px-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 h-40 rounded-lg object-cover border"
              />
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-2xl shadow hover:bg-red-700"
          >
            {form.course_id ? (
              <>
                <Edit2 className="mr-2" />
                Update Course
              </>
            ) : (
              <>
                <PlusCircle className="mr-2" />
                Add Course
              </>
            )}
          </button>
        </form>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Course List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Mode</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td className="border px-4 py-2">
                    {course.image ? (
                      <img
                        src={`http://localhost:5000${course.image}`}
                        alt="Course"
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="border px-4 py-2">{course.name}</td>
                  <td className="border px-4 py-2">{course.codename}</td>
                  <td className="border px-4 py-2">{course.type}</td>
                  <td className="border px-4 py-2">{course.mode}</td>
                  <td className="border px-4 py-2">{course.price}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.course_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentsRecords = () => {
  const [records, setRecords] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch branches for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/branches")
      .then((res) => res.json())
      .then((data) => {
        console.log("🏢 Branches fetched:", data);
        setBranches(data);
      })
      .catch((err) => console.error("❌ Error fetching branches:", err));
  }, []);

  // fetch student records (all or filtered)
  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:5000/api/manager/student-records";

    // Only add branch_id parameter if a branch is selected and it's not empty
    if (selectedBranch && selectedBranch !== "") {
      url += `?branch_id=${encodeURIComponent(selectedBranch)}`;
    }

    console.log("🔍 Fetching from URL:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("📌 Records fetched:", data);
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching records:", err);
        setRecords([]);
        setLoading(false);
      });
  }, [selectedBranch]);

  const handleBranchChange = (e) => {
    const value = e.target.value;
    console.log("🔄 Branch changed to:", value);
    setSelectedBranch(value);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student Records</h2>

      {/* Branch filter dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Branch:</label>
        <select
          value={selectedBranch}
          onChange={handleBranchChange}
          className="border p-2 rounded"
          disabled={loading}
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.branch_id} value={branch.branch_id}>
              {branch.name}
            </option>
          ))}
        </select>
        {loading && <span className="ml-2 text-gray-500">Loading...</span>}
      </div>

      {/* Records Table */}
      {loading ? (
        <p>Loading records...</p>
      ) : records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Email</th>
                <th className="border border-gray-300 p-2 text-left">
                  Contact
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Address
                </th>
                <th className="border border-gray-300 p-2 text-left">Branch</th>
                <th className="border border-gray-300 p-2 text-left">Course</th>
                <th className="border border-gray-300 p-2 text-left">
                  Enrollment Date
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr
                  key={`${rec.user_id}-${rec.course_name}`}
                  className="hover:bg-gray-50"
                >
                  <td className="border border-gray-300 p-2">
                    {rec.student_name}
                  </td>
                  <td className="border border-gray-300 p-2">{rec.email}</td>
                  <td className="border border-gray-300 p-2">
                    {rec.contact_number || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {rec.address || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {rec.branch_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {rec.course_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(rec.enrollment_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {records.length} record{records.length !== 1 ? "s" : ""}
          {selectedBranch && selectedBranch !== "" && (
            <span> for selected branch</span>
          )}
        </div>
      )}
    </div>
  );
};
const AnnouncementsPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
      showAlert("error", "Failed to load branches.");
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/announcements", {
        params: selectedBranch ? { branch_id: selectedBranch } : {},
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      showAlert("error", "Failed to load announcements.");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedBranch]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const result = await Swal.fire({
      title: editingId
        ? "Update this announcement?"
        : "Post this announcement?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/announcements/${editingId}`, {
          title,
          content,
          branch_id: branchId || null,
        });
        Swal.fire("Updated!", "Announcement updated successfully!", "success");
      } else {
        await axios.post("http://localhost:5000/announcements", {
          title,
          content,
          branch_id: branchId || null,
        });
        Swal.fire("Posted!", "Announcement posted successfully!", "success");
      }

      // Reset form
      setTitle("");
      setContent("");
      setBranchId("");
      setEditingId(null);
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to submit announcement:", err);
      const errorMsg =
        err.response?.data?.error || "Failed to submit announcement.";
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This announcement will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/announcements/${id}`);
      Swal.fire("Deleted!", "Announcement deleted successfully!", "success");
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement:", err);
      const errorMsg =
        err.response?.data?.error || "Failed to delete announcement.";
      Swal.fire("Error", errorMsg, "error");
    }
  };

  const handleEdit = (announcement) => {
    setTitle(announcement.title);
    setContent(announcement.content);
    setBranchId(announcement.branch_id || "");
    setEditingId(announcement.announcement_id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setBranchId("");
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Announcements
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage and broadcast important announcements to all branches
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
              alert.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {alert.type === "success" ? (
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-medium">{alert.message}</p>
            </div>
            <button
              onClick={() => setAlert(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div
              className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
                showForm
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-50 transform translate-y-2"
              }`}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Announcement" : "Create New Announcement"}
                </h2>
              </div>

              {showForm && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter announcement title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                      rows="4"
                      placeholder="Enter announcement content"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Branch
                    </label>
                    <select
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="">All Branches</option>
                      {branches.map((branch) => (
                        <option key={branch.branch_id} value={branch.branch_id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                    >
                      {loading
                        ? "Processing..."
                        : editingId
                        ? "Update Announcement"
                        : "Post Announcement"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!showForm && (
                <div className="p-6 text-center text-gray-500">
                  <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Click "New Announcement" to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Announcements List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Announcements
                  </h2>

                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">All Branches</option>
                      {branches.map((branch) => (
                        <option key={branch.branch_id} value={branch.branch_id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {announcements.length === 0 ? (
                  <div className="p-12 text-center">
                    <Building className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No announcements found
                    </h3>
                    <p className="text-gray-500">
                      Create your first announcement to get started.
                    </p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.announcement_id}
                      className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                        editingId === announcement.announcement_id
                          ? "bg-blue-50 border-l-4 border-l-red-500"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {announcement.content}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {announcement.branch_name || "All Branches"}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(announcement.created_at)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            disabled={loading}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(announcement.announcement_id)
                            }
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackPage = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  useEffect(() => {
    const url = selectedBranch
      ? `http://localhost:5000/api/feedback?branch_id=${selectedBranch}`
      : `http://localhost:5000/api/feedback`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setFeedbackList(data))
      .catch((err) => console.error("Error loading feedback:", err));
  }, [selectedBranch]);

  const selectedBranchName =
    branches.find((b) => b.branch_id == selectedBranch)?.name || "All Branches";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  Student Feedbacks
                </h2>
                <p className="text-slate-600 text-lg">
                  View and explore student course evaluations and reviews
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-red-50 px-4 py-2 rounded-full">
                  <span className="text-red-700 font-medium">
                    {feedbackList.length} Reviews
                  </span>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-full">
                  <span className="text-red-700 font-medium">
                    {selectedBranchName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                    />
                  </svg>
                </div>
                <label className="text-lg font-semibold text-slate-700">
                  Filter by Branch:
                </label>
              </div>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium min-w-48 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="">All Branches</option>
                {branches.map((b) => (
                  <option key={b.branch_id} value={b.branch_id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        {feedbackList.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Feedback Available
            </h3>
            <p className="text-slate-500">
              Student feedback will appear here once submitted.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {feedbackList.map((fb) => (
              <div
                key={fb.feedback_id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header with Date */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 px-3 py-1.5 rounded-full">
                      <p className="text-xs font-medium text-gray-600">
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
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {fb.student_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {fb.student_name}
                    </h3>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Course
                        </p>
                        <p className="font-semibold text-slate-800 leading-tight">
                          {fb.course_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Instructor
                        </p>
                        <p className="font-semibold text-slate-800 leading-tight">
                          {fb.instructor_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comments Preview */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Comments
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-slate-700 leading-relaxed text-sm line-clamp-3">
                        "{fb.comments}"
                      </p>
                    </div>
                  </div>

                  {/* Submission Time */}
                  <div className="mb-6">
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Submitted:{" "}
                      {new Date(fb.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedFeedback(fb)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-blredue-700 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform group-hover:scale-[1.02] shadow-sm hover:shadow-md"
                  >
                    <span className="flex items-center justify-center gap-2">
                      View Detailed Feedback
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-red-500 via-green-500 to-yellow-600"></div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
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

  // Convert feedback fields into arrays for display
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
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">Feedback Details</h2>

        {Object.entries(questions).map(([category, items], index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold capitalize mb-2">
              {category.replace(/_/g, " ")}
            </h3>
            {items.map((question, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">
                  {i + 1}. {question}
                </p>
                <p className="ml-4 text-gray-700">
                  Answer: {answerMap[category]?.[i] || "No answer"}
                </p>
              </div>
            ))}
          </div>
        ))}

        <div className="mb-4">
          <h4 className="font-semibold">Instructor Comments:</h4>
          <p className="ml-2">{feedback.instructor_comments || "None"}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Additional Comments:</h4>
          <p className="ml-2">{feedback.comments || "None"}</p>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);

  // New filter states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Generate year options (current year and past 5 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // Month options
  const monthOptions = [
    { value: "", label: "All Months" },
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

  const fetchAnalytics = async (branchId = "", year = "", month = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (branchId) params.append("branch_id", branchId);
      if (year) params.append("year", year);
      if (month) params.append("month", month);

      const url = `http://localhost:5000/api/analytics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      const fetchedData = await res.json();
      setData(fetchedData);
      setBranches(fetchedData.branches || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    fetchAnalytics(branchId, selectedYear, selectedMonth);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    fetchAnalytics(selectedBranch, year, selectedMonth);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    fetchAnalytics(selectedBranch, selectedYear, month);
  };

  const clearFilters = () => {
    setSelectedBranch("");
    setSelectedYear("");
    setSelectedMonth("");
    fetchAnalytics();
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full bg-gradient-to-br ${color.replace(
            "border-l-",
            "from-"
          )} to-opacity-20`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartContainer = ({ title, children, className = "" }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
        {title}
      </h3>
      {children}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 font-medium">Error: {error}</p>
          <button
            onClick={() =>
              fetchAnalytics(selectedBranch, selectedYear, selectedMonth)
            }
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <p className="text-gray-600 font-medium">
            No analytics data available
          </p>
        </div>
      </div>
    );
  }

  const totalStudents =
    data.courseStats?.reduce(
      (sum, course) => sum + parseInt(course.students),
      0
    ) || 0;
  const averageStudentsPerCourse = data.courseStats?.length
    ? Math.round(totalStudents / data.courseStats.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with Enhanced Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive insights into your educational platform
                {data.branchInfo && (
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {data.branchInfo.name}
                  </span>
                )}
              </p>
            </div>

            {/* Enhanced Filter Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Branch Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedBranch}
                  onChange={handleBranchChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.branch_id} value={branch.branch_id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Years</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              {(selectedBranch || selectedYear || selectedMonth) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedBranch || selectedYear || selectedMonth) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">
                Active Filters:
              </span>
              {selectedBranch && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Branch:{" "}
                  {branches.find((b) => b.branch_id === selectedBranch)?.name ||
                    selectedBranch}
                </span>
              )}
              {selectedYear && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Year: {selectedYear}
                </span>
              )}
              {selectedMonth && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Month:{" "}
                  {monthOptions.find((m) => m.value === selectedMonth)?.label ||
                    selectedMonth}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₱${parseInt(data.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            color="border-l-green-500 from-green-500"
          />
          <StatCard
            title="Total Students"
            value={totalStudents.toLocaleString()}
            icon={Users}
            color="border-l-blue-500 from-blue-500"
          />
          <StatCard
            title="Active Courses"
            value={data.courseStats?.length || 0}
            icon={BookOpen}
            color="border-l-purple-500 from-purple-500"
          />
          <StatCard
            title="Avg Students/Course"
            value={averageStudentsPerCourse}
            icon={Award}
            color="border-l-orange-500 from-orange-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enrollment Trends */}
          <ChartContainer title="Monthly Enrollment Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.enrollmentTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#1D4ED8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Students per Course */}
          <ChartContainer title="Students per Course">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.courseStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="courseName"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Top and Least Courses Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top 5 Most Enrolled */}
          <ChartContainer title="Top 5 Most Enrolled Courses">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={data.topCourses || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis
                  dataKey="courseName"
                  type="category"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Least Enrolled */}
          <ChartContainer title="5 Least Enrolled Courses">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={data.leastCourses || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis
                  dataKey="courseName"
                  type="category"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Revenue Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue per Course - PIE CHART */}
          <ChartContainer title="Revenue Distribution by Course">
            {data.revenuePerCourse && data.revenuePerCourse.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={data.revenuePerCourse.map((item) => ({
                      courseName: item.courseName,
                      revenue: parseFloat(item.revenue) || 0,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={0}
                    paddingAngle={2}
                    dataKey="revenue"
                    nameKey="courseName"
                    fill="#8884d8"
                  >
                    {data.revenuePerCourse.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `₱${parseInt(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                    labelFormatter={(label) => `Course: ${label}`}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={50}
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No revenue data available</p>
                  <p className="text-sm">
                    Revenue will appear when courses have fully paid enrollments
                  </p>
                </div>
              </div>
            )}
          </ChartContainer>

          {/* Monthly Revenue Trend */}
          <ChartContainer title="Monthly Revenue Trend">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₱${parseInt(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelStyle={{ color: "#374151" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#D97706" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8 pb-4">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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

  // Load branches
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/branches", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Branches loaded:", res.data);
        setBranches(res.data);
      } catch (err) {
        console.error("❌ Error loading branches:", err);
        setError(
          `Error loading branches: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    };

    loadBranches();
  }, []);

  // Load all attendance records
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          return;
        }

        console.log("🔄 Loading attendance records...");
        const res = await axios.get(
          "http://localhost:5000/api/attendance/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Attendance data loaded:", res.data);
        setAttendance(res.data);

        if (res.data.length === 0) {
          setError("No attendance records found.");
        }
      } catch (err) {
        console.error("❌ Error loading attendance:", err);
        setError(
          err.response?.data?.message ||
            `Error loading attendance records: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  // Get today's stats
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
    const total = todayAttendance.length;

    return { present, absent, total };
  };

  // Get branch-wise stats for today
  const getBranchStats = () => {
    const todayAttendance = attendance.filter(
      (record) => record.date === today
    );

    const branchStats = {};
    branches.forEach((branch) => {
      const branchRecords = todayAttendance.filter(
        (record) => record.branch_id === branch.id
      );
      branchStats[branch.name] = {
        present: branchRecords.filter((r) => r.status === "present").length,
        absent: branchRecords.filter((r) => r.status === "absent").length,
        total: branchRecords.length,
      };
    });

    return branchStats;
  };

  // Filter attendance records
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
    const matchesBranch = filterBranch
      ? record.branch_id.toString() === filterBranch
      : true;
    const matchesStatus = filterStatus ? record.status === filterStatus : true;

    const matchesTab = activeTab === "today" ? record.date === today : true;

    return (
      matchesName &&
      matchesYear &&
      matchesMonth &&
      matchesBranch &&
      matchesStatus &&
      matchesTab
    );
  });

  const stats = getTodayStats();
  const branchStats = getBranchStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin h-5 w-5 text-blue-600" />
          <span className="text-gray-600">Loading attendance records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Attendance Overview
                </h1>
                <p className="text-gray-600">
                  Monitor attendance across all branches
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Present Today
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.present}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Absent Today
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.absent}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Today</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Branch-wise Stats */}
        {Object.keys(branchStats).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Branch Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(branchStats).map(([branchName, stats]) => (
                <div
                  key={branchName}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {branchName}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Present:</span>
                      <span className="font-medium">{stats.present}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Absent:</span>
                      <span className="font-medium">{stats.absent}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-1">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Records Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance Records
            </h2>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("today")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "today"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            {/* Search Name */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search instructor..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Branch Dropdown */}
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>

            {/* Year Dropdown */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                setFilterBranch("");
                setFilterStatus("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Summary Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing {filteredAttendance.length} records
                {filterBranch && (
                  <span className="ml-1">
                    from{" "}
                    {
                      branches.find((b) => b.id.toString() === filterBranch)
                        ?.name
                    }
                  </span>
                )}
              </span>
              <div className="flex space-x-4">
                <span className="text-green-600">
                  Present:{" "}
                  {
                    filteredAttendance.filter((r) => r.status === "present")
                      .length
                  }
                </span>
                <span className="text-red-600">
                  Absent:{" "}
                  {
                    filteredAttendance.filter((r) => r.status === "absent")
                      .length
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <tr
                      key={record.attendance_id || record.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.instructor_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{record.username}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.branch_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <Filter className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        No attendance records found
                      </p>
                      <p className="text-sm text-gray-500">
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
  );
};

const SettingsPage = () => {
  const [statusInfo, setStatusInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/system-status");
      setStatusInfo(res.data);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  };

  const updateStatus = async (newStatus) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the system status to "${newStatus.toUpperCase()}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/system-status",
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "System status updated!",
        text: `Status is now ${newStatus.toUpperCase()}`,
      });

      fetchStatus(); // refresh status
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to update status",
        text: err.response?.data?.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>

      <div className="bg-white rounded-xl p-4 shadow border border-gray-200 space-y-2">
        <p>
          <strong>Current Status:</strong>{" "}
          <span className="uppercase text-red-600 font-semibold">
            {statusInfo.status || "Loading..."}
          </span>
        </p>
        <p>
          <strong>Last Updated By:</strong> {statusInfo.updated_by || "Unknown"}
        </p>
        <p>
          <strong>At:</strong>{" "}
          {statusInfo.updated_at
            ? new Date(statusInfo.updated_at).toLocaleString()
            : "Unknown"}
        </p>

        <div className="mt-4 space-x-2">
          <button
            onClick={() => updateStatus("online")}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Set Online
          </button>
          <button
            onClick={() => updateStatus("offline")}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Set Offline
          </button>
          <button
            onClick={() => updateStatus("maintenance")}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Set Maintenance
          </button>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Student"; // fallback kung wala

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
                <div className="font-semibold text-gray-900">{name}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {[
              { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
              { name: "Records", icon: <Users className="w-5 h-5" /> },
              { name: "Courses", icon: <LucideBookOpen className="w-5 h-5" /> },
              { name: "Student Records", icon: <Users className="w-5 h-5" /> },
              { name: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
              {
                name: "Announcements",
                icon: <MegaphoneIcon className="w-5 h-5" />,
              },
              { name: "Feedbacks", icon: <Shield className="w-5 h-5" /> },
              { name: "Attendance", icon: <ListCheck className="w-5 h-5" /> },
              { name: "Settings", icon: <Settings className="w-5 h-5" /> },
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
          {activePage === "Courses" && <CoursesPage />}
          {activePage === "Student Records" && <StudentsRecords />}
          {activePage === "Analytics" && <AnalyticsPage />}
          {activePage === "Announcements" && <AnnouncementsPage />}
          {activePage === "Feedbacks" && <FeedbackPage />}
          {activePage === "Attendance" && <AttendancePage />}
          {activePage === "Settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
