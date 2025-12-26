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