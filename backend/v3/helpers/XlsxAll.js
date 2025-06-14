const axios = require("axios");
const XLSX = require("xlsx");

const XlsxAll = async (url) => {
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
    // const workbook = XLSX.read(axiosResponse.data);
    return XLSX.read(axiosResponse.data);
  } catch (error) {
    console.log(error);
    // throw new Error(error);
  }
};

module.exports = XlsxAll;
