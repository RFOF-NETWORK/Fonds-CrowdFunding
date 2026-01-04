const BTC_GOAL = 1000;
const EUR_ROUND_LIMIT = 1000;
const LOKAL_IP = "10.47.68.174";
const TUNNEL_URL = "https://rfof-master.loca.lt"; 
const API_URL = (window.location.hostname === LOKAL_IP) ? `http://${LOKAL_IP}:5050/api` : `${TUNNEL_URL}/api`;

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

        // Admin Visibility
        if(state.user && state.user.role === 'admin') {
            document.getElementById('admin-link').style.display = 'block';
        }

        // Global Progress
        const totalEur = db.global.eur || 0;
        const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qd47242e430d648c7007c2fbcbd15fa9ea468`);
        const btcData = await btcRes.json();
        const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
        
        document.getElementById('current-eur').textContent = `${totalEur % 1000} € (Round ${Math.floor(totalEur/1000)+1})`;
        document.getElementById('fill-eur').style.width = (totalEur % 1000 / 10) + "%";
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / ${BTC_GOAL} BTC`;
        document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";

        // User Sync
        if(state.user && db.users[state.user.username]) {
            const u = db.users[state.user.username];
            document.getElementById('user-balance').textContent = `${u.balance} BTC`;
            document.getElementById('user-btc-address').textContent = u.wallet;
            document.getElementById('phrases-display').textContent = u.phrases;
            document.getElementById('invite-link').textContent = `${window.location.origin}/?ref=${u.username}`;
            document.getElementById('nav-guest').style.display = 'none';
            document.getElementById('nav-user').style.display = 'block';
        }
    } catch(e) { console.error("Sync Error"); }
}

async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || 'none';

    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            register: { username: u, password: p, referrer: ref } 
        })
    });
    const data = await res.json();
    if(data.success) { alert("Wallet Created!"); showPage('login'); }
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ login: { username: u, password: p } })
    });
    const data = await res.json();
    if(data.user) {
        state.user = data.user;
        localStorage.setItem('session_user', JSON.stringify(data.user));
        location.reload();
    } else { alert("Wrong Credentials"); }
}

async function adminSetEur() {
    const val = document.getElementById('admin-eur-val').value;
    await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            admin_eur: val, 
            admin_token: "Satoramy_Secure_Gate_77" 
        })
    });
    updateView();
}

function togglePhrases() { document.getElementById('phrases-display').classList.toggle('ethik-blur'); }
function logout() { localStorage.clear(); location.reload(); }

document.addEventListener('DOMContentLoaded', updateView);