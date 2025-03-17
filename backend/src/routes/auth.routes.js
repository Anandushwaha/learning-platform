import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refreshtoken", refreshToken);

// Protected routes
router.get("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
