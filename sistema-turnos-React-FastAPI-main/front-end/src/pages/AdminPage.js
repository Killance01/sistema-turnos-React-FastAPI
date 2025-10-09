
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TurnosDisplay from "../components/TurnosDisplay";
import { TurnosContext } from "../context/TurnosContext";

export default function AdminPage() {
  const navigate = useNavigate();

  const { turnos, asignarTurno, trabajadores } = useContext(TurnosContext);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState("");

  const handleAsignar = (index) => {
    if (trabajadorSeleccionado) {
      asignarTurno(index, trabajadorSeleccionado);
      setTrabajadorSeleccionado("");
    }
  };

  const [mostrarTurnos, setMostrarTurnos] = useState(false);
  return (
    <div className="container mt-4">
      <button className="btn btn-info mb-3 me-2" onClick={() => setMostrarTurnos(!mostrarTurnos)}>
        {mostrarTurnos ? "Ocultar turnos en tiempo real" : "Ver turnos en tiempo real"}
      </button>
  <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>Volver al Login</button>
  {mostrarTurnos && <TurnosDisplay />}
      <h1 className="mb-4">Bienvenido Administrador</h1>
      <h2>Turnos por asignar</h2>
      <table className="table table-bordered">
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
          {turnos.map((turno, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{turno.cliente}</td>
              <td>{turno.tipo}</td>
              <td>{turno.hora}</td>
              <td>{turno.asignadoA ? turno.asignadoA : "Sin asignar"}</td>
              <td>
                {!turno.asignadoA && (
                  <div className="d-flex">
                    <select
                      className="form-select me-2"
                      value={trabajadorSeleccionado}
                      onChange={e => setTrabajadorSeleccionado(e.target.value)}
                    >
                      <option value="">Selecciona trabajador</option>
                      {trabajadores.length === 0 ? (
                        <option disabled>No hay trabajadores conectados</option>
                      ) : (
                        trabajadores.map((cedula, i) => (
                          <option key={i} value={cedula}>{cedula}</option>
                        ))
                      )}
                    </select>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAsignar(idx)}
                      disabled={!trabajadorSeleccionado}
                    >
                      Asignar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}