import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../services/dashboardApi";
import "./dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalApartments: 0,
    totalStaff: 0,
    todayBookings: 0,
    monthlyRevenue: 0,
    occupiedApartments: 0,
    availableApartments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardStats();

        console.log("Dashboard Response:", response);

        setStats(response.dashboard);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  const dashboardData = [
    {
      id: 1,
      title: "Total Apartments",
      value: stats.totalApartments,
      icon: "🏢",
    },
    {
      id: 2,
      title: "Total Current Staff",
      value: stats.totalStaff,
      icon: "👨‍💼",
    },
    {
      id: 3,
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: "📅",
    },
    {
      id: 4,
      title: "Revenue This Month",
      value: `₦${stats.monthlyRevenue.toLocaleString()}`,
      icon: "💰",
    },
    {
      id: 5,
      title: "Occupied Apartments",
      value: stats.occupiedApartments,
      icon: "🛏️",
    },
    {
      id: 6,
      title: "Available Apartments",
      value: stats.availableApartments,
      icon: "✅",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>
          Welcome back! Here's an overview of today's activities.
        </p>
      </div>

      <div className="dashboard-grid">
        {dashboardData.map((item) => (
          <div className="dashboard-card" key={item.id}>
            <div className="dashboard-icon">{item.icon}</div>

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
              ✔ {stats.todayBookings} new booking
              {stats.todayBookings !== 1 ? "s" : ""} received
            </li>

            <li>
              ✔ {stats.occupiedApartments} apartments occupied
            </li>

            <li>
              ✔ {stats.availableApartments} apartments available
            </li>

            <li>
              ✔ Revenue this month: ₦
              {stats.monthlyRevenue.toLocaleString()}
            </li>

            <li>
              ✔ {stats.totalStaff} active staff member
              {stats.totalStaff !== 1 ? "s" : ""}
            </li>
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