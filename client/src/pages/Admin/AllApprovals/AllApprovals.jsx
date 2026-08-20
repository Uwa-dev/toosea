import React, { useEffect, useState } from "react";
import {
  getApprovedUsers,
  getApprovedApartments,
} from "../../../services/approvalApi.js";
import "./allApprovals.css";

const AllApprovals = () => {
  const [users, setUsers] = useState([]);
  const [apartments, setApartments] = useState([]);

  const [activeTab, setActiveTab] = useState("users");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const fetchAllApprovals = async () => {
    try {
      setLoading(true);

      const [usersResponse, apartmentsResponse] =
        await Promise.all([
          getApprovedUsers(),
          getApprovedApartments(),
        ]);

      setUsers(usersResponse.users || []);
      setApartments(apartmentsResponse.apartments || []);
    } catch (error) {
      console.error("Failed to fetch approvals:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load approvals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApprovals();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "ALL") return true;

    return user.approvalStatus === statusFilter;
  });

  const filteredApartments = apartments.filter((apartment) => {
    if (statusFilter === "ALL") return true;

    return apartment.approvalStatus === statusFilter;
  });

  const approvedUsers = users.filter(
    (user) => user.approvalStatus === "APPROVED"
  ).length;

  const rejectedUsers = users.filter(
    (user) => user.approvalStatus === "REJECTED"
  ).length;

  const approvedApartments = apartments.filter(
    (apartment) =>
      apartment.approvalStatus === "APPROVED"
  ).length;

  const rejectedApartments = apartments.filter(
    (apartment) =>
      apartment.approvalStatus === "REJECTED"
  ).length;

  if (loading) {
    return (
      <div className="all-approvals">
        <div className="approval-loading">
          Loading approvals...
        </div>
      </div>
    );
  }

  return (
    <div className="all-approvals">

      {/* HEADER */}
      <div className="all-approvals-header">
        <div>
          <h1>All Approvals</h1>
          <p>
            View the approval history of staff accounts
            and apartments.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchAllApprovals}
        >
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="approval-summary">

        <div className="summary-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div className="summary-card">
          <span>Approved Users</span>
          <strong>{approvedUsers}</strong>
        </div>

        <div className="summary-card">
          <span>Rejected Users</span>
          <strong>{rejectedUsers}</strong>
        </div>

        <div className="summary-card">
          <span>Total Apartments</span>
          <strong>{apartments.length}</strong>
        </div>

        <div className="summary-card">
          <span>Approved Apartments</span>
          <strong>{approvedApartments}</strong>
        </div>

        <div className="summary-card">
          <span>Rejected Apartments</span>
          <strong>{rejectedApartments}</strong>
        </div>

      </div>

      {/* TABS */}
      <div className="approval-controls">

        <div className="approval-tabs">
          <button
            className={
              activeTab === "users"
                ? "active-tab"
                : ""
            }
            onClick={() => setActiveTab("users")}
          >
            Staff Accounts ({users.length})
          </button>

          <button
            className={
              activeTab === "apartments"
                ? "active-tab"
                : ""
            }
            onClick={() => setActiveTab("apartments")}
          >
            Apartments ({apartments.length})
          </button>
        </div>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>

      </div>

      {/* USERS */}
      {activeTab === "users" && (
        <section className="approval-table-section">

          <div className="section-title">
            <div>
              <h2>Staff Accounts</h2>
              <p>
                All staff approval records
              </p>
            </div>

            <span>
              {filteredUsers.length} records
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="empty-approvals">
              <h3>No users found</h3>
              <p>
                There are no users matching this
                filter.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="approval-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Approval Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>

                      <td>
                        <strong>
                          {user.fullName}
                        </strong>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span className="role-badge">
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${user.approvalStatus?.toLowerCase()}`}
                        >
                          {user.approvalStatus}
                        </span>
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

      {/* APARTMENTS */}
      {activeTab === "apartments" && (
        <section className="approval-table-section">

          <div className="section-title">
            <div>
              <h2>Apartments</h2>
              <p>
                All apartment approval records
              </p>
            </div>

            <span>
              {filteredApartments.length} records
            </span>
          </div>

          {filteredApartments.length === 0 ? (
            <div className="empty-approvals">
              <h3>No apartments found</h3>
              <p>
                There are no apartments matching
                this filter.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="approval-table">

                <thead>
                  <tr>
                    <th>Apartment</th>
                    <th>Created By</th>
                    <th>Email</th>
                    <th>Approval Status</th>
                    <th>Apartment Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApartments.map(
                    (apartment) => (
                      <tr key={apartment._id}>

                        <td>
                          <strong>
                            {apartment.name ||
                              apartment.title ||
                              "Unnamed Apartment"}
                          </strong>
                        </td>

                        <td>
                          {apartment.createdBy
                            ?.fullName || "N/A"}
                        </td>

                        <td>
                          {apartment.createdBy
                            ?.email || "N/A"}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${apartment.approvalStatus?.toLowerCase()}`}
                          >
                            {apartment.approvalStatus}
                          </span>
                        </td>

                        <td>
                          {apartment.status || "N/A"}
                        </td>

                        <td>
                          {apartment.createdAt
                            ? new Date(
                                apartment.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

    </div>
  );
};

export default AllApprovals;