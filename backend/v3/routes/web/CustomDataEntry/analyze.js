const express = require("express");
const router = express.Router();
const { Analyze } = require("../../../controllers/web/CustomDataEntry/analyze");

router.post("/", Analyze);

module.exports = router;
