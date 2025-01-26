# from sqlalchemy import create_engine, MetaData
# from sqlalchemy.orm import declarative_base, sessionmaker

# # DATABASE_URL = "sqlite:///./test.db"

# # engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# # SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# # Base = declarative_base()

from typing import Annotated
from sqlmodel import create_engine, SQLModel, Session
from fastapi import Depends


SQLITE_FILE_NAME = "nexa.db"
DATABASE_URL = f"sqlite:///{SQLITE_FILE_NAME}"

connect_args = {
    "check_same_thread": False
}  # allow SQLite to be accessed by multiple threads
engine = create_engine(DATABASE_URL, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]