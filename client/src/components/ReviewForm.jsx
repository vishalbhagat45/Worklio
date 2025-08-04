import React, { useState } from 'react';
import StarRating from './StarRating';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export default function ReviewForm({ onReviewSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Get gigId and orderId from URL if not passed as props
  const { gigId, orderId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      toast.warning('Please provide both rating and comment.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/reviews', {
        gigId,
        orderId,
        rating,
        comment,
      });
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      if (onReviewSuccess) onReviewSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 border rounded shadow-md max-w-md w-full"
    >
      <h2 className="text-lg font-semibold mb-3">Leave a Review</h2>

      <label className="block mb-2 text-sm font-medium">Your Rating</label>
      <StarRating rating={rating} setRating={setRating} />

      <label className="block mt-4 mb-2 text-sm font-medium">Your Comment</label>
      <textarea
        className="w-full border p-2 rounded"
        rows="4"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
