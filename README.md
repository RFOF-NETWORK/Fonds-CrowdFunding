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
