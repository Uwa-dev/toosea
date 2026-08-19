import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReceptionistDashboard } from "../../../services/analyticsApi.js";
import "./receptDashboard.css";

const ReceptDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    walkInBookingsToday: 0,
    checkInsToday: 0,
    pendingCheckIns: 0,
    checkOutsToday: 0,
    todayArrivals: 0,
    todayDepartures: 0,
    occupiedApartments: 0,
    availableApartments: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await getReceptionistDashboard();

      setStats(response.data || {});
    } catch (error) {
      console.error(
        "Failed to load receptionist dashboard:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Walk-in Bookings",
      value: stats.walkInBookingsToday,
      description: "Created today",
      icon: "📝"
    },
    {
      title: "Check-ins Today",
      value: stats.checkInsToday,
      description: "Guests checked in",
      icon: "🛎️"
    },
    {
      title: "Pending Check-ins",
      value: stats.pendingCheckIns,
      description: "Expected today",
      icon: "⏳"
    },
    {
      title: "Check-outs Today",
      value: stats.checkOutsToday,
      description: "Guests checked out",
      icon: "🚪"
    }
  ];

  if (loading) {
    return (
      <div className="reception-dashboard-page">
        <div className="reception-dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="reception-dashboard-page">

      {/* Header */}

      <div className="reception-dashboard-header">
        <div>
          <h1>Receptionist Dashboard</h1>

          <p>
            Manage today's bookings, check-ins and
            check-outs.
          </p>
        </div>

        <button
          className="reception-dashboard-refresh"
          onClick={fetchDashboard}
        >
          Refresh
        </button>
      </div>

      {/* Statistics */}

      <div className="reception-dashboard-stats">

        {dashboardCards.map((card) => (
          <div
            className="reception-dashboard-stat-card"
            key={card.title}
          >
            <div className="reception-dashboard-stat-icon">
              {card.icon}
            </div>

            <div className="reception-dashboard-stat-content">

              <span className="reception-dashboard-stat-title">
                {card.title}
              </span>

              <strong className="reception-dashboard-stat-value">
                {card.value}
              </strong>

              <small className="reception-dashboard-stat-description">
                {card.description}
              </small>

            </div>
          </div>
        ))}

      </div>

      {/* Today's Operations */}

      <div className="reception-dashboard-section">

        <div className="reception-dashboard-section-header">
          <div>
            <h2>Today's Operations</h2>

            <p>
              Overview of today's guest activity.
            </p>
          </div>
        </div>

        <div className="reception-dashboard-operation-grid">

          <div className="reception-dashboard-operation-card">

            <div className="reception-dashboard-operation-icon">
              🛬
            </div>

            <div>
              <span>Today's Arrivals</span>

              <strong>
                {stats.todayArrivals}
              </strong>
            </div>

            <button
              onClick={() =>
                navigate("/receptionist/todaybookings")
              }
            >
              View
            </button>

          </div>

          <div className="reception-dashboard-operation-card">

            <div className="reception-dashboard-operation-icon">
              🛫
            </div>

            <div>
              <span>Today's Departures</span>

              <strong>
                {stats.todayDepartures}
              </strong>
            </div>

            <button
              onClick={() =>
                navigate("/receptionist/checkedinguests")
              }
            >
              View
            </button>

          </div>

        </div>

      </div>

      {/* Apartment Status */}

      <div className="reception-dashboard-section">

        <div className="reception-dashboard-section-header">
          <div>
            <h2>Apartment Status</h2>

            <p>
              Current apartment availability.
            </p>
          </div>
        </div>

        <div className="reception-dashboard-apartment-status">

          <div className="reception-dashboard-status-card">
            <span>Occupied</span>

            <strong>
              {stats.occupiedApartments}
            </strong>
          </div>

          <div className="reception-dashboard-status-card">
            <span>Available</span>

            <strong>
              {stats.availableApartments}
            </strong>
          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="reception-dashboard-section">

        <div className="reception-dashboard-section-header">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Common receptionist tasks.
            </p>
          </div>
        </div>

        <div className="reception-dashboard-actions">

          <button
            onClick={() =>
              navigate("/receptionist/walkin")
            }
          >
            <span>＋</span>
            New Walk-in Booking
          </button>

          <button
            onClick={() =>
              navigate("/receptionist/todaybookings")
            }
          >
            <span>📅</span>
            Today's Bookings
          </button>

          <button
            onClick={() =>
              navigate("/receptionist/checkedinguests")
            }
          >
            <span>🛎️</span>
            Checked-in Guests
          </button>

          <button
            onClick={() =>
              navigate("/receptionist/products")
            }
          >
            <span>🏢</span>
            All Apartments
          </button>

        </div>

      </div>

    </div>
  );
};

export default ReceptDashboard;