// ==========================================
// SUPABASE CLIENT INITIALIZATION
// ==========================================
// Initializing with Project URL and Anon Key
const dbClient = window.supabase.createClient(
    'https://yixuuxsvapjhxrqhpupm.supabase.co', 
    'sb_publishable_s_78prpZQRQDdfU82dC9zA_XKHh7xPi'
);

// Audio Asset for failure states
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
        
        if (error) throw error;

        if (data && data.length > 0) {
            currentCipherId = data[0].cipher_id; // Updated from id
            // Assuming the quote was removed from this specific return, 
            // or you can add a label here if needed
            cipherQuote.textContent = "DECRYPTION REQUIRED"; 
            cipherText.textContent = data[0].text_to_decode; // Updated from encrypted_text
        }
    } catch (err) {
        console.error("Archive connection failed:", err);
    }
}

async function verifySolution() {
    const solution = cipherInput.value;
    
    try {
        // RPC call to verify the solution against the current ID
        const { data, error } = await dbClient.rpc('verify_cipher_solution', {
            p_id: currentCipherId,
            p_solution: solution
        });

        if (error) throw error;

        if (data === true) {
            alert("Access Granted");
            // Add your transition logic here
        } else {
            // Trigger failure animation and audio
            rejectionSound.play();
            // Assuming your CSS class for the "reality-tear" effect is 'tear-effect'
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
