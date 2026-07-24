// dashboard.js
const supabase = supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

async function unseal() {
    const input = document.getElementById('cipher-input').value.toUpperCase();
    
    // Hash the input with the space included
    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { data, error } = await supabase
        .from('puzzles')
        .select('solution_hash')
        .eq('cipher_name', 'The Prophet\'s Reverse')
        .eq('solution_hash', hashedInput)
        .single();

    if (data) {
        // Logic for success (e.g., reveal next clue)
        console.log("Archive access granted.");
    } else {
        console.log("Archive access denied.");
    }
}
