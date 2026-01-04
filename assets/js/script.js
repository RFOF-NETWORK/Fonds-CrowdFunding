// Automatische Erkennung der API-URL
// Wir prüfen, ob wir lokal arbeiten oder über den Tunnel
const getApiUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://127.0.0.1:5050/api";
    }
    // Falls du eine spezifische Netzwerk-IP nutzt (wie in deinem Log 10.37.132.135)
    return `http://${window.location.hostname}:5050/api`;
};

const API_URL = getApiUrl();
let state = { user: JSON.parse(localStorage.getItem('session_user')) || null };

// Funktion zum Wechseln der Seiten (funktioniert immer lokal)
function showPage(pid) {
    console.log("Navigating to:", pid);
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + pid);
    if (target) target.style.display = 'block';
}

async function updateView() {
    try {
        const payload = state.user ? { sync_user: state.user.username } : {};
        const res = await fetch(`${API_URL}/sync`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(payload) 
        });
        
        if (!res.ok) throw new Error("Server not responding");
        
        const data = await res.json();
        const db = data.db;

        // Explorer füllen
        if(db.explorer && document.getElementById('global-explorer')) {
            document.getElementById('global-explorer').innerHTML = db.explorer.slice().reverse().join("<br>");
        }

        // User Interface Updates
        if(state.user && db.users[state.user.username]) {
            const u = db.users[state.user.username];
            state.user = u;
            document.getElementById('nav-guest').style.display = 'none';
            document.getElementById('nav-user').style.display = 'flex';
            
            if(u.role === 'admin') {
                const adminBtn = document.getElementById('admin-link');
                if(adminBtn) adminBtn.style.display = 'block';
            }
            
            document.getElementById('user-balance').textContent = `${u.balance} BTC`;
            document.getElementById('user-btc-address').textContent = u.wallet;
            document.getElementById('invite-link').textContent = `${window.location.origin}/?ref=${u.username}`;
            
            const histDiv = document.getElementById('user-history');
            if(histDiv) histDiv.innerHTML = u.history ? u.history.slice().reverse().join("<br>") : "No logs.";
        }

        document.getElementById('current-eur').textContent = `${db.global.eur} €`;
        document.getElementById('fill-eur').style.width = Math.min((db.global.eur % 1000 / 10), 100) + "%";
        
    } catch(e) { 
        console.error("Sync Error:", e);
        // Kleiner visueller Hinweis, dass der Server offline ist
        const explorer = document.getElementById('global-explorer');
        if(explorer) explorer.innerHTML = "<span style='color:red'>OFFLINE: Start server_logic.py</span>";
    }
}

async function handleLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    
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
            alert("Wrong credentials!");
        }
    } catch(e) {
        alert("Cannot connect to Backend! Is server_logic.py running?");
    }
}

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
            alert("Account created! You can now login.");
            showPage('login');
        }
    } catch(e) {
        alert("Registration failed. Backend unreachable.");
    }
}

function logout() { 
    localStorage.clear(); 
    location.reload(); 
}

document.addEventListener('DOMContentLoaded', () => {
    updateView();
    // Intervall für Live-Updates alle 5 Sekunden
    setInterval(updateView, 5000);
});