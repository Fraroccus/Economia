import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntrate, getAllSpese } from '../database/database';
import { useApp } from '../context/AppContext';

const DashboardScreen = () => {
  const { colors, t } = useApp();
  const [entrate, setEntrate] = useState([]);
  const [spese, setSpese] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const entrateData = await getAllEntrate();
      const speseData = await getAllSpese();
      setEntrate(entrateData);
      setSpese(speseData);
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    }
  };

  const filterByPeriod = (items, dateField = 'data') => {
    const now = new Date();
    const filtered = items.filter((item) => {
      const itemDate = new Date(item[dateField]);
      
      switch (selectedPeriod) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return itemDate >= yearAgo;
        default:
          return true;
      }
    });
    
    return filtered;
  };

  const calculateStats = () => {
    const filteredEntrate = filterByPeriod(entrate);
    const filteredSpese = filterByPeriod(spese);

    const totaleEntrateNette = filteredEntrate.reduce(
      (sum, item) => sum + item.importo_netto,
      0
    );
    const totaleSpese = filteredSpese.reduce(
      (sum, item) => sum + item.importo,
      0
    );
    const saldo = totaleEntrateNette - totaleSpese;

    return {
      totaleEntrateNette,
      totaleSpese,
      saldo,
    };
  };

  const calculateTotalBalance = () => {
    const totaleEntrateNette = entrate.reduce(
      (sum, item) => sum + item.importo_netto,
      0
    );
    const totaleSpese = spese.reduce(
      (sum, item) => sum + item.importo,
      0
    );
    return totaleEntrateNette - totaleSpese;
  };

  const stats = calculateStats();
  const saldoAttuale = calculateTotalBalance();

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week':
        return 'Ultima Settimana';
      case 'month':
        return 'Ultimo Mese';
      case 'year':
        return 'Ultimo Anno';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Saldo Attuale */}
      <View style={[styles.saldoCard, { backgroundColor: colors.saldoCard }]}>
        <Text style={[styles.saldoLabel, { color: colors.textSecondary }]}>Saldo Attuale</Text>
        <Text
          style={[
            styles.saldoAmount,
            { color: saldoAttuale >= 0 ? colors.success : colors.error },
          ]}
        >
          €{saldoAttuale.toFixed(2)}
        </Text>
        <Text style={[styles.saldoSubtext, { color: colors.textSecondary }]}>
          {saldoAttuale >= 0 ? '✓ In positivo' : '⚠ In negativo'}
        </Text>
      </View>

      {/* Selettore Periodo */}
      <View style={[styles.periodSelector, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'week' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: selectedPeriod === 'week' ? '#fff' : colors.textSecondary },
            ]}
          >
            Settimana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'month' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: selectedPeriod === 'month' ? '#fff' : colors.textSecondary },
            ]}
          >
            Mese
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'year' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedPeriod('year')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: selectedPeriod === 'year' ? '#fff' : colors.textSecondary },
            ]}
          >
            Anno
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistiche Periodo */}
      <View style={styles.statsContainer}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>{getPeriodLabel()}</Text>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.infoBackground }]}>
            <Text style={styles.statIconText}>💰</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Entrate Nette</Text>
            <Text style={[styles.statAmount, { color: colors.text }]}>
              +€{stats.totaleEntrateNette.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.statIconText}>💸</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spese Totali</Text>
            <Text style={[styles.statAmount, { color: colors.error }]}>
              -€{stats.totaleSpese.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: stats.saldo >= 0 ? '#E8F5E9' : '#FFEBEE' },
            ]}
          >
            <Text style={styles.statIconText}>
              {stats.saldo >= 0 ? '✓' : '⚠'}
            </Text>
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Saldo Netto</Text>
            <Text
              style={[
                styles.statAmount,
                { color: stats.saldo >= 0 ? colors.success : colors.error },
              ]}
            >
              €{stats.saldo.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Info */}
      <View style={[styles.infoCard, { backgroundColor: colors.warningBackground, borderLeftColor: colors.warning }]}>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          💡 Le entrate mostrate sono già al netto delle tasse, calcolate in
          base al tuo regime fiscale.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saldoCard: {
    margin: 15,
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  saldoLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  saldoAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  saldoSubtext: {
    fontSize: 14,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statIconText: {
    fontSize: 24,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoCard: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DashboardScreen;
