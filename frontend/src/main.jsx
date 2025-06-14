import React from "react";
import ReactDOM from "react-dom";
// import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import "./App.css";
import App from "./App";
import { ContextProvider } from "./contexts/NavContext";

ReactDOM.render(
  <BrowserRouter>
    <ContextProvider>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </ContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
