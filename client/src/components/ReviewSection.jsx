// client/src/components/ReviewSection.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";

export default function ReviewSection({ gigId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/${gigId}`);
      setReviews(res.data);

      const reviewed = res.data.find((r) => r.userId === user._id || r.userId._id === user._id);
      if (reviewed) {
        setHasReviewed(true);
        setEditingReviewId(null);
      }
    } catch (err) {
      console.error("Error loading reviews", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return;

    try {
      if (editingReviewId) {
        await axios.put(
          `/api/reviews/${editingReviewId}`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setEditingReviewId(null);
      } else {
        await axios.post(
          "/api/reviews",
          { gigId, rating, comment },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setHasReviewed(true);
      }

      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      console.error("Failed to submit/edit review", err);
    }
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHasReviewed(false);
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-4">⭐ Reviews</h3>

      {reviews.map((rev) => (
        <div key={rev._id} className="mb-4 border-b pb-2">
          <div className="flex justify-between items-center">
            <div>
              <strong>{rev.userId.username}</strong>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={16}
                    color={i < rev.rating ? "gold" : "lightgray"}
                  />
                ))}
              </div>
              <p className="text-gray-800">{rev.comment}</p>
            </div>

            {(user._id === rev.userId._id || user.role === "admin") && (
              <div className="flex gap-2 text-gray-500">
                {user._id === rev.userId._id && (
                  <FaEdit
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => handleEdit(rev)}
                  />
                )}
                <FaTrash
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => handleDelete(rev._id)}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {!hasReviewed || editingReviewId ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-3 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={rating === star}
                  onChange={() => setRating(star)}
                  className="accent-yellow-500"
                />
                <FaStar color={star <= rating ? "gold" : "gray"} />
              </label>
            ))}
          </div>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2 mb-2"
            placeholder="Write your review..."
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">You have already reviewed this gig.</p>
      )}
    </div>
  );
}
