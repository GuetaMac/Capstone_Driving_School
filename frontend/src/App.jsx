// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import Verify from "./student/Verify";
import Dashboard from "./Dashboard";
import Student from "./student/Student";
import Admin from "./admin/Admin";
import Instructor from "./instructor/Instructor";
import Forgot from "./student/Forgot";
import Reset from "./student/Reset";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/verify" element={<Verify />} />
        <Route path="/manager_dashboard" element={<Dashboard />} />
        <Route path="/student_dashboard" element={<Student />} />
        <Route path="/admin_dashboard" element={<Admin />} />
        <Route path="/instructor_dashboard" element={<Instructor />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password" element={<Reset />} />
      </Routes>
    </Router>
  );
}

export default App;
