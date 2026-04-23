from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Prescription(Base):
    __tablename__ = "prescriptions"

    prescription_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.appointment_id"), nullable=False)
    provider_name = Column(String, nullable=False)
    medication_name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    directions = Column(String, nullable=True)
    duration = Column(String, nullable=False)

    patient = relationship("Patient")
    appointment = relationship("Appointment")