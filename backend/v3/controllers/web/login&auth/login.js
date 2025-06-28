const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { getData } = require("../../../helpers/getData");
const { model } = require("../../../model/mainModel");

const loginapp = async (req, res) => {
  try {
    const { username, password } = req.body;
    // var query = "SELECT * FROM AdminUsersApp";
    // let Results = await getData(query);
    // Results = Results.recordsets[0];
    // const Results = await getAllData("AdminUsersApp");
    // const SearchedItems = Results?.find(
    //   (Result) => Result.UserName == username
    // );
    let SearchedItems;
    if (model["AdminUsersApp"]) {
      SearchedItems = model["AdminUsersApp"].find(
        (user) => user.UserName === username
      );
    } else {
      var query = `SELECT TOP 1 * FROM AdminUsersApp WHERE UserName = '${username}'`;
      getData(query).then((result) => {
        SearchedItems = result.recordsets[0][0];
      });
    }

    if (!SearchedItems)
      return res.status(401).json({ message: `No Found Username in DB` });
    bcrypt.compare(password, SearchedItems["Password"], async (err, result) => {
      if (err) return res.status(401).json({ message: err.message });
      if (!result)
        return res.status(401).json({ message: `Password Didn't Match` });
      const Tokenuser = {
        username: username,
        // roles: JSON.parse(SearchedItems["UserRole"]),
        img: SearchedItems["ProfileImg"],
      };
      const user = {
        id: SearchedItems["ID"],
        username: username,
        title: SearchedItems["Title"],
        department: SearchedItems["Department"],
        roles:
          SearchedItems["UserRole"] && SearchedItems["UserRole"] !== ""
            ? JSON.parse(SearchedItems["UserRole"])
            : null,
        img: SearchedItems["ProfileImg"],
      };
      // console.log(user);
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
        // const sites = await getData(query);
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
        // sites?.map((item) => {
        //   allSitesWithName.push({ name: item.Location });
        // });
        // const eqQuery = `SELECT Equipment FROM Bauer_Equipments`;
        // const eqs = await getData(eqQuery);
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
        // eqs?.map((item) => {
        //   allEqsWithName.push({ name: item.Equipment });
        // });
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
      const token = jwt.sign(Tokenuser, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        Tokenuser,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "5000000d",
        }
      );

      // Insert refreshToken to database
      res.header(
        "Access-Control-Allow-Origin",
        "https://cms-frontend-91b2.onrender.com"
      );
      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Headers", "X-Custom-Header");
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 5000000 * 24 * 60 * 60 * 100,
        path: "/",
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({ token: token, user: user });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = loginapp;
