// ForgotPasswordPage.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/forgot-password", { email });

      // Save email in localStorage for use in reset page
      localStorage.setItem("resetEmail", email);

      // Show success and redirect to reset page
      Swal.fire("Success", res.data.message, "success").then(() => {
        navigate("/reset-password");
      });

    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700 transition"
        >
          Send Code
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
