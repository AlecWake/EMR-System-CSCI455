function getStaffIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("staff_id");
}

async function loadStaff() {
    const staffId = getStaffIdFromURL();

    if (!staffId) {
        document.getElementById("staffContainer").innerText =
            "No staff ID provided";
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/staff/${staffId}`);

        if (!response.ok) {
            document.getElementById("staffContainer").innerText =
                "Staff not found";
            return;
        }

        const staff = await response.json();

        document.getElementById("staffContainer").innerHTML = `
            <div class="patient-card">
                <h3>Staff #${staff.staff_id}</h3>

                <div><b>Name:</b> ${staff.first_name} ${staff.last_name}</div>
                <div><b>Role:</b> ${staff.role}</div>
                <div><b>Phone:</b> ${staff.phone || "N/A"}</div>
                <div><b>Email:</b> ${staff.email || "N/A"}</div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        document.getElementById("staffContainer").innerText =
            "Error loading staff";
    }
}

function goToPatient() {
    const patientId = document.getElementById("patientSearchId").value;

    if (!patientId) {
        alert("Enter a patient ID");
        return;
    }

    window.location.href = `../patient/patient.html?id=${patientId}`;
}

window.onload = loadStaff;