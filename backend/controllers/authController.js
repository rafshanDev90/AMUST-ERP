const authService = require("../services/authService");
const userRepo = require("../repos/userRepo");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "schoolerp_secret_key";

// ================================
// AUTH CONTROLLER - HTTP Request Handling
// ================================

/**
 * POST /api/auth/login
 * Login user with access and refresh tokens
 */
async function login(req, res) {
  try {
    const loginData = req.body;
    const result = await authService.loginUser(loginData);

    res.json({
      message: "Login successful",
      token: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    console.error("Error in /auth/login:", err.message);
    res.status(400).json({ message: err.message });
  }
}

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
    });
  } catch (err) {
    console.error("Error in /auth/refresh:", err.message);
    res.status(401).json({ message: err.message });
  }
}

/**
 * POST /api/auth/validate
 * Validate user session/token
 */
async function validate(req, res) {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ message: "Access token required" });
    }

    const result = await authService.validateSession(accessToken);
    res.json(result);
  } catch (err) {
    console.error("Error in /auth/validate:", err.message);
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /api/auth/logout
 * Logout user (invalidate refresh token)
 */
async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    
    const result = await authService.logoutUser(refreshToken);
    res.json(result);
  } catch (err) {
    console.error("Error in /auth/logout:", err.message);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  login,
  refreshToken,
  validate,
  logout,
};