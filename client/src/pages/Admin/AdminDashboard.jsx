import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalApartments: 0,
    totalStaff: 0,
    todayBookings: 0,
    monthlyRevenue: 0,
    occupiedApartments: 0,
    availableApartments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // Fetch Dashboard Data
  // =====================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // Change to your backend endpoint
      const response = await fetch(
        "http://localhost:5000/api/dashboard"
      );

      if (!response.ok) {
        throw new Error("Unable to load dashboard.");
      }

      const data = await response.json();

      setDashboardData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Dashboard Cards
  // =====================================

  const cards = [
    {
      id: 1,
      title: "Total Active Apartments",
      value: dashboardData.totalApartments,
      icon: "🏢",
    },
    {
      id: 2,
      title: "Total Current Staff",
      value: dashboardData.totalStaff,
      icon: "👨‍💼",
    },
    {
      id: 3,
      title: "Today's Bookings",
      value: dashboardData.todayBookings,
      icon: "📅",
    },
    {
      id: 4,
      title: "Revenue This Month",
      value: `₦${Number(
        dashboardData.monthlyRevenue
      ).toLocaleString()}`,
      icon: "💰",
    },
    {
      id: 5,
      title: "Occupied Apartments Today",
      value: dashboardData.occupiedApartments,
      icon: "🛏️",
    },
    {
      id: 6,
      title: "Available Apartments",
      value: dashboardData.availableApartments,
      icon: "✅",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's an overview of today's activities.</p>
      </div>

      {loading ? (
        <h2>Loading Dashboard...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : (
        <>
          <div className="dashboard-grid">
            {cards.map((item) => (
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
                <li>
                  ✔ {dashboardData.todayBookings} bookings received today
                </li>

                <li>
                  ✔ {dashboardData.occupiedApartments} apartments occupied
                </li>

                <li>
                  ✔ {dashboardData.availableApartments} apartments available
                </li>

                <li>
                  ✔ ₦
                  {Number(
                    dashboardData.monthlyRevenue
                  ).toLocaleString()} revenue this month
                </li>

                <li>
                  ✔ {dashboardData.totalStaff} active staff members
                </li>
              </ul>
            </div>

            <div className="recent-card">
              <h2>Quick Actions</h2>

              <button
                onClick={() =>
                  navigate("/admin/createapartment")
                }
              >
                Add New Apartment
              </button>

              <button
                onClick={() =>
                  navigate("/admin/createusers")
                }
              >
                Create Staff
              </button>

              <button
                onClick={() =>
                  navigate("/admin/bookings")
                }
              >
                View Bookings
              </button>

              <button>
                Generate Report
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;