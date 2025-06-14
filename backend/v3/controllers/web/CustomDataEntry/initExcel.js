const { copyFiles } = require("../../../helpers/copyFiles");
const { writeToExcel } = require("../../../helpers/excelWrite");

const initExcel = async (req, res) => {
  try {
    const { Name, Fields } = req.body;
    console.log(Fields);
    await copyFiles(
      "/home/mohamed/bauereg/DataEntryFiles/Standard.xlsx",
      `/home/mohamed/bauereg/DataEntryFiles/${Name}Standard/Standard.xlsx`
    );
    await writeToExcel(
      `/home/mohamed/bauereg/DataEntryFiles/${Name}Standard/Standard.xlsx`,
      Object.keys(Fields)
    );
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { initExcel };
