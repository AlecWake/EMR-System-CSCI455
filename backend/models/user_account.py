from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy import CheckConstraint
from database import Base

class UserAccount(Base):
    __tablename__ = "user_accounts"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    disabled = Column(Boolean, default=False)
    clearance = Column(Integer, nullable=False, default=1)

    __table_args__ = (
        CheckConstraint("clearance >= 1 AND clearance <= 4", name="check_clearance_range"),
    )