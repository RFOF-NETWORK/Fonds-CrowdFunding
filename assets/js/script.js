// Automatische Erkennung: Wir versuchen erst die lokale IP, dann localhost
const API_URL = "http://127.0.0.1:5050/api";

let state = { 
    user: JSON.parse(localStorage.getItem('session_user')) || null 
};

// Diese Funktion MUSS gehen, sie schaltet nur die Sichtbarkeit um
function showPage(pid) {
    console.log("Versuche Seite anzuzeigen:", pid);
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');
    
    const target = document.getElementById('page-' + pid);
    if (target) {
        target.style.display = 'block';
    } else {
        console.error("Seite nicht gefunden: page-" + pid);
    }
}

async function updateView() {
    try {
        const payload = state.user ? { sync_user: state.user.username } : {};
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(payload) 
        });
        
        const data = await res.json();
        const db = data.db;

        // Dashboard Updates
        if(db.explorer) {
            const exp = document.getElementById('global-explorer');
            if(exp) exp.innerHTML = db.explorer.slice().reverse().join("<br>");
        }

        // Login-Status prüfen
        if(state.user && db.users[state.user.username]) {
            const u = db.users[state.user.username];
            state.user = u;
            document.getElementById('nav-guest').style.display = 'none';
            document.getElementById('nav-user').style.display = 'flex';
            
            if(u.role === 'admin') {
                const adminLink = document.getElementById('admin-link');
                if(adminLink) adminLink.style.display = 'block';
            }

            // Account-Daten füllen
            const bal = document.getElementById('user-balance');
            if(bal) bal.textContent = `${u.balance} BTC`;
            
            const addr = document.getElementById('user-btc-address');
            if(addr) addr.textContent = u.wallet;
        }

        const eur = document.getElementById('current-eur');
        if(eur) eur.textContent = `${db.global.eur} €`;
        
    } catch(e) { 
        console.warn("Backend nicht erreichbar. Buttons im Account-Bereich könnten ohne API-Antwort hängen.");
    }
}

// LOGIN FUNKTION
async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    
    console.log("Login Versuch für:", u);
    
    try {
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
        } else {
            alert("Login fehlgeschlagen!");
        }
    } catch(e) {
        alert("Server antwortet nicht! Bitte 'server_logic.py' starten.");
    }
}

// REGISTER FUNKTION
async function handleRegister() {
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;
    try {
        const res = await fetch(`${API_URL}/sync`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ register: { username: u, password: p, referrer: 'none' } })
        });
        const data = await res.json();
        if(data.success) {
            alert("Account erstellt! Bitte einloggen.");
            showPage('login');
        }
    } catch(e) {
        alert("Registrierung fehlgeschlagen. Backend offline.");
    }
}

function logout() { 
    localStorage.clear(); 
    location.reload(); 
}

// Event-Listener beim Laden
document.addEventListener('DOMContentLoaded', () => {
    console.log("App gestartet");
    updateView();
});