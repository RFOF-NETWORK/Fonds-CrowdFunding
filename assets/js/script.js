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
        
        // Energie-Axiom Anzeige
        if(data.status === "Energy_Validated") {
            console.log("Axiom: Testnet Energy Proof-of-Work verified.");
        }

        const totalEur = data.db.global.eur || 0;
        document.getElementById('current-eur').textContent = `${totalEur % EUR_ROUND_LIMIT} € (Round ${Math.floor(totalEur/EUR_ROUND_LIMIT)+1})`;
        
        // BTC Relevanz (Mainnet Simulation)
        const btcRes = await fetch(`https://blockchain.info/rawaddr/bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d`);
        const btcData = await btcRes.json();
        const totalBtc = (btcData.final_balance / 100000000) + (totalEur / 90000);
        document.getElementById('text-btc').textContent = `${totalBtc.toFixed(8)} / ${BTC_GOAL} BTC`;

        if(state.user && data.db.users[state.user.username]) {
            const dbUser = data.db.users[state.user.username];
            document.getElementById('user-balance').textContent = `${dbUser.balance} BTC`;
        }
    } catch(e) { console.error("Axiom Drift detected. Bridge offline."); }
}

// ... handleLogin, handleRegister wie gehabt ...

document.addEventListener('DOMContentLoaded', () => { updateView(); setInterval(updateView, 10000); });