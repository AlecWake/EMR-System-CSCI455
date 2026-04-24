from pydantic import BaseModel
from datetime import date

class InsurancePolicyCreate(BaseModel):
    patient_id: int
    provider_name: str
    policy_number: str
    coverage_start_date: date
    coverage_end_date: date

class InsurancePolicyResponse(BaseModel):
    insurance_policy_id: int
    patient_id: int
    provider_name: str
    policy_number: str
    coverage_start_date: date
    coverage_end_date: date

    class Config:
        from_attributes = True