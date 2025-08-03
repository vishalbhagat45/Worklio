// src/components/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function JobCard({ job }) {
  return (
    <div className="border p-4 rounded-md shadow hover:shadow-md transition">
      <Link to={`/gig/${job._id}`}>
        <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
          {job.title}
        </h3>
      </Link>

      <p className="text-sm text-gray-600 mt-1">
        by <span className="font-medium text-black">{job.postedBy?.name || "Freelancer"}</span>
      </p>

      <p className="text-sm mt-2 text-gray-700">
        {job.description?.slice(0, 80)}...
      </p>

      <div className="flex items-center justify-between mt-4">
        <p className="text-green-600 font-semibold">${job.budget}</p>

        {job.rating && (
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <FaStar className="inline-block" />
            {job.rating.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
}
