from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import create_db_and_tables
from .api.routes import turnos

app = FastAPI(title="Sistema de Turnos", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API Sistema de Turnos funcionando"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.include_router(turnos.router)
