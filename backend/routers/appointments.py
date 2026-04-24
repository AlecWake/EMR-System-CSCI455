from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.appointment import Appointment
from models.patient import Patient
from schemas.appointment import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == appointment.patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        provider_name=appointment.provider_name,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
        status=appointment.status,
        reason_for_visit=appointment.reason_for_visit
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    db.close()

    return new_appointment

@router.get("/patient/{patient_id}", response_model=list[AppointmentResponse])
def get_appointments_for_patient(patient_id: int):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    appointments = (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient_id)
        .all()
    )

    db.close()
    return appointments