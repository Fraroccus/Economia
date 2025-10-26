# App Gestione Economica Personale

Un'app mobile per la gestione economica personale con focus sulla trasparenza fiscale, particolarmente utile per chi ha partita IVA.

## Funzionalità Principali

### 1. 📊 Dashboard
- Visualizzazione saldo attuale (entrate nette - spese)
- Statistiche per periodo: ultima settimana / ultimo mese / ultimo anno
- Grafici riepilogativi di entrate, spese e saldo

### 2. 💰 Gestione Entrate
- Registrazione entrate con tipologia "Stipendio" o "Altro"
- Calcolo automatico del netto in base al regime fiscale
- Visualizzazione separata di importo lordo e netto
- Modifica ed eliminazione entrate

### 3. 💸 Gestione Spese
- Registrazione spese con descrizione e importo
- Lista cronologica delle spese
- Modifica ed eliminazione spese

### 4. 📋 Sezione Fiscale
- Configurazione regime fiscale (Dipendente / P.IVA Forfettario / P.IVA Ordinario / Altro)
- Impostazione RAL prevista annuale
- Calcolo automatico di:
  - Imposte totali annue
  - Contributi INPS annui
  - Netto annuo previsto
- Visualizzazione importo già accantonato nell'anno corrente

### 5. ⚙️ Setup Fiscale
Durante l'onboarding iniziale, l'utente configura:
- **Dipendente**: aliquota IRPEF stimata e detrazioni
- **P.IVA Forfettario**: coefficiente di redditività, aliquota sostitutiva (5% o 15%), contributi INPS
- **P.IVA Ordinario**: scaglioni IRPEF, addizionali regionali/comunali, contributi INPS
- Possibilità di modificare le impostazioni in qualsiasi momento

## Stack Tecnologico

- **Framework**: React Native con Expo
- **Navigation**: React Navigation (Bottom Tabs)
- **Database**: SQLite (expo-sqlite) per storage locale
- **UI**: React Native components nativi

## Installazione e Avvio

### Prerequisiti
- Node.js installato
- npm o yarn

### Avvio in modalità sviluppo

1. Installa Expo Go sul tuo dispositivo mobile:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Avvia il server di sviluppo:
```bash
npm start
```

3. Scansiona il QR code con:
   - **iOS**: Apri la fotocamera e scansiona il QR code
   - **Android**: Apri Expo Go e scansiona il QR code

### Comandi disponibili

- `npm start` - Avvia il server di sviluppo
- `npm run android` - Avvia su emulatore Android
- `npm run ios` - Avvia su simulatore iOS (solo macOS)
- `npm run web` - Avvia versione web

## Struttura del Progetto

```
Economia/
├── src/
│   ├── database/
│   │   └── database.js          # Configurazione SQLite e query
│   ├── screens/
│   │   ├── OnboardingScreen.js  # Setup fiscale iniziale
│   │   ├── DashboardScreen.js   # Dashboard con statistiche
│   │   ├── EntrateScreen.js     # Gestione entrate
│   │   ├── SpeseScreen.js       # Gestione spese
│   │   └── FiscaleScreen.js     # Sezione fiscale e stime
│   └── utils/
│       └── fiscalCalculations.js # Logica calcoli fiscali
├── App.js                        # Entry point con navigation
└── package.json
```

## Calcoli Fiscali

### Dipendente
```
Netto = Lordo - (Lordo × Aliquota IRPEF) + Detrazioni
```

### P.IVA Forfettario
```
Reddito Imponibile = Lordo × Coefficiente Redditività
Imposta Sostitutiva = Reddito Imponibile × Aliquota Sostitutiva
Contributi INPS = Reddito Imponibile × 26.23%
Netto = Lordo - Imposta Sostitutiva - Contributi INPS
```

### P.IVA Ordinario
```
IRPEF = Calcolo su scaglioni (23%, 25%, 35%, 43%)
Addizionali = Lordo × (Aliquota Regionale + Aliquota Comunale)
Contributi INPS = Lordo × 26.23%
Netto = Lordo - IRPEF - Addizionali - Contributi INPS
```

## Note Importanti

- Tutti i dati sono salvati localmente sul dispositivo
- L'app è completamente in italiano
- I calcoli fiscali sono stime basate sui parametri configurati dall'utente
- Gli scaglioni IRPEF sono quelli del 2024

## Prossimi Sviluppi Possibili

- [ ] Categorie personalizzate per le spese
- [ ] Export dei dati in CSV/PDF
- [ ] Grafici e statistiche avanzate
- [ ] Promemoria per scadenze fiscali
- [ ] Backup e sincronizzazione cloud
- [ ] Supporto multi-valuta

## Licenza

Progetto personale per gestione economica.
