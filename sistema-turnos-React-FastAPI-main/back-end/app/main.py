from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import create_db_and_tables
from .api.routers import auth, users, turnos, servicios, health
from .core.errors import register_exception_handlers  
from .core.config import settings
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Header, HTTPException

app = FastAPI(title="Sistema de Turnos", version="0.2.0", debug = True)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# Manejo de error 429
@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Límite de solicitudes excedido!"}
    )

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de manejadores de errores
register_exception_handlers(app)

@app.get("/")
def root():
    return {"message": "API Sistema de Turnos funcionando"}

# Rutas
app.include_router(auth.router)
app.include_router(turnos.router, prefix="/turnos", tags=["turnos"])
app.include_router(servicios.router, prefix="/servicios", tags=["servicios"])
app.include_router(users.router, tags=["users"])
app.include_router(health.router)

# Evento de arranque
@app.on_event("startup")
def on_startup():
    print("Creando tablas en la base de datos si no existen...")
    create_db_and_tables()

