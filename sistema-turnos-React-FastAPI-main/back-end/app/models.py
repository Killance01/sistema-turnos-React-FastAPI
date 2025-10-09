from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class UserBase(SQLModel):
    email: str = Field(index=True)
    full_name: Optional[str] = None
    is_active: bool = True

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    turnos: List["Turno"] = Relationship(back_populates="user")

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    class Config:
        orm_mode = True


class ServicioBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None

class Servicio(ServicioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    turnos: List["Turno"] = Relationship(back_populates="servicio")

class ServicioCreate(ServicioBase):
    pass

class ServicioRead(ServicioBase):
    id: int
    class Config:
        orm_mode = True


class TurnoBase(SQLModel):
    cliente: str = Field(index=True)
    tipo: str
    hora: str
    asignadoA: Optional[str] = None

class Turno(TurnoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    servicio_id: Optional[int] = Field(default=None, foreign_key="servicio.id")
    servicio: Optional[Servicio] = Relationship(back_populates="turnos")
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="turnos")

class TurnoCreate(TurnoBase):
    servicio_id: Optional[int]
    user_id: Optional[int]

class TurnoRead(TurnoBase):
    id: int
    servicio_id: Optional[int]
    user_id: Optional[int]
    class Config:
        orm_mode = True