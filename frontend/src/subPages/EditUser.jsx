import React, { useEffect, useState } from "react";
import { AiFillEdit, AiOutlineCheckCircle } from "react-icons/ai";
import { MdDelete, MdArrowBackIosNew } from "react-icons/md";
import { CiWarning } from "react-icons/ci";

import { PageLoading } from "../components";
import { useNavContext } from "../contexts/NavContext";
import { changeData } from "../Functions/changeData";
import UserForm from "./UserForm";
import fetchDataOnly from "../Functions/fetchDataOnly";
import userDefault from "../assets/noprofile.jpeg";

const ITEMS_PER_PAGE = 8;

// Default image URL (you can host or use a local asset)
const DEFAULT_PROFILE_IMG = "/images/default-profile.png"; // Or use a public CDN like https://via.placeholder.com/150

const EditUser = () => {
  const { token } = useNavContext();

  const [loading, setLoading] = useState(false);
  const [isUserChoosen, setIsUserChoosen] = useState(false);
  const [fieldsData, setFieldsData] = useState({});
  const [users, setUser] = useState([]);
  const [error, setError] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [active, setActive] = useState(false);
  const [userData, setUserData] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const currentUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Fetch user data
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(false);
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/manageUsers`;
        const data = await fetchDataOnly(url, "GET", token);
        setUser(data || []);
        setLoading(false);
      } catch (err) {
        setError(true);
        setErrorDetails(err.message || "Failed to load users");
        setLoading(false);
      }
    };
    getData();
  }, [token, active]);

  const getChildData = (field) => {
    setFieldsData(field);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    fieldsData.setError(false);

    if (!fieldsData.checkEmptyFields()) {
      fieldsData.setLoading(true);

      const chunkSize =
        fieldsData.image.size <= 5 * 1024
          ? 1 * 1024
          : fieldsData.image.size <= 10 * 1024 * 1024
          ? 5 * 1024
          : 1000 * 1024;
      const totalChunks = Math.ceil(fieldsData.image.size / chunkSize);
      let start = 0,
        end = 0,
        chunkNumber = 0;

      const uploadNextChunk = async () => {
        if (end <= fieldsData.image.size) {
          const chunk = fieldsData.image.slice(start, end);
          const formData = new FormData();
          formData.append("files", chunk);
          formData.append("chunkNumber", chunkNumber);
          formData.append("totalChunks", totalChunks);
          formData.append("originalname", fieldsData.image.name);

          fetch(
            `${import.meta.env.VITE_BASE_URL}/api/v1/uploadImg?user=${
              fieldsData.userName
            }`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then(() => {
              chunkNumber++;
              start = end;
              end = start + chunkSize;
              uploadNextChunk();
            })
            .catch((err) => {
              console.error("Upload failed:", err.message);
              fieldsData.setError(true);
              fieldsData.setErrorDetails("Image upload failed");
              fieldsData.setLoading(false);
            });
        } else {
          const path = `users/img/`;
          const bodyData = {
            UserName: fieldsData.userName,
            Title: fieldsData.title,
            Department: fieldsData.department,
            Password: fieldsData.password,
            Email: fieldsData.email,
            Phone: fieldsData.phone,
            ProfileImg: `${path}${fieldsData.userName}/${fieldsData.image.name}`,
            UserRole: JSON.stringify(fieldsData.roles),
            Token: "",
          };

          const manageUserData = async () => {
            try {
              const url = `${
                import.meta.env.VITE_BASE_URL
              }/api/v1/manageUsers/${userData?.ID}`;
              await changeData(url, bodyData, "PUT", token);
              setIsSuccess(true);
              setTimeout(() => setIsSuccess(false), 3000);
              fieldsData.setLoading(false);
            } catch (err) {
              fieldsData.setError(true);
              fieldsData.setErrorDetails(err.message);
              fieldsData.setLoading(false);
            }
          };

          manageUserData();
        }
      };

      uploadNextChunk();
    } else {
      fieldsData.setError(true);
      fieldsData.setErrorDetails("All fields are required.");
    }
  };

  const handleDeleteUser = async (ID) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      setError(false);
      const url = `${import.meta.env.VITE_BASE_URL}/api/v1/manageUsers/${ID}`;
      await fetchDataOnly(url, "DELETE", token);
      setActive((prev) => !prev);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(true);
      setErrorDetails(err.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setIsUserChoosen(true);
    setUserData(user);
  };

  return (
    <>
      {loading && <PageLoading />}

      {isUserChoosen ? (
        <div className="w-full mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <button
            onClick={() => setIsUserChoosen(false)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <MdArrowBackIosNew />
            <span>Back</span>
          </button>
          <UserForm
            handleSaveUser={handleSaveUser}
            getChildData={getChildData}
            userData={userData}
          />
        </div>
      ) : (
        <div className="w-full px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Users</h1>

          {/* Users Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center space-y-3 animate-pulse"
                  >
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full blur-sm"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 w-3/4 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 w-1/2 rounded"></div>
                    <div className="flex space-x-4 mt-2">
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))
              : currentUsers.map((user) => (
                  <div
                    key={user.ID}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center space-y-3 transition-transform transform hover:scale-105"
                  >
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/${
                        user.ProfileImg
                      }`}
                      alt="Profile"
                      className="w-16 h-16 object-contain rounded-full blur-sm transition-all duration-300 ease-in-out"
                      onLoad={(e) => e.target.classList.remove("blur-sm")}
                      onError={(e) => {
                        e.target.src = userDefault;
                        e.target.classList.remove("blur-sm");
                      }}
                    />

                    <h3 className="text-sm sm:text-base font-semibold text-center">
                      {user.UserName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                      {user.Email}
                    </p>

                    <div className="flex space-x-4 mt-2">
                      <AiFillEdit
                        onClick={() => handleEditUser(user)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        title="Edit User"
                      />
                      <MdDelete
                        onClick={() => handleDeleteUser(user.ID)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        title="Delete User"
                      />
                    </div>
                  </div>
                ))}
          </div>

          {/* No Users Found */}
          {!loading && !users.length && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No users found. Please check back later.
            </p>
          )}

          {/* Pagination */}
          {users.length > ITEMS_PER_PAGE && (
            <div className="mt-8 flex justify-center flex-wrap gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-bounce">
              <CiWarning className="text-2xl mr-2" />
              <span>{errorDetails}</span>
            </div>
          )}

          {/* Success Notification */}
          {isSuccess && (
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-bounce">
              <AiOutlineCheckCircle className="text-2xl mr-2" />
              <span>User deleted successfully!</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditUser;
