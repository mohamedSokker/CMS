const fs = require("fs");
const { model } = require("../../../model/mainModel");

const createFolders = async (req, res) => {
  try {
    const { Name } = req.body;
    const fullpath = `/home/mohamed/bauereg/DataEntryFiles/${Name}`;
    const standardFullpath = `/home/mohamed/bauereg/DataEntryFiles/${Name}Standard`;
    console.log(Name);
    if (!fs.existsSync(fullpath) && !fs.existsSync(standardFullpath)) {
      fs.mkdirSync(fullpath);
      fs.mkdirSync(standardFullpath);
      model[Name] = [];
      return res.status(200).json({ message: "Success" });
    } else {
      // return res.status(400).json({ message: "Invaild Path" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createFolders };
