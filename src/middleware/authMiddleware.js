const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    logger.warn("Access attempt without token");
    return res.status(401).json({
      message: "Authentication required",
      success: false,
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn("Invalid token");
      return res.status(403).json({
        message: "Invalid token or expired",
        success: false,
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { validateToken };
