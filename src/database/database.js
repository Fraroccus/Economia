import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;
let webStorage = null;

// Web storage fallback
if (Platform.OS === 'web') {
  webStorage = {
    settings: null,
    entrate: [],
    spese: []
  };
}

export const initDatabase = async () => {
  if (Platform.OS === 'web') {
    // Use in-memory storage for web
    db = 'web-mock';
    return db;
  }
  
  db = await SQLite.openDatabaseAsync('economia.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      regime_type TEXT NOT NULL,
      irpef_aliquota REAL,
      detrazioni REAL,
      coefficiente_redditivita REAL,
      aliquota_sostitutiva REAL,
      aliquote_irpef TEXT,
      addizionale_regionale REAL,
      addizionale_comunale REAL,
      contributi_inps REAL,
      ral_prevista REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS entrate (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      importo_lordo REAL NOT NULL,
      importo_netto REAL NOT NULL,
      descrizione TEXT,
      data DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS spese (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descrizione TEXT NOT NULL,
      importo REAL NOT NULL,
      categoria TEXT,
      data DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  return db;
};

export const getDatabase = () => {
  if (Platform.OS === 'web') {
    return 'web-mock';
  }
  if (!db) {
    throw new Error('Database non inizializzato');
  }
  return db;
};

// User Settings
export const saveUserSettings = async (settings) => {
  if (Platform.OS === 'web') {
    webStorage.settings = settings;
    return;
  }
  
  const database = getDatabase();
  
  // Elimina le impostazioni precedenti
  await database.runAsync('DELETE FROM user_settings');
  
  // Inserisci le nuove impostazioni
  const aliquoteIrpefJson = settings.aliquote_irpef ? JSON.stringify(settings.aliquote_irpef) : null;
  
  await database.runAsync(
    `INSERT INTO user_settings (
      regime_type, irpef_aliquota, detrazioni, coefficiente_redditivita,
      aliquota_sostitutiva, aliquote_irpef, addizionale_regionale,
      addizionale_comunale, contributi_inps, ral_prevista
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      settings.regime_type,
      settings.irpef_aliquota || null,
      settings.detrazioni || null,
      settings.coefficiente_redditivita || null,
      settings.aliquota_sostitutiva || null,
      aliquoteIrpefJson,
      settings.addizionale_regionale || null,
      settings.addizionale_comunale || null,
      settings.contributi_inps || null,
      settings.ral_prevista || null
    ]
  );
};

export const getUserSettings = async () => {
  if (Platform.OS === 'web') {
    return webStorage.settings;
  }
  
  const database = getDatabase();
  const result = await database.getFirstAsync('SELECT * FROM user_settings ORDER BY id DESC LIMIT 1');
  
  if (result && result.aliquote_irpef) {
    result.aliquote_irpef = JSON.parse(result.aliquote_irpef);
  }
  
  return result;
};

// Entrate
export const addEntrata = async (entrata) => {
  if (Platform.OS === 'web') {
    const newEntrata = { ...entrata, id: Date.now(), created_at: new Date().toISOString() };
    webStorage.entrate.push(newEntrata);
    return newEntrata.id;
  }
  
  const database = getDatabase();
  const result = await database.runAsync(
    'INSERT INTO entrate (tipo, importo_lordo, importo_netto, descrizione, data) VALUES (?, ?, ?, ?, ?)',
    [entrata.tipo, entrata.importo_lordo, entrata.importo_netto, entrata.descrizione, entrata.data]
  );
  return result.lastInsertRowId;
};

export const getAllEntrate = async () => {
  if (Platform.OS === 'web') {
    return [...webStorage.entrate].reverse();
  }
  
  const database = getDatabase();
  return await database.getAllAsync('SELECT * FROM entrate ORDER BY data DESC, created_at DESC');
};

export const deleteEntrata = async (id) => {
  if (Platform.OS === 'web') {
    webStorage.entrate = webStorage.entrate.filter(e => e.id !== id);
    return;
  }
  
  const database = getDatabase();
  await database.runAsync('DELETE FROM entrate WHERE id = ?', [id]);
};

export const updateEntrata = async (id, entrata) => {
  if (Platform.OS === 'web') {
    const index = webStorage.entrate.findIndex(e => e.id === id);
    if (index !== -1) {
      webStorage.entrate[index] = { ...entrata, id, created_at: webStorage.entrate[index].created_at };
    }
    return;
  }
  
  const database = getDatabase();
  await database.runAsync(
    'UPDATE entrate SET tipo = ?, importo_lordo = ?, importo_netto = ?, descrizione = ?, data = ? WHERE id = ?',
    [entrata.tipo, entrata.importo_lordo, entrata.importo_netto, entrata.descrizione, entrata.data, id]
  );
};

// Spese
export const addSpesa = async (spesa) => {
  if (Platform.OS === 'web') {
    const newSpesa = { ...spesa, id: Date.now(), created_at: new Date().toISOString() };
    webStorage.spese.push(newSpesa);
    return newSpesa.id;
  }
  
  const database = getDatabase();
  const result = await database.runAsync(
    'INSERT INTO spese (descrizione, importo, categoria, data) VALUES (?, ?, ?, ?)',
    [spesa.descrizione, spesa.importo, spesa.categoria || null, spesa.data]
  );
  return result.lastInsertRowId;
};

export const getAllSpese = async () => {
  if (Platform.OS === 'web') {
    return [...webStorage.spese].reverse();
  }
  
  const database = getDatabase();
  return await database.getAllAsync('SELECT * FROM spese ORDER BY data DESC, created_at DESC');
};

export const deleteSpesa = async (id) => {
  if (Platform.OS === 'web') {
    webStorage.spese = webStorage.spese.filter(s => s.id !== id);
    return;
  }
  
  const database = getDatabase();
  await database.runAsync('DELETE FROM spese WHERE id = ?', [id]);
};

export const updateSpesa = async (id, spesa) => {
  if (Platform.OS === 'web') {
    const index = webStorage.spese.findIndex(s => s.id === id);
    if (index !== -1) {
      webStorage.spese[index] = { ...spesa, id, created_at: webStorage.spese[index].created_at };
    }
    return;
  }
  
  const database = getDatabase();
  await database.runAsync(
    'UPDATE spese SET descrizione = ?, importo = ?, categoria = ?, data = ? WHERE id = ?',
    [spesa.descrizione, spesa.importo, spesa.categoria || null, spesa.data, id]
  );
};
