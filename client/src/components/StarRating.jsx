// src/components/StarRating.jsx
import React from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating, onRatingChange, readOnly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => !readOnly && onRatingChange?.(star)}
          className={`text-xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${
            readOnly ? "cursor-default" : "hover:text-yellow-500"
          }`}
          disabled={readOnly}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
}
