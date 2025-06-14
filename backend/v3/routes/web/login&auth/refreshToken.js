const express = require("express");
const router = express.Router();
const {
  handleRefreshToken,
} = require("../../../controllers/web/login&auth/refreshToken");

router.get("/", handleRefreshToken);

module.exports = router;
