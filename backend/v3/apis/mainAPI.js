const sql = require("mssql");

const { getTableData } = require("../services/mainService");
// const { migrateDate } = require("../controllers/web/Migration/handleAvCalc");
// const { createTables } = require("../controllers/web/Migration/createTables");

const { ManageDataEntrySchema } = require("../schemas/ManageDataEntry/schema");
const { AdminUsersAppSchema } = require("../schemas/AdminUsersApp/schema");
const {
  PowerBiRelationShipsSchema,
} = require("../schemas/PowerBiRelationShips/schema");
const { PowerBiViewSchema } = require("../schemas/PowerBiView/schema");

const route = require("../routes/mainRoute");
const { getAllTables } = require("../helpers/getTables");
const { regix } = require("../helpers/regix");
const { model } = require("../model/mainModel");
const config = require("../config/config");

const tables = [
  { name: "ManageDataEntry", schema: ManageDataEntrySchema },
  { name: "PowerBiRelationShips", schema: PowerBiRelationShipsSchema },
  { name: "PowerBiView", schema: PowerBiViewSchema },
];

async function fetchDataFromTable(pool, table, query, schema) {
  if (!query) {
    console.log(`Fetching data from table: ${table}`);
    return pool
      .request()
      .query(`SELECT * FROM "${table}"`)
      .then((result) => {
        const memoryUsage = process.memoryUsage().rss;
        console.log(`${table}  ${memoryUsage / (1024 * 1024)} MB`);
        model[table] = result.recordset;
        if (schema) model[`${table}Schema`] = schema;
        return result.recordset;
      })
      .catch((err) => {
        console.error(`Error fetching data from table: ${table}`, err);
      });
  } else {
    console.log(`Fetching data from table: ${table}`);
    return pool
      .request()
      .query(query)
      .then((result) => {
        const memoryUsage = process.memoryUsage().rss;
        console.log(`${table}  ${memoryUsage / (1024 * 1024)} MB`);
        model[table] = result.recordset;
        return result.recordset;
      })
      .catch((err) => {
        console.error(`Error fetching data from table: ${table}`, err);
      });
  }
}

async function performQuery(pool, table, query) {
  console.log(`Peforming Query: ${query}`);
  return pool
    .request()
    .query(query)
    .then((result) => {
      const memoryUsage = process.memoryUsage().rss;
      console.log(` ${memoryUsage / (1024 * 1024)} MB`);
      return result;
    })
    .catch((err) => {
      console.error(`Error Peforming Query On table: ${table}`, err);
    });
}

const createTable = async (pool, table, schema) => {
  console.log(`Try Create Tables`);
  let query = `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='${table}' AND xtype='U')
               BEGIN CREATE TABLE "${table}" (`;
  Object.keys(schema).map((item) => {
    query += `"${item}" ${schema[item].databaseType},`;
  });
  query = query.slice(0, -1);
  query += ") END";
  console.log(query);
  return pool
    .request()
    .query(query)
    .then((result) => {
      const memoryUsage = process.memoryUsage().rss;
      console.log(` ${memoryUsage / (1024 * 1024)} MB`);
      return result;
    })
    .catch((err) => {
      console.error(`Error Peforming Query On table: ${table}`, err);
    });
};

const addVariables = (table, schema) => {
  return (req, res, next) => {
    req.table = table;
    req.schema = schema;
    next();
  };
};

