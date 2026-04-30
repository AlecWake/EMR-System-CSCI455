from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.prescription import Prescription
from models.patient import Patient
from models.appointment import Appointment
from schemas.prescription import PrescriptionCreate, PrescriptionResponse
from routers.auth import require_clearance
from fastapi import Depends

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])


@router.post("/", response_model=PrescriptionResponse)
def create_prescription(
    prescription: PrescriptionCreate,
    user = Depends(require_clearance(3))
):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == prescription.patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    appointment = (
        db.query(Appointment)
        .filter(Appointment.appointment_id == prescription.appointment_id)
        .first()
    )
    if appointment is None:
        db.close()
        raise HTTPException(status_code=404, detail="Appointment not found")

    new_prescription = Prescription(
        patient_id=prescription.patient_id,
        appointment_id=prescription.appointment_id,
        provider_name=prescription.provider_name,
        medication_name=prescription.medication_name,
        dosage=prescription.dosage,
        directions=prescription.directions,
        duration=prescription.duration
    )

    db.add(new_prescription)
    db.commit()
    db.refresh(new_prescription)
    db.close()

    return new_prescription

@router.get("/patient/{patient_id}", response_model=list[PrescriptionResponse])
def get_prescriptions_for_patient(patient_id: int):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.patient_id == patient_id)
        .all()
    )

    db.close()
    return prescriptions