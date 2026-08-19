import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./createUsers.css";
import Load from "../../../../src/components/reuse/Load.jsx";
import { createUser } from "../../../services/authApi.js";

const CreateUsers = () => {
  const { user } = useSelector((state) => state.user);

  const isManager = user?.role === "MANAGER";
  const isOwner = user?.role === "OWNER";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: isManager ? "RECEPTIONIST" : "MANAGER",
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

    const dataToSend = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: isManager ? "RECEPTIONIST" : formData.role,
    };

    try {
      setLoading(true);

      const response = await createUser(dataToSend);

      console.log("Create User Response:", response);

      setCreatedUser(response.user);

      setFormData({
        fullName: "",
        email: "",
        role: isManager ? "RECEPTIONIST" : "MANAGER",
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
    if (!createdUser) return;

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

  const closePopup = () => {
    setCreatedUser(null);
  };

  return (
    <>
      {loading && <Load />}

      <div className="create-users-page">
        <div className="create-users-card">

          <div className="create-users-header">
            <h2>Create Staff</h2>

            <p>
              {isManager
                ? "Create a receptionist for administrator approval."
                : "Create a manager or receptionist account."}
            </p>
          </div>

          <form
            className="create-users-form"
            onSubmit={handleSubmit}
          >
            {/* FULL NAME */}
            <div className="create-users-form-group">
              <label htmlFor="create-users-full-name">
                Full Name
              </label>

              <input
                id="create-users-full-name"
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* EMAIL */}
            <div className="create-users-form-group">
              <label htmlFor="create-users-email">
                Email Address
              </label>

              <input
                id="create-users-email"
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* ROLE */}
            <div className="create-users-form-group">
              <label htmlFor="create-users-role">
                Role
              </label>

              {isManager ? (
                <div className="create-users-fixed-role">
                  <span>Receptionist</span>
                </div>
              ) : (
                <select
                  id="create-users-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="MANAGER">
                    Manager
                  </option>

                  <option value="RECEPTIONIST">
                    Receptionist
                  </option>
                </select>
              )}
            </div>

            {/* MANAGER NOTICE */}
            {isManager && (
              <div className="create-users-approval-notice">
                <strong>Administrator approval required</strong>

                <p>
                  This receptionist account will remain inactive
                  until the owner approves it.
                </p>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="create-users-submit"
              disabled={loading}
            >
              {isManager
                ? "Create Receptionist"
                : "Create Staff"}
            </button>
          </form>
        </div>

        {/* SUCCESS POPUP */}
        {createdUser && (
          <div className="create-users-popup-overlay">
            <div className="create-users-popup">

              <div className="create-users-popup-header">
                <h2>Staff Created Successfully</h2>

                <button
                  type="button"
                  className="create-users-popup-close-icon"
                  onClick={closePopup}
                >
                  ×
                </button>
              </div>

              <div className="create-users-popup-details">

                <div className="create-users-detail-row">
                  <strong>Name:</strong>
                  <span>{createdUser.fullName}</span>
                </div>

                <div className="create-users-detail-row">
                  <strong>Email:</strong>
                  <span>{createdUser.email}</span>
                </div>

                <div className="create-users-detail-row">
                  <strong>Role:</strong>
                  <span>{createdUser.role}</span>
                </div>

                <div className="create-users-detail-row">
                  <strong>Staff Code:</strong>
                  <span>{createdUser.staffCode}</span>
                </div>

                <div className="create-users-detail-row">
                  <strong>Password:</strong>
                  <span>{createdUser.password}</span>
                </div>

                {createdUser.approvalStatus === "PENDING" && (
                  <div className="create-users-pending-message">
                    <strong>Pending Approval</strong>

                    <p>
                      This account has been created but the
                      administrator must approve it before the
                      staff member can log in.
                    </p>
                  </div>
                )}

                {createdUser.approvalStatus === "APPROVED" && (
                  <div className="create-users-approved-message">
                    <strong>Account Approved</strong>

                    <p>
                      The staff member can log in using the
                      credentials above.
                    </p>
                  </div>
                )}
              </div>

              <div className="create-users-popup-actions">
                <button
                  type="button"
                  className="create-users-copy-button"
                  onClick={copyDetails}
                >
                  Copy Details
                </button>

                <button
                  type="button"
                  className="create-users-close-button"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateUsers;