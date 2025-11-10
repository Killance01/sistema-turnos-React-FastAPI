// src/components/SucursalesDisplay.jsx
import React, { useContext } from "react";
import { SucursalesContext } from "../context/SucursalesContext";

export default function SucursalesDisplay() {
  const { sucursales, loading, error, refresh } = useContext(SucursalesContext);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Sucursales</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={refresh}>
          Actualizar
        </button>
      </div>

      {loading && <div className="alert alert-info">Cargando sucursales...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Dirección</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {!loading && sucursales.length > 0 ? (
            sucursales.map((s, idx) => (
              <tr key={s.id ?? idx}>
                <td>{idx + 1}</td>
                <td>{s.id ? `S-${s.id}` : "-"}</td>
                <td>{s.nombre || "-"}</td>
                <td>{s.ciudad || "-"}</td>
                <td>{s.direccion || "-"}</td>
                <td>
                  {s.activa ? (
                    <span className="badge text-bg-success">Activa</span>
                  ) : (
                    <span className="badge text-bg-secondary">Inactiva</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            !loading && (
              <tr>
                <td colSpan="6" className="text-center">
                  No hay sucursales en el sistema.
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
