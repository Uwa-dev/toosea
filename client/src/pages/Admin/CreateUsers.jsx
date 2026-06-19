import React, { useState } from "react";
import "./createUsers.css";

const CreateUsers = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    staffCode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
          <label>Staff Code</label>
          <input
            type="text"
            name="staffCode"
            placeholder="Enter staff code"
            value={formData.staffCode}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="show-password">
          <input
            type="checkbox"
            id="showPassword"
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUsers;