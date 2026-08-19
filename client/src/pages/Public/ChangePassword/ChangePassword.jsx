import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../services/authApi.js";
import { loginSuccess } from "../../../utils/slices/userSlice.js";
import "./changePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Call backend
      const response = await changePassword(formData);

      console.log("Change password response:", response);

      // Get current user
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!storedUser) {
        setError("User session not found. Please login again.");
        return;
      }

      // Update user
      const updatedUser = {
        ...storedUser,
        mustChangePassword: false,
      };

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Update Redux
      dispatch(
        loginSuccess({
          user: updatedUser,
          token: localStorage.getItem("token"),
        })
      );

      setSuccess(
        "Password changed successfully!"
      );

      // Redirect according to role
      setTimeout(() => {
        switch (updatedUser.role) {
          case "OWNER":
            navigate("/admin", { replace: true });
            break;

          case "MANAGER":
            navigate("/manager", { replace: true });
            break;

          case "RECEPTIONIST":
            navigate("/receptionist", { replace: true });
            break;

          default:
            navigate("/", { replace: true });
        }
      }, 1000);

    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <form
        className="change-password-form"
        onSubmit={handleSubmit}
      >
        <h1>Change Your Password</h1>

        <p className="change-password-description">
          For security reasons, you must change your
          temporary password before accessing the dashboard.
        </p>

        {error && (
          <p className="change-password-error">
            {error}
          </p>
        )}

        {success && (
          <p className="change-password-success">
            {success}
          </p>
        )}

        <div className="password-group">
          <label htmlFor="currentPassword">
            Current Password
          </label>

          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="Enter your temporary password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="password-group">
          <label htmlFor="newPassword">
            New Password
          </label>

          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <small>
            Password must be at least 8 characters.
          </small>
        </div>

        <div className="password-group">
          <label htmlFor="confirmPassword">
            Confirm New Password
          </label>

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Changing Password..."
            : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;