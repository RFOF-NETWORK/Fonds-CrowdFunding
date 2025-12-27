const BTC_GOAL = 1000;
const EUR_ROUND_LIMIT = 1000;
const ADMIN_ID = "Satoramy"; // Korrigiert auf dein Pseudonym
const API_URL = "http://192.168.178.50:5050/api";

let state = {
    user: JSON.parse(localStorage.getItem('session_user')) || null,
};

async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-pass').value;
    if(!u || !p) return alert("Fields missing!");

    // KEINE Generierung hier im Frontend mehr! Nur Anfrage an Backend.
    const newUserRequest = { 
        username: u, 
        email: e, 
        pass: p, 
        request_secure_wallet: true // Backend soll echte Daten erzeugen
    };
    
    try {
        const res = await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_data: newUserRequest })
        });
        const data = await res.json();
        alert("Sato-Account created! Secure Phrasen wurden im Backend generiert.");
        showPage('login');
    } catch(err) { alert("Bridge offline!"); }
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
        } else { alert("Login failed!"); }
    } catch(err) { alert("Bridge error!"); }
}

async function updateView() {
    const isUser = !!state.user;
    document.getElementById('nav-guest').style.display = isUser ? 'none' : 'block';
    document.getElementById('nav-user').style.display = isUser ? 'block' : 'none';
    
    const isAdmin = state.user && state.user.username === ADMIN_ID;
    const adminLink = document.getElementById('admin-link');
    if(adminLink) adminLink.style.display = isAdmin ? 'inline-block' : 'none';

    try {
        const res = await fetch(`${API_URL}/sync`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({}) });
        const data = await res.json();
        
        // Stats
        const totalEur = data.db.global.eur;
        document.getElementById('current-eur').textContent = `${totalEur % EUR_ROUND_LIMIT} € (Round ${Math.floor(totalEur/EUR_ROUND_LIMIT)+1})`;
        document.getElementById('fill-eur').style.width = (totalEur % EUR_ROUND_LIMIT / 10) + "%";

        // BTC Live
        const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const btcData = await btcRes.json();
        const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / 1000 BTC`;
        document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";
        
        if(state.user) {
            // Zeigt die echten Daten an, die das Backend gespeichert hat
            const currentUserData = data.db.users[state.user.username];
            document.getElementById('user-btc-address').textContent = currentUserData.wallet;
            document.getElementById('phrases-display').textContent = currentUserData.phrases;
            document.getElementById('invite-link').textContent = `https://rfof-network.github.io/Fonds-CrowdFunding/?ref=${state.user.username}`;
        }
    } catch(e) { console.log("Sync..."); }
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + id).style.display = 'block';
    updateView();
}

function togglePhrases() {
    const box = document.getElementById('phrases-display');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
    box.style.filter = 'none';
}

function logout() { localStorage.clear(); location.reload(); }
document.addEventListener('DOMContentLoaded', () => showPage('home'));