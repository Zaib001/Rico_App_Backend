const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../config/jwt");
const { sendTestEmail } = require("../services/mailerService");
const { validationResult } = require("express-validator");
// **Utility Functions:**
const generateVerificationToken = (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  return token;
};

// **Sign up a New User:**
exports.signup = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const user = new User({ name, email, password });
    // const verificationToken = generateVerificationToken(user);
    await user.save();

    // const verificationUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/verify-email/${verificationToken}`;
    // await sendTestEmail(
    //   email,
    //   "Email Verification",
    //   `Verify your email: ${verificationUrl}`
    // );

    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Error during signup." });
  }
};

// **Login User:**
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    // if (!user.isVerified) {
    //   return res.status(403).json({ error: "Email not verified." });
    // }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({ token, refreshToken, user });
  } catch (error) {
    res.status(500).json({ error: "Server error during login." });
  }
};

// **Verify Email:**
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token." });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified. You can log in now." });
  } catch (error) {
    res.status(500).json({ error: "Server error during email verification." });
  }
};

// **Update Profile:**
exports.updateProfile = async (req, res) => {
  const userId = req.user.id; // Assuming JWT middleware adds user ID to the request
  const { profileData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    user.profilePicture = profileData.profilePicture || user.profilePicture;
    user.bio = profileData.bio || user.bio;
    user.audioBio = profileData.audioBio || user.audioBio;
    user.filters = { ...user.filters, ...profileData.filters };

    await user.save();
    res.status(200).json({ message: "Profile updated.", user });
  } catch (error) {
    res.status(500).json({ error: "Server error during profile update." });
  }
};

// **Forgot Password:**
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;
    await sendTestEmail(email, "Password Reset", `Reset password: ${resetUrl}`);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ error: "Server error during password reset." });
  }
};

// **Reset Password:**
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token." });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ error: "Server error during password reset." });
  }
};

// **Refresh Token:**
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken)
      return res.status(403).json({ error: "Refresh token required." });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newToken = generateToken(decoded.userId);

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token." });
  }
};
// **Get Profile Data:**
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming JWT middleware adds user ID to the request
    const user = await User.findById(userId).select(
      "-password -verificationToken"
    ); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error during profile fetch." });
  }
};
