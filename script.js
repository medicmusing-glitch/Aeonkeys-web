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
let currentCipherId = 1;

async function verifySolution() {
    try {
        const { data, error } = await dbClient.rpc('verify_cipher_solution', {
            p_cipher_id: currentCipherId, 
            p_user_guess: cipherInput.value
        });

        if (error) throw error;
        
        if (data === true) {
            alert("Access Granted");
        } else {
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
        const { data, error } = await dbClient
           .from('landing_ciphers')
            .select('*')
            .eq('id', currentCipherId)
            .single();
            
        if (error) throw error;

        document.getElementById('cipher-display').innerText = data.cipher_text; 
        
    } catch (err) {
        console.error("Error loading cipher:", err);
    }
}
submitBtn.addEventListener('click', verifySolution);

loadCipher();
