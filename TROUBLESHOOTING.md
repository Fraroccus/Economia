# 🔧 Risoluzione Problemi / Troubleshooting

## ❌ "Something went wrong" in Expo Go

### Causa
Questo errore può verificarsi per diversi motivi:
1. Versioni incompatibili dei pacchetti
2. Cache corrotta di Metro Bundler
3. PC e smartphone su reti WiFi diverse
4. Firewall che blocca la connessione

### ✅ Soluzione Applicata

Ho risolto il problema con questi passaggi:

1. **Aggiornato i pacchetti alle versioni corrette**:
   - `@react-native-picker/picker@2.11.1`
   - `react-native-gesture-handler@~2.28.0`
   - `react-native-screens@~4.16.0`

2. **Pulito la cache e riavviato il server**:
   ```bash
   npx expo start --clear
   ```

3. **Corretto il bug nel codice**: Importato `Text` in App.js

### 🔄 Come Riprovare

**Ora l'app dovrebbe funzionare!** Segui questi passaggi:

1. **Verifica che il server sia attivo** (dovresti vedere il QR code nel terminale)

2. **Sul tuo smartphone**:
   - Assicurati di essere sulla **stessa rete WiFi** del PC
   - Apri **Expo Go**
   - Scansiona il **nuovo QR code**
   - Attendi il caricamento

3. **Se vedi ancora errori**, nel terminale premi:
   - `r` per ricaricare l'app
   - Oppure `shift+m` per più opzioni

---

## 🌐 Alternative se Expo Go non Funziona

### Opzione 1: Versione Web
Nel terminale, premi **`w`** per aprire l'app nel browser.

**Pro**: Funziona immediatamente  
**Contro**: Non ottimizzata per mobile, alcune funzioni potrebbero non funzionare perfettamente

### Opzione 2: Tunnel Mode (se WiFi diverso)
Se PC e telefono sono su reti WiFi diverse:

```bash
npx expo start --tunnel
```

**Nota**: Richiede l'installazione di `@expo/ngrok`

---

## 📱 Checklist Diagnostica

Prima di scansionare il QR code, verifica:

- [ ] Il terminale mostra "Metro waiting on exp://..."
- [ ] Nessun errore rosso nel terminale
- [ ] PC e smartphone sulla stessa rete WiFi
- [ ] Expo Go aggiornato all'ultima versione
- [ ] Il QR code è ben visibile

---

## 🐛 Altri Errori Comuni

### Errore: "Unable to resolve module"
**Causa**: Pacchetto mancante o cache corrotta  
**Soluzione**:
```bash
npm install
npx expo start --clear
```

### Errore: "Network response timed out"
**Causa**: Firewall o problemi di rete  
**Soluzione**:
1. Disattiva temporaneamente il firewall
2. Usa tunnel mode: `npx expo start --tunnel`
3. Verifica che entrambi i dispositivi siano sulla stessa rete

### Errore: "Invariant Violation: Module AppRegistry is not registered"
**Causa**: App entry point non configurato correttamente  
**Soluzione**:
```bash
npm install
npx expo start --clear
```

### Errore durante l'onboarding
**Causa**: Database non inizializzato correttamente  
**Soluzione**:
1. Chiudi completamente l'app su Expo Go
2. Nel terminale premi `r` per ricaricare
3. Se persiste, riavvia il server completamente

---

## 🔄 Reset Completo

Se nulla funziona, prova un reset completo:

```bash
# 1. Ferma il server (Ctrl+C)

# 2. Pulisci tutto
rm -rf node_modules
npm cache clean --force

# 3. Reinstalla
npm install

# 4. Riavvia pulito
npx expo start --clear
```

---

## 📞 Debug Avanzato

### Visualizza i Log Dettagliati

Nel terminale Expo, quando l'app si carica, vedrai i log in tempo reale.  
Cerca errori in rosso come:

```
ERROR  Error: ...
ERROR  Invariant Violation: ...
ERROR  Unable to resolve ...
```

### Usa React Native Debugger

1. Nel terminale premi `j` per aprire il debugger
2. Apri gli strumenti di sviluppo del browser
3. Vai alla console per vedere errori dettagliati

### Verifica la Connessione

Sul terminale, quando connetti l'app vedrai:
```
› Opening exp://192.168.1.27:8081 on iPhone di Marco
```

Se non vedi questo messaggio, la connessione non è stabilita.

---

## ✅ Stato Attuale

### Problemi Risolti:
- ✅ Versioni pacchetti incompatibili
- ✅ Cache corrotta
- ✅ Bug import Text in App.js
- ✅ Server pulito e riavviato

### Prossimo Passo:
**Scansiona il nuovo QR code con Expo Go!**

---

## 💡 Suggerimenti

1. **Mantieni Expo Go aggiornato**: Controlla regolarmente gli aggiornamenti
2. **Stessa rete WiFi**: È fondamentale per Expo Go
3. **Riavvia il server se fai modifiche importanti**: `Ctrl+C` poi `npm start`
4. **Usa `npx expo start --clear`** se vedi comportamenti strani

---

## 🆘 Serve Ancora Aiuto?

Se continui ad avere problemi:

1. **Controlla il terminale** per errori specifici
2. **Prova la versione web** con `w`
3. **Verifica i prerequisiti**:
   - Node.js installato
   - Expo Go aggiornato
   - WiFi funzionante

**L'app è stata corretta e il server è attivo. Dovrebbe funzionare ora!** 🚀
