// Get patient ID from URL
function getPatientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// NAVBAR links
function attachPatientIdToLinks(id) {

    const patient = document.getElementById("patientLink");
    if (patient) {
        patient.href = `../../patient/patient.html?id=${id}`;
    }

    const prescriptions = document.getElementById("prescriptionsLink");
    if (prescriptions) {
        prescriptions.href = `../../prescription/prescriptions.html?id=${id}`;
    }

    const labResults = document.getElementById("labResultsLink");
    if (labResults) {
        labResults.href = `../../labResult/labResults.html?id=${id}`;
    }

    const billing = document.getElementById("billingLink");
    if (billing) {
        billing.href = `../../billing/billing.html?id=${id}`;
    }

    const corrections = document.getElementById("correctionsLink");
    if (corrections) {
        corrections.href = `../../correction/corrections.html?id=${id}`;
    }

    const insurance = document.getElementById("insuranceLink");
    if (insurance) {
        insurance.href = `../../insurance/insurance.html?id=${id}`;
    }

    const staff = document.getElementById("staffLink");
    if (staff) {
        staff.href = `../../staff/staff.html?id=${id}`;
    }
}

// Set "New Appointment" button link
function setupNewAppointmentButton(id) {
    const btn = document.getElementById("newAppointmentBtn");
    btn.href = `../appointment/createAppointment.html?id=${id}`;
}

// Fetch appointments
async function fetchAppointments(patientId) {
    try {
        const response = await fetch(
        `http://127.0.0.1:8000/appointments/patient/${patientId}`,
        {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
);

        if (!response.ok) {
            document.getElementById("appointmentsContainer").innerText =
                "Failed to load appointments";
            return;
        }

        const data = await response.json();

        renderAppointments(data);

    } catch (error) {
        console.error(error);
        document.getElementById("appointmentsContainer").innerText =
            "Error loading appointments";
    }
}

// Render cards
function renderAppointments(appointments) {
    const container = document.getElementById("appointmentsContainer");
    const clearance = parseInt(localStorage.getItem("clearance"));

    if (appointments.length === 0) {
        container.innerHTML = "<p>No appointments found.</p>";
        return;
    }

    container.innerHTML = "";

    appointments.forEach(appt => {
        const card = document.createElement("div");
        card.className = "patient-card";

        // 🔥 Only show buttons if NOT a patient
        let actions = "";

        if (clearance > 1) {
            actions = `
                <a href="../../prescription/createPrescription.html?id=${appt.patient_id}&appointment_id=${appt.appointment_id}" 
                class="main-button">
                + Create Prescription
                </a>

                <a href="../../labResult/createLabResult.html?id=${appt.patient_id}&appointment_id=${appt.appointment_id}" 
                class="main-button">
                + Add Lab Result
                </a>

                <a href="../../billing/createBillingInvoice.html?id=${appt.patient_id}&appointment_id=${appt.appointment_id}" 
                class="main-button">
                + Create Invoice
                </a>
            `;
        }

        card.innerHTML = `
            <h3>Appointment #${appt.appointment_id}</h3>

            <div class="patient-row"><span class="label">Provider:</span> ${appt.provider_name}</div>
            <div class="patient-row"><span class="label">Start:</span> ${new Date(appt.start_time).toLocaleString()}</div>
            <div class="patient-row"><span class="label">End:</span> ${new Date(appt.end_time).toLocaleString()}</div>
            <div class="patient-row"><span class="label">Status:</span> ${appt.status}</div>
            <div class="patient-row"><span class="label">Reason:</span> ${appt.reason_for_visit || "N/A"}</div>

            <br>

            ${actions}
        `;

        container.appendChild(card);
    });
}

// On page load
window.onload = function () {
    const id = getPatientIdFromURL();
    const clearance = parseInt(localStorage.getItem("clearance"));

    if (clearance > 1) {
        const newAppointmentBtn = document.getElementById("newAppointmentBtn");
        if (newAppointmentBtn) {
            newAppointmentBtn.style.display = "none";
        }

        fetchAllAppointments();
        return;
    }

    if (!id) {
        document.getElementById("appointmentsContainer").innerText =
            "No patient ID provided";
        return;
    }

    attachPatientIdToLinks(id);
    setupNewAppointmentButton(id);
    fetchAppointments(id);

    const staffLink = document.getElementById("staffLink");
    if (staffLink) {
        staffLink.parentElement.style.display = "none";
    }
};

function logout() {
    localStorage.clear();
    window.location.href = "/";
}

async function fetchAllAppointments() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/appointments/",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        if (!response.ok) {
            document.getElementById("appointmentsContainer").innerText =
                "Failed to load appointments";
            return;
        }

        const data = await response.json();
        renderAppointments(data);

    } catch (error) {
        console.error(error);
        document.getElementById("appointmentsContainer").innerText =
            "Error loading appointments";
    }
}

