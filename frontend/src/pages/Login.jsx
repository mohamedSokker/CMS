import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { useNavContext } from "../contexts/NavContext";

const Login = () => {
  const { setToken, setUsersData } = useNavContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/handleLoginapp`;
      const response = await axios.post(
        url,
        JSON.stringify({ username: userName, password: password }),
        {
          // headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const userData = response?.data?.user;
      const token = response?.data?.token;

      const enhancedUser = { ...userData };

      if (enhancedUser.roles.Editor.ManageUsers) {
        enhancedUser.roles.Editor["ManageUsers"] = [
          { name: "Add User", dest: "AddUser" },
          { name: "Edit User", dest: "EditUser" },
        ];
        enhancedUser.roles.User["ManageUsers"] = [];
      }

      if (enhancedUser.roles.Editor.ManageAppUsers) {
        enhancedUser.roles.Editor["ManageAppUsers"] = [
          { name: "Add App User", dest: "AddAppUser" },
          { name: "Edit App User", dest: "EditAppUser" },
        ];
        enhancedUser.roles.User["ManageAppUsers"] = [];
      }

      setUsersData([enhancedUser]);
      setToken(token);

      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred during login.";
      setError(errorMessage);
      setLoading(false);

      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* CMMS Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
          backgroundPosition: "center center",
          filter: "brightness(0.6)",
        }}
      ></div>

      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-40 dark:bg-gray-900 dark:opacity-60 z-10"></div>

      {/* Login Form Card */}
      <div className="z-20 max-w-md w-full max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-8 transition-transform transform hover:scale-[1.01] duration-300">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Sign in to access the Management System
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded animate-fadeIn dark:bg-red-900 dark:border-red-600 dark:text-red-200">
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
              placeholder="••••••••"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
