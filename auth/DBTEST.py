from database import SessionLocal
from models import UserDB

db = SessionLocal()

users = db.query(UserDB).all()

for u in users:
    print(
        u.username,
        u.clearance,
        u.email,
        u.hashed_password
    )

db.close()
