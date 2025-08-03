import React from "react";
import { Link } from "react-router-dom";

export default function DashboardAdmin() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="space-y-4">
        <Link
          to="/dashboard"
          className="block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          All Jobs (Admin View)
        </Link>

        <Link
          to="/orders"
          className="block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          All Orders
        </Link>

        <Link
          to="/admin/users"
          className="block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Manage Users
        </Link>

        <Link
          to="/admin/gigs"
          className="block bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
        >
          Manage Gigs
        </Link>
      </div>
    </div>
  );
}
