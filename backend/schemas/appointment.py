from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
    patient_id: int
    provider_name: str
    start_time: datetime
    end_time: datetime
    status: str
    reason_for_visit: str | None = None

class AppointmentResponse(BaseModel):
    appointment_id: int
    patient_id: int
    provider_name: str
    start_time: datetime
    end_time: datetime
    status: str
    reason_for_visit: str | None = None

    class Config:
        from_attributes = True