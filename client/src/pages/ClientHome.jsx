// src/pages/ClientHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/jobApi"; // Your abstraction
import { useAuth } from "../context/AuthContext";

export default function ClientHome() {
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <section
        id="top"
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 pb-10 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 dark:from-gray-800 dark:to-gray-900"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Find the Perfect Freelancer for Your Job
        </h1>
        <p className="text-xl md:text-2xl max-w-xl">
          Post jobs, hire freelancers, and get work done easily on our Fiverr-inspired platform.
        </p>

        <div className="flex gap-4 mt-6 flex-wrap justify-center">
          <button
            onClick={() => scrollTo("categories")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
          >
            Browse Categories
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
          >
            View Pricing
          </button>
        </div>
      </section>

      <section id="categories" className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{cat.name}</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Browse top gigs in {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="testimonials" className="py-16 px-6 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-3xl font-semibold mb-10 text-center">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
              <p className="text-gray-700 dark:text-gray-300">
                “Amazing experience! Found the perfect freelancer in minutes.”
              </p>
              <p className="mt-4 font-semibold">User {i + 1}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-16 px-6">
        <h2 className="text-3xl font-semibold mb-10 text-center">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Basic", "Standard", "Premium"].map((plan, i) => (
            <div key={i} className="p-6 border rounded-xl hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-xl font-bold">{plan}</h3>
              <p className="text-2xl font-semibold mt-2">${(i + 1) * 19}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✓ Post up to {(i + 1) * 5} jobs</li>
                <li>✓ Access to freelancers</li>
                <li>✓ Customer support</li>
              </ul>
              <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Get {plan}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-8">
        <button
          onClick={() => scrollTo("top")}
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          ⬆ Back to Top
        </button>
      </div>
    </div>
  );
}
