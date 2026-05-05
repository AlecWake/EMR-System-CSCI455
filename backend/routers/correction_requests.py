from fastapi import APIRouter, HTTPException, Depends
from database import SessionLocal
from models.correction_request import CorrectionRequest
from models.patient import Patient
from schemas.correction_request import (
    CorrectionRequestCreate,
    CorrectionRequestResponse,
)
from routers.auth import get_current_user, require_clearance

router = APIRouter(prefix="/correction-requests", tags=["Correction Requests"])


@router.post("/", response_model=CorrectionRequestResponse)
def create_correction_request(correction_request: CorrectionRequestCreate, user = Depends(get_current_user)):
    
    if user.clearance == 1 and user.patient_id != correction_request.patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db = SessionLocal()

    patient = (
        db.query(Patient)
        .filter(Patient.patient_id == correction_request.patient_id)
        .first()
    )
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    new_correction_request = CorrectionRequest(
        patient_id=correction_request.patient_id,
        description=correction_request.description,
        status="Pending",
        resolution_notes=None
    )

    db.add(new_correction_request)
    db.commit()
    db.refresh(new_correction_request)
    db.close()

    return new_correction_request


@router.get("/", response_model=list[CorrectionRequestResponse])
def get_all_correction_requests(user = Depends(require_clearance(2))):
    db = SessionLocal()

    correction_requests = db.query(CorrectionRequest).all()

    db.close()
    return correction_requests
@router.get("/patient/{patient_id}", response_model=list[CorrectionRequestResponse])
def get_correction_requests_for_patient(patient_id: int, user = Depends(get_current_user)):
    
    if user.clearance == 1 and user.patient_id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    correction_requests = (
        db.query(CorrectionRequest)
        .filter(CorrectionRequest.patient_id == patient_id)
        .all()
    )

    db.close()
    return correction_requests