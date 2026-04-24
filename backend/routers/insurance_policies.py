from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.insurance_policy import InsurancePolicy
from models.patient import Patient
from schemas.insurance_policy import InsurancePolicyCreate, InsurancePolicyResponse

router = APIRouter(prefix="/insurance", tags=["Insurance"])


@router.post("/", response_model=InsurancePolicyResponse)
def create_insurance_policy(policy: InsurancePolicyCreate):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == policy.patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    new_policy = InsurancePolicy(
        patient_id=policy.patient_id,
        provider_name=policy.provider_name,
        policy_number=policy.policy_number,
        coverage_start_date=policy.coverage_start_date,
        coverage_end_date=policy.coverage_end_date
    )

    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    db.close()

    return new_policy

@router.get("/patient/{patient_id}", response_model=list[InsurancePolicyResponse])
def get_insurance_for_patient(patient_id: int):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    policies = (
        db.query(InsurancePolicy)
        .filter(InsurancePolicy.patient_id == patient_id)
        .all()
    )

    db.close()
    return policies