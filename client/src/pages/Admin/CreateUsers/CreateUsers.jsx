import React, { useState } from "react";
import "./createUsers.css";

const CreateUsers = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "RECEPTIONIST"
  });

  const [createdUser, setCreatedUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.staffCode ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("User Created:", formData);

    // API call goes here

    alert("User created successfully!");

    setFormData({
      name: "",
      email: "",
      staffCode: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="create-user-container">
      <form className="create-user-form" onSubmit={handleSubmit}>
        <h2>Create User</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
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
          <select name="" id="">
            <option value="">Manager</option>
            <option value="">Receptionist</option>
          </select>
        </div>

        <button type="submit">Create User</button>
      </form>

      {createdUser && (
        <div className="popup-overlay">

            <div className="popup">

                <h2>Staff Created Successfully</h2>

                <p><strong>Name:</strong> {createdUser.fullName}</p>

                <p><strong>Email:</strong> {createdUser.email}</p>

                <p><strong>Role:</strong> {createdUser.role}</p>

                <p><strong>Staff Code:</strong> {createdUser.staffCode}</p>

                <p><strong>Password:</strong> {createdUser.password}</p>

                <button
                    onClick={() => {
                        navigator.clipboard.writeText(
                          `Name: ${createdUser.fullName}
                          Email: ${createdUser.email}
                          Role: ${createdUser.role}
                          Staff Code: ${createdUser.staffCode}
                          Password: ${createdUser.password}`
                        );
                    }}
                >
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
  );
};

export default CreateUsers;