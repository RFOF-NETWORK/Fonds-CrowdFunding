// Einfacher Demo-Client: simuliert Spenden lokal im Browser (localStorage)

const GOAL = 1000; // Spendenziel in Euro (anpassbar)
const STORAGEKEYAMOUNT = "democrowdfundingamount";
const STORAGEKEYDONORS = "democrowdfundingdonors";

const currentAmountEl = document.getElementById("current-amount");
const goalAmountEl = document.getElementById("goal-amount");
const progressFillEl = document.getElementById("progress-fill");
const progressTextEl = document.getElementById("progress-text");
const donorListEl = document.getElementById("donor-list");
const donationForm = document.getElementById("donation-form");
const yearEl = document.getElementById("year");

// Jahr im Footer
yearEl.textContent = new Date().getFullYear();

// Init
goalAmountEl.textContent = ${GOAL.toLocaleString("de-DE")} €;

// Aus localStorage laden
function loadState() {
    const storedAmount = Number(localStorage.getItem(STORAGEKEYAMOUNT) || "0");
    const storedDonors = localStorage.getItem(STORAGEKEYDONORS);
    let donors = [];

    if (storedDonors) {
        try {
            donors = JSON.parse(storedDonors);
        } catch (e) {
            donors = [];
        }
    }

    return { amount: storedAmount, donors };
}

// In localStorage speichern
function saveState(amount, donors) {
    localStorage.setItem(STORAGEKEYAMOUNT, String(amount));
    localStorage.setItem(STORAGEKEYDONORS, JSON.stringify(donors));
}

// UI aktualisieren
function updateUI(state) {
    const { amount, donors } = state;

    currentAmountEl.textContent = ${amount.toLocaleString("de-DE")} €;

    const percentage = Math.min(100, Math.round((amount / GOAL) * 100));
    progressFillEl.style.width = ${percentage}%;
    progressTextEl.textContent = ${percentage} % des Ziels erreicht;

    donorListEl.innerHTML = "";
    if (donors.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Noch keine Einträge – sei die erste Unterstützung (Demo).";
        donorListEl.appendChild(li);
    } else {
        donors
            .slice(-10)
            .reverse()
            .forEach(donor => {
                const li = document.createElement("li");
                const name = donor.name || "Anonym";
                li.innerHTML = <span>${name}</span><span>+${donor.amount.toLocaleString("de-DE")} €</span>;
                donorListEl.appendChild(li);
            });
    }
}

// Startzustand laden
let state = loadState();
updateUI(state);

// Formular-Submit (Demo-Spende)
donationForm.addEventListener("submit", event => {
    event.preventDefault();

    const amountInput = document.getElementById("donation-amount");
    const nameInput = document.getElementById("donor-name");

    const amount = Number(amountInput.value);
    const name = nameInput.value.trim();

    if (!amount || amount <= 0) {
        alert("Bitte gib einen gültigen Betrag ein.");
        return;
    }

    // State aktualisieren
    state.amount += amount;
    state.donors.push({
        name: name || null,
        amount,
        timestamp: new Date().toISOString()
    });

    saveState(state.amount, state.donors);
    updateUI(state);

    amountInput.value = "";
    nameInput.value = "";

    alert("Danke für deine Unterstützung! (Demo – kein echtes Geld geflossen)");
});