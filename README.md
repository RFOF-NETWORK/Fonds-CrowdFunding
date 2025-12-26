# Fonds-CrowdFunding
InterBOxSpiderWeb.NET PRVPNRFAI.py 2025 - 2029
```
Fonds-CrowdFunding/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── backend-examples/
│   ├── python/
│   │   └── donate_api.py
│   ├── cpp/
│   │   └── donation_service.cpp
│   └── php/
│       └── donate.php
└── README.md
```

# Mein Crowdfunding – GitHub Pages Demo

Dies ist ein einfaches, statisches Crowdfunding-Frontend, das auf GitHub Pages deployt werden kann.

- `index.html` – Hauptseite mit Projektbeschreibung und Spenden-UI (Demo).
- `assets/css/style.css` – Styling.
- `assets/js/script.js` – Logik (lokale Demo mit `localStorage`).
- `backend-examples/` – Beispiele für mögliche Server-Implementierungen (Python, PHP, C++).  
  Diese laufen **nicht** auf GitHub Pages.

## Deployment auf GitHub Pages

1. Dieses Repository auf GitHub anlegen.
2. Code pushen.
3. In den Repository-Einstellungen unter "Pages" den Branch (z.B. `main`) und Root auswählen.
4. Nach wenigen Minuten ist die Seite unter der GitHub Pages URL erreichbar.

## Hinweis

Die aktuelle Version simuliert Spenden nur lokal im Browser.  
Für echtes Geld / echte Transaktionen musst du:
- einen Zahlungsdienstleister (PayPal, Stripe usw.) anbinden **oder**
- einen eigenen Server aufsetzen (siehe `backend-examples/`) und das Frontend mit echter API verbinden.
---
# BAUPLAN

Hier ist ein kleines, sauberes Repo-Skelett als Startpunkt für deine eigene Crowdfunding-/Spenden-Seite auf GitHub Pages.

---

Repository-Struktur

`text
mein-crowdfunding/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── backend-examples/
│   ├── python/
│   │   └── donate_api.py
│   ├── cpp/
│   │   └── donation_service.cpp
│   └── php/
│       └── donate.php
└── README.md
`

Wichtig: GitHub Pages kann nur die statische Seite (index.html, CSS, JS) ausliefern.  
Die Dateien in backend-examples/ sind Vorlagen für einen späteren eigenen Server (Python, C++, PHP), laufen aber nicht direkt auf GitHub Pages.

---

index.html

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Mein Crowdfunding – Spendenplattform</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Persönliche Crowdfunding-Seite für freiwillige Spenden.">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1>Mein Crowdfunding Projekt</h1>
            <p class="subtitle">Unterstütze dieses Projekt mit einer freiwilligen Spende.</p>
        </div>
    </header>

    <main class="container">
        <section class="project-info">
            <h2>Projektbeschreibung</h2>
            <p>
                Dieses Projekt sammelt freiwillige Beiträge, um unabhängige Entwicklung, Forschung und
                transparente Technologien zu finanzieren. Jede Spende – egal wie klein – hilft.
            </p>
        </section>

        <section class="donation-status">
            <h2>Spendenstatus</h2>
            <div class="status-box">
                <div class="status-row">
                    <span>Aktuell gesammelt:</span>
                    <span id="current-amount">0 €</span>
                </div>
                <div class="status-row">
                    <span>Spendenziel:</span>
                    <span id="goal-amount">1.000 €</span>
                </div>
                <div class="progress-bar">
                    <div id="progress-fill"></div>
                </div>
                <p id="progress-text">0 % des Ziels erreicht</p>
                <p class="note">
                    Hinweis: Auf dieser Demo-Seite werden Spenden lokal im Browser gespeichert (kein echtes Geld, kein echter Transfer).
                </p>
            </div>
        </section>

        <section class="donation-form">
            <h2>Jetzt spenden</h2>
            <form id="donation-form">
                <label for="donation-amount">Betrag in Euro</label>
                <input type="number" id="donation-amount" min="1" step="1" required placeholder="z.B. 10">

                <label for="donor-name">Name (optional)</label>
                <input type="text" id="donor-name" placeholder="Dein Name oder anonym">

                <button type="submit">Spende hinzufügen (Demo)</button>
            </form>

            <p class="small-note">
                Diese Demo simuliert eine Spende nur lokal mit JavaScript. 
                Für echte Zahlungen müsstest du z.B. PayPal, Stripe o.ä. einbinden oder deinen eigenen Server nutzen.
            </p>

            <div class="external-donation">
                <h3>Externe Bezahl-Links (Platzhalter)</h3>
                <p>
                    Du kannst hier später echte Zahlungs-Provider einbauen (z.B. PayPal-Button oder Stripe Checkout).
                </p>
                <!-- Beispiel-Button: Ersetze # durch deinen echten Payment-Link -->
                <a href="#" class="btn-secondary" target="_blank" rel="noopener noreferrer">
                    Externer Spendenlink (Platzhalter)
                </a>
            </div>
        </section>

        <section class="donor-list-section">
            <h2>Letzte Unterstützer (Demo)</h2>
            <ul id="donor-list" class="donor-list">
                <!-- Wird per JavaScript gefüllt -->
            </ul>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>© <span id="year"></span> Mein Crowdfunding Projekt. Alle Rechte vorbehalten.</p>
        </div>
    </footer>

    <script src="assets/js/script.js"></script>
