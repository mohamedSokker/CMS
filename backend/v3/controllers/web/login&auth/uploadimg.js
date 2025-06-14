const { uploadFiles } = require("../../../helpers/uploadFiles");

const uploadImg = async (req, res) => {
  try {
    let dis = req.query.user;
    const fullpath = `/home/mohamed/bauereg/api/users/${dis}`;
    await uploadFiles(req, res, fullpath);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadImg };
