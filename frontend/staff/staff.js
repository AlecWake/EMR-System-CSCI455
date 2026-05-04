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
}

// CREATE STAFF BUTTON
function setupCreateStaffButton(id) {
    document.getElementById("createStaffBtn").href =
        `../staff/createStaff.html?id=${id}`;
}

// FETCH ALL STAFF
async function fetchStaff() {
    try {
        const res = await fetch("http://127.0.0.1:8000/staff/");

        if (!res.ok) {
            document.getElementById("staffContainer").innerText =
                "Failed to load staff";
            return;
        }

        const data = await res.json();
        renderStaff(data);

    } catch (err) {
        console.error(err);
        document.getElementById("staffContainer").innerText =
            "Error loading staff";
    }
}

// RENDER
function renderStaff(staffList) {
    const container = document.getElementById("staffContainer");

    if (!staffList.length) {
        container.innerHTML = "<p>No staff found.</p>";
        return;
    }

    container.innerHTML = "";

    staffList.forEach(s => {
        const card = document.createElement("div");
        card.className = "patient-card";

        card.innerHTML = `
            <h3>${s.first_name} ${s.last_name}</h3>

            <div class="patient-row"><span class="label">ID:</span> ${s.staff_id}</div>
            <div class="patient-row"><span class="label">Role:</span> ${s.role}</div>
            <div class="patient-row"><span class="label">Phone:</span> ${s.phone || "N/A"}</div>
            <div class="patient-row"><span class="label">Email:</span> ${s.email || "N/A"}</div>
        `;

        container.appendChild(card);
    });
}

// SEARCH BY ID (frontend filter)
let allStaffCache = [];

async function loadStaffCache() {
    const res = await fetch("http://127.0.0.1:8000/staff/");
    allStaffCache = await res.json();
    renderStaff(allStaffCache);
}

function searchStaffById() {
    const id = document.getElementById("searchInput").value;

    if (!id) {
        alert("Enter a staff ID");
        return;
    }

    const filtered = allStaffCache.filter(s => s.staff_id == id);
    renderStaff(filtered);
}

function resetStaffView() {
    renderStaff(allStaffCache);
}

// INIT
window.onload = function () {
    const id = getPatientIdFromURL();

    if (id) attachPatientIdToLinks(id);

    setupCreateStaffButton(id);
    loadStaffCache();
};