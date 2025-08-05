import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import StarRating from "./StarRating"; 

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
      setReviews(res.data || []);

      const alreadyReviewed = res.data.find(
        (r) => r.userId === user._id || r.userId?._id === user._id
      );
      setHasReviewed(!!alreadyReviewed);
    } catch (err) {
      console.error("Error loading reviews", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    try {
      if (editingReviewId) {
        await axios.put(
          `/api/reviews/${editingReviewId}`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      } else {
        await axios.post(
          `/api/reviews`,
          { gigId, rating, comment },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setHasReviewed(true);
      }

      setRating(0);
      setComment("");
      setEditingReviewId(null);
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
    <div className="mt-6 bg-white border rounded-md p-6 shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">⭐ Reviews</h3>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-sm mb-4">No reviews yet.</p>
      )}

      {reviews.map((rev) => (
        <div
          key={rev._id}
          className="mb-4 border-b pb-3 flex justify-between items-start"
        >
          <div>
            <p className="font-semibold text-gray-800">
              {rev.userId?.username || "Unknown User"}
            </p>
            <StarRating rating={rev.rating} readOnly />
            <p className="text-sm text-gray-700 mt-1">{rev.comment}</p>
          </div>

          {(user?._id === rev.userId?._id || user?.role === "admin") && (
            <div className="flex items-center gap-3 text-gray-600 text-sm mt-1">
              {user?._id === rev.userId?._id && (
                <FaEdit
                  title="Edit"
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleEdit(rev)}
                />
              )}
              <FaTrash
                title="Delete"
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleDelete(rev._id)}
              />
            </div>
          )}
        </div>
      ))}

      {/* Review Form */}
      {!hasReviewed || editingReviewId ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <StarRating rating={rating} onRatingChange={setRating} />
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-md p-2 text-sm mt-3 focus:outline-none focus:ring-1 focus:ring-green-400"
            placeholder="Write your review here..."
            required
          />
          <button
            type="submit"
            className="mt-3 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          ✅ You have already reviewed this gig.
        </p>
      )}
    </div>
  );
}
