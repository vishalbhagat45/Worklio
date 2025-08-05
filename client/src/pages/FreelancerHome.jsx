// src/pages/FreelancerHome.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function FreelancerHome() {
  const { user } = useAuth();

  return (
    <div className="p-6 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome {user?.name}, Freelancer Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/post-job"
          className="p-6 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          <h2 className="text-2xl font-semibold">Post a New Gig</h2>
          <p className="mt-2 text-sm">Create a new job to offer your skills</p>
        </Link>

        <Link
          to="/my-gigs"
          className="p-6 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          <h2 className="text-2xl font-semibold">Manage My Gigs</h2>
          <p className="mt-2 text-sm">Edit, delete, and manage your job listings</p>
        </Link>

        <Link
          to="/messages"
          className="p-6 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
        >
          <h2 className="text-2xl font-semibold">Messages</h2>
          <p className="mt-2 text-sm">Chat with potential clients</p>
        </Link>

        <Link
          to="/ratings"
          className="p-6 bg-yellow-600 text-white rounded-xl shadow hover:bg-yellow-700 transition"
        >
          <h2 className="text-2xl font-semibold">View Ratings</h2>
          <p className="mt-2 text-sm">See what clients are saying</p>
        </Link>
      </div>
    </div>
  );
}
