from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext

# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm // TODO implement
from models import User
from database import SessionDep
from sqlmodel import select, SQLModel
import logging

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

logger = logging.getLogger(__name__)


class LoginData(SQLModel):
    username: str
    password: str


class RegisterData(SQLModel):
    username: str
    password: str
    email: str


users = {"testuser": pwd_context.hash("password123")}


# get users from database


@router.post("/login")
def login(login_data: LoginData, session: SessionDep):
    user = session.exec(
        select(User).where(User.username == login_data.username)
    ).first()
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid username")
    if not pwd_context.verify(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid password")

    # Generate a token (for simplicity, we'll use a dummy token here)
    token = "dummy_token"  # Replace with actual token generation logic

    return {
        "message": "Login successful",
        "user": {
            "username": user.username,
            "email": user.email,
            "id": user.id,
            "is_admin": user.is_admin,
            "voted_for": user.voted_for,
            "token": token,
        },
    }


@router.post("/register")
def register(login_data: RegisterData, session: SessionDep):
    logger.info(login_data)
    if session.exec(select(User).where(User.username == login_data.username)).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # if login_data.username in users:
    #     raise HTTPException(status_code=400, detail="Username already taken")
    # users[login_data.username] = pwd_context.hash(login_data.password)
    user = User(
        username=login_data.username,
        hashed_password=pwd_context.hash(login_data.password),
        email=login_data.email,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User created"}
