import React from "react";

const ExistingTable = ({
  setData,
  isExistingTable,
  setIsExistingTable,
  setCategoryCount,
  setTableColumns,
  categoryCount,
}) => {
  return (
    <div
      className="w-full h-full flex flex-col justify-between transition-transform duration-500 ease-in-out flex-shrink-0 flex-grow-0"
      style={{
        transform: `translateX(-${100 * categoryCount}%)`,
      }}
    >
      {/* Checkbox Section */}
      <div className="p-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isExistingTable}
            onChange={() => {
              setIsExistingTable((prev) => !prev);
              setTableColumns([]);
              setData((prev) => ({ ...prev, Exist: !isExistingTable }));
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Use Existing Table
          </span>
        </label>
      </div>

      {/* Next Button */}
      <div className="p-4">
        <button
          onClick={() => {
            setCategoryCount((prev) => prev + 1);
          }}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-md shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExistingTable;
