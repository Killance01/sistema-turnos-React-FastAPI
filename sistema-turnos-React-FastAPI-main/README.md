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
* **Backend**: API REST con **FastAPI** + **SQLModel**, persistencia en **SQLite** (PostgreSQL recomendado en producción), y servidor **Uvicorn**.
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
* SQLModel / Pydantic
* SQLite (desarrollo) / PostgreSQL (producción)
* Uvicorn
* CORS Middleware
* JWT (PyJWT / python-jose)
* Passlib (hashing de contraseñas)
* Redis (opcional: soporte para rate limiting)

---

## Funcionalidades Backend (2ª entrega)

✅ **Autenticación JWT**

* Endpoints:

  * `POST /auth/register` (registro de usuarios)
  * `POST /auth/login` (login, retorna `access_token`)
  * `GET /me` (requiere JWT, devuelve perfil autenticado)
* Hashing de contraseñas (no se guarda en texto plano).
* Tokens con expiración configurable.

✅ **CRUDs implementados**

* Usuarios (`users`)
* Servicios (`servicios`)
* Turnos (`turnos`) con integridad referencial (FKs).

✅ **Relaciones con FKs y reglas de borrado**

* `User` → `Turnos`
* `Servicio` → `Turnos`.

✅ **Paginación, filtrado y ordenamiento** en listados.

✅ **Rate Limiting**

* Límite de intentos de login/registro por IP.
* Límite general de peticiones autenticadas (ej. 60 req/min).

✅ **Manejo de errores centralizado**

* 401 → No autenticado
* 403 → Prohibido
* 404 → No encontrado
* 422 → Validación fallida
* 429 → Demasiadas peticiones (Rate limit)
* 500 → Error interno

✅ **Healthcheck**

* `GET /health` → `{"status": "ok"}`

✅ **Scripts de inicialización y datos mínimos**

* `scripts/create_tables.py` → crea las tablas.
* `scripts/seed_data.py` → inserta usuarios, servicios y turnos de ejemplo.

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

3. Crear base de datos y cargar datos de prueba:

   ```bash
   python scripts/create_tables.py
   python scripts/seed_data.py
   ```

4. Ejecutar el servidor:

   ```bash
   uvicorn main:app --reload
   ```

5. API disponible en: [http://localhost:8000](http://localhost:8000)
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
* **401** → Credenciales inválidas / token no válido.
* **404** → Recurso no encontrado.
* **429** → Límite de peticiones superado.
* **500** → Error interno.

---

## Métricas de éxito (KPIs)

* Rendimiento en múltiples dispositivos.
* Tiempo de respuesta frente a errores.
* Velocidad de desarrollo.
* Tiempo medio de recuperación ante fallas.

---

## Estado del proyecto

* **Implementado (2ª entrega):**

  * Autenticación JWT
  * CRUD de usuarios, servicios y turnos
  * Relaciones con FKs
  * Paginación, filtros y ordenamiento
  * Rate limiting
  * Manejo centralizado de errores
  * Endpoint `/health`
  * Scripts de inicialización y datos de prueba

* **Pendiente (futuras entregas):**

  * Respuestas uniformes (`status, data, message`)
  * Reportes avanzados
  * Notificaciones en tiempo real (ej. WebSockets o push).

---

👉 Con este `README.md` tu entrega queda **sólida y alineada** con los requisitos.

¿Quieres que también te prepare una **sección final de “Cómo probar rápido con Postman”** para que el profe pueda testear login/register/turnos sin perder tiempo?
