import React, { createContext, useState, useEffect } from "react";

export const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);

  // URL de la API (CRA usa REACT_APP_*)
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  //  Cargar turnos al inicio
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch(`${API_URL}/turnos/turnos/`);
        if (!res.ok) throw new Error("Error al cargar turnos");
        const data = await res.json();
        setTurnos(data);
      } catch (err) {
        console.error(err);
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

  const logout = () => {
    setUser(null);
  };

  //  Crear turno en el backend
  const agregarTurno = async (turno) => {
    try {
      const res = await fetch(`${API_URL}/turnos/turnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turno),
      });
      if (!res.ok) throw new Error("Error al crear turno");
      const nuevoTurno = await res.json();
      setTurnos((prev) => [...prev, nuevoTurno]);
    } catch (err) {
      console.error(err);
    }
  };

  //  Eliminar turno
  const eliminarTurno = async (id) => {
    try {
      const res = await fetch(`${API_URL}/turnos/turnos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar turno");
      setTurnos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  //  Asignar turno a trabajador
  const asignarTurno = async (id, trabajador) => {
    try {
      const res = await fetch(`${API_URL}/turnos/turnos/${id}/asignar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trabajador }),
      });
      if (!res.ok) throw new Error("Error al asignar turno");
      const turnoActualizado = await res.json();
      setTurnos((prev) =>
        prev.map((t) => (t.id === id ? turnoActualizado : t))
      );
    } catch (err) {
      console.error(err);
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
