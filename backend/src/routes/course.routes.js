import express from "express";
import {
  createCourse,
  getTeacherCourses,
  getAllCourses,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseById,
  getEnrolledCourses,
} from "../controllers/course.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes requiring authentication
router.use(protect);

// GET /api/v1/courses - Students can view all available courses
router.get("/", getAllCourses);

// POST /api/v1/courses/create - Teacher creates a course
router.post("/create", authorize("teacher"), createCourse);

// GET /api/v1/courses/teacher - Get all courses created by a teacher
router.get("/teacher", authorize("teacher"), getTeacherCourses);

// GET /api/v1/courses/student/enrolled - Get courses a student is enrolled in
router.get("/student/enrolled", authorize("student"), getEnrolledCourses);

// POST /api/v1/courses/enroll/:id - Students enroll in a course
router.post("/enroll/:id", authorize("student"), enrollInCourse);

// Routes with :id parameter MUST come after more specific routes
// GET /api/v1/courses/:id - Get a single course by ID
router.get("/:id", getCourseById);

// PUT /api/v1/courses/:id - Teacher updates a course
router.put("/:id", authorize("teacher"), updateCourse);

// DELETE /api/v1/courses/:id - Teacher deletes a course
router.delete("/:id", authorize("teacher"), deleteCourse);

export default router;
