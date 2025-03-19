import api from "./api";

const enrollmentService = {
  // Student sends enrollment request
  sendEnrollmentRequest: async (courseId, message = "") => {
    const response = await api.post(`/enrollment/request/${courseId}`, {
      message,
    });
    return response.data;
  },

  // Teacher sends enrollment invite
  sendEnrollmentInvite: async (studentId, courseId, message = "") => {
    const response = await api.post(`/enrollment/invite/${studentId}`, {
      courseId,
      message,
    });
    return response.data;
  },

  // Accept an enrollment request
  acceptEnrollmentRequest: async (requestId) => {
    const response = await api.put(`/enrollment/accept/${requestId}`);
    return response.data;
  },

  // Reject an enrollment request
  rejectEnrollmentRequest: async (requestId) => {
    const response = await api.delete(`/enrollment/reject/${requestId}`);
    return response.data;
  },

  // Get pending requests for a user
  getPendingRequests: async () => {
    const response = await api.get("/enrollment/requests");
    return response.data;
  },

  // Get outgoing requests for a user
  getOutgoingRequests: async () => {
    const response = await api.get("/enrollment/requests/outgoing");
    return response.data;
  },
};

export default enrollmentService;
