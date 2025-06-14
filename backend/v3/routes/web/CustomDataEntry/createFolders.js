const express = require("express");
const router = express.Router();
const {
  createFolders,
} = require("../../../controllers/web/CustomDataEntry/createFolders");

router.post("/", createFolders);

module.exports = router;
