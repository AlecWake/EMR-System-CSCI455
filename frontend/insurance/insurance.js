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
            `http://127.0.0.1:8000/insurance/patient/${patientId}`,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
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
    const clearance = parseInt(localStorage.getItem("clearance"));

    const newInsuranceBtn = document.getElementById("newInsuranceBtn");

    if (clearance > 1) {
        if (newInsuranceBtn) {
            newInsuranceBtn.style.display = "none";
        }

        fetchAllInsurance();
        return;
    }

    if (!id) {
        document.getElementById("insuranceContainer").innerText =
            "No patient ID provided";
        return;
    }

    attachPatientIdToLinks(id);

    if (newInsuranceBtn) {
        newInsuranceBtn.href = `createInsurance.html?id=${id}`;
    }

    fetchInsurance(id);

    const staffLink = document.getElementById("staffLink");
    if (staffLink) {
        staffLink.parentElement.style.display = "none";
    }
};

function logout() {
    localStorage.clear();
    window.location.href = "/";
}

async function fetchAllInsurance() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/insurance/",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
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