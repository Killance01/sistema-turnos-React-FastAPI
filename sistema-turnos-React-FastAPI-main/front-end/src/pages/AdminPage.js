import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TurnosDisplay from "../components/TurnosDisplay";
import { TurnosContext } from "../context/TurnosContext";

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    turnos, asignarTurno, trabajadores,
    sucursales, crearSucursal, asignarSucursalATurno
  } = useContext(TurnosContext);

  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState({});
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState({});
  const [mostrarTurnos, setMostrarTurnos] = useState(false);

  // form sucursal
  const [nombreSucursal, setNombreSucursal] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleCrearSucursal = async (e) => {
    e.preventDefault();
    if (!nombreSucursal.trim()) return;
    await crearSucursal({ nombre: nombreSucursal.trim(), ciudad: ciudad || null, direccion: direccion || null, activa: true });
    setNombreSucursal(""); setCiudad(""); setDireccion("");
    alert("Sucursal creada");
  };

  const handleAsignarTrabajador = async (turnoId) => {
    const trabajador = trabajadorSeleccionado[turnoId] || "";
    if (!trabajador) return;
    await asignarTurno(turnoId, trabajador);
    setTrabajadorSeleccionado((p) => ({ ...p, [turnoId]: "" }));
  };

  const handleAsignarSucursal = async (turnoId) => {
    const sucId = Number(sucursalSeleccionada[turnoId]);
    if (!sucId) return;
    await asignarSucursalATurno(turnoId, sucId);
    setSucursalSeleccionada((p) => ({ ...p, [turnoId]: "" }));
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-info mb-3 me-2" onClick={() => setMostrarTurnos(!mostrarTurnos)}>
        {mostrarTurnos ? "Ocultar turnos en tiempo real" : "Ver turnos en tiempo real"}
      </button>
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>Volver al Login</button>
      {mostrarTurnos && <TurnosDisplay />}

      <h1 className="mb-4">Bienvenido Administrador</h1>

      {/* ---- Crear Sucursal ---- */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">Agregar nueva sucursal</h4>
          <form className="row g-2" onSubmit={handleCrearSucursal}>
            <div className="col-md-4">
              <input className="form-control" placeholder="Nombre *"
                     value={nombreSucursal} onChange={(e) => setNombreSucursal(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Ciudad"
                     value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
            </div>
            <div className="col-md-5">
              <input className="form-control" placeholder="Dirección"
                     value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </div>
            <div className="col-12">
              <button className="btn btn-success">Crear sucursal</button>
            </div>
          </form>
        </div>
      </div>

      {/* ---- Tabla de turnos con asignación de trabajador y sucursal ---- */}
      <h2>Turnos por asignar</h2>
      <table className="table table-bordered align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Hora</th>
            <th>Asignado a</th>
            <th>Seleccionar trabajador</th>
            <th>Sucursal actual</th>
            <th>Asignar sucursal</th>
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

              {/* seleccionar trabajador */}
              <td>
                <div className="d-flex">
                  <select
                    className="form-select me-2"
                    value={trabajadorSeleccionado[t.id] || ""}
                    onChange={(e) =>
                      setTrabajadorSeleccionado((p) => ({ ...p, [t.id]: e.target.value }))
                    }
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
                    onClick={() => handleAsignarTrabajador(t.id)}
                    disabled={!trabajadorSeleccionado[t.id]}
                  >
                    Asignar
                  </button>
                </div>
              </td>

              {/* sucursal actual */}
              <td>
                {t.sucursal?.nombre
                  ? t.sucursal.nombre
                  : (t.sucursal_id
                      ? `ID ${t.sucursal_id}`
                      : "Sin sucursal")}
              </td>

              {/* asignar sucursal */}
              <td>
                <div className="d-flex">
                  <select
                    className="form-select me-2"
                    value={sucursalSeleccionada[t.id] || ""}
                    onChange={(e) =>
                      setSucursalSeleccionada((p) => ({ ...p, [t.id]: e.target.value }))
                    }
                  >
                    <option value="">Selecciona sucursal</option>
                    {sucursales.length === 0 ? (
                      <option disabled>No hay sucursales</option>
                    ) : (
                      sucursales.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}{s.ciudad ? ` (${s.ciudad})` : ""}
                        </option>
                      ))
                    )}
                  </select>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleAsignarSucursal(t.id)}
                    disabled={!sucursalSeleccionada[t.id]}
                  >
                    Asignar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

