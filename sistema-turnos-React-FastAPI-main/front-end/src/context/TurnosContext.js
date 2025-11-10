import React, { createContext, useState, useEffect } from "react";

export const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  // ---- cargar turnos y sucursales ----
  const fetchTurnos = async () => {
    const res = await fetch(`${API_URL}/turnos`);
    if (!res.ok) throw new Error("Error al cargar turnos");
    const data = await res.json();
    setTurnos(Array.isArray(data) ? data : []);
  };

  const fetchSucursales = async () => {
    const res = await fetch(`${API_URL}/sucursales`);
    if (!res.ok) throw new Error("Error al cargar sucursales");
    const data = await res.json();
    setSucursales(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTurnos().catch(console.error);
    fetchSucursales().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  // ---- auth mínima ----
  const login = (id, role) => {
    setUser({ id, role });
    if (role === "empleado" && !trabajadores.includes(id)) {
      setTrabajadores((prev) => [...prev, id]);
    }
  };
  const logout = () => setUser(null);

  // ---- Turnos CRUD ----
  const agregarTurno = async (turno) => {
    const res = await fetch(`${API_URL}/turnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turno),
    });
    if (!res.ok) throw new Error(`Error al crear turno (${res.status})`);
    const nuevo = await res.json();
    setTurnos((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const eliminarTurno = async (id) => {
    const res = await fetch(`${API_URL}/turnos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error al eliminar turno (${res.status})`);
    setTurnos((prev) => prev.filter((t) => t.id !== id));
  };

  const asignarTurno = async (id, trabajador) => {
    id = Number(id);
    if (!id) throw new Error("ID inválido");
    const res = await fetch(`${API_URL}/turnos/${id}/asignar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trabajador }),
    });
    if (!res.ok) throw new Error(`Error al asignar turno (${res.status})`);
    const upd = await res.json();
    setTurnos((prev) => prev.map((t) => (t.id === id ? upd : t)));
    return upd;
  };

  // ---- Sucursales: crear y asignar a turno ----
  const crearSucursal = async ({ nombre, direccion = null, ciudad = null, activa = true }) => {
    const res = await fetch(`${API_URL}/sucursales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, direccion, ciudad, activa }),
    });
    if (!res.ok) throw new Error(`Error al crear sucursal (${res.status})`);
    const nueva = await res.json();
    setSucursales((prev) => [...prev, nueva]);
    return nueva;
  };

  const asignarSucursalATurno = async (turnoId, sucursalId) => {
    turnoId = Number(turnoId);
    sucursalId = Number(sucursalId);
    if (!turnoId || !sucursalId) throw new Error("IDs inválidos");
    const res = await fetch(`${API_URL}/turnos/${turnoId}/sucursal`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sucursal_id: sucursalId }),
    });
    if (!res.ok) throw new Error(`Error al asignar sucursal (${res.status})`);
    const upd = await res.json();
    setTurnos((prev) => prev.map((t) => (t.id === turnoId ? upd : t)));
    return upd;
  };

  return (
    <TurnosContext.Provider
      value={{
        user, login, logout,
        turnos, agregarTurno, eliminarTurno, asignarTurno,
        trabajadores,
        sucursales, crearSucursal, asignarSucursalATurno,
        refreshTurnos: fetchTurnos,
        refreshSucursales: fetchSucursales,
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
};

