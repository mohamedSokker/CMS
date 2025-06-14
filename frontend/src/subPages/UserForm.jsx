import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { CiWarning } from "react-icons/ci";

import { AllStocks, allDataTitles } from "../data/Tablesdata";
import { allData } from "../data/allRoles";
import { PageLoading } from "../components";
import { useNavContext } from "../contexts/NavContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserForm = ({ handleSaveUser, getChildData, userData }) => {
  const { token } = useNavContext();
  const axiosPrivate = useAxiosPrivate();

  const [allDatas, setAllDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null); // Use null initially for better handling
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");
  const [roles, setRules] = useState({
    Admin: false,
    Editor: {
      ManageUsers: false,
      Tables: [],
      CustomDataEntry: false,
      ManageDataEntry: false,
      ManageMiniPowerBi: false,
      MiniPowerBi: false,
    },
    User: {
      ManageUsers: false,
      Tables: [],
      CustomDataEntry: false,
      ManageDataEntry: false,
      ManageMiniPowerBi: false,
      MiniPowerBi: false,
    },
  });

  const [activeSections, setActiveSections] = useState({});

  // Pass data back to parent
  useEffect(() => {
    getChildData({
      image,
      userName,
      title,
      department,
      password,
      email,
      phone,
      roles,
      error,
      errorDetails,
      setRules,
      setLoading,
      setError,
      setErrorDetails,
      setImage,
      checkEmptyFields,
    });
  }, [roles, userName, title, department, password, email, phone, image]);

  // Fetch data
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await allData(token);
        setAllDatas(data);
        setLoading(false);
      } catch (err) {
        setErrorDetails(err.message || "Failed to load role data");
        setError(true);
        setLoading(false);
      }
    };

    getData();

    if (userData) {
      setUserName(userData.UserName);
      setTitle(userData.Title);
      setDepartment(userData.Department);
      setPassword(userData.Password);
      setEmail(userData.Email);
      setPhone(userData.Phone);
      setRules(JSON.parse(userData.UserRole));

      const getImage = async () => {
        const img = `${import.meta.env.VITE_BASE_URL}/${userData.ProfileImg}`;
        let imgName = userData.ProfileImg.split("/");
        imgName = imgName[imgName.length - 1];
        fetch(img)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], imgName, { type: blob.type });
            setImage(file);
          });
      };
      getImage();
    }
  }, []);

  const uploadImage = (e) => {
    setImage(e.target.files[0]);
  };

  const checkEmptyFields = () => {
    return !userName || !password || !email || !phone || !image;
  };

  const handleCheckboxChange = (e) => {
    const category = e.target.dataset.cat;
    const title = e.target.dataset.title;

    if (typeof roles[category][title] === "boolean") {
      setRules((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [title]: !prev[category][title],
        },
      }));
    } else {
      if (e.target.checked) {
        setRules((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [title]: prev[category][title]
              ? [...prev[category][title], { name: e.target.value }]
              : [{ name: e.target.value }],
          },
        }));
      } else {
        setRules((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [title]: prev[category][title].filter(
              (role) => role.name !== e.target.value
            ),
          },
        }));
      }
    }
  };

  const toggleSection = (key) => {
    setActiveSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {loading && <PageLoading />}
      <div className="dark:bg-gray-900 min-h-screen w-full p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl max-w-7xl mx-auto p-6 space-y-8">
          {/* Profile Upload */}
          <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 w-full text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
              {!image ? (
                <>
                  <AiOutlineCloudUpload className="mx-auto text-4xl text-gray-400" />
                  <p className="mt-2">Click to upload profile picture</p>
                  <p className="text-sm text-gray-400 mt-1">
                    PNG/JPG under 20MB
                  </p>
                  <input
                    type="file"
                    onChange={uploadImage}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="relative h-48 w-full">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </label>

            {/* Form Fields */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="outline-none border-b-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none border-b-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none border-b-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="outline-none border-b-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="outline-none border-b-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="outline-none border-b-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Roles Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <input
                id="admin-checkbox"
                type="checkbox"
                checked={roles.Admin}
                onChange={() => {
                  setAdmin(!admin);
                  setRules((prev) => ({ ...prev, Admin: !prev.Admin }));
                }}
                className="w-5 h-5 accent-blue-600"
              />
              <label
                htmlFor="admin-checkbox"
                className="text-lg font-semibold dark:text-white"
              >
                Admin
              </label>
            </div>

            <h2 className="text-2xl font-bold dark:text-white">
              Editor Permissions
            </h2>
            {allDataTitles.map((section) => (
              <div
                key={`editor-${section}`}
                className="border dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  disabled={admin}
                  onClick={() => toggleSection(`editor-${section}`)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-left"
                >
                  {section}
                  {activeSections[`editor-${section}`] ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </button>
                {activeSections[`editor-${section}`] && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800">
                    {allDatas[section]?.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          data-title={section}
                          data-cat="Editor"
                          value={item}
                          checked={
                            typeof roles.Editor[section] === "boolean"
                              ? roles.Editor[section]
                              : !!roles.Editor[section]?.find(
                                  (r) => r.name === item
                                )
                          }
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <h2 className="text-2xl font-bold dark:text-white">
              User Permissions
            </h2>
            {allDataTitles.map((section) => (
              <div
                key={`user-${section}`}
                className="border dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  disabled={admin}
                  onClick={() => toggleSection(`user-${section}`)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-left"
                >
                  {section}
                  {activeSections[`user-${section}`] ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </button>
                {activeSections[`user-${section}`] && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800">
                    {allDatas[section]?.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          data-title={section}
                          data-cat="User"
                          value={item}
                          checked={
                            typeof roles.User[section] === "boolean"
                              ? roles.User[section]
                              : !!roles.User[section]?.find(
                                  (r) => r.name === item
                                )
                          }
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveUser}
                disabled={checkEmptyFields()}
                className={`px-6 py-2 rounded-md font-medium ${
                  checkEmptyFields()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition-colors`}
              >
                Save User
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white flex items-center justify-center gap-2 p-3 z-50">
            <CiWarning className="text-2xl" />
            <span>{errorDetails}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default UserForm;
