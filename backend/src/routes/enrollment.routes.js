import express from "express";
import {
  sendEnrollmentRequest,
  sendEnrollmentInvite,
  acceptEnrollmentRequest,
  rejectEnrollmentRequest,
  getPendingRequests,
  getOutgoingRequests,
} from "../controllers/enrollment.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Base route: /api/v1/enrollment

// Student enrollment request routes
router.post(
  "/request/:courseId",
  protect,
  authorize("student"),
  sendEnrollmentRequest
);

// Teacher invite routes
router.post(
  "/invite/:studentId",
  protect,
  authorize("teacher"),
  sendEnrollmentInvite
);

// Common routes for students and teachers
router.put("/accept/:requestId", protect, acceptEnrollmentRequest);
router.delete("/reject/:requestId", protect, rejectEnrollmentRequest);
router.get("/requests", protect, getPendingRequests);
router.get("/requests/outgoing", protect, getOutgoingRequests);

export default router;
