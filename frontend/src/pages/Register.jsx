import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Register = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState(""); // New field
  const [phone, setPhone] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userName || !name || !email || !password || !confirmPassword) {
      setError("Username, Name, Email, and Password are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const userData = {
      UserName: userName,
      Password: password,
      Email: email,
      Phone: phone,
      ProfileImg: profileImg,
      UserRole: JSON.stringify({ Admin: true, Editor: {}, User: {} }),
      Title: title,
      Department: department,
      Token: null,
    };

    try {
      const url = `/api/v1/manageUsers`;
      const response = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify(userData),
      });
      console.log(response);
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setLoading(false);
    }
  };

  return (
    <div
      className={`h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581092160612-3d4d7592bbb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
          filter: "brightness(0.6)",
        }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 dark:bg-gray-900 dark:opacity-60 z-10"></div>

      {/* Scrollable Card Container */}
      <div className="z-20 max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Scrollable Form Area */}
        <div className="max-h-[95dvh] overflow-y-auto p-8 space-y-8 dark:text-white">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Sign up to start managing tasks
            </p>
          </div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded dark:bg-red-900 dark:border-red-600 dark:text-red-200">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
                placeholder="mohamed"
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
                placeholder="mohamed mahmoud"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
                placeholder="you@example.com"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
                placeholder="••••••••"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
                placeholder="01005296634"
              />
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title (Optional)
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
                placeholder="Engineer"
              />
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Department (Optional)
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
                placeholder="IT Support"
              />
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
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
