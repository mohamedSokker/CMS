const { model } = require("../../../model/mainModel");

const regix = {
  int: /^[0-9]*$/,
  intEmpty: /^$|^[0-9]*$/,
  date: /^(?:\d{4}-\d{2}-\d{2})$/,
  dateEmty: /^$|^(?:\d{4}-\d{2}-\d{2})$/,
  dateTime:
    /^(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(.\d{3})?|(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z))$/,
  dateTimeOrNull:
    /^(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(.\d{3})?|(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z))$/,
  nvarChar255: /^.{0,255}$/,
  nvarchar255Empty: /^$|^.{0,255}$/,
  decimal81: /^\d{1,7}(\.\d{1})?$/,
  "decimal(8,1)": /^\d{1,7}(\.\d{1,})?$/,
  decimal82: /^\d{1,7}(\.\d{2})?$/,
  "decimal(8,2)": /^\d{1,7}(\.\d{1,})?$/,
  text: /^[a-zA-Z0-9\s:,"{}[\]]*$/,
};

const validateData = async (data, savedData, targetData) => {
  let flag = true;
  let message = ``;
  const table = targetData[0].Name;
  const lastID = model[table][model[table].length - 1];

  const columns = Object.keys(targetData[0]?.Fields);
  const excelColumns = Object.keys(data[0]);
  // console.log(savedData);
  // console.log(lastID?.ID);
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].ID);
    excelColumns.map((item) => {
      if (!columns.includes(item) && item !== "ID") {
        flag = false;
        message = `${item} is not a column name`;
      }
    });

    if (flag === false) break;

    if (lastID?.ID && Number(data[i].ID) <= Number(lastID?.ID)) {
      flag = false;
      message = `this ID is found once in database in row ${i + 2}`;
      break;
    }

    Object.keys(targetData[0]?.Fields)?.map((item) => {
      if (targetData[0]?.Fields[item].Type === "DropDown") {
        if (
          !savedData?.[item]?.includes(data[i]?.[item]?.toString()) ||
          !regix?.[targetData[0]?.Fields[item].validateString].test(
            data[i]?.[item]
          )
        ) {
          flag = false;
          message = `${data[i]?.[item]} is not included in row ${
            i + 2
          }  at column ${item}`;
        }
      } else if (targetData[0]?.Fields[item].canBeEmpty) {
        if (
          !regix?.[targetData[0]?.Fields[item].validateString].test(
            data[i]?.[item]
          ) &&
          data[i]?.[item] !== "Null"
        ) {
          flag = false;
          message = `${data[i]?.[item]} is not matching date in row ${
            i + 2
          }  at column ${item}`;
        }
      } else {
        if (
          !regix?.[targetData[0]?.Fields[item].validateString]?.test(
            data[i]?.[item]
          )
        ) {
          // console.log(data[i]);
          flag = false;
          message = `${data[i]?.[item]} is not matching ${
            targetData[0]?.Fields[item].validateString
          } in row ${i + 2} at column ${item}`;
        }
      }
    });

    if (flag === false) break;
    // if (!tools.includes(data[i].Type)) {
    //   flag = false;
    //   message = `Type is not included in row ${i + 2}`;
    //   break;
    // }
    // if (!regix.nvarChar255.test(data[i].Code)) {
    //   flag = false;
    //   message = `Code is not matching nvar255 in row ${i + 2}`;
    //   break;
    // }
    // if (!regix.nvarchar255Empty.test(data[i].Serial)) {
    //   flag = false;
    //   message = `Serial is not matching nvar255empty in row ${i + 2}`;
    //   break;
    // }
    // if (!regix.date.test(data[i].Start_Date)) {
    //   flag = false;
    //   message = `Start Date is not matching date in row ${i + 2}`;
    //   break;
    // }
    // if (!regix.dateEmty.test(data[i].End_Date) && data[i].End_Date !== "Null") {
    //   console.log(data[i].End_Date);
    //   flag = false;
    //   message = `End Date is not matching date in row ${i + 2}`;
    //   break;
    // }
    // if (!regix.int.test(data[i].Start_WH)) {
    //   flag = false;
    //   message = `Start WH is not matching int in row ${i + 2}`;
    //   break;
    // }
    // if (!regix.intEmpty.test(data[i].End_WH) && data[i].End_WH != "Null") {
    //   console.log(data[i].End_WH);
    //   flag = false;
    //   message = `End WH is not matching int in row ${i + 2}`;
    //   break;
    // }
    // if (!sites.includes(data[i].Location)) {
    //   console.log(data[i].Location);
    //   flag = false;
    //   message = `Location is not included in row ${i + 2}`;
    //   break;
    // }
    // if (!eqs.includes(data[i].Equipment)) {
    //   flag = false;
    //   message = `Equipment is not included in row ${i + 2}`;
    //   break;
    // }
  }

  return { flag, message };
};

module.exports = { validateData };
