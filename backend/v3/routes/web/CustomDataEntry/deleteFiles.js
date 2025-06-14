const express = require("express");
const router = express.Router();
const {
  deleteFile,
} = require("../../../controllers/web/CustomDataEntry/deleteFiles");

router.post("/", deleteFile);

module.exports = router;
