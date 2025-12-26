// Konfiguration: Hier trägst du deine echten Zahlen ein
const GOAL = 1000;
const CURRENT_TOTAL = 0; // Hier den echten Stand manuell aktualisieren
const EURO = "\u20AC"; // Euro-Symbol sicher darstellen

document.addEventListener('DOMContentLoaded', () => {
    // 1. Jahr im Footer
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Elemente abrufen
    const currentAmountEl = document.getElementById("current-amount");
    const goalAmountEl = document.getElementById("goal-amount");
    const progressFillEl = document.getElementById("progress-fill");
    const progressTextEl = document.getElementById("progress-text");

    // 3. Berechnung
    const percentage = Math.min(100, Math.round((CURRENT_TOTAL / GOAL) * 100));

    // 4. UI aktualisieren
    if(currentAmountEl) currentAmountEl.textContent = CURRENT_TOTAL.toLocaleString("de-DE") + " " + EURO;
    if(goalAmountEl) goalAmountEl.textContent = GOAL.toLocaleString("de-DE") + " " + EURO;
    
    if(progressFillEl) progressFillEl.style.width = percentage + "%";
    if(progressTextEl) progressTextEl.textContent = percentage + " % des Ziels erreicht";

    // 5. Statische Nachricht für die Liste
    const donorListEl = document.getElementById("donor-list");
    if(donorListEl) {
        donorListEl.innerHTML = `<li>Vielen Dank f\u00FCr alle anonymen Bitcoin & PayPal Spenden!</li>`;
    }
});