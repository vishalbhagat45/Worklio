import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PurchasedGigs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

 useEffect(() => {
  if (!user) return;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/orders/user/${user._id}`
      );

      const ordersArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.orders)
        ? res.data.orders
        : [];

      setOrders(ordersArray);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  };

  fetchOrders(); // ✅ Call the async function

}, [user]);


  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      alert('Order cancelled successfully.');
    } catch (err) {
      console.error('Cancellation failed:', err);
      alert('Failed to cancel order.');
    }
  };

  const handleContact = (freelancerId) => {
    navigate(`/messages/${freelancerId}`);
  };

  const goToGigDetails = (gigId) => {
    navigate(`/gig/${gigId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎯 Purchased Gigs</h1>

      {orders.length === 0 ? (
        <p>No gigs purchased yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded shadow">
              <p className="font-semibold">
                Gig:{' '}
                <button
                  onClick={() => goToGigDetails(order.gigId)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {order.gigTitle}
                </button>
              </p>
              <p>Freelancer: {order.freelancerName}</p>
              <p>Price: ₹{order.price}</p>
              <p>Status: <span className={`font-semibold ${order.status === 'Cancelled' ? 'text-red-500' : ''}`}>{order.status}</span></p>
              <p>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>

              <div className="mt-2 flex gap-4">
                <button
                  onClick={() => handleContact(order.freelancerId)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  💬 Contact Freelancer
                </button>

                {order.status === 'Pending' && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    ❌ Cancel Order
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
