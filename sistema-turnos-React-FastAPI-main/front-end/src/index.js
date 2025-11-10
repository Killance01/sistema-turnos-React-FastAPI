// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TurnosProvider } from "./context/TurnosContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <TurnosProvider>
    <App />
  </TurnosProvider>
);
