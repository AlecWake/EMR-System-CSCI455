from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from database import Base

class BillingInvoice(Base):
    __tablename__ = "billing_invoices"

    billing_invoice_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.appointment_id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    payment_status = Column(String, nullable=False)
    billing_notes = Column(String, nullable=True)

    patient = relationship("Patient")
    appointment = relationship("Appointment")