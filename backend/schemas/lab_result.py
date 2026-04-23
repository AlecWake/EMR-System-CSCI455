from pydantic import BaseModel

class LabResultCreate(BaseModel):
    patient_id: int
    appointment_id: int
    test_name: str
    result_value: str
    measurement_unit: str
    result_status: str

class LabResultResponse(BaseModel):
    lab_result_id: int
    patient_id: int
    appointment_id: int
    test_name: str
    result_value: str
    measurement_unit: str
    result_status: str

    class Config:
        from_attributes = True