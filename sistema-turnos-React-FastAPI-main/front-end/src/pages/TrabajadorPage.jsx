// src/pages/TrabajadorPage.js
import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TurnosDisplay from "../components/TurnosDisplay";
import { TurnosContext } from "../context/TurnosContext";

export default function TrabajadorPage() {
  const navigate = useNavigate();
  const { turnos, user, eliminarTurno } = useContext(TurnosContext);

 
  const turnosAsignados = useMemo(() => {
    if (!user?.id) return [];
    return turnos.filter((t) => String(t.asignadoA) === String(user.id));
  }, [turnos, user]);


  const [turnoIdSel, setTurnoIdSel] = useState("");

  const atenderTurno = async () => {
    const id = Number(turnoIdSel);
    if (!id || Number.isNaN(id)) {
      alert("Selecciona un turno primero.");
      return;
    }
    try {
      await eliminarTurno(id);            
      setTurnoIdSel("");                  
    } catch (e) {
      console.error(e);
      alert(e.message || "No se pudo marcar como atendido");
    }
  };

  const [mostrarTurnos, setMostrarTurnos] = useState(false);

  return (
    <div className="container mt-4">
      <button
        className="btn btn-info mb-3 me-2"
        onClick={() => setMostrarTurnos(!mostrarTurnos)}
      >
        {mostrarTurnos ? "Ocultar turnos en tiempo real" : "Ver turnos en tiempo real"}
      </button>
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
        Volver al Login
      </button>
      {mostrarTurnos && <TurnosDisplay />}

      <h1 className="mb-4">Bienvenido Trabajador</h1>

      <div className="alert alert-info">
        <strong>El día de hoy atiendes los siguientes turnos:</strong>
        <ul className="mb-0">
          {turnosAsignados.length ? (
            turnosAsignados.map((t) => (
              <li key={t.id}>
                {t.tipo} - {t.cliente} ({t.hora})
              </li>
            ))
          ) : (
            <li>No tienes turnos asignados.</li>
          )}
        </ul>
      </div>

      {turnosAsignados.length > 0 && (
        <>
          <label className="form-label mt-3">Selecciona el turno que vas a atender:</label>
          <select
            className="form-select mb-3"
            value={turnoIdSel}
            onChange={(e) => setTurnoIdSel(e.target.value)}
          >
            <option value="">— Seleccionar —</option>
            {turnosAsignados.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tipo}-{t.cliente} ({t.hora})
              </option>
            ))}
          </select>

          {turnoIdSel && (
            <div className="alert alert-success d-flex align-items-center justify-content-between">
              <span>
                Atendiendo turno:{" "}
                <strong>
                  {(() => {
                    const t = turnosAsignados.find((x) => x.id === Number(turnoIdSel));
                    return t ? `${t.tipo}-${t.cliente}` : "";
                  })()}
                </strong>
              </span>
              <button className="btn btn-outline-success ms-3" onClick={atenderTurno}>
                Marcar como atendido
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
