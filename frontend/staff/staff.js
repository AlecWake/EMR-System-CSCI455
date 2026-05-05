// FETCH ALL STAFF
async function fetchStaff() {
    try {
        const res = await fetch("http://127.0.0.1:8000/staff/", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        console.log("Staff status:", res.status);

        const data = await res.json();
        console.log("Staff data:", data);

        if (!res.ok) {
            document.getElementById("staffContainer").innerText =
                data.detail || "Failed to load staff";
            return;
        }

        renderStaff(data);

    } catch (err) {
        console.error("Staff fetch error:", err);
        document.getElementById("staffContainer").innerText =
            "Error loading staff";
    }
}

// RENDER STAFF
function renderStaff(staffList) {
    const container = document.getElementById("staffContainer");

    if (!Array.isArray(staffList) || staffList.length === 0) {
        container.innerHTML = "<p>No staff found.</p>";
        return;
    }
    
    if (staffList.length === 0) {
        container.innerHTML = "<p>No staff found.</p>";
        return;
    }

    container.innerHTML = "";

    staffList.forEach(s => {
        const card = document.createElement("div");
        card.className = "patient-card";

        card.innerHTML = `
            <h2>${s.first_name} ${s.last_name}</h2>

            <div class="patient-row"><span class="label">Staff ID:</span> ${s.staff_id}</div>
            <div class="patient-row"><span class="label">Role:</span> ${s.role}</div>
            <div class="patient-row"><span class="label">Phone:</span> ${s.phone || "N/A"}</div>
            <div class="patient-row"><span class="label">Email:</span> ${s.email || "N/A"}</div>
        `;

        container.appendChild(card);
    });
}

// INIT
window.onload = function () {
    fetchStaff();
};

function logout() {
    localStorage.clear();
    window.location.href = "/";
}