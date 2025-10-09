from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from sqlalchemy import func
from fastapi.responses import JSONResponse

from ...db import get_session
from ...models import Turno, TurnoCreate, TurnoRead

router = APIRouter(prefix="/turnos", tags=["Turnos"])

@router.post("", response_model=TurnoRead, status_code=status.HTTP_200_OK)
def crear_turno(turno: TurnoCreate, session: Session = Depends(get_session)):
    nuevo_turno = Turno.from_orm(turno)
    session.add(nuevo_turno)
    session.commit()
    session.refresh(nuevo_turno)
    return nuevo_turno

@router.get("/turnos", response_model=List[TurnoRead])
def listar_turnos(
    skip: int = 0,
    limit: int = Query(10, le=100),  # máximo 100 por página
    order_by: Optional[str] = Query(None, regex="^(hora|cliente|tipo)$"),
    cliente: Optional[str] = None,
    tipo: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Turno)

    # Filtros dinámicos
    if cliente:
        query = query.where(Turno.cliente.contains(cliente))
    if tipo:
        query = query.where(Turno.tipo == tipo)

    # Orden
    if order_by:
        query = query.order_by(getattr(Turno, order_by))

    # Paginación
    query = query.offset(skip).limit(limit)

    return session.exec(query).all()

@router.delete("/{turno_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_turno(turno_id: int, session: Session = Depends(get_session)):
    turno = session.get(Turno, turno_id)
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    session.delete(turno)
    session.commit()
    return None

@router.put("/{turno_id}/asignar", response_model=TurnoRead)
def asignar_turno(turno_id: int, trabajador: str, session: Session = Depends(get_session)):
    turno = session.get(Turno, turno_id)
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    turno.asignadoA = trabajador
    session.add(turno)
    session.commit()
    session.refresh(turno)
    return turno

@router.get("/", response_model=list[TurnoRead])
def list_turnos(
    skip: int = 0,
    limit: int = Query(default=10, le=100),
    servicio_id: int | None = None,
    session: Session = Depends(get_session)
):
    query = session.query(Turno)
    if servicio_id:
        query = query.filter(Turno.servicio_id == servicio_id)
    return query.offset(skip).limit(limit).all()
