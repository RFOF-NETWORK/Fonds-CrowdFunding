const BTC_GOAL = 1000;
const EUR_ROUND_LIMIT = 1000;
const ADMIN_ID = "Satoramy"; 
const API_URL = "http://10.47.68.174:5050/api";

let state = {
    user: JSON.parse(localStorage.getItem('session_user')) || null,
};

// --- REGISTRIERUNG ---
async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-pass').value;
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if(!u || !p) return alert("Please fill in Username and Password!");

    try {
        await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_data: { username: u, email: e, password: p, referrer: ref } })
        });
        alert("Sato-Account created successfully!");
        showPage('login');
    } catch(err) { alert("Bridge offline!"); }
}

// --- LOGIN ---
async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    try {
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ user_data: { username: u, password: p } }) 
        });
        const data = await res.json();
        const user = data.db.users[u];

        if(user && (user.password === p || user.pass === p)) {
            state.user = user;
            localStorage.setItem('session_user', JSON.stringify(user));
            showPage('home');
        } else { alert("Login failed!"); }
    } catch(err) { alert("Bridge error!"); }
}

// --- ADMIN: EUR WERT SETZEN ---
async function adminSetEur() {
    const val = document.getElementById('admin-eur-val').value;
    if(!val) return alert("Enter a value!");
    try {
        await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ admin_eur: val })
        });
        alert("Database Synced!");
        updateView();
    } catch(e) { alert("Sync failed!"); }
}

// --- DASHBOARD SYNC ---
async function updateView() {
    const isUser = !!state.user;
    document.getElementById('nav-guest').style.display = isUser ? 'none' : 'block';
    document.getElementById('nav-user').style.display = isUser ? 'block' : 'none';
    
    const isAdmin = state.user && (state.user.username === ADMIN_ID || state.user.role === "admin");
    const adminLink = document.getElementById('admin-link');
    if(adminLink) adminLink.style.display = isAdmin ? 'inline-block' : 'none';

    try {
        const syncPayload = state.user ? { user_data: { username: state.user.username } } : {};
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(syncPayload) 
        });
        const data = await res.json();
        
        // Globaler Fortschritt
        const totalEur = data.db.global.eur || 0;
        document.getElementById('current-eur').textContent = `${totalEur % EUR_ROUND_LIMIT} € (Round ${Math.floor(totalEur/EUR_ROUND_LIMIT)+1})`;
        document.getElementById('fill-eur').style.width = (totalEur % EUR_ROUND_LIMIT / 10) + "%";

        // BTC Goal Tracker (Live API + Database)
        const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const btcData = await btcRes.json();
        const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / ${BTC_GOAL} BTC`;
        document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";

        // User Data
        if(state.user && data.db.users[state.user.username]) {
            const dbUser = data.db.users[state.user.username];
            state.user = dbUser;
            localStorage.setItem('session_user', JSON.stringify(dbUser));

            document.getElementById('user-btc-address').textContent = dbUser.wallet;
            document.getElementById('phrases-display').textContent = dbUser.phrases;
            document.getElementById('user-balance').textContent = `${dbUser.balance || "0.00000000"} BTC`;
            document.getElementById('invite-link').textContent = `https://rfof-network.github.io/Fonds-CrowdFunding/?ref=${dbUser.username}`;
        }
    } catch(e) { console.log("Sync..."); }
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + id);
    if(target) target.style.display = 'block';
    updateView();
}

function togglePhrases() {
    const box = document.getElementById('phrases-display');
    box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
}

function logout() { localStorage.clear(); location.reload(); }
document.addEventListener('DOMContentLoaded', () => showPage('home'));