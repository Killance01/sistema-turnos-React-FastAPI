import React, { createContext, useState, useEffect } from "react";

export const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);

  // Usa REACT_APP_API_URL si existe, si no usa localhost
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  // --- Cargar turnos al inicio ---
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const url = `${API_URL}/turnos`; // ✅ CORRECTO
        // Debug útil:
        // console.log("➡️ GET", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error al cargar turnos (${res.status})`);
        const data = await res.json();
        setTurnos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setTurnos([]); // evita que quede undefined
      }
    };
    fetchTurnos();
  }, [API_URL]);

  const login = (id, role) => {
    setUser({ id, role });
    if (role === "empleado" && !trabajadores.includes(id)) {
      setTrabajadores((prev) => [...prev, id]);
    }
  };

  const logout = () => setUser(null);

  // --- Crear turno en el backend ---
  const agregarTurno = async (turno) => {
    try {
      const url = `${API_URL}/turnos`; // ✅ CORRECTO
      // console.log("➡️ POST", url, turno);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turno),
      });
      if (!res.ok) throw new Error(`Error al crear turno (${res.status})`);
      const nuevoTurno = await res.json();
      setTurnos((prev) => [...prev, nuevoTurno]);
      return nuevoTurno;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // --- Eliminar turno (requiere endpoint DELETE /turnos/{id}) ---
  const eliminarTurno = async (id) => {
    try {
      const url = `${API_URL}/turnos/${id}`; // ✅ CORRECTO
      // console.log("➡️ DELETE", url);
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error al eliminar turno (${res.status})`);
      setTurnos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // --- Asignar turno (requiere endpoint PUT /turnos/{id}/asignar) ---
  const asignarTurno = async (id, trabajador) => {
    try {
      const url = `${API_URL}/turnos/${id}/asignar`; // ✅ CORRECTO
      // console.log("➡️ PUT", url, { trabajador });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trabajador }),
      });
      if (!res.ok) throw new Error(`Error al asignar turno (${res.status})`);
      const turnoActualizado = await res.json();
      setTurnos((prev) => prev.map((t) => (t.id === id ? turnoActualizado : t)));
      return turnoActualizado;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <TurnosContext.Provider
      value={{
        user,
        login,
        logout,
        turnos,
        agregarTurno,
        eliminarTurno,
        asignarTurno,
        trabajadores,
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
};
