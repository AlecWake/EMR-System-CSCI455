from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.lab_result import LabResult
from models.patient import Patient
from models.appointment import Appointment
from schemas.lab_result import LabResultCreate, LabResultResponse

router = APIRouter(prefix="/lab-results", tags=["Lab Results"])


@router.post("/", response_model=LabResultResponse)
def create_lab_result(lab_result: LabResultCreate):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == lab_result.patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    appointment = (
        db.query(Appointment)
        .filter(Appointment.appointment_id == lab_result.appointment_id)
        .first()
    )
    if appointment is None:
        db.close()
        raise HTTPException(status_code=404, detail="Appointment not found")

    new_lab_result = LabResult(
        patient_id=lab_result.patient_id,
        appointment_id=lab_result.appointment_id,
        test_name=lab_result.test_name,
        result_value=lab_result.result_value,
        measurement_unit=lab_result.measurement_unit,
        result_status=lab_result.result_status
    )

    db.add(new_lab_result)
    db.commit()
    db.refresh(new_lab_result)
    db.close()

    return new_lab_result

@router.get("/patient/{patient_id}", response_model=list[LabResultResponse])
def get_lab_results_for_patient(patient_id: int):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    lab_results = (
        db.query(LabResult)
        .filter(LabResult.patient_id == patient_id)
        .all()
    )

    db.close()
    return lab_results