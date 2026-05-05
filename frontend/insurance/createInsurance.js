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

async function createInsurance() {
    const patientId = getPatientIdFromURL();

    if (!patientId) {
        alert("Missing patient ID");
        return;
    }

    const provider = document.getElementById("provider").value;
    const policy = document.getElementById("policy").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if (!provider || !policy || !start || !end) {
        alert("Please fill all fields");
        return;
    }

    const payload = {
        patient_id: parseInt(patientId),
        provider_name: provider,
        policy_number: policy,
        coverage_start_date: start,
        coverage_end_date: end
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/insurance/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();

            const message =
                typeof err.detail === "string"
                    ? err.detail
                    : JSON.stringify(err.detail);

            alert(message);
            return;
        }

        window.location.href =
            `../insurance/insurance.html?id=${patientId}`;

    } catch (error) {
        console.error(error);
        alert("Error creating insurance");
    }
}

window.onload = function () {
    const id = getPatientIdFromURL();

    if (!id) {
        alert("Missing patient ID");
        return;
    }

    attachPatientIdToLinks(id);

    const clearance = parseInt(localStorage.getItem("clearance"));

    if (clearance === 1) {
        const staffLink = document.getElementById("staffLink");
        if (staffLink) {
            staffLink.parentElement.style.display = "none";
        }
    }

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.onclick = function () {
            window.location.href = `insurance.html?id=${id}`;
        };
    }
};

function logout() {
    localStorage.clear();
    window.location.href = "/";
}