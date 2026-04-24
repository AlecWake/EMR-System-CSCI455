from pydantic import BaseModel

class BillingInvoiceCreate(BaseModel):
    patient_id: int
    appointment_id: int
    total_amount: float
    payment_status: str
    billing_notes: str | None = None

class BillingInvoiceResponse(BaseModel):
    billing_invoice_id: int
    patient_id: int
    appointment_id: int
    total_amount: float
    payment_status: str
    billing_notes: str | None = None

    class Config:
        from_attributes = True