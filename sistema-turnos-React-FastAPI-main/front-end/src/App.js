// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ClientePage from "./pages/ClientePage";
import TrabajadorPage from "./pages/TrabajadorPage";
import AdminPage from "./pages/AdminPage";

import { SucursalesProvider } from "./context/SucursalesContext";
import SucursalesDisplay from "./components/SucursalesDisplay";

import TurnosDisplay from "./components/TurnosDisplay";
import { TurnosProvider } from "./context/TurnosContext"; 

export default function App() {
  return (
    // 👇 Un único provider para toda la app
    <TurnosProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/cliente" element={<ClientePage />} />
          <Route path="/trabajador" element={<TrabajadorPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route
            path="/sucursales"
            element={
              <SucursalesProvider>
                <SucursalesDisplay />
              </SucursalesProvider>
            }
          />

          {/* (Opcional) ver turnos en ruta dedicada */}
          <Route path="/turnos" element={<TurnosDisplay />} />
        </Routes>
      </Router>
    </TurnosProvider>
  );
}
