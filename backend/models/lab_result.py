from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class LabResult(Base):
    __tablename__ = "lab_results"

    lab_result_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.appointment_id"), nullable=False)
    test_name = Column(String, nullable=False)
    result_value = Column(String, nullable=False)
    measurement_unit = Column(String, nullable=False)
    result_status = Column(String, nullable=False)

    patient = relationship("Patient")
    appointment = relationship("Appointment")