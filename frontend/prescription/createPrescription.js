function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        patientId: params.get("id"),
        appointmentId: params.get("appointment_id")
    };
}

// NAVBAR links (keep patient context alive)
function attachPatientIdToLinks(patientId) {

    const patient = document.getElementById("patientLink");
    if (patient) {
        patient.href = `../../patient/patient.html?id=${patientId}`;
    }

    const appointments = document.getElementById("appointmentsLink");
    if (appointments) {
        appointments.href = `../../appointment/appointments.html?id=${patientId}`;
    }

    const prescriptions = document.getElementById("prescriptionsLink");
    if (prescriptions) {
        prescriptions.href = `../../prescription/prescriptions.html?id=${patientId}`;
    }

    const labResults = document.getElementById("labResultsLink");
    if (labResults) {
        labResults.href = `../../labResult/labResults.html?id=${patientId}`;
    }

    const billing = document.getElementById("billingLink");
    if (billing) {
        billing.href = `../../billing/billing.html?id=${patientId}`;
    }

    const corrections = document.getElementById("correctionsLink");
    if (corrections) {
        corrections.href = `../../correction/corrections.html?id=${patientId}`;
    }

    const insurance = document.getElementById("insuranceLink");
    if (insurance) {
        insurance.href = `../../insurance/insurance.html?id=${patientId}`;
    }

    const staff = document.getElementById("staffLink");
    if (staff) {
        staff.href = `../../staff/staff.html?id=${patientId}`;
    }
}

async function createPrescription() {
    const { patientId, appointmentId } = getParams();

    if (!patientId || !appointmentId) {
        alert("Missing patient or appointment ID");
        return;
    }

    const provider = document.getElementById("provider").value;
    const medication = document.getElementById("medication").value;
    const dosage = document.getElementById("dosage").value;
    const directions = document.getElementById("directions").value;
    const duration = document.getElementById("duration").value;

    if (!provider || !medication || !dosage || !duration) {
        alert("Please fill all required fields");
        return;
    }

    const payload = {
        patient_id: parseInt(patientId),
        appointment_id: parseInt(appointmentId),
        provider_name: provider,
        medication_name: medication,
        dosage: dosage,
        directions: directions || null,
        duration: duration
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/prescriptions/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.detail || "Failed to create prescription");
            return;
        }

        // redirect back to prescriptions page
        window.location.href = `prescriptions.html?id=${patientId}`;

    } catch (error) {
        console.error(error);
        alert("Error creating prescription");
    }
}

// on load
window.onload = function () {
    const { patientId } = getParams();

    if (!patientId) {
        alert("Missing patient ID");
        return;
    }

    attachPatientIdToLinks(patientId);
};