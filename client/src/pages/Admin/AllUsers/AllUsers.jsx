import React, { useState } from "react";
import "./viewUser.css";

const ViewStaff = () => {
  const [search, setSearch] = useState("");

  const [staff] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      staffCode: "STF001",
    },
    {
      id: 2,
      name: "Mary Johnson",
      email: "mary@example.com",
      staffCode: "STF002",
    },
    {
      id: 3,
      name: "David Wilson",
      email: "david@example.com",
      staffCode: "STF003",
    },
    {
      id: 4,
      name: "Grace Adams",
      email: "grace@example.com",
      staffCode: "STF004",
    },
  ]);

  const filteredStaff = staff.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.staffCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    console.log("Edit Staff:", id);
    // Navigate to edit page or open modal
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?"
    );

    if (confirmDelete) {
      console.log("Delete Staff:", id);
    }
  };

  return (
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
              <th>Staff Code</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.length > 0 ? (
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

export default ViewStaff;