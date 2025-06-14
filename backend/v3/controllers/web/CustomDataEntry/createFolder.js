const fs = require("fs");

const createFolder = (req, res) => {
  try {
    const basePath = req.body.fullpath;
    // const basePath = basePathArray[basePathArray.length - 1];
    const fullpath = req.body.pathabs;
    console.log(fullpath);

    if (!fs.existsSync(fullpath)) {
      fs.mkdirSync(fullpath);
      return res.status(200).json({ message: "success" });
    } else {
      return res.status(400).json({ message: "Invaild Path" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createFolder };
