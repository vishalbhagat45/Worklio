import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSun, FaMoon, FaSmile } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const role = user?.role;

  // Logout handler
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/"); // Redirect to home
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm py-4 px-8 flex justify-between items-center relative text-sm dark:text-white transition duration-300">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        Worklio
      </Link>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Find Professionals & Agencies"
        className="w-[40%] mx-7 px-6 py-2 border rounded-md text-sm outline-none dark:bg-gray-800 dark:text-white"
      />

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        <Link to="/solution" className="hover:underline">
          Solutions
        </Link>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Authenticated */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 font-medium"
            >
              <img
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              {user.username}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50">
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ← Back to Home
                </Link>

                {role === "client" && (
                  <>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Client Dashboard
                    </Link>
                    <Link to="/my-orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      My Orders
                    </Link>
                  </>
                )}

                {role === "freelancer" && (
                  <>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Freelancer Dashboard
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Orders
                    </Link>
                    <Link to="/my-gigs" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      My Gigs
                    </Link>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <Link to="/admin-dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Manage Users
                    </Link>
                  </>
                )}

                <Link to="/chat" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <span className="flex items-center gap-1">
                    <FaSmile className="text-yellow-500" /> Messages
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}

        {/* Role-Based Action Button */}
        {user && role === "client" && (
          <Link to="/post-job" className="bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700">
            Post a Job
          </Link>
        )}
        {user && role === "freelancer" && (
          <Link to="/my-gigs" className="bg-purple-600 px-4 py-2 text-white rounded hover:bg-purple-700">
            Post a Gig
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
