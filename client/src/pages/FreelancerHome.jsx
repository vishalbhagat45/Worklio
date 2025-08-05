import React from "react";
import { useNavigate } from "react-router-dom";

const FreelancerHome = () => {
  const navigate = useNavigate();

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
          title="Ratings & Reviews"
          description="See what clients are saying about you."
          onClick={() => navigate("/jobs/:jobId")} // or modal if inline
          bgColor="bg-yellow-500"
        />
      </div>
    </div>
  );
};

const Card = ({ title, description, onClick, bgColor }) => (
  <div
    className={`rounded-lg shadow-lg p-6 cursor-pointer hover:scale-105 transition transform ${bgColor}`}
    onClick={onClick}
  >
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-sm">{description}</p>
  </div>
);

export default FreelancerHome;
