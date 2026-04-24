from pydantic import BaseModel
from datetime import date

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    sex: str
    phone: str
    email: str
    address: str

class PatientResponse(BaseModel):
    patient_id: int
    first_name: str
    last_name: str
    date_of_birth: date
    sex: str
    phone: str
    email: str
    address: str

    class Config:
        from_attributes = True