</body>
</html>
```

---

assets/css/style.css

```css
/ Grundlayout /

:root {
    --bg-color: #0b1020;
    --card-bg: #131933;
    --accent: #ffb400;
    --accent-soft: #ffb40033;
    --text-main: #f5f5f5;
    --text-muted: #a0a4b8;
    --danger: #ff4b4b;
    --success: #25d366;
    --border-radius: 10px;
    --transition-fast: 0.2s ease;
    --shadow-soft: 0 10px 25px rgba(0, 0, 0, 0.35);
    --font-main: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: var(--font-main);
    background: radial-gradient(circle at top, #181f3b, #050715 55%);
    color: var(--text-main);
    line-height: 1.6;
    min-height: 100vh;
}

/ Container /

.container {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 1.5rem;
}

/ Header /

.site-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(to bottom, rgba(15, 23, 42, 0.9), transparent);
    backdrop-filter: blur(10px);
}

.site-header h1 {
    font-size: 2rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.subtitle {
    color: var(--text-muted);
    margin-top: 0.5rem;
}

/ Hauptbereiche /

main {
    padding-top: 1rem;
    padding-bottom: 2rem;
}

section {
    margin-bottom: 2rem;
}

h2 {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
}

p {
    margin-bottom: 0.75rem;
}

/ Karten / Boxen /

.status-box {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 1.25rem;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(255, 255, 255, 0.03);
}

.status-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

/ Fortschrittsbalken /

.progress-bar {
    width: 100%;
    height: 12px;
    background: #0b1020;
    border-radius: 999px;
    overflow: hidden;
    margin: 0.75rem 0;
    border: 1px solid rgba(255, 255, 255, 0.06);
}

progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #ffb400, #ff6b00);
    transition: width 0.4s ease;
}

progress-text {
    font-size: 0.9rem;
    color: var(--text-muted);
}

/ Formular /

.donation-form form {
    background: var(--card-bg);
    padding: 1.25rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(255, 255, 255, 0.03);
}

.donation-form label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.donation-form input {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #050715;
    color: var(--text-main);
    margin-bottom: 0.9rem;
    font-size: 0.95rem;
    outline: none;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.donation-form input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent-soft);
}

/ Buttons /

button,
.btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 1.1rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    text-decoration: none;
    transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast), color var(--transition-fast);
}

button[type="submit"] {
    background: var(--accent);
    color: #151515;
    box-shadow: 0 8px 18px rgba(255, 180, 0, 0.35);
    width: 100%;
    margin-top: 0.25rem;
}

button[type="submit"]:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(255, 180, 0, 0.45);
}

.btn-secondary {
    margin-top: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: transparent;
    color: var(--text-main);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-1px);
}

/ Hinweise /

.note {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.small-note {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.75rem;
}

/ Donor-Liste /

.donor-list-section {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 1.25rem;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(255, 255, 255, 0.03);
}

.donor-list {
    list-style: none;
    margin-top: 0.5rem;
}

.donor-list li {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    padding: 0.4rem 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}

.donor-list li:last-child {
    border-bottom: none;
}

/ Footer /

.site-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1rem 0;
    background: rgba(5, 7, 21, 0.95);
    text-align: center;
}

.site-footer p {
    margin-bottom: 0;
    font-size: 0.8rem;
    color: var(--text-muted);
}

/ Responsiv /

@media (min-width: 768px) {
    .project-info,
    .donation-status,
    .donation-form,
    .donor-list-section {
        border-radius: var(--border-radius);
    }

    main {
        padding-top: 2rem;
    }
}
```

---

assets/js/script.js

```javascript
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
```

---

backend-examples/python/donate_api.py

```python
"""
Einfache Beispiel-API (Python + Flask) für echte Spenden.
Läuft NICHT auf GitHub Pages – du brauchst eigenen Server/Host.

Installation:
    pip install flask

Start:
    python donate_api.py
"""

from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(name)

In-Memory Beispiel. In echt: Datenbank.
donations = []


