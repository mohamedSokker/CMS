const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./v3/config/corsAoptions");
const credentials = require("./v3/middlewares/credentials");
const { loadCache } = require("./v3/services/web/Cache/cache");
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine("html", require("ejs").renderFile);
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

// let model = {};

// model["Bauer_Equipments"] = [
//   { ID: 1, Equipment: "MC 128 #168" },
//   { ID: 2, Equipment: "MC 128 #154" },
//   { ID: 3, Equipment: "MC 96 #303" },
//   { ID: 4, Equipment: "MC 96 #191" },
//   { ID: 5, Equipment: "MC 96 #293" },
//   { ID: 6, Equipment: "BC 30 #881" },
//   { ID: 7, Equipment: "BC 30 #882" },
// ];
// // console.log(model);

// const fn = () => {
//   const result = new Function(
//     "model",
//     `let count = 0; model?.Bauer_Equipments?.filter((item) => item?.Equipment?.startsWith('MC 96')).map((item) => count += item?.ID); return count;`
//   );
//   console.log(result(model));
// };

// fn();

const route = require("./v3/routes/mainRoute");
const { createTableQuery, createTable } = require("./v3/services/mainService");

const addVariables = (table, schema) => {
  return (req, res, next) => {
    req.table = table;
    req.schema = schema;
    next();
  };
};

const addRoute = (name, schema) => {
  app.use(`/api/v3/${name}`, addVariables(name, schema), route);
};

app.post("/api/v3/CustomDataEntryCreateTable", async (req, res) => {
  try {
    const { Name, Schemas, Fields, Exist } = req.body;
    console.log(Name);
    console.log(Schemas);
    console.log(Fields);
    console.log(Exist);
    let schemas = {};
    Object?.keys(Fields)?.map((it) => {
      schemas = {
        ...schemas,
        [it]: { validatePattern: regix?.[Fields?.[it]?.validateString] },
      };
    });
    console.log(schemas);
    await createTable(Name, Schemas);
    if (!Exist) addRoute(Name, schemas);
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
/////////////////////////////////////////////////Cache ////////////////////////////////////////////////////////////////
// loadCache();
/////////////////////////////////////////////////Socket////////////////////////////////////////////////////////////////
const { socketFn } = require("./v3/socket/socket");
socketFn(server);
//////////////////////////////////////////////////files ///////////////////////////////////////////////////////////////
const { filesEndPoints } = require("./v3/files/api/api");
filesEndPoints(app);
//////////////////////////////////////////////////Website /////////////////////////////////////////////////////////////
const { webApi } = require("./v3/apis/web/webApi");
webApi(app);
//////////////////////////////////////////////////spare Part Mobile App ///////////////////////////////////////////////
// const { sparePartAppapi } = require("./v3/apis/sparePartApp/sparePartAppapi");
// sparePartAppapi(app);
//////////////////////////////////////////////////Maintenance Mobile App ///////////////////////////////////////////////
// const { appMobileEndPoints } = require("./v3/apis/maintenanceMobileApp/api");
// appMobileEndPoints(app);
//////////////////////////////////////////////////Main API/////////////////////////////////////////////////////////////

const { tablesV2EndPoint } = require("./v3/apis/mainAPI");
const { regix } = require("./v3/helpers/regix");

tablesV2EndPoint(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
