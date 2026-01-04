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

        if(state.user && db.users[state.user.username]) {
            const u = db.users[state.user.username];
            state.user = u;
            document.getElementById('nav-guest').style.display = 'none';
            document.getElementById('nav-user').style.display = 'block';
            if(u.role === 'admin') document.getElementById('admin-link').style.display = 'block';
            
            document.getElementById('user-balance').textContent = `${u.balance} BTC`;
            document.getElementById('user-btc-address').textContent = u.wallet;
            document.getElementById('phrases-display').textContent = u.phrases;
            
            const histDiv = document.getElementById('user-history');
            histDiv.innerHTML = u.history ? u.history.reverse().join("<br>") : "No logs yet.";
        }

        const totalEur = db.global.eur || 0;
        document.getElementById('current-eur').textContent = `${totalEur} €`;
        document.getElementById('fill-eur').style.width = (totalEur % 1000 / 10) + "%";
    } catch(e) { console.warn("Sync error"); }
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
    if((await res.json()).success) { alert("Updated!"); location.reload(); }
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