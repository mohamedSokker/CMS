import React, { useState, useEffect } from "react";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavContext } from "../../../contexts/NavContext";
import { jsonifyArray } from "../Model/model";

const useDataEntry = () => {
  const { usersData, setError, setErrorData, errorData } = useNavContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(``);
  const [siteData, setSiteData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isExistingTable, setIsExistingTable] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  console.log(allData);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setMessage(`Loading Selection Data...`);
        const URLs = ["/api/v3/AllTables", "/api/v3/AdminUsersApp"];

        const responseData = await Promise.all(
          URLs.map((url) => {
            return axiosPrivate(url, { method: "GET" });
          })
        );

        setSiteData({
          sitesResult: responseData[0].data,
          Users: responseData[1]?.data,
        });

        let sites = [];
        let users = [];
        responseData[0].data?.map((item) => {
          sites.push(item.TABLE_NAME);
        });

        responseData[1].data?.map((item) => {
          users.push(item?.UserName);
        });
        if (sites)
          sites = sites?.filter(
            (value, index, array) => array.indexOf(value) === index
          );

        if (users)
          users = users?.filter(
            (value, index, array) => array.indexOf(value) === index
          );
        setAllData((prev) => ({
          ...prev,
          Table: jsonifyArray(sites, "TABLE_NAME"),
          Users: jsonifyArray(users, "UserName"),
        }));

        setData((prev) => ({
          ...prev,
          Name: "",
          Exist: false,
          Fields: {},
          Schemas: {},
          Users: [],
        }));

        setLoading(false);
      } catch (err) {
        setErrorData((prev) => [
          ...prev,
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.message,
        ]);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return {
    loading,
    setLoading,
    setMessage,
    allData,
    errorData,
    setError,
    setErrorData,
    data,
    setData,
    setAllData,
    message,
    siteData,
    isExistingTable,
    setIsExistingTable,
    tableColumns,
    setTableColumns,
    categoryCount,
    setCategoryCount,
  };
};

export default useDataEntry;
