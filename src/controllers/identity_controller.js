const logger = require("../utils/logger");
const { validateLogin } = require("../utils/validation");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const RefreshToken = require("../models/RefreshToken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
};

const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 2 * 60 * 60 * 1000,
};

const accessCookieOptions = {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000,
};

// user login
const loginUser = async (req, res) => {
  logger.info("Login request received");

  try {
    const validationResult = validateLogin(req.body);
    if (!validationResult.success) {
      logger.warn("Validation error", validationResult.error.errors);
      return res.status(400).json({
        success: false,
        message: validationResult.error.errors[0].message,
      });
    }

    const { username, password } = validationResult.data;
    const user = await User.findOne({ username });

    if (!user) {
      logger.warn("User not found", username);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid password", username);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user);

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    logger.info("Login successful", user._id);
    res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
    });
  } catch (error) {
    logger.error("Login failed", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const refreshTokenUser = async (req, res) => {
  logger.info("Refresh token request received");

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      logger.warn("Refresh token not provided");
      return res.status(400).json({
        success: false,
        message: "Refresh token not provided",
      });
    }

    const storedToken = await RefreshToken.findOne({ refreshToken });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn("Invalid or expired refresh token");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(storedToken.user);
    if (!user) {
      logger.warn("User not found");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateToken(user);

    await RefreshToken.deleteOne({ _id: storedToken._id });

    // Set new cookies
    res.cookie("accessToken", newAccessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    logger.info("Token refreshed", user._id);
    return res.status(200).json({
      success: true,
      message: "Token refreshed",
    });
  } catch (error) {
    logger.error("Token refresh failed", error);
    return res.status(500).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};

// logout
const logoutUser = async (req, res) => {
  logger.info("Logout request received");

  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshToken.deleteOne({ refreshToken });
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    logger.info("Logout successful");
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout failed", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

const checkAuth = async (req, res) => {
  logger.info("Session check request received");

  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      logger.warn("No tokens provided for session check");
      return res.status(401).json({
        success: false,
        message: "No active session",
        isValid: false,
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).json({
        success: true,
        message: "Session is valid",
        isValid: true,
        userId: user._id,
      });
    } catch (tokenError) {
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      return refreshTokenUser(req, res);
    }
  } catch (error) {
    logger.error("Session check failed", error);
    return res.status(401).json({
      success: false,
      message: "Invalid session",
      isValid: false,
    });
  }
};
module.exports = { loginUser, refreshTokenUser, logoutUser, checkAuth };
