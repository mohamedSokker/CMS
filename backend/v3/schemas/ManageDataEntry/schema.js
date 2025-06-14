const { regix } = require("../../helpers/regix");

const ManageDataEntrySchema = {
  ID: {
    databaseType: "INT NOT NULL IDENTITY(1,1) PRIMARY KEY",
    validatePattern: regix.int,
  },
  Name: {
    databaseType: "NVARCHAR(255)",
    validatePattern: regix.nvarChar255,
  },
  Users: {
    databaseType: "TEXT",
    validatePattern: regix.text,
  },
  Schemas: { databaseType: "TEXT", validatePattern: regix.text },
  Fields: { databaseType: "TEXT", validatePattern: regix.text },
  Exist: { databaseType: "NVARCHAR(255)", validatePattern: regix.nvarChar255 },
};

module.exports = { ManageDataEntrySchema };
