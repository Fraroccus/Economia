import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntrate, getAllSpese } from '../database/database';
import { useApp } from '../context/AppContext';

const CalendarioScreen = () => {
  const { colors, t } = useApp();
  const [entrate, setEntrate] = useState([]);
  const [spese, setSpese] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
      console.error('Error loading data:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTransactionsForDay = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayEntrate = entrate.filter(e => e.data === dateStr);
    const daySpese = spese.filter(s => s.data === dateStr);
    
    return { entrate: dayEntrate, spese: daySpese };
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
  const dayLabels = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];
  const dayLabelsEn = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
          <Text style={[styles.navText, { color: colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <Text style={[styles.navText, { color: colors.primary }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayLabelsContainer}>
        {dayLabels.map((label, index) => (
          <Text key={index} style={[styles.dayLabel, { color: colors.textSecondary }]}>
            {label}
          </Text>
        ))}
      </View>

      <ScrollView style={styles.calendarContainer}>
        <View style={styles.calendar}>
          {days.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const { entrate: dayEntrate, spese: daySpese } = getTransactionsForDay(day);
            const hasTransactions = dayEntrate.length > 0 || daySpese.length > 0;

            return (
              <View 
                key={day} 
                style={[
                  styles.dayCell,
                  { backgroundColor: colors.card, borderColor: colors.border }
                ]}
              >
                <Text style={[styles.dayNumber, { color: colors.text }]}>{day}</Text>
                {hasTransactions && (
                  <View style={styles.transactionsContainer}>
                    {dayEntrate.map((e, i) => (
                      <Text key={`e-${i}`} style={[styles.transaction, { color: colors.success }]} numberOfLines={1}>
                        +€{e.importo_netto.toFixed(0)}
                      </Text>
                    ))}
                    {daySpese.map((s, i) => (
                      <Text key={`s-${i}`} style={[styles.transaction, { color: colors.error }]} numberOfLines={1}>
                        -€{s.importo.toFixed(0)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dayLabelsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
    margin: 1,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  transactionsContainer: {
    marginTop: 4,
  },
  transaction: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CalendarioScreen;
