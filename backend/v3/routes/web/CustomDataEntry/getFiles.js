const express = require("express");
const router = express.Router();
const {
  getFiles,
} = require("../../../controllers/web/CustomDataEntry/getFiles");

router.post("/", getFiles);

module.exports = router;
