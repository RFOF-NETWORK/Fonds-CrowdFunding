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
    
    // Referral aus der URL extrahieren (?ref=Name)
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if(!u || !p) return alert("Please fill in Username and Password!");

    const newUserRequest = { 
        username: u, 
        email: e, 
        password: p, // Wichtig: 'password' statt 'pass' für Backend-Match
        referrer: ref,
        request_secure_wallet: true 
    };
    
    try {
        const res = await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_data: newUserRequest })
        });
        
        if (res.ok) {
            alert("Sato-Account created! Your secure wallet is ready.");
            showPage('login');
        } else {
            alert("Registration error. Username might be taken.");
        }
    } catch(err) { 
        alert("Bridge offline! Start server_logic.py on your PC."); 
    }
}

// --- LOGIN ---
async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    
    try {
        const response = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({}) 
        });
        const data = await response.json();
        const user = data.db.users[u];

        // Passwort-Check gegen die Datenbank
        if(user && (user.password === p || user.pass === p)) {
            state.user = user;
            localStorage.setItem('session_user', JSON.stringify(user));
            showPage('home');
        } else { 
            alert("Login failed! Check credentials."); 
        }
    } catch(err) { 
        alert("Bridge error! Is the Firewall blocking port 5050?"); 
    }
}

// --- VIEW UPDATE (REAL-TIME) ---
async function updateView() {
    const isUser = !!state.user;
    
    // Navigation umschalten
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    if(navGuest) navGuest.style.display = isUser ? 'none' : 'block';
    if(navUser) navUser.style.display = isUser ? 'block' : 'none';
    
    // Admin Link Check
    const isAdmin = state.user && state.user.username === ADMIN_ID;
    const adminLink = document.getElementById('admin-link');
    if(adminLink) adminLink.style.display = isAdmin ? 'inline-block' : 'none';

    try {
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({}) 
        });
        const data = await res.json();
        
        // Global Stats (EUR & Rounds)
        const totalEur = data.db.global.eur || 0;
        const currentRound = Math.floor(totalEur / EUR_ROUND_LIMIT) + 1;
        const progressEur = (totalEur % EUR_ROUND_LIMIT) / 10; // 1000€ = 100%

        document.getElementById('current-eur').textContent = `${totalEur % EUR_ROUND_LIMIT} € (Round ${currentRound})`;
        document.getElementById('fill-eur').style.width = progressEur + "%";

        // BTC Goal Tracker
        const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const btcData = await btcRes.json();
        const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
        
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / ${BTC_GOAL} BTC`;
        document.getElementById('fill-btc').style.width = (totalBtc / BTC_GOAL * 100) + "%";
        
        // User Dashboard Daten
        if(state.user && data.db.users[state.user.username]) {
            const dbUser = data.db.users[state.user.username];
            document.getElementById('user-btc-address').textContent = dbUser.wallet || "Generating...";
            document.getElementById('phrases-display').textContent = dbUser.phrases || "Secure phrases hidden.";
            document.getElementById('invite-link').textContent = `https://rfof-network.github.io/Fonds-CrowdFunding/?ref=${state.user.username}`;
        }
    } catch(e) { 
        console.log("Bridge Syncing..."); 
    }
}

// --- HELPER ---
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + id);
    if(target) target.style.display = 'block';
    updateView();
}

function togglePhrases() {
    const box = document.getElementById('phrases-display');
    if(box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        box.style.filter = 'none';
    } else {
        box.style.display = 'none';
    }
}

function logout() { 
    localStorage.clear(); 
    location.reload(); 
}

// Initialer Start
document.addEventListener('DOMContentLoaded', () => showPage('home'));