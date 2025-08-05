// src/components/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function JobCard({ job }) {
  const {
    _id,
    title,
    description,
    budget,
    rating,
    postedBy = {},
  } = job;

  return (
    <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-300 ease-in-out bg-white">
      <Link
        to={`/gig/${_id}`}
        className="block mb-2 text-xl font-semibold text-gray-900 hover:text-blue-600 transition"
      >
        {title}
      </Link>

      <p className="text-sm text-gray-500 mb-1">
        by{" "}
        <span className="font-medium text-gray-800">
          {postedBy.name || "Freelancer"}
        </span>
      </p>

      <p className="text-gray-700 text-sm mb-4">
        {description?.slice(0, 100)}...
      </p>

      <div className="flex items-center justify-between">
        <p className="text-green-600 font-bold text-sm">
          ${budget}
        </p>

        {rating && (
          <div className="flex items-center text-yellow-500 text-sm">
            <FaStar className="mr-1" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
