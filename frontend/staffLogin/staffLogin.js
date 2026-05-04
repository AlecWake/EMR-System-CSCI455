function loginStaff() {
    const id = document.getElementById("staffId").value;

    if (!id) {
        alert("Please enter a Staff ID");
        return;
    }

    window.location.href = `./staffCard.html?staff_id=${id}`;
}