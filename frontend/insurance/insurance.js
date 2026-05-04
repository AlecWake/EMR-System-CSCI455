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
    document.getElementById("correctionsLink").href = `../../correction/corrections.html?id=${id}`;
    document.getElementById("staffLink").href = `../../staff/staff.html?id=${id}`;
}

// button link
function setupNewInsuranceButton(id) {
    document.getElementById("newInsuranceBtn").href =
        `../insurance/createInsurance.html?id=${id}`;
}

// fetch insurance
async function fetchInsurance(patientId) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/insurance/patient/${patientId}`
        );

        if (!response.ok) {
            document.getElementById("insuranceContainer").innerText =
                "Failed to load insurance";
            return;
        }

        const data = await response.json();
        renderInsurance(data);

    } catch (error) {
        console.error(error);
        document.getElementById("insuranceContainer").innerText =
            "Error loading insurance";
    }
}

// render cards
function renderInsurance(policies) {
    const container = document.getElementById("insuranceContainer");

    if (policies.length === 0) {
        container.innerHTML = "<p>No insurance found.</p>";
        return;
    }

    container.innerHTML = "";

    policies.forEach(p => {
        const card = document.createElement("div");
        card.className = "patient-card";

        card.innerHTML = `
            <h3>${p.provider_name}</h3>

            <div class="patient-row"><span class="label">Policy #:</span> ${p.policy_number}</div>
            <div class="patient-row"><span class="label">Start:</span> ${p.coverage_start_date}</div>
            <div class="patient-row"><span class="label">End:</span> ${p.coverage_end_date}</div>
        `;

        container.appendChild(card);
    });
}

window.onload = function () {
    const id = getPatientIdFromURL();

    if (!id) {
        document.getElementById("insuranceContainer").innerText =
            "No patient ID provided";
        return;
    }

    attachPatientIdToLinks(id);
    setupNewInsuranceButton(id);
    fetchInsurance(id);
};