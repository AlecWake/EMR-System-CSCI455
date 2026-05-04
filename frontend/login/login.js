function login() {
    const id = document.getElementById("patientId").value;

    if (!id) {
        alert("Please enter a Patient ID");
        return;
    }

    // Redirect to patient page with ID in URL
    window.location.href = `../patient/patient.html?id=${id}`;
}