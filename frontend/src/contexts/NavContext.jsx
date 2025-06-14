import React, { useContext, createContext, useState, useEffect } from "react";

const navContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [currentMode, setCurrentMode] = useState("Light");
  const [screenSize, setScreenSize] = useState(undefined);
  const [token, setToken] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [error, setError] = useState(false);
  const [errorData, setErrorData] = useState([]);

  const closeSmallSidebar = () => {
    // if (screenSize <= 900) {
    setActiveMenu(false);
    // }
  };

  // useEffect(() => {
  //   if (currentMode === "Dark") {
  //     document.documentElement.classList.add("dark-mode");
  //   } else {
  //     document.documentElement.classList.remove("dark-mode");
  //   }
  // }, [currentMode]);

  return (
    <navContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        currentMode,
        setCurrentMode,
        screenSize,
        setScreenSize,
        closeSmallSidebar,
        token,
        setToken,
        usersData,
        setUsersData,
        error,
        setError,
        errorData,
        setErrorData,
      }}
    >
      {children}
    </navContext.Provider>
  );
};

export const useNavContext = () => useContext(navContext);
