document.getElementById('submitBtn').addEventListener('click', validateKey);
document.getElementById('keyInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        validateKey();
    }
});

function validateKey() {
    // Standardize input by removing extra spaces and converting to uppercase
    const input = document.getElementById('keyInput').value.trim().toUpperCase();
    const feedback = document.getElementById('feedback');
    
    // The decoded Caesar Cipher (+3 shift)
    const solution = "A SIMPLE SHIFT REVEALS THE PATH";

    feedback.classList.remove('hidden');

    if (input === solution) {
        feedback.textContent = "Access Granted. Initializing...";
        feedback.className = "success";
        
        // Placeholder for the next step (e.g., redirecting to the next puzzle)
        setTimeout(() => {
            alert("This is where the server-side authentication will eventually take over.");
        }, 1500);
    } else {
        feedback.textContent = "Sequence invalid.";
        feedback.className = "error";
        
        // Clear input after a brief delay for a clean UX
        setTimeout(() => {
            document.getElementById('keyInput').value = '';
            feedback.classList.add('hidden');
        }, 2000);
    }
}
