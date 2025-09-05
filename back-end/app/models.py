from typing import Optional
from sqlmodel import SQLModel, Field

class TurnoBase(SQLModel):
    cliente: str = Field(index=True)
    tipo: str
    hora: str
    asignadoA: Optional[str] = None

class Turno(TurnoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class TurnoCreate(TurnoBase):
    pass

class TurnoRead(TurnoBase):
    id: int
