// --- KONFIGURATION ---
const BTC_GOAL = 1000;
const EUR_GOAL = 1000;
const ADMIN_USERNAME = "RFOFsocialCLUB"; // Dein Admin Account

let state = {
    currentUser: JSON.parse(localStorage.getItem('loggedUser')) || null,
    manualEur: parseFloat(localStorage.getItem('manualEur')) || 0,
    btcBalance: 0
};

// --- NAVIGATION ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';
    updateUI();
}

// --- ACCOUNT LOGIK ---
function handleRegister() {
    const user = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if(!user || !pass) return alert("Fill all fields");

    // Wallet Generation (Axiomatisch)
    const entropy = Math.random().toString(36).substring(2);
    const phrases = "shield atom logic fruit salt ocean vintage arrow unit bulk ready atom"; // Beispiel-Phrasen
    const walletAddr = "bc1q" + btoa(user + entropy).substring(0, 30).toLowerCase();

    const userData = { user, email, pass, walletAddr, phrases, invites: 0 };
    localStorage.setItem('db_user_' + user, JSON.stringify(userData));
    alert("Account created! Welcome.");
    showPage('login');
}

function handleLogin() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const stored = JSON.parse(localStorage.getItem('db_user_' + user));

    if(stored && stored.pass === pass) {
        state.currentUser = stored;
        localStorage.setItem('loggedUser', JSON.stringify(stored));
        showPage('home');
    } else {
        alert("Wrong credentials");
    }
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('loggedUser');
    location.reload();
}

// --- ADMIN LOGIK ---
function adminSetEur() {
    const val = document.getElementById('admin-eur-val').value;
    state.manualEur = parseFloat(val);
    localStorage.setItem('manualEur', state.manualEur);
    updateUI();
    alert("EUR and BTC progress updated.");
}

// --- UI UPDATE & BLOCKCHAIN ---
async function updateUI() {
    // Nav Visibility
    document.getElementById('nav-guest').style.display = state.currentUser ? 'none' : 'block';
    document.getElementById('nav-user').style.display = state.currentUser ? 'block' : 'none';
    if(state.currentUser && state.currentUser.user === ADMIN_USERNAME) {
        document.getElementById('admin-link').style.display = 'inline-block';
    }

    // EUR Progress
    const eurPercent = Math.min(100, (state.manualEur / EUR_GOAL) * 100);
    document.getElementById('current-eur').textContent = state.manualEur + " €";
    document.getElementById('fill-eur').style.width = eurPercent + "%";

    // BTC Progress (Live + EUR Impact)
    try {
        const resp = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const data = await resp.json();
        const liveBtc = data.final_balance / 100000000;
        
        // Deine Logik: EUR Zahlungen füllen den BTC Balken mit (simuliert)
        const btcFromEur = state.manualEur / 90000; // EUR zu BTC Kurs
        const totalBtcProgress = liveBtc + btcFromEur;
        const btcPercent = Math.min(100, (totalBtcProgress / BTC_GOAL) * 100);

        document.getElementById('fill-btc').style.width = btcPercent + "%";
        document.getElementById('text-btc').textContent = totalBtcProgress.toFixed(6) + " / 1000 BTC";
    } catch(e) { console.log("Blockchain delay..."); }

    // Profile Data
    if(state.currentUser) {
        document.getElementById('user-btc-address').textContent = state.currentUser.walletAddr;
        document.getElementById('phrases-display').textContent = state.currentUser.phrases;
        document.getElementById('invite-link').textContent = "https://rfof-network.github.io/Fonds-CrowdFunding/?ref=" + state.currentUser.user;
    }
}

function togglePhrases() {
    const el = document.getElementById('phrases-display');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', updateUI);