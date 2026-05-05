async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (!username || !password) {
        message.innerText = "Please enter username and password";
        return;
    }

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
        const response = await fetch("http://127.0.0.1:8000/auth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        if (!response.ok) {
            message.innerText = "Login failed";
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", username);
        localStorage.setItem("clearance", data.clearance);
        localStorage.setItem("patient_id", data.patient_id);

        if (parseInt(data.clearance) === 1 && data.patient_id) {
            window.location.href = `patient/patient.html?id=${data.patient_id}`;
        } else {
            window.location.href = `staff/staff.html`;
        }

    } catch (error) {
        console.error(error);
        message.innerText = "Error logging in";
    }
}