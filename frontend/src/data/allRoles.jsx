import { FiUserPlus, FiUserMinus, FiUserCheck } from "react-icons/fi";

import { AllTables } from "./AllTables";
import { AllStocks } from "./Tablesdata";
import { dataEntrtArray } from "./dataEntry";
import fetchDataOnly from "../Functions/fetchDataOnly";
import axios from "axios";
import { axiosPrivate } from "../api/axios";

let allEqs = [];
let allSites = [];
let allTablesWithName = [];
let allStocksWithName = [];
let allEqsWithName = [];
let allSitesWithName = [];
const allTables = [];

export const allSitesEqsdata = async (token) => {
  try {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v3/Location_Bauer`;
    const data = await fetchDataOnly(url, "GET", token);
    allSites = [];
    allSitesWithName = [];
    for (let i = 0; i < data.length; i++) {
      allSites.push(data[i].Location);
      allSitesWithName.push({ name: data[i].Location });
    }
    // data.map((item) => {
    //   allSites.push(item.Location);
    //   allSitesWithName.push({ name: item.Location });
    // });

    const eqsURL = `${process.env.REACT_APP_BASE_URL}/api/v3/Bauer_Equipments`;
    const dataEq = await fetchDataOnly(eqsURL, "GET", token);
    allEqs = [];
    allEqsWithName = [];
    for (let j = 0; j < dataEq.length; j++) {
      allEqs.push(dataEq[j].Equipment);
      allEqsWithName.push({ name: dataEq[j].Equipment });
    }
    // dataEq.map((item) => {
    //   allEqs.push(item.Equipment);
    //   allEqsWithName.push({ name: item.Equipment });
    // });
  } catch (error) {
    return [];
  }

  // try {
  //   const eqsURL = `${process.env.REACT_APP_BASE_URL}/api/v1/Bauer_Equipments`;
  //   const dataEq = await fetchDataOnly(eqsURL, "GET", token);
  //   allEqs = [];
  //   allEqsWithName = [];
  //   dataEq.map((item) => {
  //     allEqs.push(item.Equipment);
  //     allEqsWithName.push({ name: item.Equipment });
  //   });
  // } catch (error) {
  //   return [];
  // }
};

const getAllTables = async (token) => {
  const url = `/api/v3/AllTables`;
  const data = await axiosPrivate(url, { method: "GET" });
  allTablesWithName = [];
  const tableData = data?.data;
  for (let j = 0; j < tableData.length; j++) {
    console.log(tableData[j]);
    if (!allTables?.includes(tableData[j].TABLE_NAME))
      allTables.push(tableData[j].TABLE_NAME);
  }

  allTables?.sort((a, b) => {
    if (a == null) return 1;
    if (b == null) return -1;

    return String(a).localeCompare(String(b));
  });
};

export const allData = async (token) => {
  // await allSitesEqsdata(token);
  await getAllTables(token);
  console.log(allTables);
  return {
    Tables: allTables,
    ManageUsers: ["true"],
    CustomDataEntry: ["true"],
    ManageDataEntry: ["true"],
    ManageDatabase: ["true"],
    ManageMiniPowerBi: ["true"],
    MiniPowerBi: ["true"],
  };
};

const allTablesWithNames = async () => {
  allTablesWithName = [];
  allTables.map((table) => {
    allTablesWithName.push({ name: table });
  });
};

// const allStocksWithNames = async () => {
//   allStocksWithName = [];
//   AllStocks.map((stock) => {
//     allStocksWithName.push({ name: stock });
//   });
// };

export const allDataWithName = async () => {
  // await allSitesEqsdata();
  await allTablesWithNames();
  // await allStocksWithNames();
  return {
    Tables: allTablesWithName,
    ManageUsers: [
      { name: "Add User", icon: <FiUserPlus />, dest: "AddUser" },
      { name: "Edit User", icon: <FiUserCheck />, dest: "EditUser" },
      { name: "Delete User", icon: <FiUserMinus />, dest: "DeleteUser" },
    ],
    CustomDataEntry: true,
    ManageDataEntry: true,
    ManageDatabase: true,
    ManageMiniPowerBi: true,
    MiniPowerBi: true,
  };
};
