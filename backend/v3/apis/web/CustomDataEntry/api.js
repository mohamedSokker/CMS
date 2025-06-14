const CustomDataEntryGetFiles = require("../../../routes/web/CustomDataEntry/getFiles");
const CustomDataEntryCreateFolder = require("../../../routes/web/CustomDataEntry/createFolder");
const CustomDataEntryDeleteFiles = require("../../../routes/web/CustomDataEntry/deleteFiles");
const CustomDataEntryRenameFiles = require("../../../routes/web/CustomDataEntry/rename");
const CustomDataEntryUploadFiles = require("../../../routes/web/CustomDataEntry/uploadFiles");
const CustomDataEntrySearchFiles = require("../../../routes/web/CustomDataEntry/searchFiles");
const CustomDataEntryAnalyzeFiles = require("../../../routes/web/CustomDataEntry/analyze");
const CustomDataEntryCreateFolders = require("../../../routes/web/CustomDataEntry/createFolders");
const CustomDataEntryInitExcel = require("../../../routes/web/CustomDataEntry/initExcel");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
});

const CustomDataEntryEndPoints = (app) => {
  app.use("/api/v3/CustomDataEntryGetFiles", CustomDataEntryGetFiles);
  app.use("/api/v3/CustomDataEntryCreateFolder", CustomDataEntryCreateFolder);
  app.use("/api/v3/CustomDataEntryDeleteFiles", CustomDataEntryDeleteFiles);
  app.use("/api/v3/CustomDataEntryRenameFiles", CustomDataEntryRenameFiles);
  app.use(
    "/api/v3/CustomDataEntryUploadFiles",
    upload.single("files"),
    CustomDataEntryUploadFiles
  );
  app.use("/api/v3/CustomDataEntrySearchFiles", CustomDataEntrySearchFiles);
  app.use("/api/v3/CustomDataEntryAnalyzeFiles", CustomDataEntryAnalyzeFiles);
  app.use("/api/v3/CustomDataEntryCreateFolders", CustomDataEntryCreateFolders);
  app.use("/api/v3/CustomDataEntryInitExcel", CustomDataEntryInitExcel);
};

module.exports = { CustomDataEntryEndPoints };
