import { useEffect, useState } from "react";
import { regix } from "../Model/model";

const Name = ({ data, setData, setCategoryCount, categoryCount, allData }) => {
  const [tables, setTables] = useState(null);

  // Populate table names once
  useEffect(() => {
    // if (!tables && allData?.Table) {
    const result = allData?.Table?.map((item) => item.TABLE_NAME);
    setTables(result);
    // }
  }, [allData.Table]);

  const isValid = regix.nvarChar255.test(data?.Name);
  const isUnique = !tables?.includes(data?.Name);
  const canProceed = data.Name && isValid && isUnique;

  return (
    <div
      className="w-full h-full flex flex-col justify-between transition-transform duration-500 ease-in-out flex-shrink-0 flex-grow-0"
      style={{
        transform: `translateX(-${100 * categoryCount}%)`,
      }}
    >
      {/* Input Card */}
      <div className="flex flex-col items-center p-4 md:p-6 w-full max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Enter Table Name
        </h2>

        {/* Input Field */}
        <div className="w-full mb-6">
          <label
            htmlFor="table-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Table Name
          </label>
          <input
            id="table-name"
            type="text"
            className={`w-full px-4 py-3 rounded-md border ${
              !isValid || !isUnique
                ? "border-red-400 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-500"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300`}
            placeholder="Enter unique name"
            value={data?.Name}
            onChange={(e) =>
              setData((prev) => ({ ...prev, Name: e.target.value }))
            }
          />

          {/* Validation Messages */}
          <div className="mt-2 space-y-1">
            {!isValid && (
              <p className="text-red-500 text-xs">
                Invalid format. Use only letters, numbers, or symbols.
              </p>
            )}
            {!isUnique && (
              <p className="text-red-500 text-xs">
                This name is already taken.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            if (canProceed) {
              setCategoryCount((prev) => prev + 1);
            }
          }}
          disabled={!canProceed}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canProceed
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default Name;
