import React from "react";

const PageLoading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[999999999999] flex items-center justify-center bg-black/70 backdrop-blur-md transition-colors duration-300">
      <div className="dark:bg-gray-800/90 bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 flex flex-col items-center space-y-6 transition-all duration-300 ease-in-out">
        {/* Custom Spinner */}
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-full animate-bounce bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-400 dark:to-purple-400"></div>
          <div
            className="w-4 h-4 rounded-full animate-bounce bg-gradient-to-r from-pink-300 to-yellow-300 dark:from-pink-400 dark:to-yellow-400"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-4 h-4 rounded-full animate-bounce bg-gradient-to-r from-green-300 to-blue-300 dark:from-green-400 dark:to-blue-400"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Message */}
        <p className="text-lg sm:text-xl font-medium text-center max-w-xs animate-pulse tracking-wide dark:text-white text-white">
          {message}
        </p>
      </div>
    </div>
  );
};

export default PageLoading;
