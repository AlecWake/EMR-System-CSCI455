function getPatientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// NAVBAR
function attachPatientIdToLinks(id) {
    document.getElementById("patientLink").href = `../../patient/patient.html?id=${id}`;
    document.getElementById("appointmentsLink").href = `../../appointment/appointments.html?id=${id}`;
    document.getElementById("prescriptionsLink").href = `../../prescription/prescriptions.html?id=${id}`;
    document.getElementById("labResultsLink").href = `../../labResult/labResults.html?id=${id}`;
    document.getElementById("billingLink").href = `../../billing/billing.html?id=${id}`;
    document.getElementById("insuranceLink").href = `../../insurance/insurance.html?id=${id}`;
    document.getElementById("staffLink").href = `../../staff/staff.html?id=${id}`;
}

// Button link
function setupNewCorrectionButton(id) {
    const btn = document.getElementById("newCorrectionBtn");
    btn.href = `../correction/createCorrectionRequest.html?id=${id}`;
}

// Fetch
async function fetchCorrections(patientId) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/correction-requests/patient/${patientId}`
        );

        if (!response.ok) {
            document.getElementById("correctionsContainer").innerText =
                "Failed to load correction requests";
            return;
        }

        const data = await response.json();
        renderCorrections(data);

    } catch (error) {
        console.error(error);
        document.getElementById("correctionsContainer").innerText =
            "Error loading correction requests";
    }
}

// Render
function renderCorrections(corrections) {
    const container = document.getElementById("correctionsContainer");

    if (corrections.length === 0) {
        container.innerHTML = "<p>No correction requests found.</p>";
        return;
    }

    container.innerHTML = "";

    corrections.forEach(c => {
        const card = document.createElement("div");
        card.className = "patient-card";

        card.innerHTML = `
            <h3>Request #${c.correction_request_id}</h3>

            <div class="patient-row">
                <span class="label">Description:</span> ${c.description}
            </div>

            <div class="patient-row">
                <span class="label">Status:</span> ${c.status}
            </div>

            <div class="patient-row">
                <span class="label">Resolution:</span> ${c.resolution_notes || "N/A"}
            </div>
        `;

        container.appendChild(card);
    });
}

// On load
window.onload = function () {
    const id = getPatientIdFromURL();

    if (!id) {
        document.getElementById("correctionsContainer").innerText =
            "No patient ID provided";
        return;
    }

    attachPatientIdToLinks(id);
    setupNewCorrectionButton(id);
    fetchCorrections(id);
};