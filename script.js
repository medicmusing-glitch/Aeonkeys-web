// 1. Initialize Supabase Client
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Global State & Audio
let currentCipherId = null;

// Ensure your chosen audio file is named exactly this and sits in your GitHub repo
const rejectionSound = new Audio('reject.flac');
rejectionSound.volume = 0.8; 

// 3. DOM Elements
const cipherDisplay = document.getElementById('cipher-text-display');
const cipherInput = document.getElementById('cipher-input');
const submitBtn = document.getElementById('submitBtn');

// 4. Fetch the Cipher on Page Load
async function fetchCipher() {
    try {
        const { data, error } = await supabase.rpc('get_random_cipher');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            currentCipherId = data[0].cipher_id;
            cipherDisplay.innerText = data[0].text_to_decode;
        }
    } catch (error) {
        console.error('Error fetching the cipher:', error);
        cipherDisplay.innerText = "THE VOID REMAINS SILENT."; 
    }
}

// 5. Verify the Answer on Submit
async function verifyAnswer() {
    const userGuess = cipherInput.value.trim();
    
    if (!userGuess || !currentCipherId) return;

    try {
        const { data: isCorrect, error } = await supabase.rpc('verify_cipher_solution', {
            p_cipher_id: currentCipherId,
            p_user_guess: userGuess
        });

        if (error) throw error;

        if (isCorrect) {
            // SUCCESS LOGIC: Access Granted
            cipherInput.style.color = "#4ade80"; // A terminal green for success
            cipherInput.value = "ACCESS GRANTED";
            cipherInput.disabled = true;
            submitBtn.disabled = true;
            
            // Redirect to the main platform. Change '/app.html' to your actual file.
            setTimeout(() => {
                window.location.href = '/app.html'; 
            }, 1500);

        } else {
            // FAILURE LOGIC: The Hostile Rejection
            cipherInput.value = ''; 
            cipherInput.placeholder = "ACCESS DENIED.";
            
            rejectionSound.currentTime = 0;
            rejectionSound.play().catch(err => console.log("Audio blocked:", err));

            document.body.classList.add('system-rejection');

            setTimeout(() => {
                document.body.classList.remove('system-rejection');
                cipherInput.placeholder = ""; 
            }, 400); 
        }
    } catch (error) {
        console.error('Error verifying solution:', error);
    }
}

// 6. Event Listeners
window.addEventListener('DOMContentLoaded', fetchCipher);

cipherInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        verifyAnswer();
    }
});

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    verifyAnswer();
});
