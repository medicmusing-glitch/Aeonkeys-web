// ==========================================
// PASTE YOUR SUPABASE CREDENTIALS HERE
// ==========================================
const dbClient = window.supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

// Audio Asset
const rejectionSound = new Audio('reject.flac');

// DOM Elements
const cipherQuote = document.getElementById('cipher-quote');
const cipherText = document.getElementById('cipher-text');
const cipherInput = document.getElementById('cipher-input');
const submitBtn = document.getElementById('submit-btn');

let currentCipherId = null;

async function loadCipher() {
    try {
        // Use dbClient instead of supabase
        const { data, error } = await dbClient.rpc('get_random_cipher');
        
        if (error) throw error;

        if (data && data.length > 0) {
            currentCipherId = data[0].id;
            cipherQuote.textContent = `"${data[0].quote}"`;
            cipherText.textContent = data[0].encrypted_text;
        }
    } catch (err) {
        console.error("Archive connection failed:", err);
    }
}

// Ensure loadCipher runs
loadCipher();
