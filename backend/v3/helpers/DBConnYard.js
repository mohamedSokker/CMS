const sql = require("mssql");

const configYard = require("../config/configYard");

const DBConnectYard = async () => {
  try {
    const pool = new sql.ConnectionPool(configYard);
    await pool.connect();
    return pool;
  } catch (error) {
    console.log(error.message);
    throw new Error(`Failed To Connect To DB`);
  }
};

module.exports = { DBConnectYard };
