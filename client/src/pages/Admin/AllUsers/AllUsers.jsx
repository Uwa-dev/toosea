import React, { useEffect, useState } from "react";
import { Eye, SquarePen } from "lucide-react";
import "./viewUser.css";
import Load from "../../../components/reuse/Load.jsx"; 
import { allstaffs } from "../../../services/authApi.js";
import { useNavigate } from "react-router-dom";

const ViewStaff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await allstaffs();

      console.log("Staff Response:", response);

      setStaff(response.users);
    } catch (error) {
      console.error("Fetch Staff Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch staff."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter((item) => {
    return (
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.staffCode.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleView = (staff) => {
    navigate(`/admin/staff/${staff._id}`);
  };

  const handleEdit = (staff) => {
    console.log("Edit Staff:", staff);
  };

  return (
    <>
      {loading && <Load />}

      <div className="view-staff-container">
        <div className="staff-header">
          <h2>View Staff</h2>

          <input
            type="text"
            placeholder="Search by name, email or staff code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Staff Code</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.fullName}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{item.staffCode}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleView(item)}
                      >
                        <Eye />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleEdit(item)}
                      >
                        <SquarePen />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewStaff;