function checkAccess() {
    const input = document.getElementById('user-input').value.toUpperCase();
    // This is a placeholder; eventually, this will call your Supabase backend
    const correctAnswer = "HELLO WORLD"; 

    if (input === correctAnswer) {
        window.location.href = "/dashboard";
    } else {
        alert("Access Denied.");
    }
}
