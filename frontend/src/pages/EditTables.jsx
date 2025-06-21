import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CiWarning } from "react-icons/ci";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
  Search,
  Resize,
  ContextMenu,
  ExcelExport,
  PdfExport,
} from "@syncfusion/ej2-react-grids";

import { Spinner } from "../components";
import { Header } from "../components";
import { useNavContext } from "../contexts/NavContext";
import { CheckEditorRole } from "../Functions/checkEditorRole";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const EditTables = ({ socket }) => {
  const { tableName } = useParams();
  const [tableData, setTableData] = useState([]);
  const [tableGrid, setTableGrid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { closeSmallSidebar, usersData, token, setErrorData, currentMode } =
    useNavContext();
  const axiosPrivate = useAxiosPrivate();

  let grid;

  const getDataWithoutLoading = async () => {
    try {
      const url = `/api/v3/${tableName}`;
      const data = await axiosPrivate(url, { method: "GET" });
      setTableData(data?.data);
      formatColumns(data?.data);
    } catch (err) {
      setErrorData((prev) => [
        ...prev,
        err?.response?.data?.message || err?.message,
      ]);
    }
  };

  useEffect(() => {
    socket.on("appDataUpdate", getDataWithoutLoading);

    return () => {
      socket.off("appDataUpdate", getDataWithoutLoading);
    };
  }, [socket]);

  const formatColumns = (data) => {
    if (!data || data.length === 0) return;
    const keys = Object.keys(data[0]);
    const formattedGrid = keys.map((key) => ({
      field: key,
      headerText: key,
      width: "auto",
      textAlign: "Center",
    }));
    setTableGrid(formattedGrid);
  };

  const toolbarClick = (args) => {
    if (grid) {
      if (args.item.text === "PDF Export") {
        grid.pdfExport();
      } else if (args.item.text === "Excel Export") {
        const keys = Object.keys(tableData[0]);
        const newData = tableData.map((item) => {
          const row = {};
          keys.forEach((key) => {
            row[key] = item[key] ? item[key].toString() : "";
          });
          return row;
        });
        grid.dataSource = newData;
        grid.excelExport();
        grid.dataSource = tableData;
      }
    }
  };

  const rowsSelected = () => {
    if (grid) {
      const selectedrowindex = grid.getSelectedRowIndexes();
      const selectedrecords = grid.getSelectedRecords();
      setSelectedIndex(selectedrowindex[0]);
      setSelectedRow(JSON.stringify(selectedrecords));
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const url = `/api/v3/${tableName}`;
      const data = await axiosPrivate(url, { method: "GET" });
      setTableData(data?.data);
      formatColumns(data?.data);
      setLoading(false);
    } catch (err) {
      setErrorData((prev) => [
        ...prev,
        err?.response?.data?.message || err?.message,
      ]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [tableName, token]);

  const filterOptions = { ignoreAccent: true, type: "Menu" };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner message={`Loading ${tableName} Data`} />
      </div>
    );

  return (
    <div
      className="w-full p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300"
      onClick={closeSmallSidebar}
    >
      <React.Fragment>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <Header category="" title={tableName || "Table"} />
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <GridComponent
            key={currentMode}
            className={currentMode === "Dark" ? "dark-grid" : "light-grid"}
            dataSource={tableData}
            allowPaging
            allowSorting
            allowFiltering={true}
            filterSettings={filterOptions}
            allowResizing={true}
            pageSettings={{ pageSize: 7 }}
            autoFit={true}
            rowSelected={rowsSelected}
            ref={(g) => (grid = g)}
            toolbar={
              usersData[0]?.roles?.Admin ||
              CheckEditorRole(tableName, usersData)
                ? [
                    "Add",
                    "Edit",
                    "Delete",
                    "Search",
                    "ExcelExport",
                    "PdfExport",
                  ]
                : ["ExcelExport", "PdfExport", "Search"]
            }
            toolbarClick={toolbarClick}
            editSettings={{
              allowDeleting:
                usersData[0]?.roles?.Admin ||
                CheckEditorRole(tableName, usersData),
              allowEditing:
                usersData[0]?.roles?.Admin ||
                CheckEditorRole(tableName, usersData),
              allowAdding:
                usersData[0]?.roles?.Admin ||
                CheckEditorRole(tableName, usersData),
            }}
            allowExcelExport={true}
            allowPdfExport={true}
            exportAllData={true}
            actionComplete={async (args) => {
              try {
                if (
                  !usersData[0]?.roles?.Admin &&
                  !CheckEditorRole(tableName, usersData)
                ) {
                  throw new Error(`You are not authorized to edit tasks`);
                }

                if (args.requestType === "delete") {
                  await axiosPrivate(
                    `/api/v3/${tableName}/${JSON.parse(selectedRow)[0]["ID"]}`,
                    { method: "DELETE" }
                  );
                } else if (
                  args.action === "edit" &&
                  args.requestType === "save"
                ) {
                  await axiosPrivate(
                    `/api/v3/${tableName}/${JSON.parse(selectedRow)[0]["ID"]}`,
                    {
                      method: "PUT",
                      data: JSON.stringify(grid.currentViewData[selectedIndex]),
                    }
                  );
                } else if (
                  args.action === "add" &&
                  args.requestType === "save"
                ) {
                  const data = args.data;
                  delete data.ID;
                  const result = {};
                  Object.keys(data).forEach((key) => {
                    result[key] = data[key] || "";
                  });

                  await axiosPrivate(`/api/v3/${tableName}`, {
                    method: "POST",
                    data: JSON.stringify(result),
                  });
                }
              } catch (err) {
                setErrorData((prev) => [
                  ...prev,
                  err?.response?.data?.message || err?.message,
                ]);
              }
            }}
          >
            <ColumnsDirective>
              {tableGrid.map((col, index) => (
                <ColumnDirective key={index} {...col} />
              ))}
            </ColumnsDirective>
            <Inject
              services={[
                Page,
                Toolbar,
                Selection,
                Edit,
                Sort,
                Filter,
                Search,
                Resize,
                ContextMenu,
                ExcelExport,
                PdfExport,
              ]}
            />
          </GridComponent>
        </div>
      </React.Fragment>
    </div>
  );
};

export default EditTables;
