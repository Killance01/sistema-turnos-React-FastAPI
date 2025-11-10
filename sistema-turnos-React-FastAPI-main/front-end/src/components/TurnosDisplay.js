// src/components/TurnosDisplay.jsx  
import React, { useContext } from "react";
import { TurnosContext } from "../context/TurnosContext";

export default function TurnosDisplay() {
  const { turnos } = useContext(TurnosContext);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Turnos en tiempo real</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Hora</th>
            <th>Asignado a</th>
            <th>Sucursal</th> 
          </tr>
        </thead>
        <tbody>
          {turnos.length > 0 ? (
            turnos.map((t, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  {t.id
                    ? t.tipo === "prioritario"
                      ? `P-${t.id}`
                      : t.tipo === "queja"
                      ? `Q-${t.id}`
                      : `N-${t.id}`
                    : "-"}
                </td>
                <td>{t.cliente}</td>
                <td>{t.tipo}</td>
                <td>{t.hora}</td>
                <td>{t.asignadoA ? t.asignadoA : "Sin asignar"}</td>
                <td>
                  {/* Si solo tienes el ID */}
                  {t.sucursal_id
                    ? `S-${t.sucursal_id}`
                    : t.sucursal?.id
                    ? `S-${t.sucursal.id}`
                    : "Sin sucursal"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No hay turnos en el sistema.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

