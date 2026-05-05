from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from fastapi import Depends

from database import SessionLocal
from models.user_account import UserAccount
from schemas.auth import UserCreate, UserResponse, Token

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

SECRET_KEY = "change-this-secret-key-for-class-project"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def get_password_hash(password: str):
    return pwd_context.hash(password[:72])


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password[:72], hashed_password)


def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate):
    db = SessionLocal()

    existing_user = db.query(UserAccount).filter(UserAccount.username == user.username).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = UserAccount(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        disabled=False,
        clearance=user.clearance,
        patient_id=user.patient_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return new_user


@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()

    user = db.query(UserAccount).filter(UserAccount.username == form_data.username).first()

    if user is None:
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if not verify_password(form_data.password, user.hashed_password):
        db.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if user.disabled:
        db.close()
        raise HTTPException(status_code=400, detail="User account is disabled")

    access_token = create_access_token(
        data={
            "sub": user.username,
            "clearance": user.clearance
        }
    )

    db.close()

    return {
    "access_token": access_token,
    "token_type": "bearer",
    "clearance": user.clearance,
    "patient_id": user.patient_id
}

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate login token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    db = SessionLocal()
    user = db.query(UserAccount).filter(UserAccount.username == username).first()
    db.close()

    if user is None:
        raise credentials_exception

    return user


def require_clearance(required_level: int):
    def clearance_checker(current_user: UserAccount = Depends(get_current_user)):
        if current_user.clearance < required_level:
            raise HTTPException(
                status_code=403,
                detail="Not enough clearance"
            )
        return current_user

    return clearance_checker