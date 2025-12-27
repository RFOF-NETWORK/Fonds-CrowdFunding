const BTC_GOAL = 1000;
const EUR_ROUND_LIMIT = 1000;
const ADMIN_ID = "RFOFsocialCLUB";
const API_URL = "http://localhost:5050/api";

let state = {
    user: JSON.parse(localStorage.getItem('session_user')) || null,
    eurValue: 0,
    btcFromFiat: 0
};

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + id);
    if(target) target.style.display = 'block';
    updateView();
}

// --- AUTH LOGIK ---
async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-pass').value;
    if(!u || !p) return alert("Please enter Username and Password");

    const wallet = "bc1q" + Math.random().toString(36).substring(2, 20);
    const phrases = "word ".repeat(12).trim(); 

    const newUser = { username: u, email: e, pass: p, wallet, phrases };
    
    try {
        await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_data: newUser })
        });
        alert("Account created and saved in Master-DB!");
        showPage('login');
    } catch(err) { alert("Bridge not active! Start server_logic.py"); }
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;

    try {
        const response = await fetch(`${API_URL}/sync`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({}) });
        const data = await response.json();
        const user = data.db.users[u];

        if(user && user.pass === p) {
            state.user = user;
            localStorage.setItem('session_user', JSON.stringify(user));
            showPage('home');
        } else {
            alert("Login failed. Check credentials.");
        }
    } catch(err) { alert("Bridge error!"); }
}

// --- PASSWORT RESET LOGIK ---
async function requestReset() {
    const email = prompt("Enter your registered Email:");
    if(!email) return;
    try {
        const res = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if(data.status === "sent") {
            alert("Code generated! Check your data_storage.json for: " + data.code);
            document.getElementById('reset-area').style.display = 'block';
        } else { alert("Email not found."); }
    } catch(e) { alert("Bridge offline."); }
}

async function finalizeReset() {
    const u = prompt("Confirm your username:");
    const code = document.getElementById('reset-code-input').value;
    const newP = document.getElementById('new-pass-input').value;

    try {
        const res = await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                reset_confirm: { username: u, code: code, new_password: newP } 
            })
        });
        const data = await res.json();
        if(data.status === "password_updated") {
            alert("Password changed successfully!");
            document.getElementById('reset-area').style.display = 'none';
            showPage('login');
        } else { alert("Error: Code or Username wrong."); }
    } catch(e) { alert("Sync failed."); }
}

// --- ADMIN & UI ---
async function adminSetEur() {
    const val = parseFloat(document.getElementById('admin-eur-val').value);
    await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ admin_eur: val })
    });
    updateView();
}

async function updateView() {
    // Navigation
    document.getElementById('nav-guest').style.display = state.user ? 'none' : 'block';
    document.getElementById('nav-user').style.display = state.user ? 'block' : 'none';
    const adminLink = document.getElementById('admin-link');
    if(adminLink) adminLink.style.display = (state.user?.username === ADMIN_ID) ? 'inline' : 'none';

    try {
        const response = await fetch(`${API_URL}/sync`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({}) });
        const serverData = await response.json();
        const totalEur = serverData.db.global.eur;

        // Rounds Logic
        const currentRoundEur = totalEur % EUR_ROUND_LIMIT;
        const roundNumber = Math.floor(totalEur / EUR_ROUND_LIMIT) + 1;
        document.getElementById('current-eur').textContent = `${currentRoundEur} € (Round ${roundNumber})`;
        document.getElementById('fill-eur').style.width = (currentRoundEur / EUR_ROUND_LIMIT * 100) + "%";

        // BTC Growth
        const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const btcData = await btcRes.json();
        const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
        document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / 1000 BTC`;
    } catch(e) { console.log("Waiting for Bridge..."); }

    if(state.user) {
        document.getElementById('user-btc-address').textContent = state.user.wallet;
        document.getElementById('phrases-display').textContent = state.user.phrases;
        document.getElementById('invite-link').textContent = `https://rfof-network.github.io/Fonds-CrowdFunding/?ref=${state.user.username}`;
    }
}

function logout() { localStorage.clear(); location.reload(); }
document.addEventListener('DOMContentLoaded', () => { showPage('home'); });