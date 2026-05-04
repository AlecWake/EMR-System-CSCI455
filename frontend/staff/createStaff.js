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

async function createStaff() {
    const first = document.getElementById("first").value;
    const last = document.getElementById("last").value;
    const role = document.getElementById("role").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (!first || !last || !role) {
        alert("Fill required fields");
        return;
    }

    const payload = {
        first_name: first,
        last_name: last,
        role: role,
        phone: phone || null,
        email: email || null
    };

    try {
        const res = await fetch("http://127.0.0.1:8000/staff/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.detail || "Failed to create staff");
            return;
        }

        window.location.href = "../staff/staff.html";

    } catch (err) {
        console.error(err);
        alert("Error creating staff");
    }
}

window.onload = function () {
    const id = getPatientIdFromURL();
    if (id) attachPatientIdToLinks(id);
};