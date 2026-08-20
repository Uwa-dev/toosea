import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOwnerDashboardStats } from "../../../services/dashboardApi";
import "./dashboard.css";

const defaultStats = {
  apartments: {
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
  },

  bookings: {
    today: 0,
    all: 0,
    pending: 0,
  },

  bookingSources: {
    online: 0,
    walkIn: 0,
  },

  revenue: {
    total: 0,
    monthly: 0,
  },

  staff: {
    total: 0,
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getOwnerDashboardStats();

        console.log("Owner Dashboard Response:", response);

        setStats({
          ...defaultStats,
          ...response?.dashboard,

          apartments: {
            ...defaultStats.apartments,
            ...response?.dashboard?.apartments,
          },

          bookings: {
            ...defaultStats.bookings,
            ...response?.dashboard?.bookings,
          },

          bookingSources: {
            ...defaultStats.bookingSources,
            ...response?.dashboard?.bookingSources,
          },

          revenue: {
            ...defaultStats.revenue,
            ...response?.dashboard?.revenue,
          },

          staff: {
            ...defaultStats.staff,
            ...response?.dashboard?.staff,
          },
        });
      } catch (error) {
        console.error("Owner dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  const dashboardData = [
    {
      id: 1,
      title: "Total Apartments",
      value: stats.apartments.total,
      icon: "🏢",
    },

    {
      id: 2,
      title: "Total Staff",
      value: stats.staff.total,
      icon: "👨‍💼",
    },

    {
      id: 3,
      title: "Today's Bookings",
      value: stats.bookings.today,
      icon: "📅",
    },

    {
      id: 4,
      title: "All Bookings",
      value: stats.bookings.all,
      icon: "📋",
    },

    {
      id: 5,
      title: "Total Revenue",
      value: `₦${Number(
        stats.revenue.total || 0
      ).toLocaleString()}`,
      icon: "💰",
    },

    {
      id: 6,
      title: "Revenue This Month",
      value: `₦${Number(
        stats.revenue.monthly || 0
      ).toLocaleString()}`,
      icon: "💵",
    },

    {
      id: 7,
      title: "Occupied Apartments",
      value: stats.apartments.occupied,
      icon: "🛏️",
    },

    {
      id: 8,
      title: "Available Apartments",
      value: stats.apartments.available,
      icon: "✅",
    },
  ];

  return (
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <h1>Owner Dashboard</h1>

        <p>
          Welcome back! Here's an overview of your
          apartment operations and business performance.
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="dashboard-grid">

        {dashboardData.map((item) => (
          <div
            className="dashboard-card"
            key={item.id}
          >
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

      {/* ================= DASHBOARD BOTTOM ================= */}

      <div className="dashboard-bottom">

        {/* ================= TODAY'S SUMMARY ================= */}

        <div className="recent-card">

          <h2>Today's Summary</h2>

          <ul>

            <li>
              ✔ {stats.bookings.today} new booking
              {stats.bookings.today !== 1 ? "s" : ""}
              {" "}received today
            </li>

            <li>
              ✔ {stats.apartments.occupied} apartment
              {stats.apartments.occupied !== 1 ? "s" : ""}
              {" "}currently occupied
            </li>

            <li>
              ✔ {stats.apartments.available} apartment
              {stats.apartments.available !== 1 ? "s" : ""}
              {" "}currently available
            </li>

            <li>
              ✔ Revenue this month: ₦
              {Number(
                stats.revenue.monthly || 0
              ).toLocaleString()}
            </li>

            <li>
              ✔ {stats.staff.total} active staff member
              {stats.staff.total !== 1 ? "s" : ""}
            </li>

          </ul>

        </div>

        {/* ================= BOOKING OVERVIEW ================= */}

        <div className="recent-card">

          <h2>Booking Overview</h2>

          <ul>

            <li>
              ✔ {stats.bookings.today} booking
              {stats.bookings.today !== 1 ? "s" : ""}
              {" "}created today
            </li>

            <li>
              ✔ {stats.bookings.all} total booking
              {stats.bookings.all !== 1 ? "s" : ""}
            </li>

            <li>
              ✔ {stats.bookings.pending} pending booking
              {stats.bookings.pending !== 1 ? "s" : ""}
            </li>

            <li>
              ✔ {stats.bookingSources.online} online booking
              {stats.bookingSources.online !== 1 ? "s" : ""}
            </li>

            <li>
              ✔ {stats.bookingSources.walkIn} walk-in booking
              {stats.bookingSources.walkIn !== 1 ? "s" : ""}
            </li>

          </ul>

        </div>

      </div>

      {/* ================= SECOND ROW ================= */}

      <div className="dashboard-bottom">

        {/* ================= REVENUE OVERVIEW ================= */}

        <div className="recent-card">

          <h2>Revenue Overview</h2>

          <ul>

            <li>
              ✔ Total revenue: ₦
              {Number(
                stats.revenue.total || 0
              ).toLocaleString()}
            </li>

            <li>
              ✔ This month's revenue: ₦
              {Number(
                stats.revenue.monthly || 0
              ).toLocaleString()}
            </li>

          </ul>

        </div>

        {/* ================= APARTMENT OVERVIEW ================= */}

        <div className="recent-card">

          <h2>Apartment Overview</h2>

          <ul>

            <li>
              ✔ Total apartments:{" "}
              {stats.apartments.total}
            </li>

            <li>
              ✔ Available:{" "}
              {stats.apartments.available}
            </li>

            <li>
              ✔ Occupied:{" "}
              {stats.apartments.occupied}
            </li>

            <li>
              ✔ Maintenance:{" "}
              {stats.apartments.maintenance}
            </li>

          </ul>

        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="recent-card quick-actions-card">

        <h2>Quick Actions</h2>

        <div className="quick-actions">

          <Link to="/admin/apartments">
            Add New Apartment
          </Link>

          <Link to="/admin/createusers">
            Create Staff
          </Link>

          <Link to="/admin/monthly">
            View Monthly Bookings
          </Link>

          <Link to="/admin/yearly">
            View Yearly Bookings
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;