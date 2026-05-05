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

    const labResults = document.getElementById("labResultsLink");
    if (labResults) labResults.href = `../../labResult/labResults.html?id=${id}`;

    const corrections = document.getElementById("correctionsLink");
    if (corrections) corrections.href = `../../correction/corrections.html?id=${id}`;

    const insurance = document.getElementById("insuranceLink");
    if (insurance) insurance.href = `../../insurance/insurance.html?id=${id}`;

    const staff = document.getElementById("staffLink");
    if (staff) staff.href = `../../staff/staff.html?id=${id}`;
}

// FETCH
async function fetchBilling(patientId) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/billing/patient/${patientId}`,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        if (!response.ok) {
            document.getElementById("billingContainer").innerText =
                "Failed to load billing data";
            return;
        }

        const data = await response.json();
        renderBilling(data);

    } catch (error) {
        console.error(error);
        document.getElementById("billingContainer").innerText =
            "Error loading billing data";
    }
}

// RENDER
function renderBilling(records) {
    const container = document.getElementById("billingContainer");

    if (records.length === 0) {
        container.innerHTML = "<p>No invoices found.</p>";
        return;
    }

    container.innerHTML = "";

    records.forEach(inv => {
        const card = document.createElement("div");
        card.className = "patient-card";

        card.innerHTML = `
            <h3>Invoice #${inv.billing_invoice_id}</h3>

            <div class="patient-row"><span class="label">Appointment ID:</span> ${inv.appointment_id}</div>
            <div class="patient-row"><span class="label">Amount:</span> $${inv.total_amount}</div>
            <div class="patient-row"><span class="label">Status:</span> ${inv.payment_status}</div>
            <div class="patient-row"><span class="label">Notes:</span> ${inv.billing_notes || "N/A"}</div>
        `;

        container.appendChild(card);
    });
}

// LOAD
window.onload = function () {
    const id = getPatientIdFromURL();
    const clearance = parseInt(localStorage.getItem("clearance"));

    if (clearance > 1) {
        fetchAllBilling();
        return;
    }

    if (!id) {
        document.getElementById("billingContainer").innerText =
            "No patient ID provided";
        return;
    }

    attachPatientIdToLinks(id);
    fetchBilling(id);

    const staffLink = document.getElementById("staffLink");
    if (staffLink) {
        staffLink.parentElement.style.display = "none";
    }
};

function logout() {
    localStorage.clear();
    window.location.href = "/";
}

async function fetchAllBilling() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/billing/",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        if (!response.ok) {
            document.getElementById("billingContainer").innerText =
                "Failed to load billing data";
            return;
        }

        const data = await response.json();
        renderBilling(data);

    } catch (error) {
        console.error(error);
        document.getElementById("billingContainer").innerText =
            "Error loading billing data";
    }
}