# @app.post("/sizes/", response_model=Size)
# def create_size(size: Size):
#     with Session(engine) as session:
#         session.add(size)
#         session.commit()
#         session.refresh(size)
#         return size

# @app.get("/sizes/", response_model=List[Size])
# def read_sizes():
#     with Session(engine) as session:
#         sizes = session.exec(select(Size)).all()
#         return sizes

from fastapi import APIRouter, Depends, HTTPException
from database import SessionDep
from models import Size
from sqlmodel import select, SQLModel
from typing import List

router = APIRouter(prefix="/sizes", tags=["sizes"])

@router.post("/", response_model=Size)
def create_size(size: Size, session: SessionDep)->Size:
    session.add(size)
    session.commit()
    session.refresh(size)
    return size

@router.get("/", response_model=List[Size])
def read_sizes(session: SessionDep)->List[Size]:
    sizes = session.exec(select(Size)).all()
    return sizes