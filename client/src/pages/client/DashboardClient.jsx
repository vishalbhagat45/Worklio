// client/src/pages/client/DashboardClient.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DashboardClient() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [gigOrders, setGigOrders] = useState([]);
  const [customOffers, setCustomOffers] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPostedJobs();
      fetchGigOrders();
      fetchCustomOffers();
    }
  }, [user]);

  const fetchPostedJobs = async () => {
    try {
      const res = await axios.get(`/api/jobs/user/${user._id}`);
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchGigOrders = async () => {
    try {
      const res = await axios.get(`/api/orders/gigs/${user._id}`);
      setGigOrders(res.data);
    } catch (error) {
      console.error("Error fetching gig orders:", error);
    }
  };

  const fetchCustomOffers = async () => {
    try {
      const res = await axios.get(`/api/custom-offers/client/${user._id}`);
      setCustomOffers(res.data);
    } catch (error) {
      console.error("Error fetching custom offers:", error);
    }
  };

  if (!user) return <div>Please log in to view your dashboard.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Client Dashboard</h1>

      {/* Posted Jobs Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Your Posted Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs posted yet. <Link to="/post-job" className="text-blue-500 underline">Post one now</Link>.</p>
        ) : (
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li key={job._id} className="border p-4 rounded bg-white shadow-sm">
                <h3 className="font-semibold">{job.title}</h3>
                <p>{job.description}</p>
                <p className="text-sm text-gray-500">Budget: ${job.budget}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Custom Offers Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Custom Offers You Ordered</h2>
        {customOffers.length === 0 ? (
          <p>No custom offers ordered yet.</p>
        ) : (
          <ul className="space-y-2">
            {customOffers.map((offer) => (
              <li key={offer._id} className="border p-4 rounded bg-white shadow-sm">
                <h3 className="font-semibold">From: {offer.freelancerName}</h3>
                <p>{offer.description}</p>
                <p className="text-sm text-gray-500">Price: ${offer.price}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Marketplace Gig Orders Section */}
      <section>
        <h2 className="text-xl font-bold mb-2">Purchased Gigs</h2>
        {gigOrders.length === 0 ? (
          <p>No gigs purchased yet.</p>
        ) : (
          <ul className="space-y-2">
            {gigOrders.map((order) => (
              <li key={order._id} className="border p-4 rounded bg-white shadow-sm">
                <h3 className="font-semibold">{order.gigTitle}</h3>
                <p>Status: {order.status}</p>
                <p className="text-sm text-gray-500">Ordered from: {order.sellerName}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
