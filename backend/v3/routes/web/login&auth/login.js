const express = require("express");
const router = express.Router();
const loginapp = require("../../../controllers/web/login&auth/login");

router.post("/", loginapp);

module.exports = router;
