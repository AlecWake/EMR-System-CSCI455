from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    full_name: str | None = None
    email: str | None = None
    password: str
    clearance: int = 1

class UserResponse(BaseModel):
    user_id: int
    username: str
    full_name: str | None = None
    email: str | None = None
    disabled: bool
    clearance: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str