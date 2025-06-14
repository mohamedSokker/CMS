const { regix } = require("../../helpers/regix");

const PowerBiRelationShipsSchema = {
  ID: {
    databaseType: "INT NOT NULL IDENTITY(1,1) PRIMARY KEY",
    validatePattern: regix.int,
  },
  Name: {
    databaseType: "NVARCHAR(255)",
    validatePattern: regix.nvarChar255,
  },
  CreatedBy: {
    databaseType: "NVARCHAR(255)",
    validatePattern: regix.nvarChar255,
  },
  RelationShips: {
    databaseType: "TEXT",
    validatePattern: regix.text,
  },
};

module.exports = { PowerBiRelationShipsSchema };
