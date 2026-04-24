from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    date_of_birth = Column(Date)
    sex = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)

    appointments = relationship("Appointment", back_populates="patient")