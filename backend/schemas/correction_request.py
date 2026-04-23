from pydantic import BaseModel

class CorrectionRequestCreate(BaseModel):
    patient_id: int
    description: str

class CorrectionRequestResponse(BaseModel):
    correction_request_id: int
    patient_id: int
    description: str
    status: str
    resolution_notes: str | None = None

    class Config:
        from_attributes = True