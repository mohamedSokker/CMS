const { authapp } = require("../../../controllers/web/login&auth/auth");

const manageUsers = require("../../../routes/web/login&auth/manageUsers");
const { uploadImg } = require("../../../controllers/web/login&auth/uploadimg");
const loginapp = require("../../../routes/web/login&auth/login");
const handleRefreshToken = require("../../../routes/web/login&auth/refreshToken");
const handleLogout = require("../../../routes/web/login&auth/logout");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
});

const authEndPoints = (app) => {
  app.use("/api/v1/manageUsers", manageUsers);

  app.post(
    "/api/v1/uploadImg",
    authapp("uploadImg"),
    upload.single("files"),
    uploadImg
  );

  app.use("/handleLoginApp", loginapp);

  app.use("/refresh", handleRefreshToken);

  app.use("/logout", handleLogout);
};

module.exports = { authEndPoints };
