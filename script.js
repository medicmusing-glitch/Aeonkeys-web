// ==========================================
// SUPABASE CLIENT INITIALIZATION
// ==========================================
const dbClient = window.supabase.createClient(
    'https://yixuuxsvapjhxrqhpupm.supabase.co', 
    'sb_publishable_s_78prpZQRQDdfU82dC9zA_XKHh7xPi'
);

// Audio Asset
const rejectionSound = new Audio('reject.flac');

// DOM Elements
const cipherText = document.getElementById('cipher-text');
const cipherInput = document.getElementById('cipher-input');
const submitBtn = document.getElementById('submit-btn');

let currentCipherId = null;

// ==========================================
// CORE LOGIC
// ==========================================
async function loadCipher() {
    try {
        const { data, error } = await dbClient.rpc('get_random_cipher');
        
        if (error) throw error;

        if (data && data.length > 0) {
            currentCipherId = data[0].id;
            if (cipherText) cipherText.textContent = data[0].text_to_decode;
            cipherInput.value = ""; 
        }
    } catch (err) {
        console.error("Archive connection failed:", err);
    }
}

async function verifySolution() {
    const solution = cipherInput.value;
    
    try {
        // This calls the SQL function you just created
        const { data, error } = await dbClient.rpc('verify_cipher_solution', {
            p_cipher_id: currentCipherId,
            p_user_guess: solution
        });

        if (error) throw error;

        if (data === true) {
            alert("Access Granted");
        } else {
            // Trigger failure effects if answer is incorrect
            rejectionSound.play();
            document.body.classList.add('tear-effect');
            setTimeout(() => document.body.classList.remove('tear-effect'), 1000);
        }
    } catch (err) {
        console.error("Verification error:", err);
        // Trigger failure effects even if the API call fails
        rejectionSound.play();
        document.body.classList.add('tear-effect');
        setTimeout(() => document.body.classList.remove('tear-effect'), 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    submitBtn.addEventListener('click', verifySolution);
    loadCipher();
});
