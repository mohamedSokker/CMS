const path = require("path");
require("dotenv").config();
const fs = require("fs");

const FileSystem = require("../fileSystem");

function replaceAllChar(string, char1, char2) {
  while (string.includes(char1)) {
    string = string.replace(char1, char2);
  }
  return string;
}

const decodeURL = (secPath) => {
  secPath = replaceAllChar(secPath, "%20", " ");
  secPath = replaceAllChar(secPath, "%23", "#");
  secPath = replaceAllChar(secPath, "%26", "&");
  secPath = replaceAllChar(secPath, "%25", "%");
  secPath = replaceAllChar(secPath, "%22", '"');
  secPath = replaceAllChar(secPath, "%28", "(");
  secPath = replaceAllChar(secPath, "%29", ")");
  return secPath;
};

const filesEndPoints = (app) => {
  app.get("/users/img/:username/:imgName", (req, res) => {
    const filePath = `/home/mohamed/bauereg/api/users/${decodeURL(
      req.params.username
    )}/${decodeURL(req.params.imgName)}`;
    res.sendFile(filePath);
  });

  app.get("/Bauereg/DataEntryFiles/*", FileSystem);

  app.get("/AppGetFiles", (req, res) => {
    try {
      let basePath = process.env.BASE_PATH;
      const dirPath = path.resolve(req.query.fullpath);
      if (dirPath.length < basePath.length) {
        return res.status(403).json({ message: "Unauthorized" });
      } else {
        console.log(dirPath);
        let arrayOfFiles = fs.readdirSync(dirPath);
        console.log(arrayOfFiles);
        let filesList = [];

        arrayOfFiles.forEach((file) => {
          if (fs.lstatSync(`${dirPath}/${file}`).isFile()) {
            filesList.push({ file: file, type: "file" });
          } else {
            filesList.push({ file: file, type: "folder" });
          }
        });
        return res.status(200).json({ success: true, data: filesList });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

module.exports = { filesEndPoints };
