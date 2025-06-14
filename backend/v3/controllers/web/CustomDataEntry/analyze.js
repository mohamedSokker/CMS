const XLSX = require("xlsx");
const { model } = require("../../../model/mainModel");
const ExcelDateToJSDate = require("../../../helpers/ExcelToJsDate");
const formatDate = require("../../../helpers/formatdate");

const { validateData } = require("./validate");
const { addManyQuery, addMany } = require("../../../services/mainService");

const { sheerToJson } = require("../../../helpers/sheetToJson");

const Analyze = async (req, res) => {
  try {
    const path = req.body.pathabs;
    console.log(path);

    const targetData = req.body.targetData;

    const workbook = XLSX.readFile(path, { sheets: ["Sheet1"] });
    // console.log(workbook.Sheets["Sheet1"]);

    const excelData = sheerToJson(workbook.Sheets["Sheet1"]);

    // console.log(excelData);

    let savedData = {};

    Object.keys(targetData[0]?.Fields)?.map((item) => {
      if (targetData[0]?.Fields[item].Type === "DropDown") {
        const modelKey = targetData[0]?.Fields[item].From;
        const modelCol = targetData[0]?.Fields[item].Column;
        model[modelKey].map((it) => {
          if (!savedData[item]) {
            savedData = { ...savedData, [item]: [it[modelCol]?.toString()] };
          } else {
            if (!savedData[item].includes(it[modelCol])) {
              savedData[item].push(it[modelCol]?.toString());
            }
          }
        });
      }
    });

    const data = [];
    const dataWithID = [];
    excelData.map((item) => {
      let newItem = {};
      let newItemWithID = { ...item };
      const arr = Object.keys(excelData[0]);

      arr.forEach((key) => {
        // console.log(targetData[0]?.Fields[key]);
        if (key !== "ID")
          newItem[key] =
            item[key] || item[key] === 0 || item[key] === ""
              ? targetData[0]?.Fields[key]?.Type === "Date"
                ? targetData[0]?.Fields[key]?.canBeEmpty && item[key] === "Null"
                  ? null
                  : formatDate(ExcelDateToJSDate(item[key]))
                : targetData[0]?.Fields[key]?.canBeEmpty && item[key] === "Null"
                ? null
                : targetData[0]?.Fields[key]?.Type === "Decimal"
                ? item[key] === ""
                  ? 0
                  : item[key]
                : item[key]
              : "";
        newItemWithID[key] =
          item[key] || item[key] === 0 || item[key] === ""
            ? targetData[0]?.Fields[key]?.Type === "Date"
              ? targetData[0]?.Fields[key]?.canBeEmpty && item[key] === "Null"
                ? "Null"
                : formatDate(ExcelDateToJSDate(item[key]))
              : targetData[0]?.Fields[key]?.canBeEmpty && item[key] === "Null"
              ? "Null"
              : targetData[0]?.Fields[key]?.Type === "Decimal"
              ? item[key] === ""
                ? 0
                : item[key]
              : item[key]
            : "";
      });
      data.push(newItem);
      dataWithID.push(newItemWithID);
    });

    // console.log(dataWithID);

    if (dataWithID.length > 0) {
      const validate = await validateData(dataWithID, savedData, targetData);

      if (validate.message !== "") throw new Error(validate.message);
    }

    if (data.length > 0) {
      await addMany(data, targetData[0]?.Name, targetData[0]?.Schemas);
    }

    return res.status(200).json({ messgae: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { Analyze };
