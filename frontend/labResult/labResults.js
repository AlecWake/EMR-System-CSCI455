function getPatientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// NAVBAR
function attachPatientIdToLinks(id) {

    const patient = document.getElementById("patientLink");
    if (patient) patient.href = `../../patient/patient.html?id=${id}`;

    const appointments = document.getElementById("appointmentsLink");
    if (appointments) appointments.href = `../../appointment/appointments.html?id=${id}`;

    const prescriptions = document.getElementById("prescriptionsLink");
    if (prescriptions) prescriptions.href = `../../prescription/prescriptions.html?id=${id}`;

    const billing = document.getElementById("billingLink");
    if (billing) billing.href = `../../billing/billing.html?id=${id}`;

    const corrections = document.getElementById("correctionsLink");
    if (corrections) corrections.href = `../../correction/corrections.html?id=${id}`;

    const insurance = document.getElementById("insuranceLink");
    if (insurance) insurance.href = `../../insurance/insurance.html?id=${id}`;

    const staff = document.getElementById("staffLink");
    if (staff) staff.href = `../../staff/staff.html?id=${id}`;
}

// FETCH
async function fetchLabResults(patientId) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/lab-results/patient/${patientId}`
        );

        if (!response.ok) {
            document.getElementById("labResultsContainer").innerText =
                "Failed to load lab results";
            return;
        }

        const data = await response.json();
        renderLabResults(data);

    } catch (error) {
        console.error(error);
        document.getElementById("labResultsContainer").innerText =
            "Error loading lab results";
    }
}

// RENDER
function renderLabResults(results) {
    const container = document.getElementById("labResultsContainer");

    if (results.length === 0) {
        container.innerHTML = "<p>No lab results found.</p>";
        return;
    }

    container.innerHTML = "";

    results.forEach(res => {
        const card = document.createElement("div");
        card.className = "patient-card";

        card.innerHTML = `
            <h3>Lab Result #${res.lab_result_id}</h3>

            <div class="patient-row"><span class="label">Test:</span> ${res.test_name}</div>
            <div class="patient-row"><span class="label">Value:</span> ${res.result_value}</div>
            <div class="patient-row"><span class="label">Unit:</span> ${res.measurement_unit}</div>
            <div class="patient-row"><span class="label">Status:</span> ${res.result_status}</div>
            <div class="patient-row"><span class="label">Appointment ID:</span> ${res.appointment_id}</div>
        `;

        container.appendChild(card);
    });
}

// LOAD
window.onload = function () {
    const id = getPatientIdFromURL();

    if (!id) {
        document.getElementById("labResultsContainer").innerText =
            "No patient ID provided";
        return;
    }

    attachPatientIdToLinks(id);
    fetchLabResults(id);
};