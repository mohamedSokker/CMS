const { DBConnectYard } = require("./DBConnYard");

const getData = async (query) => {
  const DB = await DBConnectYard();
  try {
    const result = await DB.query(query);
    await DB.close();
    return result;
  } catch (error) {
    throw new Error(error.message);
  } finally {
  }
};

module.exports = { getData };
