from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    full_name: str | None = None
    email: str | None = None
    password: str
    clearance: int = 1
    patient_id: int | None = None

class UserResponse(BaseModel):
    user_id: int
    username: str
    full_name: str | None = None
    email: str | None = None
    disabled: bool
    clearance: int
    patient_id: int | None = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    clearance: int
    patient_id: int | None = None