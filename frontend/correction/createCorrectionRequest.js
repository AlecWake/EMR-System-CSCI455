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
    document.getElementById("insuranceLink").href = `../../insurance/insurance.html?id=${id}`;
    document.getElementById("staffLink").href = `../../staff/staff.html?id=${id}`;
}

async function createCorrectionRequest() {
    const patientId = getPatientIdFromURL();

    if (!patientId) {
        alert("Missing patient ID");
        return;
    }

    const description = document.getElementById("description").value;

    if (!description) {
        alert("Please enter a description");
        return;
    }

    const payload = {
        patient_id: parseInt(patientId),
        description: description
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/correction-requests/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.detail || "Failed to create request");
            return;
        }

        // redirect back
        window.location.href =
            `../correction/corrections.html?id=${patientId}`;

    } catch (error) {
        console.error(error);
        alert("Error creating request");
    }
}

// On load
window.onload = function () {
    const id = getPatientIdFromURL();
    if (id) attachPatientIdToLinks(id);
};