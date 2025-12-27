const BTC_GOAL = 1000;
const EUR_ROUND_LIMIT = 1000;
const ADMIN_ID = "RFOFsocialCLUB";
const API_URL = "http://10.47.68.174:5050/api"; // Deine Netzwerk-IP

let state = {
    user: JSON.parse(localStorage.getItem('session_user')) || null,
};

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + id);
    if(target) target.style.display = 'block';
    window.scrollTo(0,0);
    updateView();
}

// --- AUTH ---
async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-pass').value;
    if(!u || !p) return alert("Please fill all fields");

    const wallet = "bc1q" + Math.random().toString(36).substring(2, 15);
    const phrases = "shield atom logic verify expert core olympic trade bulk asset filter digital"; // Beispiel

    const newUser = { username: u, email: e, pass: p, wallet, phrases };
    
    try {
        await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_data: newUser })
        });
        alert("Registration Successful!");
        showPage('login');
    } catch(err) { alert("Bridge Error!"); }
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;

    try {
        const res = await fetch(`${API_URL}/sync`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({}) });
        const data = await res.json();
        const user = data.db.users[u];

        if(user && user.pass === p) {
            state.user = user;
            localStorage.setItem('session_user', JSON.stringify(user));
            showPage('home');
        } else { alert("Login failed!"); }
    } catch(e) { alert("Bridge offline!"); }
}

// --- PHRASES TOGGLE ---
function togglePhrases() {
    const box = document.getElementById('phrases-display');
    if(box.style.filter === 'none') {
        box.style.filter = 'blur(8px)';
    } else {
        box.style.filter = 'none';
    }
}

// --- ADMIN ---
async function adminSetEur() {
    const val = parseFloat(document.getElementById('admin-eur-val').value);
    await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ admin_eur: val })
    });
    alert("Stats updated!");
    updateView();
}

async function updateView() {
    // Nav Toggle
    document.getElementById('nav-guest').style.display = state.user ? 'none' : 'block';
    document.getElementById('nav-user').style.display = state.user ? 'block' : 'none';
    
    if(state.user?.username === ADMIN_ID) {
        document.getElementById('admin-link').style.display = 'inline-block';
    }

    // Global Stats Fetch
    try {
        const res = await fetch(`${API_URL}/sync`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({}) });
        const data = await res.json();
        const totalEur = data.db.global.eur;

        // Rounds
        const curEur = totalEur % EUR_ROUND_LIMIT;
        const round = Math.floor(totalEur / EUR_ROUND_LIMIT) + 1;
        document.getElementById('current-eur').textContent = `${curEur} € (Round ${round})`;
        document.getElementById('fill-eur').style.width = (curEur / EUR_ROUND_LIMIT * 100) + "%";

        // BTC
        const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const btcData = await btcRes.json();
        const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
        document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / 1000 BTC`;
    } catch(e) {}

    // Profile Data
    if(state.user) {
        document.getElementById('user-btc-address').textContent = state.user.wallet;
        document.getElementById('phrases-display').textContent = state.user.phrases;
        document.getElementById('invite-link').textContent = `https://rfof-network.github.io/Fonds-CrowdFunding/?ref=${state.user.username}`;
    }
}

function logout() { localStorage.clear(); location.reload(); }
document.addEventListener('DOMContentLoaded', () => { showPage('home'); });