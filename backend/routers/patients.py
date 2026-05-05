from fastapi import APIRouter, HTTPException, Depends
from database import SessionLocal
from models.patient import Patient
from schemas.patient import PatientCreate, PatientResponse
from routers.auth import get_current_user
from routers.auth import require_clearance

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("/", response_model=PatientResponse)
def create_patient(patient: PatientCreate):
    db = SessionLocal()

    new_patient = Patient(
        first_name=patient.first_name,
        last_name=patient.last_name,
        date_of_birth=patient.date_of_birth,
        sex=patient.sex,
        phone=patient.phone,
        email=patient.email,
        address=patient.address
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    db.close()

    return new_patient


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, user = Depends(get_current_user)):
    if user.clearance == 1 and user.patient_id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()

    db.close()

    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient

@router.get("/", response_model=list[PatientResponse])
def get_all_patients(user = Depends(require_clearance(2))):
    db = SessionLocal()
    patients = db.query(Patient).all()
    db.close()
    return patients