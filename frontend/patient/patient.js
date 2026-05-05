function getPatientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function fetchPatient(id) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/patients/${id}`,
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        if (!response.ok) {
            document.getElementById("result").innerText = "Patient not found";
            return;
        }

        const data = await response.json();

        document.getElementById("result").innerHTML = `
            <h2>${data.first_name} ${data.last_name}</h2>

            <div class="patient-row"><span class="label">Patient ID:</span> ${data.patient_id}</div>
            <div class="patient-row"><span class="label">Date of Birth:</span> ${data.date_of_birth}</div>
            <div class="patient-row"><span class="label">Sex:</span> ${data.sex}</div>
            <div class="patient-row"><span class="label">Phone:</span> ${data.phone}</div>
            <div class="patient-row"><span class="label">Email:</span> ${data.email}</div>
            <div class="patient-row"><span class="label">Address:</span> ${data.address}</div>
        `;

    } catch (error) {
        console.error(error);
        document.getElementById("result").innerText =
            "Error fetching patient data";
    }
}

function attachPatientIdToLinks(id) {
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

function logout() {
    localStorage.clear();
    window.location.href = "/";
}

window.onload = function () {
    const id = getPatientIdFromURL();
    const clearance = parseInt(localStorage.getItem("clearance"));

    // PATIENT
    if (clearance === 1) {
        if (!id) {
            document.getElementById("result").innerText =
                "No patient ID provided";
            return;
        }

        attachPatientIdToLinks(id);
        fetchPatient(id);
    }

    // ADMIN / STAFF
    else {
        fetchAllPatients();
    }

    // hide staff tab for patient
    if (clearance === 1) {
        const staffLink = document.getElementById("staffLink");
        if (staffLink) {
            staffLink.parentElement.style.display = "none";
        }
    }
};

async function fetchAllPatients() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/patients/",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        if (!response.ok) {
            document.getElementById("result").innerText =
                "Failed to load patients";
            return;
        }

        const data = await response.json();

        const container = document.getElementById("result");
        container.innerHTML = "";

        data.forEach(p => {
            const card = document.createElement("div");
            card.className = "patient-card";

            card.innerHTML = `
                <h2>${p.first_name} ${p.last_name}</h2>

                <div class="patient-row"><span class="label">Patient ID:</span> ${p.patient_id}</div>
                <div class="patient-row"><span class="label">Date of Birth:</span> ${p.date_of_birth}</div>
                <div class="patient-row"><span class="label">Sex:</span> ${p.sex}</div>
                <div class="patient-row"><span class="label">Phone:</span> ${p.phone}</div>
                <div class="patient-row"><span class="label">Email:</span> ${p.email}</div>
                <div class="patient-row"><span class="label">Address:</span> ${p.address}</div>

                <hr>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        document.getElementById("result").innerText =
            "Error loading patients";
    }
}