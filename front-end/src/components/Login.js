// src/components/Login.js
import React, { useState, useContext } from "react";
import { TurnosContext } from "../context/TurnosContext";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form } from "react-bootstrap";

export default function Login() {
  const { login } = useContext(TurnosContext);
  const [id, setId] = useState("");
  const [role, setRole] = useState("cliente");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(id, role);

    if (role === "cliente") navigate("/cliente");
    if (role === "empleado") navigate("/trabajador");
    if (role === "admin") navigate("/admin");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg rounded-4" style={{ width: "22rem" }}>
        <Card.Body>
          <h2 className="text-center fw-bold text-primary mb-4">🔐 Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formId">
              <Form.Label className="fw-semibold">Identificación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formRole">
              <Form.Label className="fw-semibold">Rol</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-3"
              >
                <option value="cliente">Cliente</option>
                <option value="empleado">Empleado</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-bold rounded-3"
            >
              Ingresar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
