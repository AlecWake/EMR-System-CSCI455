function getPatientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function createAppointment() {
    const patientId = getPatientIdFromURL();

    if (!patientId) {
        alert("Missing patient ID in URL");
        return;
    }

    const provider = document.getElementById("provider").value;
    const startTimeValue = document.getElementById("startTime").value;
    const reason = document.getElementById("reason").value;

    if (!provider || !startTimeValue) {
        alert("Please fill all required fields");
        return;
    }

    // convert start time
    const startTime = new Date(startTimeValue);

    // +1 hour end time
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const payload = {
        patient_id: parseInt(patientId),
        provider_name: provider,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: "Scheduled",
        reason_for_visit: reason || null
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/appointments/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.detail || "Failed to create appointment");
            return;
        }

        // redirect back
        window.location.href = `../appointment/appointments.html?id=${patientId}`;

    } catch (error) {
        console.error(error);
        alert("Error creating appointment");
    }
}

// NAVBAR links
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

// On page load
window.onload = function () {
    const id = getPatientIdFromURL();

    if (!id) return;

    attachPatientIdToLinks(id);
};