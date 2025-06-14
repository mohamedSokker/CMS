// const getDayName = require("./getDayName");
// const { getData } = require("../../functions/getData");
const { getAllData } = require("../services/mainService");

const checkifAvPlanRecord = async (site, DateFrom, DateTo) => {
  const allAvPlan = await getAllData("Availability_Plan");
  const targetData = allAvPlan.filter(
    (item) =>
      item.Location === site &&
      new Date(item.DateFrom) === new Date(DateFrom) &&
      new Date(item.DateTo) === new Date(DateTo)
  );

  if (targetData.length > 0) return true;
  return false;
  // const query = `SELECT *
  //                FROM Availability_Plan WHERE
  //                Location = '${site}' AND
  //                DateFrom = '${DateFrom}' AND
  //                DateTo = '${DateTo}'`;
  // const result = await getData(query);
  // if (result.recordsets[0].length > 0) return true;
  // return false;
};

module.exports = checkifAvPlanRecord;
