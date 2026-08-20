import React, { useEffect, useState } from "react";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getPendingApartments,
  approveApartment,
  rejectApartment,
} from "../../../services/approvalApi.js";
import "./pendingApprovals.css";

const PendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [apartments, setApartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);

      const [usersResponse, apartmentsResponse] = await Promise.all([
        getPendingUsers(),
        getPendingApartments(),
      ]);

      setUsers(usersResponse.users || []);
      setApartments(apartmentsResponse.apartments || []);
    } catch (error) {
      console.error("Failed to fetch pending approvals:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load pending approvals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApproveUser = async (id) => {
    try {
      setProcessingId(id);

      await approveUser(id);

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to approve user."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      setProcessingId(id);

      await rejectUser(id);

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to reject user."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveApartment = async (id) => {
    try {
      setProcessingId(id);

      await approveApartment(id);

      setApartments((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to approve apartment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectApartment = async (id) => {
    try {
      setProcessingId(id);

      await rejectApartment(id);

      setApartments((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to reject apartment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="pending-approvals">
        <div className="approval-loading">
          Loading pending approvals...
        </div>
      </div>
    );
  }

  return (
    <div className="pending-approvals">
      <div className="approval-header">
        <div>
          <h1>Pending Approvals</h1>
          <p>
            Review and approve staff accounts and newly created
            apartments.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchPendingApprovals}
        >
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="approval-summary">
        <div className="summary-card">
          <span className="summary-label">
            Pending Users
          </span>

          <strong>{users.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Pending Apartments
          </span>

          <strong>{apartments.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Total Pending
          </span>

          <strong>
            {users.length + apartments.length}
          </strong>
        </div>
      </div>

      {/* USERS */}
      <section className="approval-section">
        <div className="section-heading">
          <div>
            <h2>Staff Accounts</h2>
            <p>
              Staff accounts waiting for owner approval.
            </p>
          </div>

          <span className="count-badge">
            {users.length}
          </span>
        </div>

        {users.length === 0 ? (
          <div className="empty-approval">
            <h3>No pending users</h3>
            <p>
              There are currently no staff accounts waiting
              for approval.
            </p>
          </div>
        ) : (
          <div className="approval-table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-name">
                        {user.fullName}
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className="pending-badge">
                        Pending
                      </span>
                    </td>

                    <td>
                      <div className="approval-actions">
                        <button
                          className="approve-btn"
                          disabled={
                            processingId === user._id
                          }
                          onClick={() =>
                            handleApproveUser(user._id)
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          disabled={
                            processingId === user._id
                          }
                          onClick={() =>
                            handleRejectUser(user._id)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* APARTMENTS */}
      <section className="approval-section">
        <div className="section-heading">
          <div>
            <h2>Apartments</h2>
            <p>
              Apartments waiting for owner approval.
            </p>
          </div>

          <span className="count-badge">
            {apartments.length}
          </span>
        </div>

        {apartments.length === 0 ? (
          <div className="empty-approval">
            <h3>No pending apartments</h3>
            <p>
              There are currently no apartments waiting
              for approval.
            </p>
          </div>
        ) : (
          <div className="approval-table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Apartment</th>
                  <th>Created By</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {apartments.map((apartment) => (
                  <tr key={apartment._id}>
                    <td>
                      <div className="apartment-name">
                        {apartment.name ||
                          apartment.title ||
                          "Unnamed Apartment"}
                      </div>
                    </td>

                    <td>
                      {apartment.createdBy?.fullName ||
                        "N/A"}
                    </td>

                    <td>
                      {apartment.createdBy?.email ||
                        "N/A"}
                    </td>

                    <td>
                      <span className="pending-badge">
                        Pending
                      </span>
                    </td>

                    <td>
                      <div className="approval-actions">
                        <button
                          className="approve-btn"
                          disabled={
                            processingId ===
                            apartment._id
                          }
                          onClick={() =>
                            handleApproveApartment(
                              apartment._id
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          disabled={
                            processingId ===
                            apartment._id
                          }
                          onClick={() =>
                            handleRejectApartment(
                              apartment._id
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default PendingApprovals;