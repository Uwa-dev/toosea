import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { singleStaff } from "../../../services/authApi.js";

const Staff = () => {
  const { id } = useParams();

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
        <h2>Staff Details</h2>

        <div className="staff-info">
          <p>
            <strong>Full Name:</strong> {staff.fullName}
          </p>

          <p>
            <strong>Email:</strong> {staff.email}
          </p>

          <p>
            <strong>Staff Code:</strong> {staff.staffCode}
          </p>

          <p>
            <strong>Role:</strong> {staff.role}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {new Date(staff.createdAt).toLocaleDateString()}
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Staff;