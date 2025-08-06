import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, index) => {
            const current = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={current}
                  onClick={() => setRating(current)}
                  className="hidden"
                />
                <FaStar
                  size={30}
                  className={`cursor-pointer transition-colors ${
                    current <= (hover || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHover(current)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>

        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Write your feedback here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarRating;
