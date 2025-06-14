const fs = require("fs");

const copyFiles = async (src, dst) => {
  const rd = fs.createReadStream(src);
  const wr = fs.createWriteStream(dst);
  try {
    return await new Promise((resolve, reject) => {
      rd.on("error", reject);
      wr.on("error", reject);
      wr.on("finish", resolve);
      rd.pipe(wr);
    });
  } catch (error) {
    rd.destroy();
    wr.end();
    throw new Error(error);
  }
};

module.exports = { copyFiles };
