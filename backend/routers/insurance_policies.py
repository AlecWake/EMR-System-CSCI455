from fastapi import APIRouter, HTTPException, Depends
from database import SessionLocal
from models.insurance_policy import InsurancePolicy
from models.patient import Patient
from schemas.insurance_policy import InsurancePolicyCreate, InsurancePolicyResponse
from routers.auth import get_current_user, require_clearance

router = APIRouter(prefix="/insurance", tags=["Insurance"])


@router.post("/", response_model=InsurancePolicyResponse)
def create_insurance_policy(policy: InsurancePolicyCreate, user = Depends(get_current_user)):
    
    if user.clearance == 1 and user.patient_id != policy.patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
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

@router.get("/", response_model=list[InsurancePolicyResponse])
def get_all_insurance_policies(user = Depends(require_clearance(2))):
    db = SessionLocal()

    policies = db.query(InsurancePolicy).all()

    db.close()
    return policies

@router.get("/patient/{patient_id}", response_model=list[InsurancePolicyResponse])
def get_insurance_for_patient(patient_id: int, user = Depends(get_current_user)):
    db = SessionLocal()

    if user.clearance == 1 and user.patient_id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")

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