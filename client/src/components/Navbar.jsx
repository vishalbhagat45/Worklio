import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSun, FaMoon, FaSmile } from "react-icons/fa";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const { user, logout } = useAuth();
  const role = user?.role;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Logout handler
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserRole(storedUser.role); // client or freelancer
    }
  }, []);

  const handleHomeRedirect = () => {
    if (userRole === "client") {
      navigate("/client-home");
    } else if (userRole === "freelancer") {
      navigate("/freelancer-home");
    } else {
      navigate("/"); // fallback to landing page
    }
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
       <span
        className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
        onClick={handleHomeRedirect}
      >
        Worklio
      </span>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Find Professionals & Agencies"
        className="w-[40%] mx-7 px-6 py-2 border rounded-md text-sm outline-none dark:bg-gray-800 dark:text-white"
      />

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        {/* <Link to="/solution" className="hover:underline">
          Solutions
        </Link> */}

        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Authenticated Section */}
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

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50">

                {/* Role-Based Dropdown */}
                <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
                  <Link to="/mygigs" className="text-xl font-bold">
                    FreelanceHub
                  </Link>
                  <div className="flex items-center gap-4">
                    {!user ? (
                      <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                      </>
                    ) : (
                      <>
                        {/* <span>Hello, {user.name}</span>
                        <span className="px-2 py-1 bg-gray-700 rounded">
                          Role: {user.role}
                        </span> */}

                        {user.role === "freelancer" && (
                          <>
                            <Link to="/freelancer/dashboard">Dashboard</Link>
                            <Link to="/freelancer/post">Post Gig</Link>
                          </>
                        )}

                        {user.role === "client" && (
                          <>
                            <Link to="/client/dashboard">Dashboard</Link>
                            <Link to="/client/post">Post Job</Link>
                          </>
                        )}

                        {/* <button
                          onClick={logout}
                          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                        >
                          Logout
                        </button> */}
                      </>
                    )}
                  </div>
                </nav>
                <Link
                  to="/chat"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
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

        {/* Role-Based CTA Buttons */}
        {/* {user && role === "client" && (
          <Link
            to="/Mygigs"
            className="bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700"
          >
            Post a Job
          </Link>
        )}
        {user && role === "freelancer" && (
          <Link
            to="/mygigs"
            className="bg-purple-600 px-4 py-2 text-white rounded hover:bg-purple-700"
          >
            Post a Gig
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default Navbar;
