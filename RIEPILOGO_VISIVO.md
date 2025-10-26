# 🎯 Riepilogo Funzionalità App Economia Personale

## 📊 Flow dell'Applicazione

```
┌─────────────────────────────────────────────┐
│         PRIMO AVVIO - ONBOARDING            │
├─────────────────────────────────────────────┤
│  1. Selezione Regime Fiscale                │
│     ├─ Dipendente                           │
│     ├─ P.IVA Forfettario                    │
│     ├─ P.IVA Ordinario                      │
│     └─ Altro                                │
│                                             │
│  2. Configurazione Parametri                │
│     ├─ Aliquote                             │
│     ├─ Detrazioni                           │
│     ├─ Contributi                           │
│     └─ Addizionali                          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         APP PRINCIPALE - TAB BAR            │
├─────────────────────────────────────────────┤
│                                             │
│  [📊 Dashboard] [💰 Entrate] [💸 Spese]    │
│                [📋 Fiscale]                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📱 Schermate Dettagliate

### 1️⃣ Dashboard (Riepilogo)

```
┌─────────────────────────┐
│   SALDO ATTUALE         │
│   €2,450.00 ✓          │
│   In positivo           │
└─────────────────────────┘

┌───────────────────────────────┐
│  [Settimana][Mese][Anno]      │
└───────────────────────────────┘

┌─────────────────────────┐
│ 💰 Entrate Nette        │
│    +€3,500.00           │
└─────────────────────────┘

┌─────────────────────────┐
│ 💸 Spese Totali         │
│    -€1,050.00           │
└─────────────────────────┘

┌─────────────────────────┐
│ ✓ Saldo Netto           │
│    €2,450.00            │
└─────────────────────────┘
```

**Funzioni:**
- ✅ Visualizza saldo attuale
- ✅ Switch tra periodi (settimana/mese/anno)
- ✅ Statistiche aggregate
- ✅ Colori intuitivi (verde/rosso)

---

### 2️⃣ Entrate

```
┌────────────────────────────┐
│  Entrate                   │
│  [+ Nuova Entrata]         │
└────────────────────────────┘

┌────────────────────────────┐
│ [Stipendio]   25/01/2025   │
│ Stipendio Gennaio          │
│ Lordo: €2,500.00           │
│ Netto: €1,925.00     ✏️ 🗑️ │
└────────────────────────────┘

┌────────────────────────────┐
│ [Altro]       20/01/2025   │
│ Rimborso spese             │
│ Lordo: €200.00             │
│ Netto: €200.00       ✏️ 🗑️ │
└────────────────────────────┘
```

**Modal Nuova Entrata:**
```
┌────────────────────────────┐
│  Nuova Entrata             │
├────────────────────────────┤
│  Tipo:                     │
│  [Stipendio ▼]             │
│                            │
│  Importo Lordo (€):        │
│  [2500.00]                 │
│                            │
│  Descrizione:              │
│  [Stipendio Gennaio]       │
│                            │
│  💡 Il netto sarà          │
│  calcolato automaticamente │
│                            │
│  [Annulla]  [Aggiungi]     │
└────────────────────────────┘
```

**Funzioni:**
- ✅ Aggiungi entrate con tipo
- ✅ Calcolo automatico netto (se Stipendio)
- ✅ Modifica/elimina entrate
- ✅ Lista cronologica

---

### 3️⃣ Spese

```
┌────────────────────────────┐
│  Spese                     │
│  [+ Nuova Spesa]           │
└────────────────────────────┘

┌────────────────────────────┐
│ Spesa supermercato         │
│ 24/01/2025                 │
│                      ✏️ 🗑️ │
│           -€150.00         │
└────────────────────────────┘

┌────────────────────────────┐
│ Affitto                    │
│ 01/01/2025                 │
│                      ✏️ 🗑️ │
│           -€600.00         │
└────────────────────────────┘
```

**Modal Nuova Spesa:**
```
┌────────────────────────────┐
│  Nuova Spesa               │
├────────────────────────────┤
│  Descrizione:              │
│  [Spesa supermercato]      │
│                            │
│  Importo (€):              │
│  [150.00]                  │
│                            │
│  [Annulla]  [Aggiungi]     │
└────────────────────────────┘
```

**Funzioni:**
- ✅ Aggiungi spese
- ✅ Modifica/elimina spese
- ✅ Lista cronologica
- ✅ Interfaccia semplice

---

### 4️⃣ Fiscale

```
┌────────────────────────────┐
│  Sezione Fiscale           │
└────────────────────────────┘

┌────────────────────────────┐
│  Regime Fiscale  [Modifica]│
├────────────────────────────┤
│  Regime attuale:           │
│  P.IVA Forfettario         │
└────────────────────────────┘

┌────────────────────────────┐
│  RAL Prevista Annuale      │
├────────────────────────────┤
│  Importo lordo annuale:    │
│  [35000]                   │
│  [Salva RAL]               │
└────────────────────────────┘

