
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TurnosDisplay from "../components/TurnosDisplay";
import { TurnosContext } from "../context/TurnosContext";

export default function TrabajadorPage() {
  const navigate = useNavigate();
  const { turnos, user, eliminarTurno } = useContext(TurnosContext);
  // Filtrar turnos asignados a este trabajador
  const turnosAsignados = turnos.filter(t => t.asignadoA === user?.id);
  const [turnoActual, setTurnoActual] = useState(null);

  // Marcar turno como atendido
  const atenderTurno = () => {
    if (!turnoActual) return;
    // Buscar el índice del turno actual
    const idx = turnos.findIndex(t => t.codigo === turnoActual && t.asignadoA === user?.id);
    if (idx !== -1) {
      eliminarTurno(idx);
      setTurnoActual(null);
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
      <h1 className="mb-4">Bienvenido Trabajador</h1>
      {turnosAsignados.length > 0 ? (
        <div className="alert alert-info">
          El día de hoy atiendes los siguientes turnos:
          <ul>
            {turnosAsignados.map((t, idx) => (
              <li key={idx}>
                {t.codigo ? t.codigo : `${t.tipo} - ${t.cliente} (${t.hora})`}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="alert alert-warning">No tienes turnos asignados hoy.</div>
      )}

      {turnosAsignados.length > 0 && (
        <div className="mb-4">
          <label className="form-label">Selecciona el turno que vas a atender:</label>
          <select
            className="form-select"
            value={turnoActual || ""}
            onChange={e => setTurnoActual(e.target.value)}
          >
            <option value="">Elige turno</option>
            {turnosAsignados.map((t, idx) => (
              <option key={idx} value={t.codigo ? t.codigo : `${t.tipo}-${t.cliente}`}>{t.codigo ? t.codigo : `${t.tipo}-${t.cliente}`}</option>
            ))}
          </select>
        </div>
      )}

      {turnoActual && (
        <div className="alert alert-success d-flex align-items-center justify-content-between">
          <span>Atendiendo turno: <strong>{turnoActual}</strong></span>
          <button className="btn btn-outline-success ms-3" onClick={atenderTurno}>
            Marcar como atendido
          </button>
        </div>
      )}
    </div>
  );
}
