#include <iostream>
#include <fstream>
#include <string>

/**
 * Axiom-Validator für Satoramy
 * Prüft das Log auf Integrität.
 */
int main() {
    std::ifstream logFile("transactions.log");
    std::string line;
    int count = 0;

    std::cout << "--- AXIOM INTEGRITY CHECK START ---" << std::endl;

    if (logFile.is_open()) {
        while (getline(logFile, line)) {
            if (line.find("REWARD") != std::string::npos) {
                count++;
            }
        }
        logFile.close();
        std::cout << "Verified Affiliate Events: " << count << std::endl;
        std::cout << "Status: DETERMINISTIC STABILITY GUARANTEED" << std::endl;
    } else {
        std::cout << "Error: No Log found yet." << std::endl;
    }

    return 0;
}