const BTC_GOAL = 1000;
const EUR_ROUND_LIMIT = 1000;
const ADMIN_ID = "Satoramy";

// AXIOM: Autonome URL-Erkennung
const LOKAL_IP = "10.47.68.174";
const TUNNEL_URL = "https://rfof-master.loca.lt"; 
const API_URL = (window.location.hostname === LOKAL_IP) ? `http://${LOKAL_IP}:5050/api` : `${TUNNEL_URL}/api`;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('ref')) sessionStorage.setItem('pending_ref', urlParams.get('ref'));

let state = { user: JSON.parse(localStorage.getItem('session_user')) || null };

async function updateView() {
    const isUser = !!state.user;
    if(document.getElementById('nav-guest')) document.getElementById('nav-guest').style.display = isUser ? 'none' : 'block';
    if(document.getElementById('nav-user')) document.getElementById('nav-user').style.display = isUser ? 'block' : 'none';
    
    const isAdmin = (state.user && state.user.username === ADMIN_ID);
    const adminBtn = document.getElementById('admin-link');
    if(adminBtn) adminBtn.style.display = isAdmin ? 'inline-block' : 'none';

    try {
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(state.user ? { user_data: { username: state.user.username } } : {}) 
        });
        const data = await res.json();
        localStorage.setItem('cached_db', JSON.stringify(data.db));

        const totalEur = data.db.global.eur || 0;
        const currentRound = Math.floor(totalEur / EUR_ROUND_LIMIT) + 1;
        
        if(document.getElementById('current-eur')) {
            document.getElementById('current-eur').textContent = `${totalEur % EUR_ROUND_LIMIT} € (Round ${currentRound})`;
            document.getElementById('fill-eur').style.width = (totalEur % EUR_ROUND_LIMIT / 10) + "%";
        }

        try {
            const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
            const btcData = await btcRes.json();
            const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
            if(document.getElementById('text-btc')) {
                document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / ${BTC_GOAL} BTC`;
                document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";
            }
        } catch(e) { console.warn("BTC Node Offline."); }

        if(state.user && data.db.users[state.user.username]) {
            const dbUser = data.db.users[state.user.username];
            state.user = dbUser;
            localStorage.setItem('session_user', JSON.stringify(dbUser));
            if(document.getElementById('user-btc-address')) document.getElementById('user-btc-address').textContent = dbUser.wallet;
            if(document.getElementById('user-balance')) document.getElementById('user-balance').textContent = `${dbUser.balance} BTC`;
            if(document.getElementById('invite-link')) document.getElementById('invite-link').textContent = `${window.location.origin}${window.location.pathname}?ref=${dbUser.username}`;
        }
    } catch(e) { console.error("Axiom Bridge Offline."); }
}

async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;
    const ref = sessionStorage.getItem('pending_ref') || "none";
    if(!u || !p) return alert("Daten unvollständig!");

    await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ user_data: { username: u, password: p, referrer: ref } })
    });
    showPage('login');
}

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
        const found = data.db.users[u];
        if(found && found.password === p) {
            state.user = found;
            localStorage.setItem('session_user', JSON.stringify(found));
            showPage('home');
        } else { alert("Login fehlgeschlagen!"); }
    } catch(e) { alert("Bridge Error!"); }
}

async function adminSetEur() {
    const val = document.getElementById('admin-eur-val').value;
    await fetch(`${API_URL}/sync`, { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ admin_eur: val, admin_token: "Satoramy_Secure_Gate_77" }) 
    });
    updateView();
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + id);
    if(target) target.style.display = 'block';
    updateView();
}

function logout() { localStorage.clear(); location.reload(); }

document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    setInterval(updateView, 10000);
});