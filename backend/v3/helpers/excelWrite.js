const XLSX = require("xlsx");

const { nextColumn } = require("./excelNextColumn");

const writeToExcel = async (dst, data) => {
  try {
    let current = "B";
    let result = { A1: { t: "s", v: "ID" } };
    for (let i = 0; i < data.length; i++) {
      result = { ...result, [`${current}1`]: { t: "s", v: data[i] } };
      //   console.log(current);
      current = nextColumn(current);
    }
    result = { ...result, "!ref": `A1:${current}1` };
    console.log(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, result, "Sheet1");
    XLSX.writeFile(wb, dst);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { writeToExcel };
