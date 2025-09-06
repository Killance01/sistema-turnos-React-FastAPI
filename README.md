# Sistema de Turnos – EPS Colombia

## Elevator Pitch

El proyecto busca solucionar la problemática de desorganización en los sistemas de turnos de las EPS en Colombia.
Muchas veces los usuarios no saben en qué posición están, cuánto falta para ser atendidos o se presentan inconsistencias en el orden.

Este sistema ofrece tanto la visión de los **usuarios afiliados**, como de los **agentes de atención** y **administradores**, mejorando la experiencia de servicio y reduciendo tiempos de espera.

---

## Roles de usuario

* **Afiliado**: Tramita su turno, consulta posición y recibe notificaciones.
* **Agente de atención**: Selecciona y atiende solicitudes activas.
* **Administrador**: Gestiona cuentas de usuarios y agentes.

---

## Arquitectura

* **Frontend**: SPA desarrollada en **React** (React Router, Bootstrap, React-Bootstrap).
* **Backend**: API REST con **FastAPI** + **SQLModel**, persistencia en **SQLite**, y servidor **Uvicorn**.
* Comunicación habilitada con **CORS** (`http://localhost:3000` en desarrollo).

---

## Tecnologías principales

### Frontend

* React / React-DOM
* React Router DOM
* Bootstrap + React-Bootstrap
* Testing Library

### Backend

* FastAPI
* Pydantic / SQLModel
* SQLite
* Uvicorn
* CORS Middleware

---

## Instrucciones de instalación y ejecución

### Backend (FastAPI)

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Killance01/sistema-turnos-React-FastAPI.git
   cd backend
   ```
2. Crear entorno virtual e instalar dependencias:

   ```bash
   python -m venv .venv
   source .venv/bin/activate   # En Linux/Mac
   .venv\Scripts\activate      # En Windows

   pip install -r requirements.txt
   ```
3. Ejecutar el servidor:

   ```bash
   uvicorn main:app --reload
   ```
4. API disponible en: [http://localhost:8000](http://localhost:8000)
   Documentación interactiva: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Frontend (React)

1. Ir al directorio del frontend:

   ```bash
   cd frontend
   ```
2. Instalar dependencias:

   ```bash
   npm install
   ```
3. Ejecutar en modo desarrollo:

   ```bash
   npm start
   ```
4. Disponible en: [http://localhost:3000](http://localhost:3000)

---

## Manejo de errores (Backend)

* **422** → Datos inválidos en la petición.
* **404** → Recurso no encontrado.
* **409** → Conflicto (ejemplo: duplicados en creación de turnos, planeado).

---

## Métricas de éxito (KPIs)

* Rendimiento en múltiples dispositivos.
* Tiempo de respuesta frente a errores.
* Velocidad de desarrollo.
* Tiempo medio de recuperación ante fallas.

---

## Estado del proyecto

* **Implementado:** Autenticación básica, CRUD de turnos, gestión de cuentas.
* **Pendiente:** Respuestas uniformes (`status, data, message`), reportes avanzados y notificaciones automáticas.
