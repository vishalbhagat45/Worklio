// src/pages/FreelancerDashboard.jsx
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
  const [applications, setApplications] = useState([]);
  const [editingGig, setEditingGig] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchGigs(user._id);
      fetchOrders(user._id);
      fetchApplications(user._id);
    }
  }, [user]);

  const fetchGigs = async (freelancerId) => {
    try {
      const res = await axios.get(`/api/gigs?userId=${freelancerId}`);
      setGigs(res.data);
    } catch (err) {
      console.error("Error fetching gigs", err);
      toast.error("Failed to load gigs");
    }
  };

  const fetchOrders = async (freelancerId) => {
    try {
      const res = await axios.get(`/api/orders?freelancerId=${freelancerId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
      toast.error("Failed to load orders");
    }
  };

  const fetchApplications = async (freelancerId) => {
    try {
      const res = await axios.get(`/api/applications?freelancerId=${freelancerId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
      toast.error("Failed to load applications");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/gigs/${id}`);
      setGigs(prev => prev.filter(gig => gig._id !== id));
      toast.success("Gig deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete gig");
    }
  };

  if (!user) {
    return <div className="text-center text-gray-500 mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎨 Freelancer Dashboard</h1>

      {/* My Gigs */}
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

      {/* Orders */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📦 Gig Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No gig orders received yet.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map(order => (
              <li key={order._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold">{order.gigTitle || "Unnamed Gig"}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Client: {order.clientName || "N/A"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Status: {order.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📄 Job Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        ) : (
          <ul className="space-y-2">
            {applications.map(app => (
              <li key={app._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold">Job: {app.jobTitle}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Status: {app.status}</p>
                {app.jobId && (
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    🔍 View Job Details
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Edit Modal */}
      {editingGig && (
        <EditGigModal
          gig={editingGig}
          onClose={() => setEditingGig(null)}
          onSave={() => fetchGigs(user._id)}
        />
      )}
    </div>
  );
}
