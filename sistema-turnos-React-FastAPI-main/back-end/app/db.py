from sqlmodel import SQLModel, create_engine, Session
from pathlib import Path


DB_FILE = Path(__file__).resolve().parents[1] / "turnos.db"
DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    from . import models 
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

