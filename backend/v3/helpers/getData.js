const { DBConnect } = require("./DBConnect");

const getData = async (query) => {
  try {
    const DB = await DBConnect();
    const result = await DB.query(query);
    await DB.close();
    return result;
  } catch (error) {
    console.log(error.message);
    // throw new Error(error.message);
  } finally {
  }
};

module.exports = { getData };
