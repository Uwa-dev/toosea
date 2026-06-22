import React from "react";
import "./dashboard.css";

const Dashboard = () => {
  const dashboardData = [
    {
      id: 1,
      title: "Total Active Apartments",
      value: 48,
      icon: "🏢",
    },
    {
      id: 2,
      title: "Total Current Staff",
      value: 22,
      icon: "👨‍💼",
    },
    {
      id: 3,
      title: "Today's Bookings",
      value: 15,
      icon: "📅",
    },
    {
      id: 4,
      title: "Revenue This Month",
      value: "₦12,500,000",
      icon: "💰",
    },
    {
      id: 5,
      title: "Occupied Apartments Today",
      value: 36,
      icon: "🛏️",
    },
    {
      id: 6,
      title: "Available Apartments",
      value: 12,
      icon: "✅",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's an overview of today's activities.</p>
      </div>

      <div className="dashboard-grid">
        {dashboardData.map((item) => (
          <div className="dashboard-card" key={item.id}>
            <div className="dashboard-icon">
              {item.icon}
            </div>

            <div className="dashboard-content">
              <h3>{item.title}</h3>
              <h2>{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        <div className="recent-card">
          <h2>Today's Summary</h2>

          <ul>
            <li>✔ 15 new bookings received</li>
            <li>✔ 36 apartments occupied</li>
            <li>✔ 12 apartments available</li>
            <li>✔ Monthly revenue growing steadily</li>
            <li>✔ Staff attendance updated</li>
          </ul>
        </div>

        <div className="recent-card">
          <h2>Quick Actions</h2>

          <button>Add New Apartment</button>
          <button>Create Staff</button>
          <button>View Bookings</button>
          <button>Generate Report</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;