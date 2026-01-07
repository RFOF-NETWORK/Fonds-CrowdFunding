import hashlib, os, datetime

def process_data(data, is_valid=True):
    # Generiere Hash für die Sichtbarkeit im WarmNET
    data_hash = hashlib.sha256(data.encode()).hexdigest()
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    if is_valid:
        # KORREKTE DATEN: Volltext ins ColdNET, nur Hash ins WarmNET
        with open(r'C:\dkmi-projekt-ordner\pykiller_coldNET\integrity_vault.log', 'a') as c:
            c.write(f"[{timestamp}] VALID_DATA: {data}\n")
        with open(r'C:\dkmi-projekt-ordner\pykiller_warmNET\sync_state.log', 'a') as w:
            w.write(f"[{timestamp}] HASH_REF: {data_hash} (STATUS: VERIFIED)\n")
    else:
        # FEHLGELAUFENE DATEN: Nur Hash ins ColdNET (zur Analyse)
        with open(r'C:\dkmi-projekt-ordner\pykiller_coldNET\error_vault.log', 'a') as c:
            c.write(f"[{timestamp}] FAILED_HASH: {data_hash}\n")
        print(f"[ALERT] Corrupt Data detected. Hash stored in ColdNET.")

# Beispiel-Trigger für den Master
process_data("MASTER_AI_CORE_CODE_v1.0", is_valid=True)
process_data("CORRUPT_INTRUSION_ATTEMPT", is_valid=False)
