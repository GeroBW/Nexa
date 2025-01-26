# Backend
# Erstelle ein Backend mit einer Datenbank deiner Wahl (z.B. SQLite) und verbinde es über eine
# geeignete API mit dem Frontend.
# 1. Ein Endpoint zum Einloggen. (Du musst nichts so kompliziertes wie Oauth2
# implementieren).
from fastapi import FastAPI, Depends
from routers import auth, products, size_parameters, sizes
from contextlib import asynccontextmanager
from database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
from models import User
from passlib.context import CryptContext
from database import SessionDep, Session, engine
import uvicorn

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


### MOD
@asynccontextmanager
async def lifespan(app: FastAPI):
    # this happens at startup
    create_db_and_tables()  # todo: do migrations here
    with Session(engine) as session:
    #     # Check if admin user already exists
        admin_user = session.query(User).filter(User.username == "admin").first()
        if not admin_user:
            # Create admin user
            user = User(
                username="admin",
                hashed_password=pwd_context.hash("admin"),
                email="admin@example.com",
                is_admin=True,
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            print("Admin user created.")
        else:
            print("Admin user already exists.")
    yield
    # this happens at shutdown


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(size_parameters.router)
app.include_router(sizes.router)    


# 2. Ein Endpoint für die Personenverwaltung
# 3. Ein Endpoint für die Wahlen
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)