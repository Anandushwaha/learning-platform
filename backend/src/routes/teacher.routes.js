import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected teacher route
router.get("/dashboard", protect, authorize("instructor"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Teacher dashboard access granted",
    data: {
      user: req.user,
      teacherResources: {
        courses: [],
        students: [],
        assignments: [],
        notifications: [],
      },
    },
  });
});

export default router;
