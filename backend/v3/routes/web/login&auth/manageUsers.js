const express = require("express");
const router = express.Router();
const {
  getAllmanageUsers,
} = require("../../../controllers/web/login&auth/manageUsers");
const {
  getmanageUsers,
} = require("../../../controllers/web/login&auth/manageUsers");
const {
  addmanageUsers,
} = require("../../../controllers/web/login&auth/manageUsers");
const {
  updatemanageUsers,
} = require("../../../controllers/web/login&auth/manageUsers");
const {
  deletemanageUsers,
} = require("../../../controllers/web/login&auth/manageUsers");

router.use((req, res, next) => {
  console.log("manage Users middleware");
  next();
});

router.get("/", getAllmanageUsers);

router.get("/:id", getmanageUsers);

router.post("/", addmanageUsers);

router.put("/:id", updatemanageUsers);

router.delete("/:id", deletemanageUsers);

module.exports = router;
