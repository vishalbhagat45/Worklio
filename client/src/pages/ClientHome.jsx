// src/pages/ClientHome.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../api/jobApi";
import { useAuth } from "../context/AuthContext";

export default function ClientHome() {
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("Invalid categories response format");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const navigationLinks = [
    { label: "Dashboard", path: "/dashboard/client" },
    { label: "Purchased Gigs", path: "/client/purchased-gigs" },
    { label: "All Jobs", path: "/all-jobs" },
    // Replace :gigId with an actual ID or keep placeholder if dynamic
    { label: "Gig Applicants", path: "/gig/:gigId/applicants" },
    { label: "Job Details", path: "/jobs/:jobId" },
    { label: "Messages", path: "/chat" },
    { label: "Orders", path: "/orders" },
    { label: "Categories", path: "/category/:slug" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg px-6 py-8 hidden md:block">
        <h2 className="text-xl font-bold mb-6">👤 Client Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {navigationLinks.map((link, index) => (
            <Link
              key={`${link.path}-${index}`}
              to={link.path}
              className="hover:text-blue-600 transition text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Hero */}
        <section className="text-center py-16 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 dark:from-gray-800 dark:to-gray-900 rounded-xl mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find the Perfect Freelancer for Your Job
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Post jobs, hire freelancers, and get your work done efficiently – just like Fiverr.
          </p>
          <div className="flex justify-center mt-6 flex-wrap gap-4">
            <Link
              to="/category/:slug"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Browse Categories
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              View Pricing
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">📁 Explore Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Browse top gigs in {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mb-16">
          <h2 className="text-3xl font-semibold mb-10 text-center">💬 What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition"
              >
                <p className="text-gray-700 dark:text-gray-300">
                  “Amazing experience! Found the perfect freelancer in minutes.”
                </p>
                <p className="mt-4 font-semibold">User {i + 1}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mb-16">
          <h2 className="text-3xl font-semibold mb-10 text-center">💰 Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {["Basic", "Standard", "Premium"].map((plan, i) => (
              <div
                key={plan}
                className="p-6 border rounded-xl hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="text-xl font-bold">{plan}</h3>
                <p className="text-2xl font-semibold mt-2">${(i + 1) * 19}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>✓ Post up to {(i + 1) * 5} jobs</li>
                  <li>✓ Access to freelancers</li>
                  <li>✓ Priority support</li>
                </ul>
                <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Get {plan}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Back to top */}
        <div className="text-center py-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            ⬆ Back to Top
          </button>
        </div>
      </main>
    </div>
  );
}