@app.route("/api/donate", methods=["POST"])
def donate():
    data = request.json or {}
    amount = data.get("amount")
    name = data.get("name", "Anonym")

    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({"error": "Ungültiger Betrag"}), 400

    donation = {
        "name": name,
        "amount": float(amount),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    donations.append(donation)

    # In echt würdest du hier Payment-Provider ansprechen (Stripe, PayPal, etc.)
    return jsonify({"status": "ok", "donation": donation}), 201


@app.route("/api/donations", methods=["GET"])
def list_donations():
    return jsonify({"donations": donations})


if name == "main":
    app.run(debug=True)
```

---

backend-examples/php/donate.php

```php
<?php
/
 * Einfache PHP-Beispiel-Endpoint für Spenden.
 * Läuft NICHT auf GitHub Pages – du brauchst einen PHP-Server.
 */

header('Content-Type: application/json; charset=utf-8');

// Nur POST zulassen
if ($SERVER['REQUESTMETHOD'] !== 'POST') {
    httpresponsecode(405);
    echo json_encode(['error' => 'Nur POST erlaubt']);
    exit;
}

// JSON Body lesen
$input = jsondecode(fileget_contents('php://input'), true);
$amount = $input['amount'] ?? null;
$name = $input['name'] ?? 'Anonym';

if (!is_numeric($amount) || $amount <= 0) {
    httpresponsecode(400);
    echo json_encode(['error' => 'Ungültiger Betrag']);
    exit;
}

// In echt: hier Payment Provider ansprechen (Stripe, PayPal, etc.)
// Und Spende speichern (Datenbank)

$donation = [
    'name' => $name,
    'amount' => (float) $amount,
    'timestamp' => gmdate('c'),
];

echo json_encode([
    'status' => 'ok',
    'donation' => $donation,
]);
```

---

backend-examples/cpp/donation_service.cpp

```cpp
// Minimaler C++ HTTP-Server-Beispielcode (Konzept; für echte Nutzung brauchst du eine HTTP-Library)
// Läuft NICHT auf GitHub Pages. 
// Libraries: z.B. cpp-httplib, Crow, Pistache, etc.

include <iostream>

int main() {
    std::cout << "Donation Service (C++ Stub)\n";
    std::cout << "Hier würdest du eine HTTP-Library einbinden und\n";
    std::cout << "POST /donate Endpoints implementieren, die mit einem Payment-Provider sprechen.\n";
    return 0;
}
```

---

🧭 Ziel: Eigenes GitHub-Repo erstellen und pushen

🔧 Voraussetzungen
- Du hast ein GitHub-Account.
- Du bist im Terminal in deinem Projektordner (Fonds-CrowdFunding).
- Du willst nicht klonen, sondern dein eigenes Repo hochladen.

---

🪜 Schritt-für-Schritt Git-Befehle

1. 🔐 GitHub mit deinem Terminal verbinden (nur einmal nötig)

`bash
git config --global user.name "Justin"
git config --global user.email "deine@email.de"
`

Falls du GitHub mit SSH nutzen willst (empfohlen für Mobilität):

`bash
ssh-keygen -t ed25519 -C "deine@email.de"
`

Dann den öffentlichen Schlüssel (~/.ssh/id_ed25519.pub) zu GitHub unter  
Settings → SSH and GPG keys → New SSH key hinzufügen.

---

2. 🏗️ Neues Repository auf GitHub erstellen

Gehe auf github.com, klicke auf New Repository, z.B.:

- Name: Fonds-CrowdFunding
- Beschreibung: „Crowdfunding für Fonds-Einzahlungen 2025–2029“
- Öffentlich oder privat
- Kein README, keine .gitignore, keine Lizenz hinzufügen (du hast das lokal schon)

---

3. 🔗 Remote-Verbindung zum GitHub-Repo herstellen

Wenn du HTTPS nutzt:

`bash
git remote add origin https://github.com/deinUser/Fonds-CrowdFunding.git
`

Wenn du SSH nutzt:

`bash
git remote add origin git@github.com:deinUser/Fonds-CrowdFunding.git
`

---

4. 🚀 Projekt pushen

`bash
git branch -M main
git push -u origin main
`

Jetzt ist dein Projekt live auf GitHub.

---

🌐 GitHub Pages aktivieren

1. Gehe in dein Repository auf GitHub.
2. Klicke auf Settings → Pages.
3. Wähle Branch: main, Ordner: /root (falls index.html im Hauptverzeichnis liegt).
4. Speichern → Deine Seite ist bald unter https://deinUser.github.io/Fonds-CrowdFunding/ erreichbar.

---

📱 Mobilität & Gerätewechsel

Damit du dein Projekt von überall verwalten kannst:

🔑 SSH für Mobilität
- Richte SSH auf jedem Gerät ein (Laptop, Tablet, Server).
- Füge den öffentlichen Schlüssel zu GitHub hinzu.
- Du kannst dann überall per git push, git pull arbeiten.

📦 GitHub App oder Web
- Du kannst Dateien direkt über die GitHub-Weboberfläche hochladen, bearbeiten oder Issues verwalten.
- Die GitHub Mobile App erlaubt dir, Repos zu verfolgen, Commits zu kommentieren, aber nicht direkt zu pushen.

🧠 GitHub CLI (optional)
Falls du mobil mit GitHub CLI arbeiten willst:

`bash
gh auth login
gh repo create Fonds-CrowdFunding --public --source=. --remote=origin
`

---

🧭 Zusammenfassung der wichtigsten Befehle

`bash

Initialisierung (hast du schon gemacht)
git init
git add .
git commit -m "first commit"

GitHub verbinden
git remote add origin https://github.com/deinUser/Fonds-CrowdFunding.git
git branch -M main
git push -u origin main
`

---


