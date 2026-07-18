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
const cipherQuote = document.getElementById('cipher-quote');
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
        
        // Debugging line to see exact response in console
        console.log("Database Response:", data);
        
        if (error) throw error;

        // Accessing fields based on the columns 'cipher_id' and 'text_to_decode'
        if (data && data.length > 0) {
            currentCipherId = data[0].cipher_id;
            cipherQuote.textContent = "DECRYPTION REQUIRED";
            cipherText.textContent = data[0].text_to_decode;
        }
    } catch (err) {
        console.error("Archive connection failed:", err);
    }
}

async function verifySolution() {
    const solution = cipherInput.value;
    
    try {
        const { data, error } = await dbClient.rpc('verify_cipher_solution', {
            p_id: currentCipherId,
            p_solution: solution
        });

        if (error) throw error;

        if (data === true) {
            alert("Access Granted");
        } else {
            rejectionSound.play();
            document.body.classList.add('tear-effect');
            setTimeout(() => document.body.classList.remove('tear-effect'), 1000);
        }
    } catch (err) {
        console.error("Verification error:", err);
    }
}

// Event Listeners
submitBtn.addEventListener('click', verifySolution);

// Initialize
loadCipher();
