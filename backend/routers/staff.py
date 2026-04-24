from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.staff import Staff
from schemas.staff import StaffCreate, StaffResponse

router = APIRouter(prefix="/staff", tags=["Staff"])


@router.post("/", response_model=StaffResponse)
def create_staff(staff: StaffCreate):
    db = SessionLocal()

    new_staff = Staff(
        first_name=staff.first_name,
        last_name=staff.last_name,
        role=staff.role,
        phone=staff.phone,
        email=staff.email
    )

    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    db.close()

    return new_staff


@router.get("/", response_model=list[StaffResponse])
def get_all_staff():
    db = SessionLocal()

    staff_members = db.query(Staff).all()

    db.close()

    return staff_members


@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff(staff_id: int):
    db = SessionLocal()

    staff = db.query(Staff).filter(Staff.staff_id == staff_id).first()

    db.close()

    if staff is None:
        raise HTTPException(status_code=404, detail="Staff member not found")

    return staff