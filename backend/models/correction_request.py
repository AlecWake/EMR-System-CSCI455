from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class CorrectionRequest(Base):
    __tablename__ = "correction_requests"

    correction_request_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Pending")
    resolution_notes = Column(String, nullable=True)

    patient = relationship("Patient")