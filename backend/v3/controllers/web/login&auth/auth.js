const jwt = require("jsonwebtoken");
// const { getData } = require("../../../v3/helpers/getData");
// const { getAllData } = require("../../../services/mainService");
const { getData } = require("../../../helpers/getData");
const { model } = require("../../../model/mainModel");

let authapp = (endPointName) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let flag = false;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ message: "Failed From authHeader" });

    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decode) => {
      if (err) return res.status(403).json({ message: err.message });
      let Results = [];
      try {
        // console.log(`decode => ${JSON.stringify(decode)}`);

        if (model["AdminUsersApp"]) {
          Results = model["AdminUsersApp"].filter(
            (user) => user.UserName === decode.username
          );
        } else {
          var query = `SELECT TOP 1  UserRole FROM AdminUsersApp WHERE UserName = '${decode.username}'`;
          getData(query).then((result) => {
            Results = result.recordsets[0];
          });
        }
        // const allUsers = await getAllData("AdminUsersApp");
        // Results = allUsers.filter((user) => user.UserName === decode.username);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

      //   Results = Results.recordsets[0];
      console.log(Results);
      const roles = JSON.parse(Results[0]["UserRole"]);
      console.log(roles);

      if (roles?.Admin) {
        next();
      } else if (
        checkRole(endPointName, roles?.Editor?.Tables) ||
        checkRole(endPointName, roles?.User?.Tables)
      ) {
        next();
      } else {
        if (
          roles?.StockRes &&
          manageResources.User.StockRes.includes(endPointName)
        ) {
          flag = true;
          console.log(`true from Stocks`);
        } else {
          for (let i = 0; i < resourcesTitles.length; i++) {
            // console.log(resourcesTitles[i]);
            // console.log(roles?.User[resourcesTitles[i]]);
            // console.log(manageResources.User[resourcesTitles[i]]);
            // console.log(endPointName);

            // console.log(decode?.roles?.Editor[resourcesTitles[i]]);
            // console.log(decode?.roles?.User[resourcesTitles[i]]);
            // console.log(manageResources.User[resourcesTitles[i]]);
            // console.log(endPointName);
            if (
              (roles?.Editor[resourcesTitles[i]] === true ||
                roles?.Editor[resourcesTitles[i]]?.length > 0) &&
              manageResources.Editor[resourcesTitles[i]]?.includes(endPointName)
            ) {
              flag = true;
              console.log(`true from Editor`);
              // next();
            } else if (
              (roles?.User[resourcesTitles[i]] === true ||
                roles?.User[resourcesTitles[i]]?.length > 0) &&
              manageResources.User[resourcesTitles[i]].includes(endPointName)
            ) {
              flag = true;
              console.log(`true from User`);
              // next();
            }
          }
        }

        if (flag === true) {
          next();
        } else {
          return res.status(401).json({ message: "Failed From Permission" });
        }
      }
    });
  };
};

const checkRole = (endPointName, roles) => {
  let flag = false;
  roles.map((role) => {
    if (role.name === endPointName) {
      flag = true;
      return true;
    }
  });
  if (flag) {
    return true;
  }
  return false;
};

const resourcesTitles = [
  "ManageUsers",
  "Dashboard",
  "Kanban",
  "Transportations",
  "Sites",
  "Equipments",
  "Orders",
  "Stocks",
  "StocksList",
  "StockRes",
  "OilSamples",
  "OilSamplesAnalyzed",
  "Catalogues",
];

const manageResources = {
  Editor: {
    ManageUsers: [
      "Bauer_Equipments",
      "Location_Bauer",
      "uploadImg",
      "manageUsers",
      "Equipments_Location",
      "AppManageUsers",
    ],
    Dashboard: [
      // "Availability",
      // "FuelConsumption",
      // "OilConsumption",
      // "Production",
      // "Maintenance",
      // "PeriodicMaintenance_Plan",
      "Dashboard",
    ],
    Kanban: ["AdminTasks", "Bauer_Equipments", "Location_Bauer", "manageUsers"],
    Transportations: ["Location_Bauer"],
    Sites: ["Sites"],
    Equipments: ["Equipments"],
    Orders: [
      "AppGetFiles",
      "AppCreateFolder",
      "AppDeleteFolder",
      "AppRenameFolder",
      "AppUploadItems",
      "AppCheck",
      "OrdersFile",
      "OrdersConfirmationpdfAnalysis",
      "OrdersInvoicepdfAnalysis",
      "OrdersOrderpdfAnalysis",
      "OrdersQuotationpdfAnalysis",
    ],
    Stocks: ["Maintenance_Stocks"],
    StocksList: [],
    StockRes: [
      "AppNotification",
      "AppStocksTransition",
      "AppStocks",
      "StockTransition",
      "AppPlaceOrder",
      "stocksRecieve",
      "stocksExchange",
      "stocksNewItem",
      "stocksPlaceOrder",
      "confirmOrder",
      "Bauer_Equipments",
    ],
    Tables: [],
    OilSamples: [
      "AppGetFiles",
      "AppCreateFolder",
      "AppDeleteFolder",
      "AppRenameFolder",
      "AppUploadItems",
      "AppCheck",
      "OilSamplesFile",
      "pdfAnalysis",
    ],
    OilSamplesAnalyzed: [
      "AppGetFiles",
      "AppCreateFolder",
      "AppDeleteFolder",
      "AppRenameFolder",
      "AppUploadItems",
      "AppCheck",
      "OilSamplesAnalyzedFile",
    ],
    Catalogues: [],
  },
  User: {
    ManageUsers: [
      "Bauer_Equipments",
      "Location_Bauer",
      "uploadImg",
      "manageUsers",
      "Equipments_Location",
    ],
    Dashboard: ["Dashboard"],
    Kanban: ["AdminTasks", "Bauer_Equipments", "Location_Bauer", "manageUsers"],
    Transportations: ["Location_Bauer"],
    Sites: ["Sites"],
    Equipments: ["Equipments"],
    Orders: ["AppGetFiles", "AppCheck", "OrdersFile"],
    Stocks: ["Maintenance_Stocks"],
    StocksList: [],
    StockRes: [
      "AppNotification",
      "AppStocksTransition",
      "AppStocks",
      "StockTransition",
      "AppPlaceOrder",
      "stocksRecieve",
      "stocksExchange",
      "stocksNewItem",
      "stocksPlaceOrder",
      "confirmOrder",
      "Bauer_Equipments",
    ],
    Tables: [],
    OilSamples: ["AppGetFiles", "AppCheck", "OilSamplesFile"],
    OilSamplesAnalyzed: ["AppGetFiles", "AppCheck", "OilSamplesAnalyzedFile"],
    Catalogues: [],
  },
};

module.exports = { authapp };
