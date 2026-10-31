import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Eye, UserRoundX, X, AlertTriangle } from "lucide-react";
import "./viewUser.css";
import Load from "../../../components/reuse/Load.jsx";
import {
  allstaffs,
  deleteUser,
} from "../../../services/authApi.js";
import { useNavigate } from "react-router-dom";

const ViewStaff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await allstaffs();

      console.log("Staff Response:", response);

      setStaff(response.users || []);
    } catch (error) {
      console.error("Fetch Staff Error:", error);

      toast.error(
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
    const name = item.fullName?.toLowerCase() || "";
    const email = item.email?.toLowerCase() || "";
    const staffCode = item.staffCode?.toLowerCase() || "";
    const searchValue = search.toLowerCase();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      staffCode.includes(searchValue)
    );
  });

  const handleView = (staff) => {
    navigate(`/admin/staff/${staff._id}`);
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;

    try {
      setDeleting(true);

      await deleteUser(selectedStaff._id);

      toast.success(
        `${selectedStaff.fullName} has been removed successfully.`
      );

      setStaff((currentStaff) =>
        currentStaff.filter(
          (item) => item._id !== selectedStaff._id
        )
      );

      setSelectedStaff(null);
    } catch (error) {
      console.error("Delete User Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove user."
      );
    } finally {
      setDeleting(false);
    }
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
                        title="View staff"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setSelectedStaff(item)}
                        title="Remove staff"
                      >
                        <UserRoundX size={18} />
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

      {/* DELETE CONFIRMATION MODAL */}
      {selectedStaff && (
        <div
          className="delete-modal-overlay"
          onClick={() => !deleting && setSelectedStaff(null)}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="delete-modal-close"
              onClick={() => setSelectedStaff(null)}
              disabled={deleting}
            >
              <X size={20} />
            </button>

            <div className="delete-modal-icon">
              <AlertTriangle size={28} />
            </div>

            <h3>Remove Staff?</h3>

            <p>
              Are you sure you want to remove{" "}
              <strong>{selectedStaff.fullName}</strong>?
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                className="cancel-delete-btn"
                onClick={() => setSelectedStaff(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Removing..." : "Remove Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewStaff;