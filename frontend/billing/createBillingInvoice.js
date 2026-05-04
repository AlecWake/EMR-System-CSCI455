// Get params
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
async function createInvoice() {
    const { patientId, appointmentId } = getParams();

    if (!patientId || !appointmentId) {
        alert("Missing patient or appointment ID");
        return;
    }

    const amount = document.getElementById("amount").value;
    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value;

    if (!amount || !status) {
        alert("Please fill all required fields");
        return;
    }

    const payload = {
        patient_id: parseInt(patientId),
        appointment_id: parseInt(appointmentId),
        total_amount: parseFloat(amount),
        payment_status: status,
        billing_notes: notes || null
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/billing/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.detail || "Failed to create invoice");
            return;
        }

        // redirect back
        window.location.href = `../billing/billing.html?id=${patientId}`;

    } catch (error) {
        console.error(error);
        alert("Error creating invoice");
    }
}

// LOAD
window.onload = function () {
    const { patientId, appointmentId } = getParams();

    if (!patientId || !appointmentId) {
        alert("Missing patient or appointment ID");
        return;
    }

    attachPatientIdToLinks(patientId);

    // OPTIONAL: show which appointment
    const info = document.getElementById("appointmentInfo");
    if (info) {
        info.innerText = `Creating invoice for Appointment #${appointmentId}`;
    }
};