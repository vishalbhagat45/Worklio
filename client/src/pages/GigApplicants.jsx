// src/pages/GigApplicants.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GigApplicants = () => {
  const { gigId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/api/applications/gig/${gigId}`);
        setApplicants(res.data);
      } catch (err) {
        console.error("Failed to fetch applicants", err);
      }
    };

    if (gigId) fetchApplicants();
  }, [gigId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gig Applicants</h2>
      {applicants.length === 0 ? (
        <p>No one has applied for this gig yet.</p>
      ) : (
        <div className="grid gap-4">
          {applicants.map((app) => (
            <div key={app._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{app.applicantId.username}</h3>
              <p className="text-sm text-gray-600">{app.applicantId.email}</p>
              <p className="mt-2 italic">Cover Letter: {app.coverLetter}</p>
              <p className="text-sm text-gray-500 mt-1">Status: {app.status}</p>
              {/* Optional: Add Accept/Reject buttons here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GigApplicants;
