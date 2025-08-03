// src/pages/admin/ManageGigs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ManageGigs() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await axios.get("/api/admin/gigs");
      setGigs(res.data);
    } catch (error) {
      toast.error("Failed to fetch gigs");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this gig?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/admin/gigs/${id}`);
      toast.success("Gig deleted");
      setGigs(gigs.filter((gig) => gig._id !== id));
    } catch (err) {
      toast.error("Failed to delete gig");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Gigs</h1>

      {gigs.length === 0 ? (
        <p>No gigs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Seller</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gigs.map((gig) => (
                <tr key={gig._id}>
                  <td className="py-2 px-4 border">{gig.title}</td>
                  <td className="py-2 px-4 border">{gig?.createdBy?.name || "N/A"}</td>
                  <td className="py-2 px-4 border">${gig.price}</td>
                  <td className="py-2 px-4 border">{gig.category}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleDelete(gig._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    {/* You can add Edit button here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
