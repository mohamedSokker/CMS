const { regix } = require("../../helpers/regix");

const AdminUsersAppSchema = {
  ID: {
    databaseType: "INT NOT NULL IDENTITY(1,1) PRIMARY KEY",
    validatePattern: regix.int,
  },
  UserName: {
    databaseType: "NVARCHAR(255)",
    validatePattern: regix.nvarChar255,
  },
  Password: {
    databaseType: "NVARCHAR(255)",
    validatePattern: regix.nvarChar255,
  },
  Email: { databaseType: "NVARCHAR(255)", validatePattern: regix.nvarChar255 },
  Phone: { databaseType: "NVARCHAR(255)", validatePattern: regix.nvarChar255 },
  ProfileImg: {
    databaseType: "NVARCHAR(255)",
    validatePattern: regix.nvarChar255,
  },
  UserRole: {
    databaseType: "TEXT",
    validatePattern: regix.text,
  },
  Title: { databaseType: "NVARCHAR(255)", validatePattern: regix.nvarChar255 },
  Department: {
    databaseType: "NVARCHAR(255)",
    validatePattern: regix.nvarChar255,
  },
  Token: { databaseType: "NVARCHAR(255)", validatePattern: regix.nvarChar255 },
};

module.exports = { AdminUsersAppSchema };
