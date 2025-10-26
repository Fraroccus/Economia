# Guida Rapida d'Uso - App Gestione Economica

## 🚀 Come Avviare l'App

### Su Smartphone (Consigliato)

1. **Installa Expo Go** sul tuo telefono:
   - iPhone: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Avvia il server** (già fatto - vedi QR code nel terminale)

3. **Scansiona il QR code**:
   - **iPhone**: Apri la fotocamera e punta sul QR code
   - **Android**: Apri Expo Go e premi "Scan QR code"

4. L'app si caricherà automaticamente sul tuo telefono!

### Su Web Browser

Premi `w` nel terminale per aprire la versione web (meno ottimizzata per mobile)

---

## 📱 Primo Utilizzo

### 1. Configurazione Iniziale (Onboarding)

Al primo avvio ti verrà chiesto di configurare il tuo regime fiscale:

**Step 1: Selezione Regime**
- Scegli tra: Dipendente, P.IVA Forfettario, P.IVA Ordinario, Altro

**Step 2: Parametri Fiscali**

**Per Dipendenti:**
- Aliquota IRPEF media (es. 23%, 25%, 35%, 43%)
- Detrazioni annuali (se applicabili)

**Per P.IVA Forfettario:**
- Coefficiente di redditività:
  - 78% per servizi professionali
  - 67% per commercio
  - 86% per altri professionisti
- Aliquota sostitutiva: 5% (primi 5 anni) o 15%
- Contributi INPS: 26.23% (default)

**Per P.IVA Ordinario:**
- Addizionale regionale (varia per regione, es. 1.23%)
- Addizionale comunale (varia per comune, es. 0.8%)
- Contributi INPS: 26.23% (default)

---

## 💰 Gestione Entrate

### Aggiungere una Nuova Entrata

1. Vai alla tab **"Entrate"** (icona 💰)
2. Premi **"+ Nuova Entrata"**
3. Compila i campi:
   - **Tipo**: "Stipendio" (calcolo automatico) o "Altro" (nessun calcolo)
   - **Importo Lordo**: l'importo prima delle tasse
   - **Descrizione**: (opzionale) es. "Stipendio Gennaio"
4. Premi **"Aggiungi"**

**Nota**: Se selezioni "Stipendio", il netto verrà calcolato automaticamente!

### Modificare/Eliminare un'Entrata

- **Modifica**: Premi l'icona ✏️ sulla card dell'entrata
- **Elimina**: Premi l'icona 🗑️ e conferma

---

## 💸 Gestione Spese

### Aggiungere una Nuova Spesa

1. Vai alla tab **"Spese"** (icona 💸)
2. Premi **"+ Nuova Spesa"**
3. Compila i campi:
   - **Descrizione**: es. "Spesa supermercato"
   - **Importo**: l'importo della spesa
4. Premi **"Aggiungi"**

### Modificare/Eliminare una Spesa

- **Modifica**: Premi l'icona ✏️ sulla card della spesa
- **Elimina**: Premi l'icona 🗑️ e conferma

---

## 📊 Dashboard

La dashboard mostra:

### Saldo Attuale
Il saldo totale (entrate nette - spese totali)

### Statistiche per Periodo
Seleziona il periodo: **Settimana** | **Mese** | **Anno**

Per ogni periodo vedi:
- 💰 **Entrate Nette**: totale delle entrate al netto
- 💸 **Spese Totali**: totale delle spese
- ✓/⚠ **Saldo Netto**: differenza (verde se positivo, rosso se negativo)

---

## 📋 Sezione Fiscale

### Impostare la RAL Prevista

1. Vai alla tab **"Fiscale"** (icona 📋)
2. Nella sezione "RAL Prevista Annuale":
   - Inserisci l'importo lordo annuale previsto (es. 30000)
   - Premi **"Salva RAL"**

### Visualizzare le Stime Annuali

Dopo aver impostato la RAL, vedrai:
- **Imposte Totali**: IRPEF o imposta sostitutiva stimata
- **Contributi INPS**: contributi previdenziali totali
- **Netto Annuo Previsto**: quanto ti resta dopo tasse e contributi

### Accantonato Anno Corrente

Mostra quanto hai già "messo da parte" per tasse/contributi basandosi sulle entrate registrate nell'anno corrente.

### Modificare le Impostazioni Fiscali

1. Premi **"Modifica"** nella sezione "Regime Fiscale"
2. Aggiorna i parametri come necessario
3. Premi **"Salva"**

---

## 💡 Suggerimenti

### Best Practices

- ✅ Registra le entrate come "Stipendio" per calcoli automatici
- ✅ Usa "Altro" per entrate occasionali o che non subiscono tassazione
- ✅ Aggiorna regolarmente spese ed entrate per statistiche accurate
- ✅ Controlla la RAL prevista e le stime periodicamente

### Differenze tra "Stipendio" e "Altro"

**Stipendio:**
- Applica automaticamente i calcoli fiscali configurati
- Mostra separatamente lordo e netto
- Ideale per stipendi, fatture P.IVA regolari

**Altro:**
- Non applica calcoli fiscali (netto = lordo)
- Ideale per entrate sporadiche, rimborsi, regali, ecc.

---

## ⚙️ Funzionalità Avanzate

### Reset Completo

Per ricominciare da zero:
1. Chiudi l'app
2. Disinstalla e reinstalla
3. I dati sono salvati localmente e verranno eliminati

### Backup Manuale

Attualmente non c'è un sistema di backup automatico. I dati sono salvati solo sul dispositivo locale.

---

## 🐛 Risoluzione Problemi

**L'app non si carica su Expo Go**
- Verifica che PC e smartphone siano sulla stessa rete WiFi
- Riavvia il server con `npm start`
- Scansiona di nuovo il QR code

**I calcoli fiscali sembrano errati**
- Verifica le impostazioni nella sezione Fiscale
- Controlla i parametri inseriti durante l'onboarding
- Ricorda: sono stime basate sui tuoi parametri!

**Le modifiche non vengono salvate**
- Assicurati di premere il pulsante "Salva" o "Aggiungi"
- Riavvia l'app se il problema persiste

---

## 📞 Note Finali

- Tutti i dati sono salvati **localmente** sul tuo dispositivo
- L'app è **offline-first**: non richiede connessione internet
- I calcoli fiscali sono **stime indicative**, non consulenza fiscale professionale
- Consulta sempre un commercialista per decisioni fiscali importanti

Buona gestione economica! 💼
