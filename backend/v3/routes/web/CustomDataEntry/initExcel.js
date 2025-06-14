const express = require("express");
const router = express.Router();
const {
  initExcel,
} = require("../../../controllers/web/CustomDataEntry/initExcel");

router.post("/", initExcel);

module.exports = router;
