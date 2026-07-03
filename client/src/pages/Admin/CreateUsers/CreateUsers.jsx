import React, { useState } from "react";
import "./createUsers.css";
import Load from "../../../../src/components/reuse/Load.jsx";
import { createUser } from "../../../services/authApi.js"; 

const CreateUsers = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "RECEPTIONIST",
  });

  const [createdUser, setCreatedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await createUser(formData);

      console.log("Create User Response:", response);

      setCreatedUser(response.user);

      setFormData({
        fullName: "",
        email: "",
        role: "RECEPTIONIST",
      });
    } catch (error) {
      console.error("Create User Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create staff."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(
        `Name: ${createdUser.fullName}
        Email: ${createdUser.email}
        Role: ${createdUser.role}
        Staff Code: ${createdUser.staffCode}
        Password: ${createdUser.password}`
      );

      alert("Staff details copied successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to copy details.");
    }
  };

  return (
    <>
      {loading && <Load />}

      <div className="create-user-container">
        <form className="create-user-form" onSubmit={handleSubmit}>
          <h2>Create Staff</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="MANAGER">Manager</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            Create User
          </button>
        </form>

        {createdUser && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Staff Created Successfully</h2>

              <p>
                <strong>Name:</strong> {createdUser.fullName}
              </p>

              <p>
                <strong>Email:</strong> {createdUser.email}
              </p>

              <p>
                <strong>Role:</strong> {createdUser.role}
              </p>

              <p>
                <strong>Staff Code:</strong> {createdUser.staffCode}
              </p>

              <p>
                <strong>Password:</strong> {createdUser.password}
              </p>

              <button onClick={copyDetails}>
                Copy Details
              </button>

              <button
                onClick={() => setCreatedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateUsers;