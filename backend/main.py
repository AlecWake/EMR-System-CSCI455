from fastapi import FastAPI
from database import engine, Base
import models
from routers import patients, appointments, prescriptions, lab_results, correction_requests, billing_invoices, insurance_policies, staff, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(prescriptions.router)
app.include_router(lab_results.router)
app.include_router(correction_requests.router)
app.include_router(billing_invoices.router)
app.include_router(insurance_policies.router)
app.include_router(staff.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "EMR backend running"}