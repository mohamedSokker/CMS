const fs = require("fs");
const path = require("path");
require("dotenv").config();

const getFiles = async (req, res) => {
  try {
    // const basePath = basePathArray[basePathArray.length - 1];
    const fullpath = req.body.pathabs;

    console.log(fullpath);

    const arrayOfFiles = fs.readdirSync(`${fullpath}`);
    const filesList = [];

    arrayOfFiles.forEach((file) => {
      const stats = fs.lstatSync(`${fullpath}/${file}`);
      if (stats.isFile()) {
        filesList.push({
          file: file,
          type: "file",
          size: stats.size,
          dateCreated: stats.ctime,
        });
      } else {
        filesList.push({
          file: file,
          type: "folder",
          size: stats.size,
          dateCreated: stats.ctime,
        });
      }
    });
    return res.status(200).json({ data: filesList });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getFiles };
