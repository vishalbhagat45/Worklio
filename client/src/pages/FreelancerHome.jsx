import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJobs } from "../api/jobApi";
import { useAuth } from "../context/AuthContext";

const FreelancerHome = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await fetchJobs();
        setJobs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    getJobs();
  }, []);

  const firstJob = jobs.length > 0 ? jobs[0] : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-5">
      <h1 className="text-4xl font-bold mb-10">Welcome, Freelancer 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card
          title="Manage My Gigs"
          description="Create, edit, and manage your gigs."
          onClick={() => navigate("/mygigs")}
          bgColor="bg-blue-500"
        />
        <Card
          title="My Applications"
          description="Track jobs you've applied for."
          onClick={() => navigate("/my-applications")}
          bgColor="bg-green-500"
        />
        <Card
          title="Dashboard"
          description="Check earnings, stats, and activity."
          onClick={() => navigate("/freelancer-dashboard")}
          bgColor="bg-purple-600"
        />
        <Card
          title="Messages"
          description="Chat with potential clients."
          onClick={() => navigate("/inbox")}
          bgColor="bg-pink-500"
        />
        <Card
          title="Post a Job"
          description="Add a new job posting."
          onClick={() => navigate("/post-job")}
          bgColor="bg-orange-500"
        />
        <Card
          title="Ratings & Reviews"
          description="See what clients are saying about you."
          onClick={() => {
            if (firstJob?._id) {
              navigate(`/jobs/${jobs[0]._id}#reviews`, { replace: true });
            }
          }}
          bgColor="bg-yellow-500"
        />
      </div>
    </div>
  );
};

const Card = ({ title, description, onClick, bgColor }) => (
  <div
    className={`rounded-lg shadow-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-300 ${bgColor}`}
    onClick={onClick}
  >
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-sm">{description}</p>
  </div>
);

export default FreelancerHome;
