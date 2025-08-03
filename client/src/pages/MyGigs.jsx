import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EditGigModal from '../components/EditGigModal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MyGigs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [editingGig, setEditingGig] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGigs();
    } else {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setEditingGig(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/gigs?userId=${user._id}`);
      setGigs(res.data);
    } catch (err) {
      console.error("Error fetching gigs", err);
      toast.error("Failed to load gigs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this gig?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/gigs/${id}`);
      setGigs(gigs.filter(gig => gig._id !== id));
      toast.success("Gig deleted successfully 🚮");
    } catch (err) {
      console.error("Error deleting gig", err);
      toast.error("Failed to delete gig.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">💼 My Gigs</h2>
        <Link to="/" className="text-blue-500 hover:underline text-sm">← Back to Home</Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading gigs...</p>
      ) : gigs.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">You haven't posted any gigs yet. 🚀</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map(gig => (
            <div key={gig._id} className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-1">{gig.title} 🎨</h3>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{gig.description}</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Budget: ₹{gig.budget}</p>
              <div className="mt-3 flex gap-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                  onClick={() => setEditingGig(gig)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full text-sm"
                  onClick={() => handleDelete(gig._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
