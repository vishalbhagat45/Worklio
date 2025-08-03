// components/BuyButton.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function BuyButton({
  itemId, // can be jobId or gigId
  sellerId,
  type = 'job', // 'job' or 'gig'
  currentUserId,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBuy = async () => {
    if (!itemId || !sellerId || !type) {
      toast.error("Missing item/seller/type info.");
      return;
    }

    if (currentUserId === sellerId) {
      toast.info("You cannot purchase your own listing.");
      return;
    }

    const confirmed = confirm(`Are you sure you want to buy this ${type}?`);
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          itemId,
          sellerId,
          type,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`,
        },
        { withCredentials: true }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Invalid Stripe URL.");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      toast.error("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Hide Buy Button for seller/owner
  if (currentUserId === sellerId) return null;

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`px-4 py-2 rounded text-white transition duration-200 ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? 'Processing...' : 'Buy Now'}
    </button>
  );
}
