// src/api.js
const BASE_URL = "http://localhost:8000"; // ✅ SIN /turnos

async function http(method, path, body) {
  const url = `${BASE_URL}${path}`;
  console.log("➡️ Fetching:", url); // debug
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = (await res.json()).detail || msg; } catch {}
    throw new Error(`${res.status} ${msg}`);
  }
  return res.json();
}

// ---- Turnos ----
export function fetchTurnos() {
  return http("GET", "/turnos");                 // ✅ /turnos (no /turnos/turnos)
}
export function createTurno(payload) {
  return http("POST", "/turnos", payload);       // ✅
}

// ---- Sucursales (por si acaso) ----
export function fetchSucursales() {
  return http("GET", "/sucursales");
}
export function createSucursal(payload) {
  return http("POST", "/sucursales", payload);
}
