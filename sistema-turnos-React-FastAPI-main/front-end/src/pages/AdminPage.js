import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TurnosDisplay from "../components/TurnosDisplay";
import { TurnosContext } from "../context/TurnosContext";

export default function AdminPage() {
  const navigate = useNavigate();
  const { turnos, asignarTurno, trabajadores } = useContext(TurnosContext);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState({});
  const [mostrarTurnos, setMostrarTurnos] = useState(false);

  // asigna usando el ID REAL del turno
  const handleAsignar = async (turnoId) => {
    const trabajador = trabajadorSeleccionado[turnoId] || "";
    if (!turnoId || !trabajador) return;
    try {
      await asignarTurno(turnoId, trabajador);
      // limpia el select solo de ese turno
      setTrabajadorSeleccionado((prev) => ({ ...prev, [turnoId]: "" }));
    } catch (e) {
      console.error(e);
      alert(e.message || "Error al asignar turno");
    }
  };

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
          {turnos.map((t, idx) => (
            <tr key={t.id ?? idx}>
              <td>{idx + 1}</td>
              <td>{t.cliente}</td>
              <td>{t.tipo}</td>
              <td>{t.hora}</td>
              <td>{t.asignadoA || "Sin asignar"}</td>
              <td>
                {!t.asignadoA && (
                  <div className="d-flex">
                    <select
                      className="form-select me-2"
                      value={trabajadorSeleccionado[t.id] || ""}
                      onChange={(e) =>
                        setTrabajadorSeleccionado((prev) => ({
                          ...prev,
                          [t.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecciona trabajador</option>
                      {trabajadores.length === 0 ? (
                        <option disabled>No hay trabajadores conectados</option>
                      ) : (
                        trabajadores.map((cedula, i) => (
                          <option key={i} value={cedula}>
                            {cedula}
                          </option>
                        ))
                      )}
                    </select>

                    <button
                      className="btn btn-primary"
                      onClick={() => handleAsignar(t.id)} 
                      disabled={!trabajadorSeleccionado[t.id]}
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
