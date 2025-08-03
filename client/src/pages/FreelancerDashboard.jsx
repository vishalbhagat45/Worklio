import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EditGigModal from '../components/EditGigModal';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingGig, setEditingGig] = useState(null);

  useEffect(() => {
    if (user) {
      fetchGigs();
      fetchOrders();
    }
  }, [user]);

  const fetchGigs = async () => {
    try {
      const res = await axios.get(`/api/gigs?userId=${user._id}`);
      setGigs(res.data);
    } catch (err) {
      console.error("Error fetching gigs", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/orders?freelancerId=${user._id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/gigs/${id}`);
      setGigs(gigs.filter(gig => gig._id !== id));
      toast.success("Gig deleted successfully");
    } catch (err) {
      toast.error("Failed to delete gig");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎨 Freelancer Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🛠️ My Gigs</h2>
        {gigs.length === 0 ? (
          <p className="text-gray-500">No gigs added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gigs.map(gig => (
              <div key={gig._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">{gig.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{gig.description}</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Budget: ₹{gig.budget}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => setEditingGig(gig)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => handleDelete(gig._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📦 Gig Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No gig orders received yet.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map(order => (
              <li key={order._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold">{order.gigTitle}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Client: {order.clientName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Status: {order.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingGig && (
        <EditGigModal
          gig={editingGig}
          onClose={() => setEditingGig(null)}
          onSave={fetchGigs}
        />
      )}
    </div>
  );
}