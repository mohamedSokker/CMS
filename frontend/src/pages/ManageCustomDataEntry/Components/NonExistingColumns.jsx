import { useState } from "react";
import Dropdown from "./Dropdown";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const NonExistingColumns = ({
  setLoading,
  setMessage,
  tableColumns,
  categoryCount,
  data,
  setData,
  errorData,
  setError,
  setErrorData,
  allData,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [currentColumns, setCurrentColumns] = useState({});

  const handleFinish = async () => {
    try {
      setLoading(true);
      setMessage("Creating Table...");
      await axiosPrivate("/api/v3/CustomDataEntryCreateTable", {
        method: "POST",
        data: JSON.stringify(data),
      });

      setMessage("Adding Data...");
      await axiosPrivate("/api/v3/ManageDataEntry", {
        method: "POST",
        data: JSON.stringify({
          Name: data?.Name,
          Users: JSON.stringify(data?.Users),
          Schemas: JSON.stringify(data?.Schemas),
          Fields: JSON.stringify(data?.Fields),
          Exist: data?.Exist,
        }),
      });

      setMessage("Creating Folders...");
      await axiosPrivate("/api/v3/CustomDataEntryCreateFolders", {
        method: "POST",
        data: JSON.stringify({ Name: data?.Name }),
      });

      setMessage("Initializing Excel...");
      await axiosPrivate("/api/v3/CustomDataEntryInitExcel", {
        method: "POST",
        data: JSON.stringify({
          Name: data?.Name,
          Fields: data?.Fields,
        }),
      });

      setLoading(false);
    } catch (err) {
      setErrorData((prev) => [
        ...prev,
        err?.response?.data?.message || err.message,
      ]);
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col transition-transform duration-500 ease-in-out flex-shrink-0 flex-grow-0"
      style={{
        transform: `translateX(-${100 * categoryCount}%)`,
      }}
    >
      {/* Scrollable Section */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-6">
          {tableColumns.map(
            (item, i) =>
              item.name !== "ID" && (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  {/* Column Title */}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                    {item.name}
                  </h3>

                  {/* Grid Layout for Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Type */}
                    <div>
                      {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type
                      </label> */}
                      <Dropdown
                        name={item.name}
                        label="Type"
                        column="Type"
                        condition={true}
                        local={true}
                        localData={[
                          { Type: "DropDown" },
                          { Type: "Int" },
                          { Type: "Decimal" },
                          { Type: "Text" },
                          { Type: "Date" },
                          { Type: "DateTime" },
                        ]}
                        data={data}
                        setData={setData}
                        errorData={errorData}
                        setError={setError}
                        setErrorData={setErrorData}
                      />
                    </div>

                    {/* Length */}
                    <div>
                      {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Length
                      </label> */}
                      <Dropdown
                        name={item.name}
                        label="Length"
                        column="Length"
                        condition={true}
                        local={true}
                        localData={
                          data?.Fields?.[item.name]?.Type === "DropDown" ||
                          data?.Fields?.[item.name]?.Type === "Text"
                            ? [{ Length: "< 255" }, { Length: "> 255" }]
                            : data?.Fields?.[item.name]?.Type === "Int"
                            ? [{ Length: "4 Bytes" }]
                            : data?.Fields?.[item.name]?.Type === "Date"
                            ? [{ Length: "8 Bytes" }]
                            : data?.Fields?.[item.name]?.Type === "DateTime"
                            ? [{ Length: "7" }]
                            : [{ Length: "(8,1)" }, { Length: "(8,2)" }]
                        }
                        data={data}
                        setData={setData}
                        errorData={errorData}
                        setError={setError}
                        setErrorData={setErrorData}
                      />
                    </div>

                    {/* Conditional Fields - DropDown Type */}
                    {data?.Fields?.[item.name]?.Type === "DropDown" && (
                      <>
                        <div>
                          {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            From
                          </label> */}
                          <Dropdown
                            setLoading={setLoading}
                            setMessage={setMessage}
                            name={item.name}
                            label="From"
                            column="TABLE_NAME"
                            condition={true}
                            local={true}
                            localData={allData?.Table}
                            data={data}
                            setData={setData}
                            errorData={errorData}
                            setError={setError}
                            setErrorData={setErrorData}
                            setCurrentColumns={setCurrentColumns}
                          />
                        </div>

                        <div>
                          {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Column
                          </label> */}
                          <Dropdown
                            name={item.name}
                            label="Column"
                            column="name"
                            condition={true}
                            local={true}
                            localData={currentColumns[item.name]}
                            data={data}
                            setData={setData}
                            errorData={errorData}
                            setError={setError}
                            setErrorData={setErrorData}
                            setCurrentColumns={setCurrentColumns}
                          />
                        </div>

                        <div>
                          {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Condition
                          </label> */}
                          <Dropdown
                            name={item.name}
                            label="Condition"
                            column="name"
                            condition={true}
                            local={true}
                            localData={tableColumns}
                            data={data}
                            setData={setData}
                            errorData={errorData}
                            setError={setError}
                            setErrorData={setErrorData}
                            setCurrentColumns={setCurrentColumns}
                          />
                        </div>

                        <div>
                          {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            onDrop Makes Empty
                          </label> */}
                          <Dropdown
                            multiple={true}
                            name={item.name}
                            label="onDropMakesEmpty"
                            column="name"
                            condition={true}
                            local={true}
                            localData={tableColumns}
                            data={data}
                            setData={setData}
                            errorData={errorData}
                            setError={setError}
                            setErrorData={setErrorData}
                            setCurrentColumns={setCurrentColumns}
                          />
                        </div>
                      </>
                    )}

                    {/* Checkboxes for non-DropDown fields */}
                    {data?.Fields?.[item.name]?.Type &&
                      data?.Fields?.[item.name]?.Type !== "" &&
                      data?.Fields?.[item.name]?.Type !== "DropDown" && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-wrap gap-6 mt-4">
                          {/* Can Be Empty Checkbox */}
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!data.Fields[item.name].canBeEmpty}
                              onChange={() =>
                                setData((prev) => ({
                                  ...prev,
                                  Fields: {
                                    ...prev.Fields,
                                    [item.name]: {
                                      ...prev.Fields[item.name],
                                      canBeEmpty:
                                        !data.Fields[item.name].canBeEmpty,
                                    },
                                  },
                                }))
                              }
                              className="rounded text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              Can be Empty
                            </span>
                          </label>

                          {/* Has Check Box Checkbox */}
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!data.Fields[item.name].isCheck}
                              onChange={() =>
                                setData((prev) => ({
                                  ...prev,
                                  Fields: {
                                    ...prev.Fields,
                                    [item.name]: {
                                      ...prev.Fields[item.name],
                                      isCheck: !data.Fields[item.name].isCheck,
                                    },
                                  },
                                }))
                              }
                              className="rounded text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              Has Check Box
                            </span>
                          </label>

                          {/* Validation Exception Checkbox */}
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!data.Fields[item.name].isException}
                              onChange={() =>
                                setData((prev) => ({
                                  ...prev,
                                  Fields: {
                                    ...prev.Fields,
                                    [item.name]: {
                                      ...prev.Fields[item.name],
                                      isException:
                                        !data.Fields[item.name].isException,
                                    },
                                  },
                                }))
                              }
                              className="rounded text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              Validation Exception
                            </span>
                          </label>
                        </div>
                      )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {/* Sticky Footer Button */}
      <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={handleFinish}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default NonExistingColumns;
