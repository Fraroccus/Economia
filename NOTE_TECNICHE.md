# Note Tecniche per Sviluppatori

## Architettura dell'App

### Database (SQLite)

**File**: `src/database/database.js`

**Tabelle:**

1. **user_settings** (singola riga)
   - Configurazione regime fiscale dell'utente
   - RAL prevista
   - Parametri per calcoli (aliquote, detrazioni, ecc.)

2. **entrate**
   - Registro di tutte le entrate
   - Salva sia lordo che netto pre-calcolato
   - Campo `tipo`: "Stipendio" o "Altro"

3. **spese**
   - Registro di tutte le spese
   - Campo `categoria` per future estensioni

### Calcoli Fiscali

**File**: `src/utils/fiscalCalculations.js`

**Funzioni principali:**

- `calcolaNettoStipendio()`: Dipendenti
- `calcolaNettoForfettario()`: P.IVA Forfettario
- `calcolaNettoOrdinario()`: P.IVA Ordinario
- `calcolaNettoEntrata()`: Router principale
- `calcolaStimeFiscaliAnnuali()`: Stime per sezione fiscale

**Importante:** 
- Il netto viene calcolato al momento dell'inserimento
- Viene salvato nel database per performance
- Se si modificano i parametri fiscali, le entrate esistenti non vengono ricalcolate

### Navigation

**Tab Navigator con 4 schermate:**
1. Dashboard (Riepilogo)
2. Entrate
3. Spese
4. Fiscale

**Onboarding:**
- Mostrato solo se `user_settings` è vuoto
- Una volta completato, non riappare

---

## Modifiche Future Suggerite

### 1. Aggiungere Categorie Spese

**Database:**
```sql
CREATE TABLE IF NOT EXISTS categorie (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  icona TEXT,
  colore TEXT
);
```

**UI:**
- Aggiungere Picker nella modale di inserimento spesa
- Visualizzare icona/colore nelle card

### 2. Export Dati

**Implementazione:**
```javascript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const exportToCSV = async () => {
  const entrate = await getAllEntrate();
  const spese = await getAllSpese();
  
  let csv = 'Tipo,Data,Descrizione,Importo\n';
  
  entrate.forEach(e => {
    csv += `Entrata,${e.data},${e.descrizione},${e.importo_netto}\n`;
  });
  
  spese.forEach(s => {
    csv += `Spesa,${s.data},${s.descrizione},-${s.importo}\n`;
  });
  
  const fileUri = FileSystem.documentDirectory + 'export.csv';
  await FileSystem.writeAsStringAsync(fileUri, csv);
  await Sharing.shareAsync(fileUri);
};
```

### 3. Grafici

**Libreria consigliata:** `react-native-chart-kit`

```bash
npm install react-native-chart-kit react-native-svg
```

**Esempio LineChart:**
```javascript
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={{
    labels: ['Gen', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      data: [2000, 2200, 1800, 2400]
    }]
  }}
  width={screenWidth}
  height={220}
  chartConfig={{
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  }}
/>
```

### 4. Notifiche/Promemoria

**Libreria:** `expo-notifications`

```bash
npx expo install expo-notifications
```

**Setup base:**
```javascript
import * as Notifications from 'expo-notifications';

// Richiedi permessi
const { status } = await Notifications.requestPermissionsAsync();

// Programma notifica
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Ricorda di registrare le spese!",
    body: "Non dimenticare le spese di questa settimana"
  },
  trigger: {
    weekday: 1, // Lunedì
    hour: 20,
    minute: 0,
    repeats: true
  }
});
```

### 5. Backup Cloud (Firebase)

**Setup Firebase:**
```bash
npm install firebase
```

**Sync database:**
- Esporta dati da SQLite
- Salva su Firestore
- Implementa sync bidirezionale

### 6. Migliori Scaglioni IRPEF

Attualmente gli scaglioni sono hardcoded in `fiscalCalculations.js`.

**Miglioramento:**
Renderli configurabili in `user_settings`:

