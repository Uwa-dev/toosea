import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getPendingApartments,
  approveApartment,
  rejectApartment,
} from "../../../services/approvalApi.js";

import {
  getPendingApartmentUpdates,
  approveApartmentUpdate,
  rejectApartmentUpdate,
  getPendingApartmentDeletions,
  approveApartmentDeletion,
  rejectApartmentDeletion,
} from "../../../services/apartmentApi.js";

import "./pendingApprovals.css";

const PendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [apartmentUpdates, setApartmentUpdates] = useState([]);
  const [apartmentDeletions, setApartmentDeletions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Handles endpoints that return their lists under different keys.
  const getList = (response) =>
    response?.users ||
    response?.apartments ||
    response?.requests ||
    [];

  // ========================================
  // FETCH ALL PENDING REQUESTS
  // ========================================

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);

      const [
        usersResponse,
        apartmentsResponse,
        updatesResponse,
        deletionsResponse,
      ] = await Promise.all([
        getPendingUsers(),
        getPendingApartments(),
        getPendingApartmentUpdates(),
        getPendingApartmentDeletions(),
      ]);

      setUsers(getList(usersResponse));
      setApartments(getList(apartmentsResponse));
      setApartmentUpdates(getList(updatesResponse));
      setApartmentDeletions(getList(deletionsResponse));
    } catch (error) {
      console.error("Failed to fetch pending approvals:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load all pending requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  // ========================================
  // USER ACCOUNT APPROVALS
  // ========================================

  const handleApproveUser = async (id) => {
    try {
      setProcessingId(`user-${id}`);

      await approveUser(id);

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );

      toast.success("Staff account approved.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve user."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      setProcessingId(`user-${id}`);

      await rejectUser(id);

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );

      toast.success("Staff account rejected.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject user."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // NEW APARTMENT APPROVALS
  // ========================================

  const handleApproveApartment = async (id) => {
    try {
      setProcessingId(`apartment-${id}`);

      await approveApartment(id);

      setApartments((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );

      const response = await getPendingApartments();


      toast.success("Apartment approved.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve apartment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectApartment = async (id) => {
    try {
      setProcessingId(`apartment-${id}`);

      await rejectApartment(id);

      setApartments((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );

      toast.success("Apartment rejected.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject apartment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // APARTMENT EDIT APPROVALS
  // ========================================

  const handleApproveUpdate = async (id) => {
    try {
      setProcessingId(`update-${id}`);

      await approveApartmentUpdate(id);

      setApartmentUpdates((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );

      toast.success("Apartment changes approved.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve apartment changes."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectUpdate = async (id) => {
    try {
      setProcessingId(`update-${id}`);

      await rejectApartmentUpdate(id);

      setApartmentUpdates((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );

      toast.success("Apartment changes rejected.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject apartment changes."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // APARTMENT DELETION APPROVALS
  // ========================================

  const handleApproveDeletion = async (id) => {
    try {
      setProcessingId(`deletion-${id}`);

      await approveApartmentDeletion(id);

      setApartmentDeletions((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );

      toast.success("Apartment deletion approved.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve apartment deletion."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectDeletion = async (id) => {
    try {
      setProcessingId(`deletion-${id}`);

      await rejectApartmentDeletion(id);

      setApartmentDeletions((prev) =>
        prev.filter((apartment) => apartment._id !== id)
      );

      toast.success("Apartment deletion request rejected.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reject apartment deletion."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // HELPERS
  // ========================================

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    if (Array.isArray(value)) {
      return value.join(", ") || "—";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const totalPending =
    users.length +
    apartments.length +
    apartmentUpdates.length +
    apartmentDeletions.length;

  if (loading) {
    return (
      <div className="pending-approvals">
        <div className="approval-loading">
          Loading all pending requests...
        </div>
      </div>
    );
  }

  return (
    <div className="pending-approvals">
      {/* HEADER */}

      <div className="approval-header">
        <div>
          <h1>Pending Approvals</h1>
          <p>
            Review staff accounts and apartment creation,
            edit and deletion requests.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchPendingApprovals}
          disabled={processingId !== null}
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
            New Apartments
          </span>
          <strong>{apartments.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Apartment Edits
          </span>
          <strong>{apartmentUpdates.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Deletion Requests
          </span>
          <strong>{apartmentDeletions.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Total Pending
          </span>
          <strong>{totalPending}</strong>
        </div>
      </div>

      {/* ================================== */}
      {/* STAFF ACCOUNTS */}
      {/* ================================== */}

      <section className="approval-section">
        <div className="section-heading">
          <div>
            <h2>Staff Accounts</h2>
            <p>Staff accounts awaiting owner approval.</p>
          </div>

          <span className="count-badge">{users.length}</span>
        </div>

        {users.length === 0 ? (
          <div className="empty-approval">
            <h3>No pending users</h3>
            <p>There are no staff accounts awaiting approval.</p>
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
                          disabled={processingId !== null}
                          onClick={() =>
                            handleApproveUser(user._id)
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          disabled={processingId !== null}
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

      {/* ================================== */}
      {/* NEW APARTMENTS */}
      {/* ================================== */}

      <section className="approval-section">
        <div className="section-heading">
          <div>
            <h2>New Apartment Requests</h2>
            <p>
              Newly created apartments awaiting owner approval.
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
              There are no new apartments awaiting approval.
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
                      {apartment.createdBy?.fullName || "N/A"}
                    </td>

                    <td>
                      {apartment.createdBy?.email || "N/A"}
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
                          disabled={processingId !== null}
                          onClick={() =>
                            handleApproveApartment(apartment._id)
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          disabled={processingId !== null}
                          onClick={() =>
                            handleRejectApartment(apartment._id)
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

      {/* ================================== */}
      {/* APARTMENT EDIT REQUESTS */}
      {/* ================================== */}

      <section className="approval-section">
        <div className="section-heading">
          <div>
            <h2>Apartment Edit Requests</h2>
            <p>
              Review proposed changes before they are applied.
            </p>
          </div>

          <span className="count-badge">
            {apartmentUpdates.length}
          </span>
        </div>

        {apartmentUpdates.length === 0 ? (
          <div className="empty-approval">
            <h3>No pending edits</h3>
            <p>
              There are no apartment changes awaiting approval.
            </p>
          </div>
        ) : (
          <div className="approval-table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Apartment</th>
                  <th>Requested By</th>
                  <th>Proposed Changes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {apartmentUpdates.map((apartment) => {
                  const changes = apartment.pendingUpdate || {};

                  return (
                    <tr key={apartment._id}>
                      <td>
                        <div className="apartment-name">
                          {apartment.name ||
                            apartment.title ||
                            "Unnamed Apartment"}
                        </div>
                      </td>

                      <td>
                        {changes.requestedBy?.fullName ||
                          changes.updatedBy?.fullName ||
                          apartment.pendingUpdateBy?.fullName ||
                          "Manager"}
                      </td>

                      <td>
                        {Object.keys(changes).filter(
                          (key) =>
                            ![
                              "_id",
                              "requestedBy",
                              "updatedBy",
                              "requestedAt",
                              "updatedAt",
                            ].includes(key)
                        ).length === 0 ? (
                          "Changes submitted"
                        ) : (
                          <details>
                            <summary>View changes</summary>
                            <ul>
                              {Object.entries(changes)
                                .filter(
                                  ([key]) =>
                                    ![
                                      "_id",
                                      "requestedBy",
                                      "updatedBy",
                                      "requestedAt",
                                      "updatedAt",
                                    ].includes(key)
                                )
                                .map(([key, value]) => (
                                  <li key={key}>
                                    <strong>{key}:</strong>{" "}
                                    {formatValue(value)}
                                  </li>
                                ))}
                            </ul>
                          </details>
                        )}
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
                            disabled={processingId !== null}
                            onClick={() =>
                              handleApproveUpdate(apartment._id)
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-btn"
                            disabled={processingId !== null}
                            onClick={() =>
                              handleRejectUpdate(apartment._id)
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================================== */}
      {/* APARTMENT DELETION REQUESTS */}
      {/* ================================== */}

      <section className="approval-section">
        <div className="section-heading">
          <div>
            <h2>Apartment Deletion Requests</h2>
            <p>
              Review apartments the manager has requested to delete.
              Approving a request permanently removes the apartment.
            </p>
          </div>

          <span className="count-badge">
            {apartmentDeletions.length}
          </span>
        </div>

        {apartmentDeletions.length === 0 ? (
          <div className="empty-approval">
            <h3>No pending deletions</h3>
            <p>
              There are no apartment deletion requests awaiting approval.
            </p>
          </div>
        ) : (
          <div className="approval-table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Apartment</th>
                  <th>Requested By</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {apartmentDeletions.map((apartment) => {
                  const deletion = apartment.pendingDeletion || {};

                  return (
                    <tr key={apartment._id}>
                      <td>
                        <div className="apartment-name">
                          {apartment.name ||
                            apartment.title ||
                            "Unnamed Apartment"}
                        </div>
                      </td>

                      <td>
                        {deletion.requestedBy?.fullName ||
                          deletion.requestedBy?.email ||
                          "Manager"}
                      </td>

                      <td>
                        {deletion.requestedAt
                          ? new Date(
                              deletion.requestedAt
                            ).toLocaleDateString()
                          : "N/A"}
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
                            disabled={processingId !== null}
                            onClick={() =>
                              handleApproveDeletion(apartment._id)
                            }
                          >
                            Approve Delete
                          </button>

                          <button
                            className="reject-btn"
                            disabled={processingId !== null}
                            onClick={() =>
                              handleRejectDeletion(apartment._id)
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default PendingApprovals;