import os, time, subprocess, datetime

def get_system_state():
    # Dimensionale Logik: Wechselt alle 5 Minuten den Zustand
    # oder reagiert auf die Existenz einer 'trigger.txt' (Inbound-Signal)
    now = datetime.datetime.now()
    if now.minute % 10 < 5:
        return "WARM"
    else:
        return "COLD"

def manage_dimension():
    print("[META-AUTONOMY] Observer gestartet. Überwache Dimensionen...")
    active_processes = []
    
    while True:
        state = get_system_state()
        
        if state == "WARM":
            # Prüfen ob Prozesse laufen, falls nicht: START
            check = subprocess.run(['tasklist'], capture_output=True, text=True)
            if "python.exe" not in check.stdout:
                print(f"[{datetime.datetime.now()}] Trigger: WARM-NET. Starte Enforcer...")
                for i in range(1, 5):
                    subprocess.Popen(['python', f'script_{i}.py'], creationflags=subprocess.CREATE_NO_WINDOW)
        
        elif state == "COLD":
            # Erzwinge Abschaltung (Kill-Switch autonom)
            check = subprocess.run(['tasklist'], capture_output=True, text=True)
            if "python.exe" in check.stdout:
                print(f"[{datetime.datetime.now()}] Trigger: COLD-NET. Erzwinge Kill-Switch...")
                subprocess.run(['taskkill', '/F', '/IM', 'python.exe', '/T'], capture_output=True)
        
        time.sleep(10) # Prüf-Intervall der Dimensionen

if __name__ == '__main__':
    manage_dimension()
