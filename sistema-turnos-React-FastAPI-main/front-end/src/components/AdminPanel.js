// src/components/AdminPanel.js
import React, { useContext } from "react";
import { TurnosContext } from "../context/TurnosContext";

export default function AdminPanel() {
  const { turnos, asignarTurno } = useContext(TurnosContext);

  const handleAsignar = async (t, trabajador) => {
    try {
      if (!t?.id) {
        alert("Error: el turno no tiene id válido.");
        console.error("Turno sin id:", t);
        return;
      }
      console.log("➡️ PUT /turnos/" + t.id + "/asignar", { trabajador });
      await asignarTurno(t.id, trabajador);
    } catch (e) {
      console.error(e);
      alert(e.message || "Error al asignar turno");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Turnos por asignar</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Tipo de turno</th>
            <th>Hora</th>
            <th>Asignado a</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {turnos?.length ? (
            turnos.map((t, idx) => (
              <tr key={t.id ?? `row-${idx}`}>
                <td>{idx + 1}</td>
                <td>{t.cliente}</td>
                <td>{t.tipo}</td>
                <td>{t.hora}</td>
                <td>{t.asignadoA || "Sin asignar"}</td>
                <td style={{ minWidth: 260 }}>
                  <select
                    defaultValue=""
                    className="form-select form-select-sm"
                    onChange={(e) => handleAsignar(t, e.target.value)}
                  >
                    <option value="" disabled>Selecciona trabajador</option>
                    <option value="Juan">Juan</option>
                    <option value="María">María</option>
                    <option value="Sofía">Sofía</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay turnos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
