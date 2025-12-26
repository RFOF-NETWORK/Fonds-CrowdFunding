const BTC_ADDRESS = "bc1qh7ucw0kmz0m3m808zhvxed46ma80f4yc92ph7d";
const GOAL_EUR = 1000;
const GOAL_BTC = 1000;
const MANUAL_EUR = 0; // Hier deine PayPal-Eingänge eintragen

async function updateLiveDonations() {
    // 1. Euro Update
    const eurPercent = Math.min(100, (MANUAL_EUR / GOAL_EUR) * 100);
    document.getElementById('current-eur').textContent = MANUAL_EUR + " \u20AC";
    document.getElementById('fill-eur').style.width = eurPercent + "%";
    document.getElementById('text-eur').textContent = Math.round(eurPercent) + "% erreicht";

    // 2. Bitcoin Live Abfrage
    try {
        const response = await fetch(`https://blockchain.info/rawaddr/${BTC_ADDRESS}`);
        const data = await response.json();
        
        // Umrechnung von Satoshis in BTC
        const btcBalance = data.final_balance / 100000000;
        const btcPercent = Math.min(100, (btcBalance / GOAL_BTC) * 100);

        document.getElementById('current-btc').textContent = btcBalance.toFixed(8) + " BTC";
        document.getElementById('fill-btc').style.width = btcPercent + "%";
        document.getElementById('text-btc').textContent = btcPercent.toFixed(4) + "% des Ziels erreicht";
    } catch (e) {
        document.getElementById('text-btc').textContent = "Blockchain-Daten tempor\u00E4r nicht verf\u00FCgbar";
    }
}

document.addEventListener('DOMContentLoaded', updateLiveDonations);