import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
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
  Menu,
  Monitor,
  Wrench,
  Sparkles,
  Database,
  AtSign,
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
  Download,
  FileText,
  Receipt,
  ChevronDown,
  Building2,
  KeyRound,
  ShieldCheck,
  Lock,
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
    total_online_tdc: 0,
    total_tdc: 0,
    total_pdc: 0,
    total_earnings: 0,
    total_maintenance_price: 0,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard-stats`)
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
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      {/* Header - Mobile Optimized */}
      <div className="block sm:hidden">
        {/* Mobile Top Row - Date & Sign Out */}
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

        {/* Mobile Welcome Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold mb-2">Welcome back, {name}!</h1>
            <p className="text-red-100 text-sm leading-relaxed">
              Monitor your driving school operations and track key metrics
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">
            Welcome {name}!
          </h1>
          <p className="text-gray-600 text-sm lg:text-lg">
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
        </div>
      </div>

      {/* Mission Statement Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 lg:mb-4 flex items-center justify-center sm:justify-start">
              <Shield className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3 text-yellow-300" />{" "}
              Our Mission
            </h2>
            <p className="text-red-100 text-sm sm:text-base lg:text-lg leading-relaxed text-center sm:text-left max-w-4xl">
              Our mission is to educate every Filipino Motor Vehicle Driver on
              Road Safety and instill safe driving practices. We envision a
              safer road for every Filipino family, with zero fatalities brought
              about by road crash incidents.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          number={stats.total_enrollments}
          title="Total Enrollments"
          icon={<Users className="w-5 h-5 lg:w-6 lg:h-6" />}
          color="blue"
        />
        <StatCard
          number={stats.total_online_tdc}
          title="Online TDC"
          icon={<Monitor className="w-5 h-5 lg:w-6 lg:h-6" />}
          color="indigo"
        />
        <StatCard
          number={stats.total_tdc}
          title="Theoretical Driving Course"
          icon={<Book className="w-5 h-5 lg:w-6 lg:h-6" />}
          color="green"
        />
        <StatCard
          number={stats.total_pdc}
          title="Practical Driving Course"
          icon={<Car className="w-5 h-5 lg:w-6 lg:h-6" />}
          color="yellow"
        />
        <StatCard
          number={`₱${stats.total_earnings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          title="Total Earnings"
          icon={<DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />}
          color="purple"
        />
        <StatCard
          number={`₱${stats.total_maintenance_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          title="Maintenance Expenses"
          icon={<Wrench className="w-5 h-5 lg:w-6 lg:h-6" />}
          color="red"
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
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/accounts`
      );
      setAccounts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/branches`
      );
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
          `${import.meta.env.VITE_API_URL}/api/accounts/${editingId}`,
          form
        );
        Swal.fire("Updated!", "Account updated successfully.", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/accounts`, form);
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/accounts/${id}`);
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
      <div className="p-4 sm:p-6">
        <div className="bg-white shadow-md rounded-lg">
          <div className="border-b px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Account List</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Filter by Branch:
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-full sm:w-auto"
              >
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden p-4 space-y-4">
            {filteredAccounts.map((acc) => (
              <div key={acc.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{acc.name}</h3>
                      <p className="text-sm text-gray-600">@{acc.username}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(acc)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Role:</span>
                      <p className="font-medium capitalize">
                        {acc.role.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Branch:</span>
                      <p className="font-medium">{acc.branch_name || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredAccounts.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No accounts found for this branch.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto p-6">
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Add or Edit Account Form */}
      <div className="bg-white shadow-md rounded-lg mb-6 sm:mb-8">
        <div className="border-b px-4 sm:px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {editingId ? "Edit Account" : "Add New Account"}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm sm:text-base">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2 text-sm sm:text-base"
              placeholder="e.g. Juan Dela Cruz"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm sm:text-base">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2 text-sm sm:text-base"
              placeholder="Enter your username"
            />
          </div>
          <div className="flex flex-col relative">
            <label className="mb-1 font-medium text-sm sm:text-base">
              Password {editingId && "(Leave blank to keep unchanged)"}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-300 rounded-md p-2 pr-10 text-sm sm:text-base"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] sm:top-[42px] text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm sm:text-base">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2 text-sm sm:text-base"
            >
              <option value="instructor">Instructor</option>
              <option value="administrative_staff">Administrative Staff</option>
            </select>
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 font-medium text-sm sm:text-base">
              Branch
            </label>
            <select
              value={form.branch_id}
              onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
              required
              className="border border-gray-300 rounded-md p-2 text-sm sm:text-base"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-full flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 sm:gap-0">
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
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base order-1 sm:order-2"
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
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [form, setForm] = useState({
    course_id: null,
    name: "",
    codeName: "",
    type: "",
    mode: "",
    description: "",
    price: "",
    branch_id: "",
    vehicle_category: "",
    required_schedules: 1,
    schedule_config: [{ day: 1, hours: 4, time: "flexible" }],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches`);
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchCourses = async (branchId = "") => {
    try {
      const url = branchId
        ? `${import.meta.env.VITE_API_URL}/courses?branch_id=${branchId}`
        : `${import.meta.env.VITE_API_URL}/courses`;
      const res = await axios.get(url);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchCourses();
  }, []);

  const handleBranchFilterChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    fetchCourses(branchId);
  };

  const addScheduleDay = () => {
    setForm({
      ...form,
      schedule_config: [
        ...form.schedule_config,
        {
          day: form.schedule_config.length + 1,
          hours: 4,
          time: "flexible",
        },
      ],
      required_schedules: form.schedule_config.length + 1,
    });
  };

  const removeScheduleDay = (index) => {
    const updated = form.schedule_config.filter((_, i) => i !== index);
    // Re-number the days
    const renumbered = updated.map((config, i) => ({
      ...config,
      day: i + 1,
    }));
    setForm({
      ...form,
      schedule_config: renumbered,
      required_schedules: renumbered.length,
    });
  };

  const updateScheduleDay = (index, field, value) => {
    const updated = [...form.schedule_config];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, schedule_config: updated });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      const cleanValue =
        parts[0] + (parts.length > 1 ? "." + parts[1].slice(0, 2) : "");

      const numValue = parseFloat(cleanValue);
      if (numValue > 99999999.99) {
        Swal.fire({
          title: "Invalid Price",
          text: "Price cannot exceed ₱99,999,999.99",
          icon: "warning",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      setForm({ ...form, [name]: cleanValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!form.branch_id) {
      Swal.fire({
        title: "Branch Required",
        text: "Please select a branch for this course",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return false;
    }

    const priceValue = parseFloat(form.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Swal.fire({
        title: "Invalid Price",
        text: "Please enter a valid price greater than 0",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return false;
    }

    if (priceValue > 99999999.99) {
      Swal.fire({
        title: "Price Too High",
        text: "Price cannot exceed ₱99,999,999.99",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return false;
    }

    return true;
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
      formData.append("branch_id", form.branch_id);
      // ✅ NEW: Add schedule config
      formData.append("required_schedules", form.required_schedules);
      formData.append("schedule_config", JSON.stringify(form.schedule_config));
      formData.append("vehicle_category", form.vehicle_category || null);
      if (image) formData.append("image", image);

      if (form.course_id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/courses/${form.course_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("Updated!", "Course updated successfully.", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/courses`, formData, {
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
        branch_id: "",
        required_schedules: 1,
        schedule_config: [{ day: 1, hours: 4, time: "flexible" }],
      });
      setImage(null);
      setImagePreview(null);
      fetchCourses(selectedBranch);
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

    // ✅ Parse schedule config
    let scheduleConfig = [{ day: 1, hours: 4, time: "flexible" }];
    try {
      scheduleConfig =
        typeof course.schedule_config === "string"
          ? JSON.parse(course.schedule_config)
          : course.schedule_config || scheduleConfig;
    } catch (error) {
      console.error("Error parsing schedule_config:", error);
    }

    setForm({
      course_id: course.course_id,
      name: course.name,
      codeName: course.codename,
      type: course.type,
      mode: course.mode || "",
      description: course.description,
      price: course.price,
      branch_id: course.branch_id,
      vehicle_category: course.vehicle_category || "",
      required_schedules: course.required_schedules || 1,
      schedule_config: scheduleConfig,
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/courses/${id}`);
      Swal.fire("Deleted!", "The course has been deleted.", "success");
      fetchCourses(selectedBranch);
    } catch (err) {
      console.error("Error deleting course:", err);
      Swal.fire("Error", "Failed to delete the course.", "error");
    }
  };

  const getScheduleConfigDisplay = (course) => {
    if (!course.required_schedules || course.required_schedules === 0) {
      return { badge: "No schedules", details: "-", color: "gray" };
    }

    try {
      const config =
        typeof course.schedule_config === "string"
          ? JSON.parse(course.schedule_config)
          : course.schedule_config;

      if (!config || config.length === 0) {
        return {
          badge: `${course.required_schedules} day(s)`,
          details: "Not configured",
          color: "yellow",
        };
      }

      const badge = `${course.required_schedules} day${
        course.required_schedules > 1 ? "s" : ""
      }`;
      const details = config
        .map((day) => {
          const timeText = day.time === "flexible" ? "Any time" : day.time;
          return `Day ${day.day}: ${day.hours}hrs (${timeText})`;
        })
        .join(" • ");

      return { badge, details, color: "blue" };
    } catch (error) {
      return {
        badge: `${course.required_schedules || 0} day(s)`,
        details: "Error loading config",
        color: "red",
      };
    }
  };

  const isTheoretical = form.name.trim().toLowerCase().includes("theoretical");

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-6 flex items-center">
          <PlusCircle className="mr-2 text-red-600 w-6 h-6 sm:w-8 sm:h-8" />
          {form.course_id ? "Update Course" : "Add New Course"}
        </h2>

        <form
          onSubmit={handleAddOrUpdate}
          className="space-y-4 sm:space-y-6"
          encType="multipart/form-data"
        >
          {/* Branch Selection - Highlighted */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <label className="block text-sm font-bold text-red-800 mb-2">
              Select Branch *
            </label>
            <select
              name="branch_id"
              value={form.branch_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-2 border-red-300 rounded-lg shadow-sm text-base py-2 px-3 focus:border-red-500 focus:ring-red-500"
            >
              <option value="">Choose a branch...</option>
              {branches.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                className="mt-1 sm:mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base py-2 px-3"
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
                className="mt-1 sm:mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base py-2 px-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
                  className="mt-1 sm:mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base py-2 px-3"
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
                  className="mt-1 sm:mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base py-2 px-3"
                >
                  <option value="">Select Mode</option>
                  <option value="ftof">Face-to-Face</option>
                  <option value="online">Online</option>
                </select>
              </div>
            )}

            {!isTheoretical && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Category *
                </label>
                <select
                  name="vehicle_category"
                  value={form.vehicle_category}
                  onChange={handleChange}
                  required
                  className="mt-1 sm:mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base py-2 px-3"
                >
                  <option value="">Select Vehicle Category</option>
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
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₱)
              </label>
              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="mt-1 sm:mt-2 block w-full border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base py-2 px-3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ₱99,999,999.99
              </p>
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
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base py-2 px-3"
            />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">
                Schedule Requirements
              </h3>
            </div>

            <div className="bg-white border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>
                  Configure how many schedules students need to select for this
                  course:
                </strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Add the number of days/sessions required</li>
                <li>Set hours needed for each day</li>
                <li>Choose time requirement (flexible or specific time)</li>
              </ul>
            </div>

            {/* Schedule Days List */}
            <div className="space-y-3">
              {form.schedule_config.map((config, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                        {config.day}
                      </span>
                      Day {config.day}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeScheduleDay(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                      disabled={form.schedule_config.length === 1}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hours Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hours Required *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={config.hours}
                        onChange={(e) =>
                          updateScheduleDay(
                            index,
                            "hours",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Number of hours for this session (1-12)
                      </p>
                    </div>

                    {/* Time Requirement */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Time Requirement *
                      </label>
                      <select
                        value={config.time}
                        onChange={(e) =>
                          updateScheduleDay(index, "time", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="flexible">
                          Flexible (any time slot)
                        </option>
                        <option value="08:00-12:00">8:00 AM - 12:00 PM</option>
                        <option value="13:00-17:00">1:00 PM - 5:00 PM</option>
                        <option value="08:00-16:00">8:00 AM - 4:00 PM</option>
                        <option value="08:00-17:00">8:00 AM - 5:00 PM</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.time === "flexible"
                          ? "Student can choose any available time slot"
                          : "Student must select this specific time"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Day Button */}
              <button
                type="button"
                onClick={addScheduleDay}
                className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Another Schedule Day
              </button>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Summary
              </h4>
              <p className="text-sm text-gray-700">
                This course will require{" "}
                <span className="font-bold text-blue-600 text-lg">
                  {form.required_schedules} schedule
                  {form.required_schedules > 1 ? "s" : ""}
                </span>
              </p>
              {form.schedule_config.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {form.schedule_config.map((config, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        <strong>Day {config.day}:</strong> {config.hours} hour
                        {config.hours > 1 ? "s" : ""}
                        {config.time !== "flexible" && (
                          <span className="text-gray-600">
                            {" "}
                            ({config.time})
                          </span>
                        )}
                        {config.time === "flexible" && (
                          <span className="text-green-600">
                            {" "}
                            (flexible time)
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="file-input"
            />

            {!imagePreview ? (
              <label
                htmlFor="file-input"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Choose Image
              </label>
            ) : (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 sm:h-40 rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    document.getElementById("file-input").value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
                >
                  ×
                </button>
                <div className="mt-2">
                  <label
                    htmlFor="file-input"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition"
                  >
                    Change Image
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow hover:bg-red-700 text-sm sm:text-base"
          >
            {form.course_id ? (
              <>
                <Edit2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Update Course
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Add Course
              </>
            )}
          </button>
        </form>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Course List
          </h3>

          {/* Branch Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedBranch}
              onChange={handleBranchFilterChange}
              className="block w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm text-sm py-2 px-3"
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

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {courses.map((course) => {
            const scheduleInfo = getScheduleConfigDisplay(course);
            return (
              <div
                key={course.course_id}
                className="bg-gray-50 rounded-lg p-4 border shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    {course.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${course.image}`}
                        alt="Course"
                        className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">
                        {course.name}
                      </h4>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded flex-shrink-0">
                        {course.branch_name}
                      </span>
                    </div>

                    {/* Course Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs">Code</span>
                        <p className="font-mono font-semibold text-gray-800">
                          {course.codename}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Price</span>
                        <p className="font-bold text-gray-800">
                          ₱{parseFloat(course.price).toLocaleString()}
                        </p>
                      </div>
                      {course.type && (
                        <div>
                          <span className="text-gray-500 text-xs">Type</span>
                          <p className="font-medium text-gray-800">
                            {course.type}
                          </p>
                        </div>
                      )}
                      {course.mode && (
                        <div>
                          <span className="text-gray-500 text-xs">Mode</span>
                          <p className="font-medium text-gray-800">
                            {course.mode === "ftof" ? "Face-to-Face" : "Online"}
                          </p>
                        </div>
                      )}
                      {course.vehicle_category && (
                        <div>
                          <span className="text-gray-500 text-xs">Vehicle</span>
                          <p className="font-medium text-gray-800 capitalize">
                            {course.vehicle_category}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ✅ NEW: Schedule Info Section */}
                    <div className="bg-white border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-blue-900 text-sm">
                          Schedule Requirements
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            scheduleInfo.color === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : scheduleInfo.color === "yellow"
                              ? "bg-yellow-100 text-yellow-700"
                              : scheduleInfo.color === "red"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {scheduleInfo.badge}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        {scheduleInfo.details
                          .split(" • ")
                          .map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-1">
                              <span className="text-blue-600 font-bold mt-0.5">
                                •
                              </span>
                              <span>{detail}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.course_id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-sm font-medium">Image</th>
                <th className="border px-4 py-2 text-sm font-medium">Branch</th>
                <th className="border px-4 py-2 text-sm font-medium">
                  Course Name
                </th>
                <th className="border px-4 py-2 text-sm font-medium">Code</th>
                <th className="border px-4 py-2 text-sm font-medium">
                  Type/Mode
                </th>
                <th className="border px-4 py-2 text-sm font-medium">
                  Vehicle
                </th>
                <th className="border px-4 py-2 text-sm font-medium">Price</th>

                <th className="border px-4 py-2 text-sm font-medium">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Days Required
                  </div>
                </th>

                <th className="border px-4 py-2 text-sm font-medium">
                  Schedule Details
                </th>
                <th className="border px-4 py-2 text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const scheduleInfo = getScheduleConfigDisplay(course);
                return (
                  <tr key={course.course_id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {course.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${course.image}`}
                          alt="Course"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            No image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        {course.branch_name}
                      </span>
                    </td>
                    <td className="border px-4 py-2 text-sm font-medium">
                      {course.name}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {course.codename}
                      </code>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {course.type && (
                        <div className="text-gray-700">{course.type}</div>
                      )}
                      {course.mode && (
                        <div className="text-gray-600 text-xs mt-1">
                          {course.mode === "ftof" ? "Face-to-Face" : "Online"}
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-sm text-center">
                      {course.vehicle_category ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 capitalize">
                          {course.vehicle_category}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-sm font-semibold">
                      ₱{parseFloat(course.price).toLocaleString()}
                    </td>
                    {/* ✅ DAYS REQUIRED COLUMN */}
                    <td className="border px-4 py-2 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          scheduleInfo.color === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : scheduleInfo.color === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : scheduleInfo.color === "red"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {scheduleInfo.badge}
                      </span>
                    </td>
                    {/* ✅ SCHEDULE DETAILS COLUMN */}
                    <td className="border px-4 py-2">
                      <div className="text-xs text-gray-600 max-w-xs">
                        {scheduleInfo.details
                          .split(" • ")
                          .map((detail, idx) => (
                            <div key={idx} className="mb-1 last:mb-0">
                              {detail}
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.course_id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
  const [years, setYears] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // export handler
  const handleExport = () => {
    let url = `${import.meta.env.VITE_API_URL}/api/manager/export-records`;

    const params = new URLSearchParams();
    if (selectedBranch) params.append("branch_id", selectedBranch);
    if (selectedMonth) params.append("month", selectedMonth);
    if (selectedYear) params.append("year", selectedYear);

    if (params.toString()) url += `?${params.toString()}`;

    window.open(url, "_blank");
  };

  // fetch branches
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/branches/records`)
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error("❌ Error fetching branches:", err));
  }, []);

  // fetch years
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/manager/years`)
      .then((res) => res.json())
      .then((data) => setYears(data))
      .catch((err) => console.error("❌ Error fetching years:", err));
  }, []);

  // fetch student records
  useEffect(() => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/manager/student-records`;

    const params = new URLSearchParams();
    if (selectedBranch) params.append("branch_id", selectedBranch);
    if (selectedMonth) params.append("month", selectedMonth);
    if (selectedYear) params.append("year", selectedYear);

    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching records:", err);
        setRecords([]);
        setLoading(false);
      });
  }, [selectedBranch, selectedMonth, selectedYear]);

  // Filter records based on search term
  const filteredRecords = records.filter(
    (rec) =>
      rec.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearFilters = () => {
    setSelectedBranch("");
    setSelectedMonth("");
    setSelectedYear("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                  Student Records
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage and view student enrollment data
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={loading || records.length === 0}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                disabled={loading}
              />
            </div>

            {/* Branch Dropdown */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Dropdown */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">All Years</option>
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedBranch ||
              selectedMonth ||
              selectedYear ||
              searchTerm) && (
              <button
                onClick={clearFilters}
                className="lg:col-span-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Records Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Results Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredRecords.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {records.length}
                </span>{" "}
                record{records.length !== 1 ? "s" : ""}
                {(selectedBranch ||
                  selectedMonth ||
                  selectedYear ||
                  searchTerm) && (
                  <span className="text-blue-600 ml-1">(filtered)</span>
                )}
              </p>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600">Loading records...</p>
              </div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium mb-1">
                  No records found
                </p>
                <p className="text-slate-500 text-sm">
                  Try adjusting your filters or search term
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Enrollment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRecords.map((rec) => (
                      <tr
                        key={`${rec.user_id}-${rec.course_name}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {rec.student_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {rec.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {rec.contact_number || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {rec.branch_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {rec.course_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(rec.enrollment_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {rec.amount_paid !== null
                            ? `₱${rec.amount_paid.toLocaleString()}`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              rec.payment_status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : rec.payment_status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {rec.payment_status || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-slate-200">
                {filteredRecords.map((rec) => (
                  <div
                    key={`${rec.user_id}-${rec.course_name}`}
                    className="p-4 hover:bg-slate-50"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {rec.student_name}
                          </h3>
                          <p className="text-sm text-slate-600 mt-0.5">
                            {rec.email}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            rec.payment_status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : rec.payment_status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {rec.payment_status || "N/A"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Branch:</span>
                          <p className="text-slate-900 font-medium">
                            {rec.branch_name}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Course:</span>
                          <p className="text-slate-900 font-medium">
                            {rec.course_name}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Contact:</span>
                          <p className="text-slate-900 font-medium">
                            {rec.contact_number || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Amount:</span>
                          <p className="text-slate-900 font-medium">
                            {rec.amount_paid !== null
                              ? `₱${rec.amount_paid.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500">Enrolled:</span>
                          <p className="text-slate-900 font-medium">
                            {new Date(rec.enrollment_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
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
  const [alert, setAlert] = useState(null);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches`);
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
      showAlert("error", "Failed to load branches.");
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/announcements`,
        {
          params: selectedBranch ? { branch_id: selectedBranch } : {},
        }
      );
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
        await axios.put(
          `${import.meta.env.VITE_API_URL}/announcements/${editingId}`,
          {
            title,
            content,
            branch_id: branchId || null,
          }
        );
        Swal.fire("Updated!", "Announcement updated successfully!", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/announcements`, {
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/announcements/${id}`);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setBranchId("");
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
          <div className="py-4 sm:py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Announcements
              </h1>
              <p className="mt-1 sm:mt-2 text-sm text-gray-600">
                Manage and broadcast important announcements to all branches
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
              <p className="font-medium text-sm sm:text-base">
                {alert.message}
              </p>
            </div>
            <button
              onClick={() => setAlert(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Announcement" : "Create New Announcement"}
                </h2>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
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
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
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
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch.branch_id} value={branch.branch_id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm sm:text-base"
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
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Announcements List Section */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Recent Announcements
                  </h2>

                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-auto"
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
                  <div className="p-8 sm:p-12 text-center">
                    <Building className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      No announcements found
                    </h3>
                    <p className="text-sm text-gray-500">
                      Create your first announcement using the form on the left.
                    </p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.announcement_id}
                      className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 ${
                        editingId === announcement.announcement_id
                          ? "bg-blue-50 border-l-4 border-l-red-500"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                            {announcement.content}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
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

                        <div className="flex items-center gap-2 pt-2 border-t sm:border-t-0 sm:pt-0 border-gray-100">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 text-xs sm:text-sm font-medium text-green-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            disabled={loading}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(announcement.announcement_id)
                            }
                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 text-xs sm:text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Feedback Details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>

        {/* Questions and Answers */}
        {Object.entries(questions).map(([category, items], index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold capitalize mb-3 text-red-600">
              {category.replace(/_/g, " ")}
            </h3>
            <div className="space-y-3">
              {items.map((question, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-slate-700 mb-1">
                    {i + 1}. {question}
                  </p>
                  <p className="ml-4 text-slate-600">
                    <strong>Answer:</strong>{" "}
                    {answerMap[category]?.[i] || "No answer"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Comments Section */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">
              Instructor Comments:
            </h4>
            <p className="text-slate-700">
              {feedback.instructor_comments ||
                "No instructor comments provided"}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">
              Additional Comments:
            </h4>
            <p className="text-slate-700">
              {feedback.comments || "No additional comments provided"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackPage = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instructorStats, setInstructorStats] = useState([]);
  const [showInstructorStats, setShowInstructorStats] = useState(false);
  const userRole = localStorage.getItem("role");

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const monthOptions = [
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

  const calculateAverageRating = () => {
    const validRatings = feedbackList.filter((fb) => fb.instructor_rating);
    if (validRatings.length === 0) return 0;
    const total = validRatings.reduce(
      (sum, fb) => sum + fb.instructor_rating,
      0
    );
    return (total / validRatings.length).toFixed(1);
  };

  const calculateInstructorStats = () => {
    const stats = {};

    const feedbackWithRatings = feedbackList.filter(
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

    setInstructorStats(instructorArray);
  };

  // Load branches
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/branches`)
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => {
        console.error("Error loading branches:", err);
        setError("Failed to load branches");
      });
  }, []);

  // Load feedback with filters
  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedBranch) params.append("branch_id", selectedBranch);
        if (selectedMonth) params.append("month", selectedMonth);
        if (selectedYear) params.append("year", selectedYear);

        const url = `${
          import.meta.env.VITE_API_URL
        }/api/feedback?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const processedData = data.map((feedback) => ({
          ...feedback,
          featured: Boolean(feedback.featured),
        }));

        setFeedbackList(processedData);
      } catch (err) {
        console.error("Error loading feedback:", err);
        setError("Failed to load feedback data");
        setFeedbackList([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [selectedBranch, selectedMonth, selectedYear]);

  useEffect(() => {
    if (feedbackList.length > 0) {
      calculateInstructorStats();
    } else {
      setInstructorStats([]);
    }
  }, [feedbackList, selectedMonth, selectedYear, selectedBranch]);

  const handleFeatureComment = async (feedbackId, shouldFeature) => {
    try {
      setError(null);

      const result = await Swal.fire({
        title: shouldFeature
          ? "Feature this comment?"
          : "Remove from featured comments?",
        text: shouldFeature
          ? "This comment will be highlighted as featured."
          : "This comment will no longer be featured.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: shouldFeature ? "Yes, feature it" : "Yes, remove it",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/${feedbackId}/feature`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ featured: shouldFeature }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const updatedFeedback = await response.json();

      setFeedbackList((prevList) =>
        prevList.map((feedback) =>
          feedback.feedback_id === feedbackId
            ? {
                ...feedback,
                featured: Boolean(updatedFeedback.featured || shouldFeature),
              }
            : feedback
        )
      );

      Swal.fire({
        icon: "success",
        title: shouldFeature ? "Comment Featured!" : "Comment Unfeatured!",
        text: shouldFeature
          ? "The comment is now featured."
          : "The comment has been removed from featured list.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating featured status:", error);
      setError(`Failed to update featured status: ${error.message}`);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update: ${error.message}`,
      });
    }
  };

  const clearFilters = () => {
    setSelectedBranch("");
    setSelectedMonth("");
    setSelectedYear("");
  };

  const selectedBranchName =
    branches.find((b) => b.branch_id == selectedBranch)?.name || "All Branches";

  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600"
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
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
                  View and explore student course evaluations and reviews
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
                <div className="bg-red-50 px-3 sm:px-4 py-2 rounded-full">
                  <span className="text-red-700 font-medium text-sm sm:text-base">
                    {loading ? "Loading..." : `${feedbackList.length} Reviews`}
                  </span>
                </div>
                <div className="bg-red-50 px-3 sm:px-4 py-2 rounded-full">
                  <span className="text-red-700 font-medium text-sm sm:text-base">
                    {selectedBranchName}
                  </span>
                </div>
                {userRole === "manager" && (
                  <div className="bg-green-50 px-3 sm:px-4 py-2 rounded-full">
                    <span className="text-green-700 font-medium text-sm sm:text-base">
                      Featured:{" "}
                      {loading
                        ? "..."
                        : feedbackList.filter((fb) => fb.featured).length}
                    </span>
                  </div>
                )}
                {!loading && averageRating > 0 && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 px-3 sm:px-4 py-2 rounded-full flex items-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-yellow-700 font-medium text-sm sm:text-base">
                      Avg: {averageRating}/5
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!loading && instructorStats.length > 0 && (
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
                Statistics{" "}
                {(selectedMonth || selectedYear || selectedBranch) &&
                  "(Filtered)"}
              </span>
              <span className="sm:hidden">
                {showInstructorStats ? "Hide" : "View"} Rankings{" "}
                {(selectedMonth || selectedYear || selectedBranch) &&
                  "(Filtered)"}
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
            {(selectedMonth || selectedYear || selectedBranch) && (
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Showing results for{" "}
                {selectedMonth &&
                  monthOptions.find((m) => m.value === selectedMonth)
                    ?.label}{" "}
                {selectedYear}
                {selectedBranch &&
                  ` - ${
                    branches.find((b) => b.branch_id == selectedBranch)?.name ||
                    "Selected Branch"
                  }`}
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

        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 7V4z"
                  />
                </svg>
              </div>
              <label className="text-base sm:text-lg font-semibold text-slate-700">
                Filter Options:
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Branches</option>
                  {branches.map((b) => (
                    <option key={b.branch_id} value={b.branch_id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Months</option>
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Years</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={
                    loading ||
                    (!selectedBranch && !selectedMonth && !selectedYear)
                  }
                  className="w-full px-4 py-2 sm:py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Loading Feedback...
            </h3>
            <p className="text-slate-500">
              Please wait while we fetch the data.
            </p>
          </div>
        )}

        {!loading && feedbackList.length === 0 ? (
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
              No Feedback Available
            </h3>
            <p className="text-slate-500 text-sm sm:text-base">
              No feedback found for the selected filters.
            </p>
          </div>
        ) : !loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {feedbackList.map((fb) => (
              <div
                key={fb.feedback_id}
                className={`group bg-white rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300 overflow-hidden ${
                  fb.featured
                    ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-white"
                    : "border-slate-200"
                }`}
              >
                <div className="p-4 sm:p-6">
                  {fb.featured && (
                    <div className="mb-3 flex justify-center">
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.602-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        FEATURED
                      </div>
                    </div>
                  )}

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

                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {fb.student_name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <span className="truncate">{fb.student_name}</span>
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2.5 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Course
                        </p>
                        <p className="font-semibold text-slate-800 leading-tight text-sm sm:text-base">
                          {fb.course_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2.5 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Instructor
                        </p>
                        <p className="font-semibold text-slate-800 leading-tight text-sm sm:text-base">
                          {fb.instructor_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Rating
                        </p>
                        {renderStars(fb.instructor_rating)}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Comments
                    </p>
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl">
                      <p className="text-slate-700 leading-relaxed text-xs sm:text-sm line-clamp-3">
                        "{fb.comments || "No comments provided"}"
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
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

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedFeedback(fb)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform group-hover:scale-[1.02] shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="hidden sm:inline">
                          View Detailed Feedback
                        </span>
                        <span className="sm:hidden">View Details</span>
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

                    {userRole === "manager" && (
                      <button
                        onClick={() =>
                          handleFeatureComment(fb.feedback_id, !fb.featured)
                        }
                        className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm ${
                          fb.featured
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                        }`}
                      >
                        {fb.featured
                          ? "Remove from Featured"
                          : "Feature on Landing Page"}
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={`h-1 ${
                    fb.featured
                      ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-red-500 via-green-500 to-yellow-600"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        ) : null}

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

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Insights state for each chart
  const [insights, setInsights] = useState({});
  const [loadingInsights, setLoadingInsights] = useState({});

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

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

  // Function to generate insights
  const generateInsights = async (chartId, chartType, chartData, context) => {
    setLoadingInsights((prev) => ({ ...prev, [chartId]: true }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/generate-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chartType,
            data: chartData,
            context,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate insights");

      const result = await response.json();
      setInsights((prev) => ({ ...prev, [chartId]: result.insights }));
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights((prev) => ({
        ...prev,
        [chartId]: "Failed to generate insights. Please try again.",
      }));
    } finally {
      setLoadingInsights((prev) => ({ ...prev, [chartId]: false }));
    }
  };

  const fetchAnalytics = async (branchId = "", year = "", month = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (branchId) params.append("branch_id", branchId);
      if (year) params.append("year", year);
      if (month) params.append("month", month);

      const url = `${import.meta.env.VITE_API_URL}/api/analytics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch analytics data");

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
      className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium truncate">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-2 sm:p-3 rounded-full bg-gradient-to-br ${color.replace(
            "border-l-",
            "from-"
          )} to-opacity-20 flex-shrink-0 ml-2`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartContainer = ({
    title,
    children,
    chartId,
    chartType,
    chartData,
    context,
    className = "",
  }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 lg:mb-6 gap-2 sm:gap-0">
        <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 flex items-center">
          <div className="w-1 h-3 sm:h-4 lg:h-6 bg-blue-500 rounded mr-2 sm:mr-3"></div>
          <span className="truncate">{title}</span>
        </h3>
        <button
          onClick={() =>
            generateInsights(chartId, chartType, chartData, context)
          }
          disabled={loadingInsights[chartId]}
          className="flex items-center justify-center sm:justify-start space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto"
        >
          {loadingInsights[chartId] ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
              <span className="hidden sm:inline">Generating...</span>
              <span className="sm:hidden">Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Generate Insights</span>
              <span className="sm:hidden">AI Insights</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">{children}</div>

      {insights[chartId] && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">
                AI Insights
              </h4>
              <div className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                {insights[chartId]}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-800 text-xs sm:text-sm mb-1">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-xs sm:text-sm"
              style={{ color: entry.color }}
            >
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            Loading Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 font-medium text-sm sm:text-base mb-4">
            Error: {error}
          </p>
          <button
            onClick={() =>
              fetchAnalytics(selectedBranch, selectedYear, selectedMonth)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📊</div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">
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

  // Context for insights
  const getFilterContext = () => {
    let context = "Analyzing data";
    if (selectedBranch)
      context += ` for ${
        branches.find((b) => b.branch_id === selectedBranch)?.name
      }`;
    if (selectedYear) context += ` in year ${selectedYear}`;
    if (selectedMonth)
      context += ` for ${
        monthOptions.find((m) => m.value === selectedMonth)?.label
      }`;
    return context;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-3 sm:p-6 max-w-7xl mx-auto">
        {/* Header with Filters (same as before) */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  AI-Powered insights for your educational platform
                </p>
                {data.branchInfo && (
                  <span className="mt-1 sm:mt-0 sm:ml-2 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium inline-block w-fit">
                    {data.branchInfo.name}
                  </span>
                )}
              </div>
            </div>

            {/* Filters - Same as original */}
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <select
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  >
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch.branch_id} value={branch.branch_id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  >
                    <option value="">All Years</option>
                    {generateYearOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  >
                    {monthOptions.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                {(selectedBranch || selectedYear || selectedMonth) && (
                  <button
                    onClick={clearFilters}
                    className="w-full sm:w-auto px-2 sm:px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm flex items-center justify-center space-x-1"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {(selectedBranch || selectedYear || selectedMonth) && (
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
              <span className="text-xs sm:text-sm text-gray-600 mr-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
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

        {/* Charts with AI Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <ChartContainer
            title="Monthly Enrollment Trends"
            chartId="enrollment-trends"
            chartType="Enrollment Trends"
            chartData={data.enrollmentTrends}
            context={`${getFilterContext()}. Total enrollments per month showing growth patterns.`}
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.enrollmentTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="red"
                  strokeWidth={2}
                  dot={{ fill: "red", strokeWidth: 1, r: 4 }}
                  activeDot={{ r: 6, fill: "red" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Students per Course"
            chartId="students-per-course"
            chartType="Course Distribution"
            chartData={data.courseStats}
            context={`${getFilterContext()}. Distribution of ${totalStudents} students across ${
              data.courseStats?.length || 0
            } courses.`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={data.courseStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  dataKey="courseName"
                  type="category"
                  tick={{ fontSize: 8 }}
                  stroke="#6b7280"
                  width={100}
                  interval={0}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="students" fill="#10B981" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Top and Least Courses */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <ChartContainer
            title="Top 5 Most Enrolled Courses"
            chartId="top-courses"
            chartType="Top Performing Courses"
            chartData={data.topCourses}
            context={`${getFilterContext()}. Top 5 most popular courses by enrollment.`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={data.topCourses || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  dataKey="courseName"
                  type="category"
                  tick={{ fontSize: 8 }}
                  stroke="#6b7280"
                  width={90}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="students" fill="#F59E0B" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="5 Least Enrolled Courses"
            chartId="least-courses"
            chartType="Underperforming Courses"
            chartData={data.leastCourses}
            context={`${getFilterContext()}. Courses with lowest enrollment that may need attention.`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={data.leastCourses || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  dataKey="courseName"
                  type="category"
                  tick={{ fontSize: 8 }}
                  stroke="#6b7280"
                  width={90}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="students" fill="#EF4444" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Maintenance Cost Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <ChartContainer
            title="Maintenance Cost per Branch"
            chartId="maintenance-cost"
            chartType="Maintenance Cost Distribution"
            chartData={data.maintenanceCostPerBranch}
            context={`${getFilterContext()}. Total maintenance cost: ₱${parseInt(
              data.totalMaintenanceCost || 0
            ).toLocaleString()} across branches.`}
          >
            {data.maintenanceCostPerBranch &&
            data.maintenanceCostPerBranch.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  layout="vertical"
                  data={data.maintenanceCostPerBranch.map((item) => ({
                    branchName: item.branchName,
                    cost: parseFloat(item.cost) || 0,
                    maintenanceCount: parseInt(item.maintenanceCount) || 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    dataKey="branchName"
                    type="category"
                    tick={{ fontSize: 8 }}
                    stroke="#6b7280"
                    width={100}
                    interval={0}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "cost")
                        return [`₱${parseInt(value).toLocaleString()}`, "Cost"];
                      if (name === "maintenanceCount")
                        return [value, "Reports"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Branch: ${label}`}
                    contentStyle={{
                      fontSize: "12px",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "white",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="cost" fill="#EF4444" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-60">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="font-medium text-sm">
                    No maintenance data available
                  </p>
                </div>
              </div>
            )}
          </ChartContainer>

          {/* Revenue Charts */}
          <ChartContainer
            title="Revenue Distribution by Course"
            chartId="revenue-distribution"
            chartType="Revenue Distribution"
            chartData={data.revenuePerCourse}
            context={`${getFilterContext()}. Total revenue: ₱${parseInt(
              data.totalRevenue || 0
            ).toLocaleString()} across courses.`}
          >
            {data.revenuePerCourse && data.revenuePerCourse.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  layout="vertical"
                  data={data.revenuePerCourse.map((item) => ({
                    courseName: item.courseName,
                    revenue: parseFloat(item.revenue) || 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    dataKey="courseName"
                    type="category"
                    tick={{ fontSize: 8 }}
                    stroke="#6b7280"
                    width={100}
                    interval={0}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `₱${parseInt(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                    labelFormatter={(label) => `Course: ${label}`}
                    contentStyle={{
                      fontSize: "12px",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "white",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-60">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="font-medium text-sm">
                    No revenue data available
                  </p>
                </div>
              </div>
            )}
          </ChartContainer>

          <ChartContainer
            title="Monthly Revenue Trend"
            chartId="revenue-trend"
            chartType="Monthly Revenue"
            chartData={data.monthlyRevenue}
            context={`${getFilterContext()}. Revenue trends showing growth patterns over time.`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₱${parseInt(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    fontSize: "12px",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: "#F59E0B", strokeWidth: 1, r: 4 }}
                  activeDot={{ r: 6, fill: "#D97706" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
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

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/branches`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
          `${import.meta.env.VITE_API_URL}/api/attendance/all`,
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

  // Calculate instructor totals based on current filters (excluding status filter for total count)
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
      const matchesBranch = filterBranch
        ? record.branch_id.toString() === filterBranch
        : true;

      const matchesTab = activeTab === "today" ? record.date === today : true;

      return (
        matchesName &&
        matchesYear &&
        matchesMonth &&
        matchesBranch &&
        matchesTab
      );
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
  const branchStats = getBranchStats();
  const instructorTotals = getInstructorTotals();

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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Attendance Overview
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Monitor attendance across all branches
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="sm:hidden">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 text-sm sm:text-base">{error}</span>
            </div>
          </div>
        )}

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Present Today
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {stats.present}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Absent Today
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">
                  {stats.absent}
                </p>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Today
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Branch-wise Stats */}
        {Object.keys(branchStats).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Today's Branch Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(branchStats).map(([branchName, stats]) => (
                <div
                  key={branchName}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4"
                >
                  <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base truncate">
                    {branchName}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-green-600">Present:</span>
                      <span className="font-medium">{stats.present}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-red-600">Absent:</span>
                      <span className="font-medium">{stats.absent}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm border-t pt-1">
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
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
            {/* Search Name */}
            <div className="relative lg:col-span-1">
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
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Summary Info */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
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
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
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
                    Branch
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
                        key={record.attendance_id || record.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div className="sm:hidden">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="hidden sm:block">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {record.instructor_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{record.username}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div className="truncate max-w-[100px] sm:max-w-none">
                            {record.branch_name}
                          </div>
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
                            <span className="hidden sm:inline">
                              {record.status.toUpperCase()}
                            </span>
                            <span className="sm:hidden">
                              {record.status === "present" ? "P" : "A"}
                            </span>
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div className="flex flex-col space-y-1">
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
                    <td colSpan="5" className="px-3 sm:px-6 py-12 text-center">
                      <Filter className="h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm sm:text-base">
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
  );
};

const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loadingPw, setLoadingPw] = useState(false);
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [lastBackup, setLastBackup] = useState(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  // Load auto backup settings and profile on mount
  useEffect(() => {
    fetchBackupSettings();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName(response.data.name || "");
      setUsername(response.data.username || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchBackupSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/backup/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAutoBackupEnabled(response.data.enabled);
      setBackupFrequency(response.data.frequency || "daily");
      setLastBackup(response.data.lastBackup);
    } catch (err) {
      console.error("Failed to fetch backup settings:", err);
    }
  };

  const updateProfile = async () => {
    if (!name.trim() || !username.trim()) {
      return Swal.fire("Error", "Name and username cannot be empty", "error");
    }

    if (username.length < 8) {
      return Swal.fire(
        "Error",
        "Username must be at least 8 characters long",
        "error"
      );
    }

    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        { name, username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const toggleAutoBackup = async () => {
    try {
      const token = localStorage.getItem("token");
      const newState = !autoBackupEnabled;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/backup/settings`,
        { enabled: newState, frequency: backupFrequency },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAutoBackupEnabled(newState);
      Swal.fire(
        "Success",
        `Automatic backup ${newState ? "enabled" : "disabled"}!`,
        "success"
      );
    } catch (err) {
      Swal.fire("Error", "Failed to update backup settings", "error");
    }
  };

  const updateBackupFrequency = async (frequency) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/backup/settings`,
        { enabled: autoBackupEnabled, frequency },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBackupFrequency(frequency);
      Swal.fire("Success", "Backup frequency updated!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update frequency", "error");
    }
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !repeatPassword) {
      return Swal.fire("Error", "Please fill in all fields", "error");
    }

    if (newPassword !== repeatPassword) {
      return Swal.fire("Error", "New passwords do not match", "error");
    }

    if (newPassword.length < 6) {
      return Swal.fire(
        "Error",
        "New password must be at least 6 characters long",
        "error"
      );
    }

    setLoadingPw(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Password updated successfully!", "success");
      setOldPassword("");
      setNewPassword("");
      setRepeatPassword("");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update password",
        "error"
      );
    } finally {
      setLoadingPw(false);
    }
  };

  const handleBackup = async () => {
    setLoadingBackup(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/backup`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/sql" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${new Date().toISOString().split("T")[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire(
        "Success",
        "Database backup downloaded successfully!",
        "success"
      );
      fetchBackupSettings();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to backup database",
        "error"
      );
    } finally {
      setLoadingBackup(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Security Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile, security and backup preferences
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">
                  Profile Settings
                </h2>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <AtSign className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Username must be at least 8 characters long
                </p>
              </div>
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={updateProfile}
                  disabled={loadingProfile}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingProfile ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating Profile...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <KeyRound className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">
                  Change Password
                </h2>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Old Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showOld ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showOld ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showNew ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Repeat Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showRepeat ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeat(!showRepeat)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showRepeat ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={changePassword}
                  disabled={loadingPw}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingPw ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating Password...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>

              {/* Security Tips */}
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Security Tips:
                </h3>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>
                    • Use a mix of letters, numbers, and special characters
                  </li>
                  <li>• Avoid using personal information</li>
                  <li>• Don't reuse passwords from other accounts</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Database Backup Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">
                  Database Backup
                </h2>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Automatic Backup Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Automatic Backup
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Automatically backup database on schedule
                  </p>
                </div>
                <button
                  onClick={toggleAutoBackup}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoBackupEnabled ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoBackupEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Backup Frequency */}
              {autoBackupEnabled && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Backup Frequency
                  </label>
                  <select
                    value={backupFrequency}
                    onChange={(e) => updateBackupFrequency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="every6hours">Every 6 Hours</option>
                    <option value="daily">Daily (2:00 AM)</option>
                    <option value="weekly">Weekly (Sunday 3:00 AM)</option>
                    <option value="monthly">Monthly (1st day 4:00 AM)</option>
                  </select>
                </div>
              )}

              {/* Last Backup Info */}
              {lastBackup && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Last backup:</span>{" "}
                    {new Date(lastBackup).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Manual Backup Button */}
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-3">
                  Download a manual backup of your database
                </p>
                <button
                  onClick={handleBackup}
                  disabled={loadingBackup}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loadingBackup ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Creating Backup...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Manual Backup</span>
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                  Backup Info:
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• SQL format file</li>
                  <li>• Includes all tables and data</li>
                  <li>• Automatic backups stored on server</li>
                  <li>• Keeps last 7 backups (older ones deleted)</li>
                  <li>• Can be restored using PostgreSQL tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Student";

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

  const navigationItems = [
    { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Records", icon: <Users className="w-5 h-5" /> },
    { name: "Courses", icon: <LucideBookOpen className="w-5 h-5" /> },
    { name: "Student Records", icon: <Users className="w-5 h-5" /> },
    { name: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Announcements", icon: <MegaphoneIcon className="w-5 h-5" /> },
    { name: "Feedbacks", icon: <Shield className="w-5 h-5" /> },
    { name: "Attendance", icon: <ListCheck className="w-5 h-5" /> },
    { name: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header - Static (Not Fixed) */}
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

      {/* Overlay for mobile */}
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
              <div className="font-bold text-lg">1st Safety</div>
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
            {activePage === "Records" && <RecordsPage />}
            {activePage === "Courses" && <CoursesPage />}
            {activePage === "Student Records" && <StudentsRecords />}
            {activePage === "Analytics" && <AnalyticsPage />}
            {activePage === "Announcements" && <AnnouncementsPage />}
            {activePage === "Feedbacks" && <FeedbackPage />}
            {activePage === "Attendance" && <AttendancePage />}
            {activePage === "Settings" && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
};
export default ManagerDashboard;
