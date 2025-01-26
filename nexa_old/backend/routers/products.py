from fastapi import APIRouter, Depends, HTTPException
from database import SessionDep
from models import Product, Size, SizeParameter, ProductInput, SizeInput, SizeParameterInput
from sqlmodel import select
from typing import List
import logging

router = APIRouter(prefix="/products", tags=["products"])

logger = logging.getLogger(__name__)

@router.post("/", response_model=Product)
def create_product(product_input: ProductInput, session: SessionDep) -> Product:
    logger.info("Received product input: %s", product_input)

    # Check if the product URL already exists
    existing_product = session.exec(select(Product).where(Product.url == product_input.url)).first()
    if existing_product:
        raise HTTPException(status_code=400, detail="Product with this URL already exists")

    # Convert input models to SQLModel instances
    sizes = []
    for size_input in product_input.sizes:
        parameters = [
            SizeParameter(
                parameter_name=param.parameter_name,
                parameter_value=float(param.parameter_value) if param.parameter_value else None
            )
            for param in size_input.parameters
        ]
        size = Size(size_label=size_input.size_label, parameters=parameters)
        sizes.append(size)

    new_product = Product(
        url=product_input.url,
        image_url=product_input.image_url,
        price=product_input.price,
        name=product_input.name,
        properties=product_input.properties,
        sizes=sizes
    )

    # Add and commit the SQLModel instance
    session.add(new_product)
    session.commit()
    session.refresh(new_product)
    return new_product


@router.get("/", response_model=List[Product])
def read_products(session: SessionDep) -> List[Product]:
    products = session.exec(select(Product)).all()
    return products

@router.get("/{product_id}", response_model=Product)
def read_product(product_id: int, session: SessionDep) -> Product:
    product = session.exec(select(Product).where(Product.id == product_id)).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
