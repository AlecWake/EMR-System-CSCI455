from sqlalchemy import Column, String, Boolean, Integer, CheckConstraint
from database import Base

class UserDB(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    disabled = Column(Boolean, default=False)
    clearance = Column(Integer, default=0, nullable=False) 

__table_args__ = ( CheckConstraint("clearance >= 0 AND clearance <= 4", name="check_clearance_range"), )