┌────────────────────────────┐
│  Stime Annuali             │
├────────────────────────────┤
│  Imposte Totali            │
│  €4,095.00                 │
├────────────────────────────┤
│  Contributi INPS           │
│  €7,160.79                 │
├────────────────────────────┤
│  Netto Annuo Previsto      │
│  €23,744.21                │
└────────────────────────────┘

┌────────────────────────────┐
│  Accantonato Anno Corrente │
├────────────────────────────┤
│  Importo già accantonato   │
│  per tasse/contributi:     │
│                            │
│      €2,134.56             │
│                            │
│  💡 Calcolato dalla        │
│  differenza lordo-netto    │
└────────────────────────────┘
```

**Funzioni:**
- ✅ Visualizza/modifica regime fiscale
- ✅ Imposta RAL prevista
- ✅ Calcolo stime automatiche
- ✅ Monitoraggio accantonato

---

## 🧮 Formule di Calcolo

### Dipendente
```
Netto = Lordo - (Lordo × IRPEF%) + Detrazioni
```

**Esempio:**
```
Lordo:      €2,500.00
IRPEF 27%:  -€675.00
Detrazioni: +€100.00
─────────────────────
Netto:      €1,925.00
```

---

### P.IVA Forfettario
```
Reddito Imponibile = Lordo × Coeff.%
Imposta = Reddito Imp. × Aliq.%
INPS = Reddito Imp. × 26.23%
Netto = Lordo - Imposta - INPS
```

**Esempio:**
```
Lordo:          €3,000.00
Coeff. 78%:     €2,340.00 (reddito imp.)
Imposta 15%:    -€351.00
INPS 26.23%:    -€613.78
───────────────────────────
Netto:          €2,035.22
```

---

### P.IVA Ordinario
```
IRPEF = Calcolo scaglioni
Add. Reg. = Lordo × %
Add. Com. = Lordo × %
INPS = Lordo × 26.23%
Netto = Lordo - IRPEF - Add. - INPS
```

**Scaglioni IRPEF 2024:**
- 0 - 15.000€: 23%
- 15.001 - 28.000€: 25%
- 28.001 - 50.000€: 35%
- Oltre 50.000€: 43%

---

## 🎨 Palette Colori

```
Primario (Azioni):    #007AFF (Blu iOS)
Entrate:              #34C759 (Verde)
Spese:                #FF3B30 (Rosso)
Background:           #F5F5F5 (Grigio chiaro)
Card:                 #FFFFFF (Bianco)
Testo primario:       #333333 (Grigio scuro)
Testo secondario:     #888888 (Grigio medio)
Bordi:                #E0E0E0 (Grigio bordo)
Info:                 #E3F2FD (Blu chiaro)
Warning:              #FFF9E6 (Giallo chiaro)
```

---

## 📊 Database Schema

### Tabella: user_settings
```
id                          INTEGER PRIMARY KEY
regime_type                 TEXT
irpef_aliquota             REAL
detrazioni                 REAL
coefficiente_redditivita   REAL
aliquota_sostitutiva       REAL
aliquote_irpef             TEXT (JSON)
addizionale_regionale      REAL
addizionale_comunale       REAL
contributi_inps            REAL
ral_prevista               REAL
created_at                 DATETIME
```

### Tabella: entrate
```
id              INTEGER PRIMARY KEY
tipo            TEXT ('Stipendio' | 'Altro')
importo_lordo   REAL
importo_netto   REAL
descrizione     TEXT
data            DATE
created_at      DATETIME
```

### Tabella: spese
```
id              INTEGER PRIMARY KEY
descrizione     TEXT
importo         REAL
categoria       TEXT (futuro)
data            DATE
created_at      DATETIME
```

---

## ⚡ Performance

- ✅ Database locale (SQLite) - velocissimo
- ✅ Calcoli eseguiti lato client
- ✅ Nessuna dipendenza da internet
- ✅ Dati salvati permanentemente sul dispositivo
- ✅ Hot reload durante sviluppo
- ✅ Ottimizzato per mobile

---

## 🔐 Privacy

- ✅ Tutti i dati salvati **localmente**
- ✅ Nessun invio a server esterni
- ✅ Nessun tracking
- ✅ Nessuna raccolta dati
- ✅ Completamente offline
- ✅ Privacy al 100%

---

## 📦 Tecnologie Utilizzate

```
Framework:        React Native
Build Tool:       Expo
Navigation:       React Navigation (Bottom Tabs)
Database:         SQLite (expo-sqlite)
Picker:           @react-native-picker/picker
Linguaggio:       JavaScript (ES6+)
Piattaforme:      iOS, Android, Web
```

---

## 🎯 Checklist Pre-Utilizzo

- [x] Node.js installato
- [x] Dipendenze installate (`npm install`)
- [x] Server avviato (`npm start`)
- [x] Expo Go installato su smartphone
- [ ] QR code scansionato
- [ ] App caricata su telefono
- [ ] Onboarding completato
- [ ] Prima entrata registrata
- [ ] Prima spesa registrata
- [ ] Dashboard controllata

---

## 🚀 Sei Pronto!

L'app è completamente funzionante e pronta all'uso!

**Prossimo Step:** Scansiona il QR code nel terminale con Expo Go! 📱
