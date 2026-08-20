import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LogIn,
  LogOut,
  BedDouble,
  Building2,
  Clock,
  Wrench,
  Plus,
  Users,
} from "lucide-react";

import Load from "../../../../src/components/reuse/Load.jsx";
import { getDashboardStats } from "../../../services/dashboardApi.js";

import "./managerDashboard.css";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardStats();

        if (response?.success) {
          setDashboard(response.dashboard);
        }
      } catch (error) {
        console.error("Manager Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Load />;
  }

  if (!dashboard) {
    return (
      <div className="dashboard-error">
        Unable to load dashboard information.
      </div>
    );
  }

  const apartments = dashboard.apartments || {};
  const bookings = dashboard.bookings || {};
  const bookingSources = dashboard.bookingSources || {};
  const staff = dashboard.staff || {};

  return (
    <div className="manager-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Manager Dashboard</h1>
          <p>
            Monitor daily hotel operations and apartment activity.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon">
            <CalendarDays size={24} />
          </div>

          <div>
            <span>Today's Bookings</span>
            <h2>{bookings.today || 0}</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <BedDouble size={24} />
          </div>

          <div>
            <span>Available Apartments</span>
            <h2>{apartments.available || 0}</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <Users size={24} />
          </div>

          <div>
            <span>Checked-In Guests</span>
            <h2>{bookings.checkedIn || 0}</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <Clock size={24} />
          </div>

          <div>
            <span>Pending Bookings</span>
            <h2>{bookings.pending || 0}</h2>
          </div>
        </div>

      </div>

      {/* DAILY OPERATIONS */}
      <section className="dashboard-section">

        <div className="section-title">
          <h2>Today's Operations</h2>
        </div>

        <div className="operations-grid">

          <div
            className="operation-card clickable"
            onClick={() => navigate("/manager/bookings/today")}
          >
            <LogIn size={22} />

            <div>
              <span>Today's Check-Ins</span>
              <strong>{bookings.checkInsToday || 0}</strong>
            </div>
          </div>

          <div
            className="operation-card clickable"
            onClick={() => navigate("/manager/bookings/today")}
          >
            <LogOut size={22} />

            <div>
              <span>Today's Check-Outs</span>
              <strong>{bookings.checkOutsToday || 0}</strong>
            </div>
          </div>

          <div
            className="operation-card clickable"
            onClick={() => navigate("/manager/bookings/checkedin")}
          >
            <Users size={22} />

            <div>
              <span>Currently Checked-In</span>
              <strong>{bookings.checkedIn || 0}</strong>
            </div>
          </div>

          <div className="operation-card">
            <Clock size={22} />

            <div>
              <span>Pending Bookings</span>
              <strong>{bookings.pending || 0}</strong>
            </div>
          </div>

        </div>

      </section>

      {/* APARTMENT STATUS */}
      <section className="dashboard-section">

        <div className="section-title">
          <h2>Apartment Status</h2>

          <button
            onClick={() => navigate("/manager/apartments")}
            className="view-button"
          >
            View Apartments
          </button>
        </div>

        <div className="status-grid">

          <div className="status-card">
            <Building2 size={22} />
            <span>Total</span>
            <strong>{apartments.total || 0}</strong>
          </div>

          <div className="status-card">
            <BedDouble size={22} />
            <span>Available</span>
            <strong>{apartments.available || 0}</strong>
          </div>

          <div className="status-card">
            <CalendarDays size={22} />
            <span>Booked</span>
            <strong>{apartments.booked || 0}</strong>
          </div>

          <div className="status-card">
            <Users size={22} />
            <span>Occupied</span>
            <strong>{apartments.occupied || 0}</strong>
          </div>

          <div className="status-card">
            <Wrench size={22} />
            <span>Maintenance</span>
            <strong>{apartments.maintenance || 0}</strong>
          </div>

        </div>

      </section>

      {/* BOOKING ACTIVITY */}
      <section className="dashboard-section">

        <div className="section-title">
          <h2>Booking Activity</h2>
        </div>

        <div className="activity-grid">

          <div className="activity-card">
            <span>Online Bookings</span>
            <strong>{bookingSources.online || 0}</strong>
          </div>

          <div className="activity-card">
            <span>Walk-In Bookings</span>
            <strong>{bookingSources.walkIn || 0}</strong>
          </div>

          <div className="activity-card">
            <span>Total Staff</span>
            <strong>{staff.total || 0}</strong>
          </div>

        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="dashboard-section">

        <div className="section-title">
          <h2>Quick Actions</h2>
        </div>

        <div className="quick-actions">

          <button
            onClick={() => navigate("/manager/apartments/create")}
          >
            <Plus size={20} />
            Add Apartment
          </button>

          <button
            onClick={() => navigate("/manager/apartments")}
          >
            <Building2 size={20} />
            View Apartments
          </button>

          <button
            onClick={() => navigate("/manager/bookings/today")}
          >
            <CalendarDays size={20} />
            Today's Bookings
          </button>

          <button
            onClick={() => navigate("/manager/bookings/checkedin")}
          >
            <Users size={20} />
            Checked-In Guests
          </button>

        </div>

      </section>

    </div>
  );
};

export default ManagerDashboard;