const express = require("express");
const {
  loginUser,
  refreshTokenUser,
  logoutUser,
  checkAuth,
} = require("../controllers/identity_controller");

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenUser);
router.post("/logout", logoutUser);

router.get("/check", checkAuth);

module.exports = router;
