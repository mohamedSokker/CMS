import React from "react";
import Dropdown from "./Dropdown";

const ChooseUsers = ({
  setLoading,
  setMessage,
  siteData,
  setAllData,
  allData,
  data,
  setData,
  errorData,
  setError,
  setErrorData,
  tableColumns,
  setTableColumns,
  setCategoryCount,
  categoryCount,
}) => {
  return (
    <div
      className="w-full h-full flex flex-col justify-between transition-transform duration-700 ease-in-out flex-shrink-0 flex-grow-0"
      style={{
        transform: `translateX(-${100 * categoryCount}%)`,
      }}
    >
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8 w-full h-full p-4">
        {/* Left Panel - User Selector Card */}
        <div className="w-full md:w-2/3 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Select Users
          </h2>
          <div className="mt-2 h-[calc(100%-30px)]">
            <Dropdown
              multiple={true}
              setLoading={setLoading}
              setMessage={setMessage}
              label="Users"
              column="UserName"
              siteData={siteData}
              setAllData={setAllData}
              condition={true}
              local={true}
              localData={allData?.Users}
              data={data}
              setData={setData}
              errorData={errorData}
              setError={setError}
              setErrorData={setErrorData}
              tableColumns={tableColumns}
              setTableColumns={setTableColumns}
            />
          </div>
        </div>

        {/* Right Panel - Selected Users Preview */}
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-all">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Chosen Users
          </h3>
          <div
            className={`mt-2 max-h-[240px] overflow-y-auto rounded-lg border border-dashed ${
              data?.Users?.length > 0
                ? "border-gray-300 dark:border-gray-600"
                : "border-red-300 dark:border-red-500"
            } p-4`}
          >
            {data?.Users?.length === 0 ? (
              <p className="text-sm text-red-600 dark:text-red-400 italic">
                No users selected yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {data?.Users?.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-800 dark:text-gray-200 py-1 px-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => setCategoryCount((prev) => prev + 1)}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-lg shadow-md transform transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChooseUsers;
