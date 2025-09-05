import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TurnosDisplay from "../components/TurnosDisplay";
import { TurnosContext } from "../context/TurnosContext";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import imgPrioritario from "../imagenes/Prioritario.webp";
import imgQuejas from "../imagenes/Quejas.png";
import imgNormal from "../imagenes/Normal.avif";

function ClientePage() {
  const navigate = useNavigate();
  const [turno, setTurno] = useState(null);
  const [seleccion, setSeleccion] = useState(null);
  const { agregarTurno, user, turnos } = useContext(TurnosContext);

  // Calcular el número de turno según los turnos globales
  const generarTurno = (tipo) => {
    let prefijo = tipo === "prioritario" ? "P" : tipo === "queja" ? "Q" : "N";
    // Filtrar turnos globales por tipo para calcular el número
    let numero = turnos.filter(t => t.tipo === tipo).length + 1;
    let nuevoTurno = `${prefijo}-${numero.toString().padStart(2, "0")}`;
    setTurno(nuevoTurno);
    setSeleccion(tipo);
    // Agregar al contexto global
    agregarTurno({
      cliente: user?.id || "SinID",
      tipo,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const opciones = [
    {
      tipo: "prioritario",
      titulo: "Turno Prioritario",
      descripcion: "Atención rápida para personas con prioridad.",
      img: imgPrioritario,
      color: "danger",
    },
    {
      tipo: "queja",
      titulo: "Turno Queja",
      descripcion: "Registre sus inconformidades o reclamos.",
      img: imgQuejas,
      color: "warning",
    },
    {
      tipo: "normal",
      titulo: "Turno Normal",
      descripcion: "Atención regular en orden de llegada.",
      img: imgNormal,
      color: "primary",
    },
  ];

  const [mostrarTurnos, setMostrarTurnos] = useState(false);
  return (
    <div className="p-4 text-center">
      <button className="btn btn-info mb-3 me-2" onClick={() => setMostrarTurnos(!mostrarTurnos)}>
        {mostrarTurnos ? "Ocultar turnos en tiempo real" : "Ver turnos en tiempo real"}
      </button>
  <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>Volver al Login</button>
  {mostrarTurnos && <TurnosDisplay />}
      <h1 className="fw-bold mb-5 text-primary">
        🎟️ Seleccione el tipo de turno
      </h1>

  {/* Grid responsivo */}
      <Row className="g-4 justify-content-center">
        {opciones.map((op, index) => (
          <Col
            key={index}
            xs={12}
            sm={6}
            md={4}
            className="d-flex justify-content-center"
          >
            <Card
              className="shadow-lg border-0 rounded-4"
              style={{
                width: "15rem",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Card.Img
                variant="top"
                src={op.img}
                style={{ height: "140px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">{op.titulo}</Card.Title>
                <Card.Text className="text-muted">{op.descripcion}</Card.Text>

                {seleccion === op.tipo && turno ? (
                  <div className="bg-light p-2 rounded-3 mt-2 shadow-sm">
                    <h6 className="mb-1">
                      Su turno: <span className="text-primary fw-bold">{turno}</span>
                    </h6>
                    <small className="d-block">
                      Personas antes que usted: <strong>{turnos.filter(t => t.tipo === seleccion).length - 1}</strong>
                    </small>
                    <small>
                      Tiempo de espera: <strong>{(turnos.filter(t => t.tipo === seleccion).length - 1) * 5} min</strong>
                    </small>
                  </div>
                ) : (
                  <Button
                    variant={op.color}
                    onClick={() => generarTurno(op.tipo)}
                    disabled={!!turno}
                    className="w-100 rounded-3 mt-2"
                  >
                    Seleccionar
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensaje de aviso si ya hay un turno */}
      {turno && (
        <Alert variant="info" className="mt-5 shadow rounded-3">
          ✅ Ya tiene un turno asignado:{" "}
          <strong className="text-primary">{turno}</strong>.  
          Espere a ser atendido antes de pedir otro.
        </Alert>
      )}
    </div>
  );
}

export default ClientePage;








