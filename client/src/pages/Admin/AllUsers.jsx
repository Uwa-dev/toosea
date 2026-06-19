import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./viewUser.css";

const AllUsers = () => {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===========================
  // Fetch Staff
  // ===========================
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");

      // Replace this with your backend endpoint
      const response = await fetch(
        "http://localhost:5000/api/staff"
      );

      if (!response.ok) {
        throw new Error("Unable to fetch staff.");
      }

      const data = await response.json();

      // assuming backend returns an array
      setStaff(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Search
  // ===========================

  const filteredStaff = useMemo(() => {
    return staff.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.staffCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [staff, search]);

  // ===========================
  // Edit
  // ===========================

  const handleEdit = (id) => {
    navigate(`/admin/edituser/${id}`);
  };

  // ===========================
  // Delete
  // ===========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete staff.");
      }

      // Remove from state immediately
      setStaff((prev) => prev.filter((user) => user.id !== id));

      alert("Staff deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="view-staff-container">
      <div className="staff-header">
        <h2>View Staff</h2>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Search by name, email or staff code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={() => navigate("/admin/createusers")}
          >
            + Create Staff
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Staff Code</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="no-data">
                  Loading staff...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {error}
                </td>
              </tr>
            ) : filteredStaff.length > 0 ? (
              filteredStaff.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.staffCode}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;