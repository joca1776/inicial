# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def home():
#     return {"message": "Backend funcionando!"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=5000)


# # # ----------------------------------em cima, backend simples em python. Em baixo backend python conversando com react no front

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Configurar CORS para permitir requisições do frontend
# origins = [
#     "http://localhost:3000",  # URL do React em desenvolvimento
#         "http://localhost:3001",  # React na porta 3001 (atual)

# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
#     allow_headers=["*"],  # Permite todos os headers
# )

# @app.get("/")
# def home():
#     return {"message": "Backend funcionando!"}

# @app.get("/users")
# def get_users():
#     return [
#         {"id": 1, "name": "Alice"},
#         {"id": 2, "name": "Bob"},
#     ]

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=5000)



##--------------------------------ABAIXO, CÓDIGO COM 4 BOTÕES DE CRUD
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# app = FastAPI()

# origins = ["http://localhost:3000", "http://localhost:3003"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class User(BaseModel):
#     id: int
#     name: str

# users = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]

# @app.get("/")
# def home():
#     return {"message": "Backend funcionando!"}

# @app.get("/users")
# def get_users():
#     return users

# @app.post("/users")
# def create_user(user: User):
#     users.append(user.dict())
#     return user

# @app.get("/users/{user_id}")
# def read_user(user_id: int):
#     for user in users:
#         if user["id"] == user_id:
#             return user
#     raise HTTPException(status_code=404, detail="Usuário não encontrado")

# @app.put("/users/{user_id}")
# def update_user(user_id: int, updated_user: User):
#     for i, user in enumerate(users):
#         if user["id"] == user_id:
#             users[i] = updated_user.dict()
#             return updated_user
#     raise HTTPException(status_code=404, detail="Usuário não encontrado")

# @app.delete("/users/{user_id}")
# def delete_user(user_id: int):
#     for i, user in enumerate(users):
#         if user["id"] == user_id:
#             return users.pop(i)
#     raise HTTPException(status_code=404, detail="Usuário não encontrado")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)


# ----------------------- abaixo com banco de dados Mysql


from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# Configurações do MySQL (ajuste com suas credenciais do Cloud SQL)
DATABASE_URL = "mysql+mysqlconnector://root:Jona123!!@localhost:3306/jona_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo do banco de dados
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Modelo Pydantic para entrada e resposta
class UserCreate(BaseModel):
    name: str

class UserResponse(UserCreate):
    id: int

    class Config:
        orm_mode = True

app = FastAPI()

origins = ["http://localhost:3000", "http://localhost:3003"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para obter a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, updated_user: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    user.name = updated_user.name
    db.commit()
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(user)
    db.commit()
    return {"message": "Usuário deletado com sucesso"}
