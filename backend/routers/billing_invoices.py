from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.billing_invoice import BillingInvoice
from models.patient import Patient
from models.appointment import Appointment
from schemas.billing_invoice import BillingInvoiceCreate, BillingInvoiceResponse
from fastapi import APIRouter, HTTPException, Depends
from routers.auth import require_clearance

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.post("/", response_model=BillingInvoiceResponse)
def create_billing_invoice(
    billing: BillingInvoiceCreate,
    user = Depends(require_clearance(4))
):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == billing.patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    appointment = (
        db.query(Appointment)
        .filter(Appointment.appointment_id == billing.appointment_id)
        .first()
    )
    if appointment is None:
        db.close()
        raise HTTPException(status_code=404, detail="Appointment not found")

    new_invoice = BillingInvoice(
        patient_id=billing.patient_id,
        appointment_id=billing.appointment_id,
        total_amount=billing.total_amount,
        payment_status=billing.payment_status,
        billing_notes=billing.billing_notes
    )

    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    db.close()

    return new_invoice

@router.get("/patient/{patient_id}", response_model=list[BillingInvoiceResponse])
def get_billing_for_patient(patient_id: int):
    db = SessionLocal()

    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if patient is None:
        db.close()
        raise HTTPException(status_code=404, detail="Patient not found")

    billing_records = (
        db.query(BillingInvoice)
        .filter(BillingInvoice.patient_id == patient_id)
        .all()
    )

    db.close()
    return billing_records