from fastapi import FastAPI
from database import engine, Base
import models
from routers import patients, appointments, prescriptions, lab_results, correction_requests, billing_invoices, insurance_policies, staff, auth

app = FastAPI()

Base.metadata.create_all(bind=engine)

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