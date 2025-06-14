const axios = require("axios");
const XLSX = require("xlsx");
const ExcelDateToJSDate = require("./ExcelToJsDate");
const { sheerToJson } = require("./sheetToJson");

const AxiosXlsx = async (url, sheet) => {
  let axiosResponse;
  try {
    const options = {
      method: "get",
      url,
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
    };
    axiosResponse = await axios(options);
    const workbook = XLSX.read(axiosResponse.data);

    // let worksheets = workbook.SheetNames.map((sheetName) => {
    //   return {
    //     sheetName,
    let data = sheerToJson(workbook.Sheets[sheet]);
    for (let i = 0; i < data.length; i++) {
      data[i]["Pouring Finish"] = ExcelDateToJSDate(data[i]["Pouring Finish"]);
    }
    return data;
    //   };
    // });
    // return worksheets;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = AxiosXlsx;