const tablesV2EndPoint = async (app) => {
  sql
    .connect(config)
    .then((pool) => {
      let promise = Promise.resolve();

      return (
        promise
          .then(() => {
            [
              ...tables,
              { name: "AdminUsersApp", schema: AdminUsersAppSchema },
            ].forEach((item) => {
              promise = promise.then(() => {
                return createTable(pool, item?.name, item?.schema);
              });
            });
            return promise;
          })
          .then(() => {
            tables.forEach((item) => {
              promise = promise.then(() => {
                app.use(
                  `/api/v3/${item.name}`,
                  addVariables(item.name, item.schema),
                  route
                );
                app.get(`/api/v3/${item.name}Schema`, async (req, res) => {
                  try {
                    return res.status(200).json(item.schema);
                  } catch (error) {
                    return res.status(500).json({ message: error.message });
                  }
                });
                return fetchDataFromTable(pool, item.name, null, item.schema);
              });
            });
            return promise;
          })
          // .then(() => {
          //   return fetchDataFromTable(
          //     pool,
          //     "AppMaintUsers",
          //     null,
          //     AppMaintUsersSchema
          //   );
          // })
          .then(() => {
            return fetchDataFromTable(
              pool,
              "AdminUsersApp",
              null,
              AdminUsersAppSchema
            );
          })
          // .then(() => {
          //   return getAllCons();
          // })
          // .then(() => {
          //   return getAllProd();
          // })
          .then(() => {
            return fetchDataFromTable(
              pool,
              "AllTables",
              "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'",
              null
            );
          })
          .then(() => {
            return fetchDataFromTable(
              pool,
              "ManageDataEntry",
              null,
              ManageDataEntrySchema
            );
          })
          .then((result) => {
            result?.forEach((item) => {
              promise = promise.then(() => {
                let schemas = {};
                const fields = JSON.parse(item?.Fields);
                Object?.keys(fields)?.map((it) => {
                  schemas = {
                    ...schemas,
                    [it]: {
                      validatePattern: regix?.[fields?.[it]?.validateString],
                    },
                  };
                });

                if (item.Exist === "false") {
                  app.use(
                    `/api/v3/${item.Name}`,
                    addVariables(item.Name, schemas),
                    route
                  );
                  app.use(`/api/v3/${item.Name}Schema`, (req, res) => {
                    try {
                      return res.status(200).json(JSON.parse(item.Schemas));
                    } catch (error) {
                      return res.status(500).json({ message: error.message });
                    }
                  });
                }
                schemas = null;
                return fetchDataFromTable(pool, item.Name, null, item.Schemas);
              });
            });
            return promise;
          })
          .then(() => {
            console.log("All data fetched");
            return pool.close(); // Close the connection pool
          })
      );
    })
    .catch((error) => console.log(error));

  // app.use(
  //   "/api/v3/AppMaintUsers",
  //   addVariables("AppMaintUsers", AppMaintUsersSchema),
  //   route
  // );
  app.use(
    "/api/v3/AdminUsersApp",
    addVariables("AdminUsersApp", AdminUsersAppSchema),
    route
  );

  app.get("/api/v3/AllTables", getAllTables);
  app.get("/api/v3/getTableData", async (req, res) => {
    try {
      console.log(req.query);
      const table = req.query.table;
      const data = await getTableData(table);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  app.post("/api/v3/performQuery", async (req, res) => {
    const { query, table } = req.body;
    sql
      .connect(config)
      .then((pool) => {
        let promise = Promise.resolve();

        return promise
          .then(() => {
            return performQuery(pool, table, query);
          })
          .then((result) => {
            return {
              getData: fetchDataFromTable(pool, table, null, null),
              result: result,
            };
          })
          .then((result) => {
            return res.status(200).json(result);
          })
          .catch((err) => {
            return res.status(500).json({ message: err.message });
          });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
    // try {
    //   const { query } = req.body;
    //   console.log(query);
    //   const data = await getData(query);
    //   console.log(data);
    //   return res.status(200).json(data);
    // } catch (error) {
    //   return res.status(500).json({ message: error.message });
    // }
  });
  // try {
  //   //   await getAllData("AppMaintUsers");
  //   //   await getAllData("AdminUsersApp");
  //   //   await getAllCons();
  //   //   await getAllProd();
  //   //   // await createTables("QCTable");
  // setTimeout(() => {
  //   migrateDate();
  // }, 100000);
  //   //   // setTimeout(() => {
  //   //   //   createTables();
  //   //   // }, 20000);
  // } catch (error) {
  //   console.log(error.message);
  // }
};

module.exports = { tablesV2EndPoint };
