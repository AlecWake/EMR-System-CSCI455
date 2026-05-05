Electronic Medical Record (EMR) System

Overview
This project is a web-based Electronic Medical Record (EMR) system developed for CSCI 455.
It allows patients and staff to manage medical records, appointments, prescriptions, lab results, billing, insurance, and correction requests.
The system uses role-based access control to ensure patients can only view their own data, while staff/admin users can access and manage all records.

Features
Patient registration and record management
Appointment scheduling
Prescription and lab result tracking
Billing and insurance management
Correction request system
Role-based access control (patient vs admin)

Technologies Used
Python
FastAPI
PostgreSQL
SQLAlchemy
HTML, CSS, JavaScript
GitHub

How to Run the Project

Clone the repository
git clone <your-repo-link>
cd EMR-System-CSCI455
Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

Frontend Setup

Option 1 (recommended):
Open project in VS Code
Right click index.html
Click “Open with Live Server”

Option 2:
cd frontend
python -m http.server 5500

Frontend runs on:
http://127.0.0.1:5500

Test Accounts

Admin Account
Username: admin
Password: admin123

This account has full access and can view and manage all system data.

Patient Account
Username: patient1
Password: patient123

This account has restricted access and can only view its own records and submit correction requests.

Notes
PostgreSQL must be installed and running
Database connection is configured in database.py
Ensure correct credentials are set before running
If test accounts do not work, they can be recreated through the API or database

Authors
Alexander Wake
Joshua Lang
Jacob Davis
Logan Evans
