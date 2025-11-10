// src/context/SucursalesContext.js
import React, { createContext, useEffect, useState, useCallback } from "react";

export const SucursalesContext = createContext({
  sucursales: [],
  refresh: () => {},
  loading: true,
  error: null,
});

const BASE_URL = "http://localhost:8000"; 

export function SucursalesProvider({ children }) {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSucursales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/sucursales`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setSucursales(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error cargando sucursales");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  const value = {
    sucursales,
    refresh: fetchSucursales,
    loading,
    error,
  };

  return (
    <SucursalesContext.Provider value={value}>
      {children}
    </SucursalesContext.Provider>
  );
}
