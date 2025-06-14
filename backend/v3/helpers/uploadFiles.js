const fs = require("fs");
// const path = require("path");
// let storage;
// let dir = "";
// let upload;

// const uploadFiles = async (req, res, fullpath) => {
//   try {
//     if (fs.existsSync(fullpath)) {
//       storage = multer.diskStorage({
//         destination: (req, file, callback) => {
//           dir = fullpath;
//           callback(null, dir);
//         },
//         filename: (req, file, callback) => {
//           callback(null, file.originalname);
//         },
//       });
//       upload = multer({
//         storage: storage,
//         limits: { fileSize: 2 * 1024 * 1024 * 1024 },
//         fileFilter: (req, file, callback) => {
//           file.originalname = Buffer.from(file.originalname, "latin1").toString(
//             "utf8"
//           );
//           callback(null, true);
//         },
//       }).array("files", 50);
//       upload(req, res, (err) => {
//         if (err) {
//           throw new Error(err.message);
//         }
//         return res.status(200).json({ message: "Success" });
//       });
//     } else {
//       throw new Error(`No Such Directory`);
//     }
//   } catch (err) {
//     // return res.status(500).json({ message: err.message });
//     throw new Error(err.message);
//   }
// };

const mergeChunks = async (fileName, totalChunks, fullpath) => {
  const chunkDir = fullpath + "/chunks";
  const mergedFilePath = fullpath;

  if (!fs.existsSync(mergedFilePath)) {
    fs.mkdirSync(mergedFilePath);
  }

  const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
    const chunkBuffer = await fs.promises.readFile(chunkFilePath);
    writeStream.write(chunkBuffer);
    fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
  }

  writeStream.end();
  try {
    fs.rmdirSync(chunkDir);
  } catch (error) {
    console.log(error.message);
  }

  console.log("Chunks merged successfully");
};

const uploadFiles = async (req, res, fullpath) => {
  const memoryUsage = process.memoryUsage().rss;
  const chunk = req.file.buffer;
  const chunkNumber = Number(req.body.chunkNumber); // Sent from the client
  const totalChunks = Number(req.body.totalChunks); // Sent from the client
  const fileName = req.body.originalname;

  console.log(`${fileName}  ${memoryUsage / (1024 * 1024)} MB`);

  const chunkDir = fullpath + "/chunks"; // Directory to save chunks

  if (!fs.existsSync(fullpath)) {
    fs.mkdirSync(fullpath);
  }

  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir);
  }

  const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

  try {
    await fs.promises.writeFile(chunkFilePath, chunk);
    console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

    if (chunkNumber === totalChunks - 1) {
      // If this is the last chunk, merge all chunks into a single file
      await mergeChunks(fileName, totalChunks, fullpath);
      console.log("File merged successfully");
    }

    res.status(200).json({ message: "Chunk uploaded successfully" });
  } catch (error) {
    console.error("Error saving chunk:", error);
    res.status(500).json({ error: "Error saving chunk" });
  }
};

module.exports = { uploadFiles };
