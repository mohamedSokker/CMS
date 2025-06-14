const { model } = require("../model/mainModel");
const { getData } = require("./getData");

const JSONStream = require("JSONStream");

const getAllTables = async (req, res) => {
  try {
    const memoryUsageBefore = process.memoryUsage().rss;

    const jsonStream = JSONStream.stringify("[\n", "\n,\n", "\n]\n", 1024);

    // Pipe the large JSON object to the JSONStream serializer
    jsonStream.pipe(res);

    // const query = `SELECT * FROM TaskManagerTasks`;
    // const data = (await getData(query)).recordsets[0];
    if (model["AllTables"]) {
      // Push the large JSON object into the JSONStream serializer
      model["AllTables"].forEach((item) => {
        jsonStream.write(item);
      });

      // End the JSONStream serializer
      jsonStream.end();
    } else {
      getData(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
      )
        .then((result) => {
          model["AllTables"] = result?.recordset;
          result.recordsets[0].forEach((item) => {
            jsonStream.write(item);
          });

          // End the JSONStream serializer
          jsonStream.end();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    const memoryUsageAfter = process.memoryUsage().rss;
    const memoryDiff = memoryUsageAfter - memoryUsageBefore;

    console.log(`AllTables b ${memoryUsageBefore / (1024 * 1024)} MB`);
    console.log(`AllTables a ${memoryDiff / (1024 * 1024)} MB`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTables };
