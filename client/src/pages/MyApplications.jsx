// src/pages/MyApplications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // updated import
import { Link } from "react-router-dom";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const { user } = useAuth(); // updated usage

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`/api/applications/user/${user._id}`);
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    };

    if (user?._id) fetchApplications();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app._id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">
                <Link to={`/gig/${app.gigId._id}`} className="text-blue-600 hover:underline">
                  {app.gigId.title}
                </Link>
              </h3>
              <p className="text-gray-700">{app.gigId.description}</p>
              <p className="text-sm text-gray-500 mt-1">Status: {app.status}</p>
              <p className="mt-2 italic">Proposal: {app.coverLetter}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
