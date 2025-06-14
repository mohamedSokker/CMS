const { authEndPoints } = require("./login&auth/api");
const { CustomDataEntryEndPoints } = require("./CustomDataEntry/api");
const { AIEndPoints } = require("./AI(RAG)/api");

const webApi = (app) => {
  authEndPoints(app);
  CustomDataEntryEndPoints(app);
  AIEndPoints(app);
};

module.exports = { webApi };
