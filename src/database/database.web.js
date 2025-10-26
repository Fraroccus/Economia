// Web-specific database implementation using in-memory storage
let webStorage = {
  settings: null,
  entrate: [],
  spese: []
};

export const initDatabase = async () => {
  return 'web-storage';
};

export const getDatabase = () => {
  return 'web-storage';
};

// User Settings
export const saveUserSettings = async (settings) => {
  webStorage.settings = settings;
};

export const getUserSettings = async () => {
  return webStorage.settings;
};

// Entrate
export const addEntrata = async (entrata) => {
  const newEntrata = { 
    ...entrata, 
    id: Date.now(), 
    created_at: new Date().toISOString() 
  };
  webStorage.entrate.push(newEntrata);
  return newEntrata.id;
};

export const getAllEntrate = async () => {
  return [...webStorage.entrate].sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });
};

export const deleteEntrata = async (id) => {
  webStorage.entrate = webStorage.entrate.filter(e => e.id !== id);
};

export const updateEntrata = async (id, entrata) => {
  const index = webStorage.entrate.findIndex(e => e.id === id);
  if (index !== -1) {
    webStorage.entrate[index] = { 
      ...entrata, 
      id, 
      created_at: webStorage.entrate[index].created_at 
    };
  }
};

// Spese
export const addSpesa = async (spesa) => {
  const newSpesa = { 
    ...spesa, 
    id: Date.now() + Math.random(), 
    created_at: new Date().toISOString() 
  };
  webStorage.spese.push(newSpesa);
  return newSpesa.id;
};

export const getAllSpese = async () => {
  return [...webStorage.spese].sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });
};

export const deleteSpesa = async (id) => {
  webStorage.spese = webStorage.spese.filter(s => s.id !== id);
};

export const updateSpesa = async (id, spesa) => {
  const index = webStorage.spese.findIndex(s => s.id === id);
  if (index !== -1) {
    webStorage.spese[index] = { 
      ...spesa, 
      id, 
      created_at: webStorage.spese[index].created_at 
    };
  }
};
