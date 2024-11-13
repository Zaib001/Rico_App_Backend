// routes/authRoutes.js
const express = require("express");
const {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  getProfile,
} = require("../controllers/authController");

// Import profile-related controllers

const { body } = require("express-validator"); // Input validation
const authMiddleware = require("../middlewares/authMiddleware"); // JWT middleware for protected routes

const router = express.Router();

// **Signup Route**
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  signup
);

// **Login Route**
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// **Verify Email Route**
router.get("/verify-email/:token", verifyEmail);

// **Forgot Password Route**
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  forgotPassword
);

// **Reset Password Route**
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  resetPassword
);

// **Refresh Token Route**
router.post("/refresh-token", refreshToken);

router.get("/profile", authMiddleware, getProfile);
// **Protected Routes: Profile Management (JWT authentication required)**

module.exports = router;
