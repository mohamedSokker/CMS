// MainLoading.jsx
import React from "react";

const MainLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Bouncing Dots Loader */}
      <div className="flex space-x-2">
        <div
          className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>

      {/* Loading Text */}
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Loading...
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full w-3/5 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default MainLoading;
