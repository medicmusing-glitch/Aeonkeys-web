const dbClient = window.supabase.createClient(
    'https://yixuuxsvapjhxrqhpupm.supabase.co', 
    'sb_publishable_s_78prpZQRQDdfU82dC9zA_XKHh7xPi',
    {
        db: { schema: 'public' }
    }
);

const rejectionSound = new Audio('reject.flac');
const submitBtn = document.getElementById('submit-btn'); 
const cipherInput = document.getElementById('cipher-input'); 
let currentCipherId = null;

async function verifySolution() {
    try {
        const { data, error } = await dbClient.rpc('verify_cipher_solution', {
            p_cipher_id: currentCipherId, 
            p_user_guess: cipherInput.value
        });

        if (error) throw error;
        
        if (data === true) {
            window.location.href = '/dashboard/index.html';
        } else {{
            triggerFailure();
        }
    } catch (err) {
        console.error("Verification error:", err);
        triggerFailure();
    }
}

function triggerFailure() {
    rejectionSound.play();
    document.body.classList.add('tear-effect');
    setTimeout(() => document.body.classList.remove('tear-effect'), 500);
}
async function loadCipher() {
    try {
        // Fetch all ciphers from the table
        const { data, error } = await dbClient
            .from('landing_ciphers') 
            .select('*');
            
        if (error) throw error;

        if (data && data.length > 0) {
            // Pick a random cipher from the results
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomCipher = data[randomIndex];
            
            // Store the selected ID so verifySolution() knows which one to check
            currentCipherId = randomCipher.id; 
            
            // Display the text on the screen
            document.getElementById('cipher-text').innerText = randomCipher.cipher_text; 
        } else {
            console.warn("No ciphers found in the database.");
        }
        
    } catch (err) {
        console.error("Error loading cipher:", err);
    }
}
submitBtn.addEventListener('click', verifySolution);

loadCipher();
