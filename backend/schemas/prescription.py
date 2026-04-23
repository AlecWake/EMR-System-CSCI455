from pydantic import BaseModel

class PrescriptionCreate(BaseModel):
    patient_id: int
    appointment_id: int
    provider_name: str
    medication_name: str
    dosage: str
    directions: str | None = None
    duration: str

class PrescriptionResponse(BaseModel):
    prescription_id: int
    patient_id: int
    appointment_id: int
    provider_name: str
    medication_name: str
    dosage: str
    directions: str | None = None
    duration: str

    class Config:
        from_attributes = True