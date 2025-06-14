const express = require("express");
const router = express.Router();
const {
  searchFiles,
} = require("../../../controllers/web/CustomDataEntry/searchFile");

router.post("/", searchFiles);

module.exports = router;
