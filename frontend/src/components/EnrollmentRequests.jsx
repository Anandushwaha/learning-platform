import { useState, useEffect } from "react";
import enrollmentService from "../services/enrollmentService";
import Spinner from "./Spinner";
import "./EnrollmentRequests.css";

const EnrollmentRequests = ({ userRole }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [pendingRes, outgoingRes] = await Promise.all([
        enrollmentService.getPendingRequests(),
        enrollmentService.getOutgoingRequests(),
      ]);
      setPendingRequests(pendingRes.data);
      setOutgoingRequests(outgoingRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await enrollmentService.acceptEnrollmentRequest(requestId);
      setSuccessMessage("Request accepted successfully");
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await enrollmentService.rejectEnrollmentRequest(requestId);
      setSuccessMessage("Request rejected successfully");
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject request");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="enrollment-requests">
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Pending Requests Section */}
      <div className="requests-section">
        <h3>Pending Requests</h3>
        {pendingRequests.length === 0 ? (
          <p className="no-requests">No pending requests</p>
        ) : (
          <div className="requests-list">
            {pendingRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-info">
                  <h4>{request.course.title}</h4>
                  <p className="request-type">
                    {request.type === "student_request"
                      ? `Request from ${request.requester.name}`
                      : `Invite from ${request.requester.name}`}
                  </p>
                  {request.message && (
                    <p className="request-message">{request.message}</p>
                  )}
                </div>
                <div className="request-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleAccept(request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests Section */}
      <div className="requests-section">
        <h3>Outgoing Requests</h3>
        {outgoingRequests.length === 0 ? (
          <p className="no-requests">No outgoing requests</p>
        ) : (
          <div className="requests-list">
            {outgoingRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-info">
                  <h4>{request.course.title}</h4>
                  <p className="request-type">
                    {request.type === "student_request"
                      ? `Request to ${request.recipient.name}`
                      : `Invite to ${request.recipient.name}`}
                  </p>
                  {request.message && (
                    <p className="request-message">{request.message}</p>
                  )}
                </div>
                <div className="request-status">
                  <span className="status pending">Pending</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentRequests;
