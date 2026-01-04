const LOKAL_IP = "10.47.68.174";
const API_URL = (window.location.hostname === LOKAL_IP) ? `http://${LOKAL_IP}:5050/api` : `https://rfof-master.loca.lt/api`;

let state = { user: JSON.parse(localStorage.getItem('session_user')) || null };

function showPage(pid) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pid).style.display = 'block';
}

async function updateView() {
    try {
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(state.user ? { sync_user: state.user.username } : {}) 
        });
        const data = await res.json();
        const db = data.db;

        // GLOBAL EXPLORER LOGIC (Zusammengeführte History aller User)
        let globalLogs = [];
        Object.values(db.users).forEach(u => {
            if(u.history) globalLogs = globalLogs.concat(u.history.map(h => `${u.username.substring(0,3)}...: ${h}`));
        });
        document.getElementById('global-explorer').innerHTML = globalLogs.sort().reverse().slice(0,20).join("<br>");

        // USER VIEW LOGIC
        if(state.user && db.users[state.user.username]) {
            const u = db.users[state.user.username];
            state.user = u;
            document.getElementById('nav-guest').style.display = 'none';
            document.getElementById('nav-user').style.display = 'flex';
            if(u.role === 'admin') document.getElementById('admin-link').style.display = 'block';
            
            document.getElementById('user-balance').textContent = `${u.balance} BTC`;
            document.getElementById('user-btc-address').textContent = u.wallet;
            document.getElementById('phrases-display').textContent = u.phrases;
            document.getElementById('invite-link').textContent = `${window.location.origin}/?ref=${u.username}`;
            
            const histDiv = document.getElementById('user-history');
            histDiv.innerHTML = u.history ? u.history.slice().reverse().join("<br>") : "No logs.";
        }

        document.getElementById('current-eur').textContent = `${db.global.eur} €`;
        document.getElementById('fill-eur').style.width = Math.min((db.global.eur % 1000 / 10), 100) + "%";
    } catch(e) { console.warn("Sync failed"); }
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ login: { username: u, password: p } })
    });
    const data = await res.json();
    if(data.user) { state.user = data.user; localStorage.setItem('session_user', JSON.stringify(data.user)); location.reload(); }
}

async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;
    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ register: { username: u, password: p, referrer: new URLSearchParams(window.location.search).get('ref') || 'none' } })
    });
    if((await res.json()).success) showPage('login');
}

async function updateAccount() {
    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ update_settings: { username: state.user.username, new_password: document.getElementById('set-pass').value, new_email: document.getElementById('set-email').value } })
    });
    if((await res.json()).success) { alert("Data Synced!"); updateView(); }
}

async function adminSetEur() {
    await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ admin_eur: document.getElementById('admin-eur-val').value, admin_token: "Satoramy_Secure_Gate_77" })
    });
    updateView();
}

function togglePhrases() { document.getElementById('phrases-display').classList.toggle('ethik-blur'); }
function logout() { localStorage.clear(); location.reload(); }
document.addEventListener('DOMContentLoaded', updateView);