function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        patientId: params.get("id"),
        appointmentId: params.get("appointment_id")
    };
}

// NAVBAR
function attachPatientIdToLinks(id) {

    const patient = document.getElementById("patientLink");
    if (patient) patient.href = `../../patient/patient.html?id=${id}`;

    const appointments = document.getElementById("appointmentsLink");
    if (appointments) appointments.href = `../../appointment/appointments.html?id=${id}`;

    const prescriptions = document.getElementById("prescriptionsLink");
    if (prescriptions) prescriptions.href = `../../prescription/prescriptions.html?id=${id}`;

    const labResults = document.getElementById("labResultsLink");
    if (labResults) labResults.href = `../../labResult/labResults.html?id=${id}`;

    const billing = document.getElementById("billingLink");
    if (billing) billing.href = `../../billing/billing.html?id=${id}`;

    const corrections = document.getElementById("correctionsLink");
    if (corrections) corrections.href = `../../correction/corrections.html?id=${id}`;

    const insurance = document.getElementById("insuranceLink");
    if (insurance) insurance.href = `../../insurance/insurance.html?id=${id}`;

    const staff = document.getElementById("staffLink");
    if (staff) staff.href = `../../staff/staff.html?id=${id}`;
}

// CREATE
async function createLabResult() {
    const { patientId, appointmentId } = getParams();

    if (!patientId || !appointmentId) {
        alert("Missing patient or appointment ID");
        return;
    }

    const testName = document.getElementById("testName").value;
    const value = document.getElementById("value").value;
    const unit = document.getElementById("unit").value;
    const status = document.getElementById("status").value;

    if (!testName || !value || !unit || !status) {
        alert("Please fill all required fields");
        return;
    }

    const payload = {
        patient_id: parseInt(patientId),
        appointment_id: parseInt(appointmentId),
        test_name: testName,
        result_value: value,
        measurement_unit: unit,
        result_status: status
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/lab-results/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.detail || "Failed to create lab result");
            return;
        }

        // redirect back
        window.location.href = `labResults.html?id=${patientId}`;

    } catch (error) {
        console.error(error);
        alert("Error creating lab result");
    }
}

// LOAD
window.onload = function () {
    const { patientId } = getParams();

    if (!patientId) {
        alert("Missing patient ID");
        return;
    }

    attachPatientIdToLinks(patientId);
};