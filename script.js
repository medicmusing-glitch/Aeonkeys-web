const dbClient = window.supabase.createClient(
    'https://yixuuxsvapjhxrqhpupm.supabase.co', 
    'sb_publishable_s_78prpZQRQDdfU82dC9zA_XKHh7xPi'
);

const rejectionSound = new Audio('reject.flac');
const cipherText = document.getElementById('cipher-text');
const cipherInput = document.getElementById('cipher-input');
const submitBtn = document.getElementById('submit-btn');
let currentCipherId = null;

async function loadCipher() {
    try {
        const { data, error } = await dbClient.rpc('get_random_cipher');
        if (error) throw error;
        if (data && data.length > 0) {
            currentCipherId = data[0].id;
            cipherText.textContent = data[0].text_to_decode;
        }
    } catch (err) {
        console.error("Error loading cipher:", err);
    }
}

function triggerFailure() {
    rejectionSound.play();
    document.body.classList.add('tear-effect');
    setTimeout(() => document.body.classList.remove('tear-effect'), 500);
}

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

submitBtn.addEventListener('click', verifySolution);
loadCipher();
