const express = require("express");
const {
  loginUser,
  refreshTokenUser,
  logoutUser,
} = require("../controllers/identity_controller");

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenUser);
router.post("/logout", logoutUser);

module.exports = router;
