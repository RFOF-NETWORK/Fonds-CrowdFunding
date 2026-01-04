const LOKAL_IP = "10.47.68.174";
const API_URL = (window.location.hostname === LOKAL_IP) ? `http://${LOKAL_IP}:5050/api` : `https://rfof-master.loca.lt/api`;

let state = { user: JSON.parse(localStorage.getItem('session_user')) || null };

function showPage(pid) {
    // Verstecke alle Seiten
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    // Zeige gewünschte Seite
    const target = document.getElementById('page-' + pid);
    if(target) target.style.display = 'block';
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

        // AUTH CHECK & UI ADAPTATION
        if(state.user && db.users[state.user.username]) {
            const u = db.users[state.user.username];
            state.user = u; // Update local state with DB data
            
            document.getElementById('nav-guest').style.display = 'none';
            document.getElementById('nav-user').style.display = 'block';
            
            // Satoramy Admin Check
            if(u.role === 'admin') {
                document.getElementById('admin-link').style.display = 'block';
            }
            
            // Profile Data Update
            document.getElementById('user-balance').textContent = `${u.balance} BTC`;
            document.getElementById('user-btc-address').textContent = u.wallet;
            document.getElementById('phrases-display').textContent = u.phrases;
            document.getElementById('invite-link').textContent = `${window.location.origin}/?ref=${u.username}`;
            
            const histDiv = document.getElementById('user-history');
            histDiv.innerHTML = u.history && u.history.length > 0 ? 
                u.history.slice().reverse().map(entry => `<div>${entry}</div>`).join("") : 
                "No activity recorded yet.";
        } else {
            document.getElementById('nav-guest').style.display = 'block';
            document.getElementById('nav-user').style.display = 'none';
        }

        // Global Progress Update
        const totalEur = db.global.eur || 0;
        document.getElementById('current-eur').textContent = `${totalEur} €`;
        document.getElementById('fill-eur').style.width = Math.min((totalEur % 1000 / 10), 100) + "%";
        
        // BTC Calculation (Dummy Logic for UI, synced with Master-Admin)
        const totalBtc = (totalEur / 90000); // Beispielhafter Kurs
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(4)} / 1000 BTC`;
        document.getElementById('fill-btc').style.width = (totalBtc / 1000 * 100) + "%";

    } catch(e) { console.warn("Connection to Sato-Bridge failed."); }
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ login: { username: u, password: p } })
    });
    const data = await res.json();
    if(data.user) {
        state.user = data.user;
        localStorage.setItem('session_user', JSON.stringify(data.user));
        location.reload(); // Re-Init View
    } else {
        alert("Invalid Credentials.");
    }
}

async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;
    if(!u || !p) return alert("Please fill all fields.");
    
    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            register: { 
                username: u, 
                password: p, 
                referrer: new URLSearchParams(window.location.search).get('ref') || 'none' 
            } 
        })
    });
    const data = await res.json();
    if(data.success) {
        alert("Account & Wallet generated!");
        showPage('login');
    }
}

async function updateAccount() {
    const newPass = document.getElementById('set-pass').value;
    const newEmail = document.getElementById('set-email').value;
    
    const res = await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            update_settings: { 
                username: state.user.username, 
                new_password: newPass, 
                new_email: newEmail 
            } 
        })
    });
    const data = await res.json();
    if(data.success) {
        alert("Settings Saved!");
        document.getElementById('set-pass').value = "";
        updateView();
    }
}

async function adminSetEur() {
    const val = document.getElementById('admin-eur-val').value;
    await fetch(`${API_URL}/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ admin_eur: val, admin_token: "Satoramy_Secure_Gate_77" })
    });
    alert("Database Synced & Rewards Distributed.");
    updateView();
}

function togglePhrases() { document.getElementById('phrases-display').classList.toggle('ethik-blur'); }
function logout() { localStorage.clear(); location.reload(); }

document.addEventListener('DOMContentLoaded', () => {
    updateView();
    // Wenn eingeloggt, zeige Home, sonst Login
    if(!state.user) showPage('home'); 
});