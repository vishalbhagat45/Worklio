// client/src/components/LeaveReview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import { toast } from 'react-toastify';

export default function LeaveReview({ gigId, orderId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    const checkReview = async () => {
      try {
        const res = await axios.get(`/api/reviews/check?gigId=${gigId}&orderId=${orderId}`);
        setAlreadyReviewed(res.data.exists);
      } catch (error) {
        toast.error('Error checking review status');
      }
    };
    checkReview();
  }, [gigId, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 10) return toast.error('Comment must be at least 10 characters');
    if (rating === 0) return toast.error('Please select a rating');

    try {
      await axios.post('/api/reviews', { gigId, orderId, rating, comment });
      toast.success('Review submitted!');
      setAlreadyReviewed(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (alreadyReviewed) return <p className="text-green-600">You already submitted a review.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Leave a Review</h3>
      <StarRating rating={rating} setRating={setRating} />
      <textarea
        className="w-full border rounded p-2"
        rows="4"
        placeholder="Write your experience (min 10 characters)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit Review
      </button>
    </form>
  );
}
