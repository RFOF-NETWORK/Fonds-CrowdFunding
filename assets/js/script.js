// AXIOMATIC CONFIG
const BTC_GOAL = 1000;
const EUR_GOAL = 1000;
const ADMIN_ID = "RFOFsocialCLUB"; 

let state = {
    user: JSON.parse(localStorage.getItem('session_user')) || null,
    eurValue: parseFloat(localStorage.getItem('global_eur')) || 0
};

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + id).style.display = 'block';
    updateView();
}

function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-pass').value;
    if(!u || !p) return;

    // Wallet Axiom: Generate on registration
    const phrases = "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu"; 
    const wallet = "bc1q" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const newUser = { username: u, email: e, pass: p, wallet, phrases, invites: 0 };
    localStorage.setItem('db_user_' + u, JSON.stringify(newUser));
    alert("Account created. Phrases secured.");
    showPage('login');
}

function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    const dbUser = JSON.parse(localStorage.getItem('db_user_' + u));

    if(dbUser && dbUser.pass === p) {
        state.user = dbUser;
        localStorage.setItem('session_user', JSON.stringify(dbUser));
        showPage('home');
    } else {
        alert("Invalid login.");
    }
}

function logout() {
    localStorage.removeItem('session_user');
    location.reload();
}

function adminSetEur() {
    const val = document.getElementById('admin-eur-val').value;
    state.eurValue = parseFloat(val);
    localStorage.setItem('global_eur', state.eurValue);
    updateView();
}

async function updateView() {
    // Nav Logic
    document.getElementById('nav-guest').style.display = state.user ? 'none' : 'block';
    document.getElementById('nav-user').style.display = state.user ? 'block' : 'none';
    if(state.user && state.user.username === ADMIN_ID) {
        document.getElementById('admin-link').style.display = 'inline-block';
    }

    // Progress Logic
    document.getElementById('current-eur').textContent = state.eurValue + " €";
    const eurFill = (state.eurValue / EUR_GOAL) * 100;
    document.getElementById('fill-eur').style.width = Math.min(100, eurFill) + "%";

    try {
        const res = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const data = await res.json();
        const liveBtc = data.final_balance / 100000000;
        
        // Multi-Growth: EUR value adds to BTC progress (Simulated Conversion)
        const btcFromEur = state.eurValue / 90000; 
        const totalBtc = liveBtc + btcFromEur;
        
        document.getElementById('fill-btc').style.width = Math.min(100, (totalBtc / BTC_GOAL) * 100) + "%";
        document.getElementById('text-btc').textContent = totalBtc.toFixed(6) + " / 1000 BTC";
    } catch(err) { console.log("Blockchain Sync..."); }

    // User Data
    if(state.user) {
        document.getElementById('user-btc-address').textContent = state.user.wallet;
        document.getElementById('phrases-display').textContent = state.user.phrases;
        document.getElementById('invite-link').textContent = "https://rfof-network.github.io/Fonds-CrowdFunding/?ref=" + state.user.username;
    }
}

function togglePhrases() {
    const d = document.getElementById('phrases-display');
    d.style.display = d.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', updateView);