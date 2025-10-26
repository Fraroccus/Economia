import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme, language, toggleLanguage, colors, t } = useApp();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
      </View>

      {/* Theme Section */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>{t('theme')}</Text>
          <View style={styles.themeToggle}>
            <Text style={[styles.themeLabel, theme === 'light' && { color: colors.primary }]}>
              {t('lightTheme')}
            </Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
            />
            <Text style={[styles.themeLabel, theme === 'dark' && { color: colors.primary }]}>
              {t('darkTheme')}
            </Text>
          </View>
        </View>
      </View>

      {/* Language Section */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>{t('language')}</Text>
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'it' && { backgroundColor: colors.primary },
                { borderColor: colors.border }
              ]}
              onPress={() => language !== 'it' && toggleLanguage()}
            >
              <Text style={[
                styles.languageText,
                { color: language === 'it' ? '#fff' : colors.text }
              ]}>
                🇮🇹 {t('italian')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && { backgroundColor: colors.primary },
                { borderColor: colors.border }
              ]}
              onPress={() => language !== 'en' && toggleLanguage()}
            >
              <Text style={[
                styles.languageText,
                { color: language === 'en' ? '#fff' : colors.text }
              ]}>
                🇬🇧 {t('english')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Calendar Section */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('Calendario')}
        >
          <Text style={[styles.label, { color: colors.text }]}>📅 {t('calendar')}</Text>
          <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeLabel: {
    fontSize: 14,
    color: '#888',
  },
  languageToggle: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});

export default SettingsScreen;
