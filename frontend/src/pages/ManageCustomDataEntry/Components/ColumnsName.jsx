import React, { useState } from "react";

const ColumnsName = ({
  categoryCount,
  tableColumns,
  setTableColumns,
  setCategoryCount,
  setData,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [columns, setColumns] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const isUnique = (value, id = null) => {
    const allNames = [
      ...tableColumns.filter((col) => col.id !== id),
      ...columns.filter((col) => col.id !== id),
    ].map((col) => col.name);

    return !allNames.includes(value);
  };

  const isValid = (value) => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(value);

  // Confirm main input field
  const handleConfirmMainInput = () => {
    if (inputValue && isValid(inputValue) && isUnique(inputValue)) {
      setTableColumns((prev) => [
        ...prev,
        { id: Date.now(), name: inputValue, confirmed: true },
      ]);
      setInputValue("");
    }
  };

  // Confirm additional column
  const handleConfirmColumn = (id, value) => {
    if (value && isValid(value) && isUnique(value, id)) {
      setColumns((prev) => prev.filter((col) => col.id !== id));
      setTableColumns((prev) => [
        ...prev,
        { id, name: value, confirmed: true },
      ]);
    }
  };

  // Remove column
  const handleRemoveColumn = (id) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
    setTableColumns((prev) => prev.filter((col) => col.id !== id));
  };

  // Edit column
  const handleEditColumn = (id, value) => {
    setEditingId(id);
    setColumns((prev) => [...prev, { id, name: value }]);
    setTableColumns((prev) => prev.filter((col) => col.id !== id));
  };

  // Add empty editable column
  const handleAddColumn = () => {
    const newId = Date.now();
    setColumns((prev) => [...prev, { id: newId, name: "" }]);
  };

  const handleSubmit = () => {
    const fieldsResult = {};
    tableColumns.forEach((item) => {
      fieldsResult[item.name] = {};
    });

    setData((prev) => ({
      ...prev,
      Schemas: {
        ID: {
          databaseType: "INT NOT NULL IDENTITY(1,1) PRIMARY KEY",
        },
      },
      Fields: fieldsResult,
    }));

    setCategoryCount((prev) => prev + 1);
  };

  return (
    <div
      className="w-full h-full flex flex-col p-4 transition-transform duration-500 ease-in-out flex-shrink-0 flex-grow-0"
      style={{
        transform: `translateX(-${100 * categoryCount}%)`,
      }}
    >
      {/* Header */}
      <div className="flex flex-col w-full mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Define Table Columns
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add as many columns as needed for your table schema.
        </p>
      </div>

      {/* Main Input Row */}
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="w-full flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full">
            <input
              placeholder="Column Name"
              className={`w-full px-4 py-3 rounded-md border ${
                inputValue && (!isValid(inputValue) || !isUnique(inputValue))
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            {/* Validation Messages */}
            <div className="mt-1 space-y-1">
              {inputValue && !isValid(inputValue) && (
                <p className="text-xs text-red-500">
                  Invalid format. Use only letters, numbers, or underscores.
                </p>
              )}
              {inputValue && !isUnique(inputValue) && (
                <p className="text-xs text-red-500">
                  This name is already taken.
                </p>
              )}
            </div>
          </div>

          <button
            disabled={
              !inputValue || !isValid(inputValue) || !isUnique(inputValue)
            }
            onClick={handleConfirmMainInput}
            className={`px-4 py-2 rounded-md font-medium text-white min-w-[120px] transition-colors ${
              inputValue && isValid(inputValue) && isUnique(inputValue)
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>

        {/* Dynamic Columns */}
        {columns.map((col) => (
          <div
            key={col.id}
            className="w-full flex flex-col md:flex-row gap-4 items-start md:items-center"
          >
            <div className="w-full">
              <input
                placeholder="Column Name"
                className={`w-full px-4 py-3 rounded-md border ${
                  col.name &&
                  (!isValid(col.name) || !isUnique(col.name, col.id))
                    ? "border-red-400 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300`}
                value={col.name || ""}
                onChange={(e) =>
                  setColumns((prev) =>
                    prev.map((c) =>
                      c.id === col.id ? { ...c, name: e.target.value } : c
                    )
                  )
                }
              />

              {/* Validation Messages */}
              <div className="mt-1 space-y-1">
                {col.name && !isValid(col.name) && (
                  <p className="text-xs text-red-500">
                    Invalid format. Use only letters, numbers, or underscores.
                  </p>
                )}
                {col.name && !isUnique(col.name, col.id) && (
                  <p className="text-xs text-red-500">
                    This name is already taken.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={
                  !col.name || !isValid(col.name) || !isUnique(col.name, col.id)
                }
                onClick={() => handleConfirmColumn(col.id, col.name)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  col.name && isValid(col.name) && isUnique(col.name, col.id)
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => handleRemoveColumn(col.id)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add Column Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAddColumn}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors focus:outline-none"
          >
            + Add Column
          </button>
        </div>
      </div>

      {/* Confirmed Columns Preview - Scrollable */}
      {tableColumns.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mt-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Confirmed Columns:
          </h3>
          <ul className="max-h-28 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            {tableColumns.map((col) => (
              <li
                key={col.id}
                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {col.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditColumn(col.id, col.name)}
                    className="text-yellow-500 hover:text-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveColumn(col.id)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sticky Next Button */}
      <div className="w-full mt-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="w-full mx-auto">
          <button
            onClick={handleSubmit}
            disabled={tableColumns.length === 0}
            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              tableColumns.length > 0
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnsName;
