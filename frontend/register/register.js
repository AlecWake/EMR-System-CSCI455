document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // stop page reload

    // Collect form data
    const patientData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        date_of_birth: document.getElementById("date_of_birth").value,
        sex: document.getElementById("sex").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/patients/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            document.getElementById("message").innerText = "Error creating patient";
            return;
        }

        const data = await response.json();

        // Redirect to patient page with new ID
        window.location.href = `../patient/patient.html?id=${data.patient_id}`;

    } catch (error) {
        console.error(error);
        document.getElementById("message").innerText = "Server error";
    }
});