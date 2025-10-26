import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [language, setLanguage] = useState('it'); // 'it' or 'en'

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'it' ? 'en' : 'it');
  };

  const colors = theme === 'dark' ? {
    // Dark theme colors
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    primary: '#0A84FF',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FFD60A',
    tabBar: '#1C1C1E',
    inputBackground: '#1C1C1E',
    modalBackground: '#1C1C1E',
    saldoCard: '#1C1C1E',
    infoBackground: '#1F3A5F',
    warningBackground: '#3D2F00',
  } : {
    // Light theme colors
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#333333',
    textSecondary: '#888888',
    border: '#E0E0E0',
    primary: '#007AFF',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FFB300',
    tabBar: '#FFFFFF',
    inputBackground: '#F5F5F5',
    modalBackground: '#FFFFFF',
    saldoCard: '#FFFFFF',
    infoBackground: '#E3F2FD',
    warningBackground: '#FFF9E6',
  };

  const translations = {
    it: {
      // Navigation
      dashboard: 'Riepilogo',
      entrate: 'Entrate',
      spese: 'Spese',
      fiscale: 'Fiscale',
      calendario: 'Calendario',
      
      // Settings
      settings: 'Impostazioni',
      theme: 'Tema',
      lightTheme: 'Chiaro',
      darkTheme: 'Scuro',
      language: 'Lingua',
      italian: 'Italiano',
      english: 'Inglese',
      calendar: 'Calendario',
      
      // Common
      save: 'Salva',
      cancel: 'Annulla',
      delete: 'Elimina',
      edit: 'Modifica',
      add: 'Aggiungi',
      close: 'Chiudi',
      
      // Dashboard
      currentBalance: 'Saldo Attuale',
      inPositive: 'In positivo',
      inNegative: 'In negativo',
      week: 'Settimana',
      month: 'Mese',
      year: 'Anno',
      netIncome: 'Entrate Nette',
      totalExpenses: 'Spese Totali',
      netBalance: 'Saldo Netto',
      
      // Entrate
      newIncome: '+ Nuova Entrata',
      incomeType: 'Tipo',
      salary: 'Stipendio',
      other: 'Altro',
      grossAmount: 'Importo Lordo (€)',
      description: 'Descrizione',
      optional: 'opzionale',
      
      // Spese
      newExpense: '+ Nuova Spesa',
      amount: 'Importo (€)',
      
      // Messages
      noDataYet: 'Nessun dato ancora',
      loadingError: 'Errore nel caricamento',
    },
    en: {
      // Navigation
      dashboard: 'Dashboard',
      entrate: 'Income',
      spese: 'Expenses',
      fiscale: 'Tax',
      calendario: 'Calendar',
      
      // Settings
      settings: 'Settings',
      theme: 'Theme',
      lightTheme: 'Light',
      darkTheme: 'Dark',
      language: 'Language',
      italian: 'Italian',
      english: 'English',
      calendar: 'Calendar',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      
      // Dashboard
      currentBalance: 'Current Balance',
      inPositive: 'Positive',
      inNegative: 'Negative',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      netIncome: 'Net Income',
      totalExpenses: 'Total Expenses',
      netBalance: 'Net Balance',
      
      // Entrate
      newIncome: '+ New Income',
      incomeType: 'Type',
      salary: 'Salary',
      other: 'Other',
      grossAmount: 'Gross Amount (€)',
      description: 'Description',
      optional: 'optional',
      
      // Spese
      newExpense: '+ New Expense',
      amount: 'Amount (€)',
      
      // Messages
      noDataYet: 'No data yet',
      loadingError: 'Loading error',
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    language,
    setLanguage,
    toggleLanguage,
    colors,
    t,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
