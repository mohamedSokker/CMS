// const { getData } = require("./getData");
const { getAllData } = require("../services/mainService");

const getEqsInSite = async (site) => {
  const allEqsLoc = await getAllData("Equipments_Location");
  const targetData = allEqsLoc.filter(
    (item) => item.Location === site && item.End_Date === null
  );
  return targetData;
  // const query = `SELECT * FROM Equipments_Location WHERE
  //                  Location = '${site}' AND
  //                  End_Date IS NULL`;
  // const result = await getData(query);
  // return result.recordsets[0];
};

module.exports = getEqsInSite;
