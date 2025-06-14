const jwt = require("jsonwebtoken");

const { getData } = require("../../../helpers/getData");
const { model } = require("../../../model/mainModel");

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: `Failed because no cookie` });
  const refreshToken = cookies.jwt;

  // find user with refresh token in users table in database

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ message: `Failed from verifing refresh token` });
      try {
        const tokenUser = {
          username: decoded.username,
          // roles: decoded.roles,
          img: decoded.img,
        };
        // var query = `SELECT TOP 1 * FROM AdminUsersApp WHERE UserName = '${decoded.username}'`;
        // let Results = await getData(query);
        // Results = Results.recordsets[0];
        let user = {};
        let Results = [];
        if (model["AdminUsersApp"]) {
          Results = model["AdminUsersApp"].filter(
            (user) => user.UserName === decoded.username
          );
        } else {
          var query = `SELECT TOP 1 * FROM AdminUsersApp WHERE UserName = '${decoded.username}'`;
          getData(query).then((result) => {
            Results = result.recordsets[0];
          });
        }
        // const allUsers = await getAllData("AdminUsersApp");
        user = {
          username: decoded.username,
          title: Results[0]["Title"],
          department: Results[0]["Department"],
          roles: JSON.parse(Results[0]["UserRole"]),
          img: decoded.img,
        };

        const token = jwt.sign(tokenUser, process.env.TOKEN_SECRET_KEY, {
          expiresIn: "1h",
        });
        if (user.roles.Admin) {
          let allTablesWithName = [];
          // let allStocksWithName = [];
          // let allEqsWithName = [];
          // let allSitesWithName = [];

          model["AllTables"]?.map((table) => {
            allTablesWithName.push({ name: table?.TABLE_NAME });
          });

          allTablesWithName?.sort((a, b) => {
            if (a?.name == null) return 1;
            if (b?.name == null) return -1;

            return String(a?.name).localeCompare(String(b?.name));
          });

          // AllStocks.map((stock) => {
          //   allStocksWithName.push({ name: stock });
          // });

          // const query = `SELECT Location FROM Location_Bauer`;
          //   const sites = await getData(query);
          // if (model["Location_Bauer"]) {
          //   model["Location_Bauer"]?.map((item) => {
          //     allSitesWithName.push({ name: item.Location });
          //   });
          // } else {
          //   getData(query).then((result) => {
          //     result.recordsets[0]?.map((item) => {
          //       allSitesWithName.push({ name: item.Location });
          //     });
          //   });
          // }
          // const sites = await getAllData("Location_Bauer");

          // const eqQuery = `SELECT Equipment FROM Bauer_Equipments`;
          //   const eqs = await getData(eqQuery);
          // if (model["Bauer_Equipments"]) {
          //   model["Bauer_Equipments"]?.map((item) => {
          //     allEqsWithName.push({ name: item.Equipment });
          //   });
          // } else {
          //   getData(eqQuery).then((result) => {
          //     result.recordsets[0]?.map((item) => {
          //       allEqsWithName.push({ name: item.Equipment });
          //     });
          //   });
          // }
          // const eqs = await getAllData("Bauer_Equipments");

          user.roles.Editor = {
            // Dashboard: true,
            // Kanban: true,
            // Transportations: true,
            // Sites: allSitesWithName,
            // Equipments: allEqsWithName,
            // Orders: [
            //   { name: "Order" },
            //   { name: "Quotation" },
            //   { name: "Confirmation" },
            //   { name: "Invoice" },
            //   { name: "Order_IncompleteItems" },
            //   { name: "Order_Status" },
            //   { name: "OrderInvoice_NotFound" },
            // ],
            // Stocks: [
            //   { name: "Barcode Generation" },
            //   { name: "Barcode Reader" },
            //   { name: "Stock Order" },
            //   { name: "Stocks Consumption" },
            // ],
            // StocksList: allStocksWithName,
            Tables: allTablesWithName,
            // DataEntry: dataEntry,
            // Catalogues: true,
            // OilSamples: true,
            // OilSamplesAnalyzed: true,
            ManageUsers: true,
            // ManageAppUsers: true,
            CustomDataEntry: true,
            ManageDataEntry: true,
            // ManageDatabase: true,
            ManageMiniPowerBi: true,
            MiniPowerBi: true,
          };
        }
        return res.status(200).json({ token: token, user: user });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  );
};

module.exports = { handleRefreshToken };