```javascript
const scaglioni = [
  { limite: 15000, aliquota: 23 },
  { limite: 28000, aliquota: 25 },
  { limite: 50000, aliquota: 35 },
  { limite: Infinity, aliquota: 43 }
];
```

---

## Performance Tips

### 1. Usa useMemo per calcoli pesanti

```javascript
const stats = useMemo(() => calculateStats(), [entrate, spese, selectedPeriod]);
```

### 2. Virtualizzazione Liste

Per liste molto lunghe, usa `VirtualizedList` o `FlashList`:

```bash
npm install @shopify/flash-list
```

### 3. Lazy Loading

Carica solo gli ultimi N elementi inizialmente:

```javascript
const getAllEntrateRecent = async (limit = 50) => {
  const database = getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM entrate ORDER BY data DESC LIMIT ?',
    [limit]
  );
};
```

---

## Testing

### Unit Tests (Jest)

**Setup:**
```bash
npm install --save-dev jest @testing-library/react-native
```

**Esempio test calcoli:**
```javascript
import { calcolaNettoForfettario } from '../src/utils/fiscalCalculations';

describe('Calcoli Fiscali', () => {
  test('calcolo netto forfettario', () => {
    const netto = calcolaNettoForfettario(3000, 78, 15, 26.23);
    expect(netto).toBeCloseTo(2269.22, 2);
  });
});
```

### E2E Tests (Detox)

Per test completi dell'interfaccia:

```bash
npm install --save-dev detox
```

---

## Deploy in Produzione

### Build Standalone

**Android:**
```bash
eas build --platform android
```

**iOS:**
```bash
eas build --platform ios
```

### Pubblicazione Store

1. **Google Play Store**
   - Crea account sviluppatore (25$ una tantum)
   - Genera AAB con EAS Build
   - Carica su Play Console

2. **Apple App Store**
   - Iscrizione Apple Developer (99$/anno)
   - Genera IPA con EAS Build
   - Carica su App Store Connect

---

## Sicurezza

### Dati Sensibili

- Attualmente tutto in locale (SQLite)
- Per cloud: **sempre criptare** i dati sensibili
- Usa `expo-secure-store` per token/credenziali:

```javascript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('userToken', token);
const token = await SecureStore.getItemAsync('userToken');
```

### Validazione Input

Aggiungi validazione più robusta:

```javascript
const validateImporto = (value) => {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0 || num > 999999) {
    throw new Error('Importo non valido');
  }
  return num;
};
```

---

## Debugging

### React Native Debugger

```bash
npm install -g react-native-debugger
```

Premi `j` nel terminale Expo per aprire il debugger.

### Flipper

Per debug avanzato (network, database, ecc.)

### Console Logs

Nel codice:
```javascript
console.log('Debug:', data);
```

In Expo: vedrai i log nel terminale

---

## Struttura Consigliata per Crescita

```
src/
├── components/         # Componenti riutilizzabili
│   ├── Button.js
│   ├── Card.js
│   └── Input.js
├── constants/         # Costanti app
│   ├── colors.js
│   └── fiscalRates.js
├── contexts/          # React Context per state globale
│   └── AppContext.js
├── database/          # Database layer
│   └── database.js
├── hooks/             # Custom hooks
│   ├── useEntrate.js
│   └── useSpese.js
├── navigation/        # Navigation config
│   └── AppNavigator.js
├── screens/           # Schermate
│   └── ...
├── services/          # API/servizi esterni
│   └── exportService.js
└── utils/             # Utility functions
    ├── fiscalCalculations.js
    └── dateHelpers.js
```

---

## Link Utili

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [SQLite Expo](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Agenzia Entrate](https://www.agenziaentrate.gov.it/)

---

## Changelog Consigliato

Mantieni un file CHANGELOG.md:

```markdown
# Changelog

## [1.0.0] - 2025-01-XX
### Added
- Setup iniziale app
- Onboarding fiscale
- Gestione entrate/spese
- Dashboard con statistiche
- Sezione fiscale con stime

### Future
- Categorie spese
- Export CSV/PDF
- Grafici avanzati
- Notifiche
```
