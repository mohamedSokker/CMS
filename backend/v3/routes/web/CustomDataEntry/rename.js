const express = require("express");
const router = express.Router();
const {
  renameFile,
} = require("../../../controllers/web/CustomDataEntry/renameFiles");

router.post("/", renameFile);

module.exports = router;
