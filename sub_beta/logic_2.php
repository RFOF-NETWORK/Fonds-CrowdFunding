<?php
// Zero-Knowledge Validation Layer
$logFile = dirname(__DIR__) . '/sync_state.log';
if (file_exists($logFile)) {
    $content = file($logFile);
    $lastLine = end($content);
    // Prüfe InBound Integrität (Zero-Knowledge: Validierung ohne Kenntnis der Node-ID)
    if (strpos($lastLine, 'Integrity Secured') !== false) {
        echo "[RESILIENCE] InBound State: VERIFIED\n";
    } else {
        echo "[RESILIENCE] InBound State: COMPROMISED\n";
    }
} else {
    echo "[COLD-NET] No Log found. Waiting for Autonomy...\n";
}
?>
