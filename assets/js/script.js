const BTC_GOAL = 1000;
const EUR_ROUND_LIMIT = 1000;
const ADMIN_ID = "Satoramy";
const LOKAL_IP = "10.47.68.174";
const TUNNEL_URL = "https://rfof-master.loca.lt"; 
const API_URL = (window.location.hostname === LOKAL_IP) ? `http://${LOKAL_IP}:5050/api` : `${TUNNEL_URL}/api`;

let state = { user: JSON.parse(localStorage.getItem('session_user')) || null };

async function updateView() {
    try {
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(state.user ? { user_data: { username: state.user.username } } : {}) 
        });
        const data = await res.json();
        
        // UI-Navigation Update
        const isUser = !!state.user;
        if(document.getElementById('nav-guest')) document.getElementById('nav-guest').style.display = isUser ? 'none' : 'block';
        if(document.getElementById('nav-user')) document.getElementById('nav-user').style.display = isUser ? 'block' : 'none';

        // EUR Anzeige & Fortschritt
        const totalEur = data.db.global.eur || 0;
        const currentRound = Math.floor(totalEur / EUR_ROUND_LIMIT) + 1;
        const roundEur = totalEur % EUR_ROUND_LIMIT;
        
        if(document.getElementById('current-eur')) {
            document.getElementById('current-eur').textContent = `${roundEur} € (Round ${currentRound})`;
            document.getElementById('fill-eur').style.width = (roundEur / 10) + "%"; // 1000€ = 100%
        }

        // BTC Anzeige & Blockchain-Sync
        try {
            const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
            const btcData = await btcRes.json();
            const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
            
            if(document.getElementById('text-btc')) {
                document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / ${BTC_GOAL} BTC`;
                document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";
            }
        } catch(e) { console.warn("Blockchain API Delay."); }

        // User-Daten Sync
        if(state.user && data.db.users[state.user.username]) {
            const dbUser = data.db.users[state.user.username];
            state.user = dbUser; // Sync state
            if(document.getElementById('user-balance')) document.getElementById('user-balance').textContent = `${dbUser.balance} BTC`;
            if(document.getElementById('user-btc-address')) document.getElementById('user-btc-address').textContent = dbUser.wallet;
        }
    } catch(e) { console.error("Axiom Drift detected. Bridge offline."); }
}

// Funktionen für Login/Register
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
            location.reload(); // Refresh um UI zu setzen
        } else { alert("Login fehlgeschlagen!"); }
    } catch(e) { alert("Bridge Connection Error!"); }
}

function logout() { localStorage.clear(); location.reload(); }

document.addEventListener('DOMContentLoaded', () => { 
    updateView(); 
    setInterval(updateView, 10000); 
});