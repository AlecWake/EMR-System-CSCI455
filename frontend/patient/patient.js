// Get patient ID from URL (?id=1)
function getPatientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function fetchPatient(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/patients/${id}`);

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

// AUTO LOAD ONLY
window.onload = function () {
    const id = getPatientIdFromURL();

    if (!id) {
        document.getElementById("result").innerText =
            "No patient ID provided in URL";
        return;
    }

    attachPatientIdToLinks(id);
    fetchPatient(id);
};

//NAVBAR links
function attachPatientIdToLinks(id) {
    /*
    const patient = document.getElementById("patientsLink");
    if (patient) {
        patient.href = `../../patient/patient.html?id=${id}`;
    }
    */

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

