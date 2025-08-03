// client/src/components/StarRating.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating, setRating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((num) => (
        <FaStar
          key={num}
          className={`cursor-pointer text-2xl transition ${
            num <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => setRating(num)}
        />
      ))}
    </div>
  );
}
