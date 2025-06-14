// const { parseURL } = require("../../functions/parseURL");
// const { getData } = require("../../../v3/helpers/getData");
// const bcrypt = require("bcrypt");
const JSONStream = require("JSONStream");

const { getData } = require("../../../helpers/getData");
const { model } = require("../../../model/mainModel");
const {
  // getAllData,
  getOneData,
  addData,
  updateData,
  deleteData,
} = require("../../../services/mainService");

const {
  AdminUsersAppSchema,
} = require("../../../schemas/AdminUsersApp/schema");

const getAllmanageUsers = async (req, res) => {
  try {
    // const result = await getAllData("AdminUsersApp");
    // return res.status(200).json(result);
    const jsonStream = JSONStream.stringify("[\n", "\n,\n", "\n]\n", 1024);

    // Pipe the large JSON object to the JSONStream serializer
    jsonStream.pipe(res);

    if (model["AdminUsersApp"]) {
      // Push the large JSON object into the JSONStream serializer
      model["AdminUsersApp"].forEach((item) => {
        jsonStream.write(item);
      });

      // End the JSONStream serializer
      jsonStream.end();
    } else {
      getData("SELECT * FROM AdminUsersApp").then((result) => {
        result.recordsets[0].forEach((item) => {
          jsonStream.write(item);
        });

        // End the JSONStream serializer
        jsonStream.end();
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getmanageUsers = async (req, res) => {
  try {
    const result = await getOneData(req.params.id, "AdminUsersApp");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addmanageUsers = async (req, res) => {
  try {
    const result = await addData(
      req.body,
      "AdminUsersApp",
      AdminUsersAppSchema
    );
    return res.status(200).json({ success: "true", dataAdded: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatemanageUsers = async (req, res) => {
  try {
    const result = await updateData(
      req.body,
      req.params.id,
      "AdminUsersApp",
      AdminUsersAppSchema
    );
    return res.status(200).json({ success: "true", dataUpdated: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletemanageUsers = async (req, res) => {
  try {
    const result = await deleteData(req.params.id, "AdminUsersApp");
    return res.status(200).json({ success: "true", dataDeleted: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllmanageUsers,
  getmanageUsers,
  addmanageUsers,
  updatemanageUsers,
  deletemanageUsers,
};
