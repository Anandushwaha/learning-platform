import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected student route
router.get("/dashboard", protect, authorize("student"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student dashboard access granted",
    data: {
      user: req.user,
      studentResources: {
        courses: [],
        assignments: [],
        notifications: [],
      },
    },
  });
});

export default router;
