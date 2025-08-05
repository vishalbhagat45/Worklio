// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.role) {
      setError("Please select your role: Client or Freelancer.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("allUsers")) || [];

    const matchedUser = users.find(
      (user) =>
        user.email === formData.email &&
        user.password === formData.password &&
        user.role === formData.role
    );

    if (matchedUser) {
      login(matchedUser);

      // Redirect based on role
      if (matchedUser.role === "client") {
        navigate("/client-home");
      } else if (matchedUser.role === "freelancer") {
        navigate("/freelancer-home");
      } else {
        setError("Invalid role. Please contact support.");
      }
    } else {
      setError("Invalid credentials or role mismatch.");
    }
  };

  return (
    <div
      className="h-full w-full py-7 mt-30 mb-2 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/login.jpg')" }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md bg-opacity-90">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to your Worklio account
        </p>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-3 mb-4 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 mb-4 border rounded-lg"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={formData.role === "client"}
                  onChange={handleChange}
                />
                <span>Client</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="freelancer"
                  checked={formData.role === "freelancer"}
                  onChange={handleChange}
                />
                <span>Freelancer</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition mb-4"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mb-4">Or login with</p>
        <div className="flex justify-center space-x-4 mb-6">
          <button className="bg-blue-100 p-3 rounded-full text-blue-700 hover:bg-blue-200">
            <FaGoogle />
          </button>
          <button className="bg-blue-100 p-3 rounded-full text-blue-700 hover:bg-blue-200">
            <FaFacebookF />
          </button>
          <button className="bg-blue-100 p-3 rounded-full text-blue-700 hover:bg-blue-200">
            <FaTwitter />
          </button>
        </div>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
