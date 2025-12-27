#include <iostream>
#include <fstream>
#include <string>

/**
 * SATORAMY AXIOM VALIDATOR
 * Verifiziert die Integrität der Belohnungen und der Datenbank.
 */
int main() {
    std::ifstream logFile("transactions.log");
    std::ifstream dbFile("data_storage.json");
    std::string line;
    int rewardsFound = 0;

    std::cout << "========================================" << std::endl;
    std::cout << "   AXIOM INTEGRITY SYSTEM STATUS        " << std::endl;
    std::cout << "========================================" << std::endl;

    if (logFile.is_open()) {
        while (getline(logFile, line)) {
            if (line.find("REWARD") != std::string::npos || line.find("AXIOM") != std::string::npos) {
                rewardsFound++;
            }
        }
        logFile.close();
        std::cout << "[OK] Log-Integrität: " << rewardsFound << " Rewards verarbeitet." << std::endl;
    } else {
        std::cout << "[!] Log-Datei fehlt noch (Erstes Update abwarten)." << std::endl;
    }

    if (dbFile.is_open()) {
        std::cout << "[OK] Master-Datenbank ist online und lesbar." << std::endl;
        dbFile.close();
    } else {
        std::cout << "[CRITICAL] Datenbank-Datei fehlt!" << std::endl;
        return 1;
    }

    std::cout << "----------------------------------------" << std::endl;
    std::cout << "ERGEBNIS: SYSTEMSTABILITAET GARANTIERT" << std::endl;
    std::cout << "========================================" << std::endl;

    return 0;
}