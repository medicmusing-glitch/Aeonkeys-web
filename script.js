// ==========================================
// PASTE YOUR SUPABASE CREDENTIALS HERE
// ==========================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Audio Asset (Uncompressed FLAC)
const rejectionSound = new Audio('reject.flac');

// DOM Elements
const cipherQuote = document.getElementById('cipher-quote');
const cipherText = document.getElementById('cipher-text');
const cipherInput = document.getElementById('cipher-input');
const submitBtn = document.getElementById('submit-btn');

// Current puzzle state
let currentCipherId = null;

// Fetch cipher from database
async function loadCipher() {
    try {
        const { data, error } = await supabase.rpc('get_random_cipher');
        
        if (error) throw error;

        if (data && data.length > 0) {
            currentCipherId = data[0].id;
            cipherQuote.textContent = `"${data[0].quote}"`;
            cipherText.textContent = data[0].encrypted_text;
        } else {
            cipherQuote.textContent = "THE VOID REMAINS SILENT.";
            cipherText.textContent = "";
        }
    } catch (err) {
        console.error("Archive connection failed:", err);
        cipherQuote.textContent = "CONNECTION LOST.";
    }
}

// Verify solution
async function verifySolution() {
    const attempt = cipherInput.value.trim().toUpperCase();
    if (!attempt || !currentCipherId) return;

    try {
        const { data, error } = await supabase.rpc('verify_cipher_solution', {
            p_cipher_id: currentCipherId,
            p_attempt: attempt
        });

        if (error) throw error;

        if (data === true) {
            handleSuccess();
        } else {
            handleFailure();
        }
    } catch (err) {
        console.error("Verification failed:", err);
        handleFailure();
    }
}

function handleFailure() {
    // Trigger hostile sensory feedback
    rejectionSound.currentTime = 0;
    rejectionSound.play().catch(e => console.log("Audio interaction blocked:", e));
    
    // Trigger CSS Reality-Tear
    document.body.classList.add('reality-tear');
    
    setTimeout(() => {
        document.body.classList.remove('reality-tear');
        cipherInput.value = ''; // Clear input on failure
    }, 300); // Matches the 0.3s CSS animation duration
}

function handleSuccess() {
    // Lock input and shift UI to success state
    cipherInput.disabled = true;
    submitBtn.disabled = true;
    cipherQuote.classList.add('success');
    cipherText.classList.add('success');
    
    cipherQuote.textContent = "AUTHORIZATION ACCEPTED.";
    cipherText.textContent = "ACCESS GRANTED.";
    
    // Redirect placeholder
    setTimeout(() => {
        window.location.href = '/archive-access'; // Update with your actual next route
    }, 2000);
}

// Event Listeners
submitBtn.addEventListener('click', verifySolution);
cipherInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifySolution();
});

// Initialize Handshake
loadCipher();
