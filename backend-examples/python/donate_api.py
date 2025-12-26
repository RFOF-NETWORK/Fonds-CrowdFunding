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