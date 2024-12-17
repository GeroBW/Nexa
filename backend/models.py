from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON
from typing import Optional, List, Annotated
from pydantic import BaseModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    hashed_password: str = Field(index=True)
    email: str = Field(index=True)
    voted_for: Optional[int] = Field(default=None)
    is_admin: bool = Field(default=False)

class SizeParameter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    size_id: int = Field(foreign_key="size.id")
    parameter_name: str
    parameter_value: Optional[float] = Field(default=None)
    size: "Size" = Relationship(back_populates="parameters")

class Size(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    size_label: str
    parameters: List[SizeParameter] = Relationship(back_populates="size")
    product: "Product" = Relationship(back_populates="sizes")

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str
    image_url: str
    price: str
    name: str
    properties: dict = Field(sa_column=Column(JSON))
    sizes: List[Size] = Relationship(back_populates="product")


class SizeParameterInput(BaseModel):
    parameter_name: str
    parameter_value: str

class SizeInput(BaseModel):
    size_label: str
    parameters: List[SizeParameterInput]

class ProductInput(BaseModel):
    url: str
    image_url: str
    price: str
    name: str
    properties: dict
    sizes: List[SizeInput]