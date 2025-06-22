const fs = require("fs");
const path = require("path");

async function searchFile(dir, searchedData, result) {
  // read the contents of the directory
  const files = fs.readdirSync(dir);

  // search through the files
  for (const file of files) {
    // build the full path of the file
    const filePath = path.join(dir, file);

    // get the file stats
    const fileStat = fs.statSync(filePath);

    // if the file is a directory, recursively search the directory
    if (fileStat.isDirectory()) {
      if (file.toLowerCase().includes(searchedData.toLowerCase())) {
        // if the file is a match, print it
        result.push(filePath);
      }
      searchFile(filePath, searchedData, result);
    } else if (file.toLowerCase().includes(searchedData.toLowerCase())) {
      // if the file is a match, print it
      result.push(filePath);

      //   console.log(filePath);
    }
  }
  //   console.log(`result => ${JSON.stringify(result)}`);
  return result;
}

const searchFiles = async (req, res) => {
  try {
    const startPath = req.body.path;
    const searchedData = req.body.search;
    const fullpath = req.body.pathabs;
    console.log(fullpath);

    let result = [];

    const data = await searchFile(fullpath, searchedData, result);
    // console.log(`data => ${JSON.stringify(data)}`);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { searchFiles };
