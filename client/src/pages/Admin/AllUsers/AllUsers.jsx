import React, { useEffect, useState } from "react";
import { Eye, UserRoundX } from "lucide-react";
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

  const navigate = useNavigate();

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await allstaffs();

      console.log("Staff Response:", response);

      setStaff(response.users || []);
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
    const name =
      item.fullName?.toLowerCase() || "";

    const email =
      item.email?.toLowerCase() || "";

    const staffCode =
      item.staffCode?.toLowerCase() || "";

    const searchValue =
      search.toLowerCase();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      staffCode.includes(searchValue)
    );
  });

  const handleView = (staff) => {
    navigate(`/admin/staff/${staff._id}`);
  };

  const handleDelete = async (staff) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${staff.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteUser(staff._id);

      alert(
        `${staff.fullName} has been removed successfully.`
      );

      // Remove the user immediately from the current list
      setStaff((currentStaff) =>
        currentStaff.filter(
          (item) => item._id !== staff._id
        )
      );

    } catch (error) {
      console.error(
        "Delete User Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove user."
      );
    } finally {
      setLoading(false);
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
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

                filteredStaff.map(
                  (item, index) => (

                    <tr key={item._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {item.fullName}
                      </td>

                      <td>
                        {item.email}
                      </td>

                      <td>
                        {item.role}
                      </td>

                      <td>
                        {item.staffCode}
                      </td>

                      <td>

                        {/* VIEW */}
                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleView(item)
                          }
                          title="View staff"
                        >
                          <Eye size={18} />
                        </button>

                        {/* DELETE */}
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(item)
                          }
                          title="Remove staff"
                        >
                          <UserRoundX
                            size={18}
                          />
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="no-data"
                  >
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