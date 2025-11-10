// src/pages/SucursalesPage.jsx
import React, { useEffect, useState } from "react";
import { createSucursal, fetchSucursales } from "../api";

export default function SucursalesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    activa: true,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchSucursales()
      .then(setItems)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (k) => (e) => {
    const v = k === "activa" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre.trim(),
        direccion: form.direccion || null,
        ciudad: form.ciudad || null,
        activa: !!form.activa,
      };
      const created = await createSucursal(payload);
      setItems((prev) => [created, ...prev]);
      setForm({ nombre: "", direccion: "", ciudad: "", activa: true });
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Sucursales</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input placeholder="Nombre" value={form.nombre} onChange={onChange("nombre")} required />
        <input placeholder="Dirección" value={form.direccion} onChange={onChange("direccion")} />
        <input placeholder="Ciudad" value={form.ciudad} onChange={onChange("ciudad")} />
        <label>
          <input type="checkbox" checked={form.activa} onChange={onChange("activa")} /> Activa
        </label>
        <button type="submit">Crear sucursal</button>
      </form>

      <hr />
      <ul>
        {items.map((s) => (
          <li key={s.id}>
            <b>{s.nombre}</b> — {s.ciudad || "-"} {s.activa ? "(activa)" : "(inactiva)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
