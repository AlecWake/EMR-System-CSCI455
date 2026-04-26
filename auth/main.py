from enum import Enum
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import hashlib
from database import get_db
from models import UserDB
from sqlalchemy.orm import Session

#Server startup: uvicorn main:api --reload
#ends with: ctrl+c

SECRET_KEY = "89bed99c4319a419b227f42919c6e5c60bd1cdb5d2793580d41630962a2a58bc3fb3e6982c7a502b89ec3d38b499e2630002c699d5dd1aa735bfced9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

api = FastAPI()

db = {
  "Admin": {
      "Username" : "Admin",
      "full_name" : "Admin",
      "hashed_password" : "c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f",
      "disabled" : False
      }
  }

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    username: str or None = None

class User(BaseModel):
    username: str
    email: str or None = None
    full_name: str or None = None
    disabled: bool or None = None
    clearance: int or None = None
    
class UserInDB(User):
    hashed_password: str
    
pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain, hashed):
    digest = hashlib.sha256(plain.encode("utf-8")).hexdigest()
    return digest #pwd_context.verify(digest, hashed)

def get_hash(password):
    digest = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return digest #pwd_context.hash(digest)

def get_user(db, username: str):
    if username in db:
        return db.query(UserDB).filter(UserDB.username==username).first()
        
def auth_user(db:Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.udtnow() + expires_delta
    else:
        expire = datetime.udtnow() + timedelta(minutes=15)
        
    to_encode.update({"exp" : expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    
async def get_current_user(token: str = Depends(oauth_2_scheme), db: Session = Depends(get_db)):
    credential_exception = HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Could not validate credentials", headers = {"WWW-Authenticate" : "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credential_exception
    
    user = get_user(db, username)
    if user is None:
        raise credential_exception
    return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code, detail="Inactive user!")
    return current_user

@api.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate" : "Bearer"})
    
    access_token_expires = timedelta(miuntes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username,"clearance": user.clearance}, expires_delta=access_token_expires)
    return{"access_token": access_token, "token_type": "bearer"}

def clearance_check(level:int):
    def checker(current_user:UserDB= Depends(get_current_user)):
        if current_user.clearance < level:
            raise HTTPException(
                status_code=403, 
                detail= "Need higher clearance")
        return current_user
    return checker

@api.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@api.get("/users/me/itmes")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return None

pwd = get_hash("Admin")
print(pwd)