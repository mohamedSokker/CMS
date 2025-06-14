const fs = require("fs");
const path = require("path");

const renameFile = (req, res) => {
  try {
    const startPath = req.body.pathabs;
    const endPath = req.body.endPathabs;
    console.log(startPath);
    console.log(endPath);
    // const fullpath = `${startPath}`;
    // const newPath = `${endPath}`;
    fs.renameSync(startPath, endPath);
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { renameFile };
