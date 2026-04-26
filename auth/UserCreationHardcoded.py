from database import SessionLocal
from models import UserDB
from main import get_hash
#!!this is for testing
def create_users():
    db = SessionLocal()

    try:
        # ADMIN (clearance 4)
        admin = UserDB(
            username="admin",
            full_name="System Administrator",
            email="admin@hospital.local",
            hashed_password=get_hash("admin123"),
            disabled=False,
            clearance=4
        )

        # DOCTOR (clearance 3)
        doctor = UserDB(
            username="doctorRobby",
            full_name="Micheal Robinavitch",
            email="doctor@hospital.local",
            hashed_password=get_hash("doctor123"),
            disabled=False,
            clearance=3
        )

        # NURSE (clearance 2)
        nurse = UserDB(
            username="nurseDana",
            full_name="Dana Evans",
            email="nurse@hospital.local",
            hashed_password=get_hash("nurse123"),
            disabled=False,
            clearance=2
        )

        # PATIENT (clearance 1)
        patient = UserDB(
            username="LouieCloverfield",
            full_name="Louie Cloverfield",
            email="patient@hospital.local",
            hashed_password=get_hash("patient123"),
            disabled=False,
            clearance=1
        )

        db.add(admin)
        db.add(doctor)
        db.add(nurse)
        db.add(patient)

        db.commit()

        print("Users created successfully")

    except Exception as e:
        db.rollback()
        print("Error creating users:", e)

    finally:
        db.close()

if __name__ == "__main__":
    create_users()
    print("Users are created")

