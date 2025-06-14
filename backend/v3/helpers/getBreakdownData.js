const dateDiffDays = require("../helpers/dateDiff");
const dateDiffMin = require("../helpers/dateDiffMin");
const getDayName = require("../helpers/getDayName");
const formatDate = require("../helpers/formatdate");
// const { getData } = require("../helpers/getData");
const { getAllData } = require("../services/mainService");
const getWeekInterval = require("../helpers/getWeekInterval");
const addDays = require("../helpers/addDays");

const getbreakdownData = async (startDate, endDate, Location) => {
  try {
    let startTime = startDate;
    let endTime = endDate;
    const diff = dateDiffDays(endDate, startDate);
    let result = [];
    let breakdownTime = 0;
    if (diff > 0) {
      let currTime = new Date(startTime).toLocaleString();
      while (new Date(currTime) <= new Date(endTime)) {
        const weekInterval = getWeekInterval(currTime);
        const startInterval = formatDate(weekInterval.startDate);
        const endInterval = formatDate(weekInterval.endDate);
        const allAvPlan = await getAllData("Availability_Plan");
        const targetData = allAvPlan.filter(
          (item) =>
            item.Location === Location &&
            new Date(item.DateFrom) === new Date(startInterval) &&
            new Date(item.DateTo) === new Date(endInterval)
        );
        const avPlanData = targetData[0] && [
          {
            day: targetData[0][getDayName(currTime)],
          },
        ];
        // const avPlanQuery = `SELECT ${getDayName(currTime)} AS day
        //                    FROM Availability_Plan WHERE
        //                    Location = '${Location}' AND
        //                    DateFrom = '${startInterval}' AND
        //                    DateTo = '${endInterval}'`;
        // let avPlanData = await getData(avPlanQuery);
        // avPlanData = avPlanData.recordsets[0];
        if (formatDate(currTime) === formatDate(startTime)) {
          let nextTime = formatDate(addDays(currTime, 1));
          nextTime = `${nextTime} 00:00:00`;
          breakdownTime = dateDiffMin(nextTime, currTime);
          result.push({
            breakdownTime: breakdownTime,
            dateTime: formatDate(currTime),
          });
        } else if (formatDate(currTime) === formatDate(endTime)) {
          let targetTime = `${formatDate(endTime)} 00:00:00`;
          breakdownTime = dateDiffMin(endTime, targetTime);
          result.push({
            breakdownTime: breakdownTime,
            dateTime: formatDate(currTime),
          });
        } else {
          breakdownTime = Number(avPlanData[0][`day`]);
          result.push({
            breakdownTime: breakdownTime,
            dateTime: formatDate(currTime),
          });
        }
        currTime = new Date(addDays(currTime, 1)).toLocaleString();
      }
    } else {
      breakdownTime = dateDiffMin(endDate, startDate);
      result.push({
        breakdownTime: breakdownTime,
        dateTime: formatDate(startDate),
      });
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = getbreakdownData;
