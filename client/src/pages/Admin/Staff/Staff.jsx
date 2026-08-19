import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { singleStaff } from "../../../services/authApi.js";
import "./staff.css";

const Staff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await singleStaff(id);
      setStaff(response.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!staff) {
    return <h2>Staff not found.</h2>;
  }

  return (
    <div className="staff-page">

      <div className="staff-card">

        {/* BACK BUTTON */}
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <h2>Staff Details</h2>

        <div className="staff-info">

          <p>
            <strong>Full Name:</strong>
            <span>{staff.fullName}</span>
          </p>

          <p>
            <strong>Email:</strong>
            <span>{staff.email}</span>
          </p>

          <p>
            <strong>Staff Code:</strong>
            <span>{staff.staffCode}</span>
          </p>

          <p>
            <strong>Role:</strong>
            <span>{staff.role}</span>
          </p>

          <p>
            <strong>Created:</strong>
            <span>
              {new Date(
                staff.createdAt
              ).toLocaleDateString()}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Staff;