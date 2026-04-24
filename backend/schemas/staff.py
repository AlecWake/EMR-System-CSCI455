from pydantic import BaseModel

class StaffCreate(BaseModel):
    first_name: str
    last_name: str
    role: str
    phone: str | None = None
    email: str | None = None

class StaffResponse(BaseModel):
    staff_id: int
    first_name: str
    last_name: str
    role: str
    phone: str | None = None
    email: str | None = None

    class Config:
        from_attributes = True