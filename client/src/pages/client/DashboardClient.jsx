import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJobs, DeleteJobById, fetchOrders, fetchReviewsByUser } from "../../api/jobApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function DashboardClient() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

 useEffect(() => {
  const loadData = async () => {
    if (user?.role === "client") {
      const jobData = await fetchJobs();
      setJobs(Array.isArray(jobData?.data) ? jobData.data : jobData?.data?.jobs || []);
    } else if (user?.role === "freelancer") {
      const orderData = await fetchOrders(user._id);
      setOrders(orderData.data);
      const reviewData = await fetchReviewsByUser(user._id);
      setReviews(reviewData.data);
    }
  };

  if (user) loadData(); // safety check
}, [user]);


  const handleLeaveReview = (orderId) => {
    navigate(`/leave-review/${orderId}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await DeleteJobById(jobId);
      toast.success("Job deleted successfully");
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      toast.error("Error deleting job");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user?.role === "client" && (
        <>
          <h2 className="text-xl font-semibold mb-2">Your Posted Jobs</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p>{job.description}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEditJob(job._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {user?.role === "freelancer" && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Your Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-bold">{order.jobTitle}</h3>
                <p>Status: {order.status}</p>

                {/* Delivery Files or Chat Links */}
                {order.deliveryFile && (
                  <div className="mt-2">
                    <p className="font-semibold">Delivery File:</p>
                    <a
                      href={order.deliveryFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Delivered File
                    </a>
                  </div>
                )}

                {/* Leave a Review Button */}
                {order.status === "Completed" && !reviews.some(r => r.orderId === order._id) && (
                  <button
                    className="mt-3 bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleLeaveReview(order._id)}
                  >
                    Leave a Review
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
