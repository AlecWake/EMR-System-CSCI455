function getPatientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// NAVBAR links (keep patient context alive)
function attachPatientIdToLinks(id) {

    const patient = document.getElementById("patientLink");
    if (patient) {
        patient.href = `../../patient/patient.html?id=${id}`;
    }

    const appointments = document.getElementById("appointmentsLink");
    if (appointments) {
        appointments.href = `../../appointment/appointments.html?id=${id}`;
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

// Fetch prescriptions
async function fetchPrescriptions(patientId) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/prescriptions/patient/${patientId}`,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        if (!response.ok) {
            document.getElementById("prescriptionsContainer").innerText =
                "Failed to load prescriptions";
            return;
        }

        const data = await response.json();
        renderPrescriptions(data);

    } catch (error) {
        console.error(error);
        document.getElementById("prescriptionsContainer").innerText =
            "Error loading prescriptions";
    }
}

// Render cards
function renderPrescriptions(prescriptions) {
    const container = document.getElementById("prescriptionsContainer");

    if (prescriptions.length === 0) {
        container.innerHTML = "<p>No prescriptions found.</p>";
        return;
    }

    container.innerHTML = "";

    prescriptions.forEach(p => {
        const card = document.createElement("div");
        card.className = "patient-card";

        card.innerHTML = `
            <h3>${p.medication_name}</h3>

            <div class="patient-row"><span class="label">Prescription ID:</span> ${p.prescription_id}</div>
            <div class="patient-row"><span class="label">Provider:</span> ${p.provider_name}</div>
            <div class="patient-row"><span class="label">Dosage:</span> ${p.dosage}</div>
            <div class="patient-row"><span class="label">Directions:</span> ${p.directions || "N/A"}</div>
            <div class="patient-row"><span class="label">Duration:</span> ${p.duration}</div>
            <div class="patient-row"><span class="label">Appointment ID:</span> ${p.appointment_id}</div>
        `;

        container.appendChild(card);
    });
}

// On load
window.onload = function () {
    const id = getPatientIdFromURL();
    const clearance = parseInt(localStorage.getItem("clearance"));

    if (clearance > 1) {
        fetchAllPrescriptions();
        return;
    }

    if (!id) {
        document.getElementById("prescriptionsContainer").innerText =
            "No patient ID provided";
        return;
    }

    attachPatientIdToLinks(id);
    fetchPrescriptions(id);

    const staffLink = document.getElementById("staffLink");
    if (staffLink) {
        staffLink.parentElement.style.display = "none";
    }
};

function logout() {
    localStorage.clear();
    window.location.href = "/";
}

async function fetchAllPrescriptions() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/prescriptions/",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        if (!response.ok) {
            document.getElementById("prescriptionsContainer").innerText =
                "Failed to load prescriptions";
            return;
        }

        const data = await response.json();
        renderPrescriptions(data);

    } catch (error) {
        console.error(error);
        document.getElementById("prescriptionsContainer").innerText =
            "Error loading prescriptions";
    }
}