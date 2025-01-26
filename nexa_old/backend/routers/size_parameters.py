from fastapi import APIRouter, Depends, HTTPException
from database import SessionDep
from models import SizeParameter as SizeParameterModel
from sqlmodel import select, SQLModel


router = APIRouter(prefix="/size_parameters", tags=["size_parameters"])

@router.post("/")
def add_size_parameter(size_parameter: SizeParameterModel, session: SessionDep) -> SizeParameterModel:
    size_parameter_validated = SizeParameterModel.model_validate(size_parameter)
    if size_parameter_validated is None:
        raise HTTPException(status_code=400, detail="Invalid size parameter")
    if session.exec(
        select(SizeParameterModel).where(
            (SizeParameterModel.size_id == size_parameter.size_id)
            & (SizeParameterModel.parameter_name == size_parameter.parameter_name)
        )
    ).first():
        raise HTTPException(status_code=400, detail="Size parameter already exists")
    session.add(size_parameter_validated)
    session.commit()
    session.refresh(size_parameter_validated)
    return size_parameter

@router.get("/")
def list_size_parameters(session: SessionDep) -> list[SizeParameterModel]:
    size_parameters = session.exec(select(SizeParameterModel)).all()
    return size_parameters