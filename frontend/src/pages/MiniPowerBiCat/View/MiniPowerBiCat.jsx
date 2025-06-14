import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { PageLoading } from "../../../components";
import { useNavContext } from "../../../contexts/NavContext";

const MiniPowerBiCat = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { usersData } = useNavContext();

  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState({});

  const getData = async () => {
    try {
      setLoading(true);
      const url = `/api/v3/PowerBiView`;
      const responseData = await axiosPrivate(url, { method: "GET" });
      const viewDataJSON = responseData?.data;

      const result = {};
      viewDataJSON.forEach((item) => {
        const createdUser = item.CreatedBy;
        const viewUser = JSON.parse(item.UsersToView)?.Users || [];

        if ([createdUser, ...viewUser].includes(usersData[0]?.username)) {
          if (!result[item.Group]) {
            result[item.Group] = [];
          }
          result[item.Group].push({
            name: item.Name,
            id: item.ID,
            createdBy: item.CreatedBy,
            users: viewUser,
          });
        }
      });

      setViewData(result);
      setLoading(false);
    } catch (err) {
      console.error(err?.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const url = `/api/v3/PowerBiView/${id}`;
      await axiosPrivate(url, { method: "DELETE" });
      await getData();
    } catch (err) {
      console.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 transition-colors duration-300">
      {loading && <PageLoading message="Loading..." />}

      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Power BI Categories
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Select a report to view
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
        {Object.keys(viewData).length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-16">
            <p className="text-lg text-gray-500 dark:text-gray-400 italic">
              No data available.
            </p>
          </div>
        ) : (
          Object.entries(viewData).map(([group, items]) => (
            <div
              key={group}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-base font-semibold text-white truncate">
                  {group}
                </h2>
              </div>

              {/* List of Reports */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors duration-200"
                  >
                    <TooltipComponent content={item.name} position="LeftTop">
                      <span
                        className="cursor-pointer flex-1 truncate text-gray-800 dark:text-gray-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        onClick={() => navigate(`/MiniPowerBi/${item.id}`)}
                      >
                        {item.name}
                      </span>
                    </TooltipComponent>

                    {[item.createdBy].includes(usersData[0]?.username) && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-3 ml-2 transition-opacity duration-200">
                        <button
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                          onClick={() =>
                            navigate(`/MiniPowerBi/Edit/${item.id}`)
                          }
                          aria-label="Edit"
                        >
                          <AiFillEdit size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MiniPowerBiCat;
