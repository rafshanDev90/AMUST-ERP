const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userRepo = require("../repos/userRepo");

// JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET;

// Token expiry times
const ACCESS_TOKEN_EXPIRES = "15m";  // Access token valid for 15 minutes
const REFRESH_TOKEN_EXPIRES = "30d"; // Refresh token valid for 30 days

// ================================
// AUTH SERVICE - Business Logic
// ================================

/**
 * Login user and generate access + refresh tokens
 */
async function loginUser(loginData) {
  const { loginId, rollNumber, email, parentPhone, password } = loginData;

  let user = null;

  // Authenticate based on provided identifier
  if (parentPhone) {
    user = await userRepo.findByParentPhone(parentPhone);
  } else if (loginId) {
    user = await userRepo.findByLoginId(loginId);
  } else if (rollNumber) {
    user = await userRepo.findByLoginId(rollNumber);
  } else if (email) {
    user = await userRepo.findByEmail(email);
  }

  if (!user) {
    throw new Error("Invalid login details");
  }

  // Compare password
  const passwordMatch = await userRepo.comparePassword(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate access token
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );

  // Return user info without password + tokens
  const userInfo = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email || null,
    loginId: user.loginId || null,
    rollNumber: user.rollNumber || null,
    parentPhone: user.parentPhone || null,
  };

  return {
    user: userInfo,
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    return {
      accessToken: newAccessToken,
      userId: payload.id,
      role: payload.role,
    };
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
}

/**
 * Validate user session (check if token is valid and user exists)
 */
async function validateSession(accessToken) {
  if (!accessToken) {
    return { valid: false, message: "No token provided" };
  }

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET);
    
    // Check if user still exists in database
    const user = await userRepo.findById(payload.id);
    if (!user) {
      return { valid: false, message: "User not found" };
    }

    return {
      valid: true,
      user: {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email || null,
        loginId: user.loginId || null,
        rollNumber: user.rollNumber || null,
      },
    };
  } catch (err) {
    return { valid: false, message: "Invalid token" };
  }
}

/**
 * Logout user (invalidate session/refresh token)
 */
async function logoutUser(refreshToken) {
  if (!refreshToken) {
    return { success: false, message: "No refresh token provided" };
  }

  try {
    jwt.verify(refreshToken, JWT_SECRET);
    return { success: true, message: "Logged out successfully" };
  } catch (err) {
    return { success: false, message: "Invalid refresh token" };
  }
}

module.exports = {
  loginUser,
  refreshAccessToken,
  validateSession,
  logoutUser,
};