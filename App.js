import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { initDatabase, getUserSettings, saveUserSettings } from './src/database/database';
import { AppProvider, useApp } from './src/context/AppContext';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EntrateScreen from './src/screens/EntrateScreen';
import SpeseScreen from './src/screens/SpeseScreen';
import FiscaleScreen from './src/screens/FiscaleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CalendarioScreen from './src/screens/CalendarioScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { colors, t } = useApp();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      const settings = await getUserSettings();
      setHasCompletedOnboarding(!!settings);
    } catch (error) {
      console.error('Errore inizializzazione:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (settings) => {
    try {
      await saveUserSettings(settings);
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Errore salvataggio impostazioni:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <>
        <StatusBar style="auto" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={colors.background === '#000000' ? 'light' : 'auto'} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: [styles.tabBar, { backgroundColor: colors.tabBar, borderTopColor: colors.border }],
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="DashboardStack"
          options={{
            tabBarLabel: t('dashboard'),
            tabBarIcon: ({ color }) => <TabIcon icon="📊" color={color} />,
          }}
        >
          {() => (
            <Stack.Navigator>
              <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={({ navigation }) => ({
                  headerShown: true,
                  headerStyle: { backgroundColor: colors.card },
                  headerTintColor: colors.text,
                  title: t('dashboard'),
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Settings')}
                      style={styles.settingsButton}
                    >
                      <Text style={{ fontSize: 24 }}>⚙️</Text>
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: colors.card },
                  headerTintColor: colors.text,
                  title: t('settings'),
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="Calendario"
                component={CalendarioScreen}
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: colors.card },
                  headerTintColor: colors.text,
                  title: t('calendar'),
                }}
              />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Entrate"
          component={EntrateScreen}
          options={{
            tabBarLabel: t('entrate'),
            tabBarIcon: ({ color }) => <TabIcon icon="💰" color={color} />,
            headerShown: true,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            title: t('entrate'),
          }}
        />
        <Tab.Screen
          name="Spese"
          component={SpeseScreen}
          options={{
            tabBarLabel: t('spese'),
            tabBarIcon: ({ color }) => <TabIcon icon="💸" color={color} />,
            headerShown: true,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            title: t('spese'),
          }}
        />
        <Tab.Screen
          name="Fiscale"
          component={FiscaleScreen}
          options={{
            tabBarLabel: t('fiscale'),
            tabBarIcon: ({ color }) => <TabIcon icon="📋" color={color} />,
            headerShown: true,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            title: t('fiscale'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const TabIcon = ({ icon, color }) => {
  return (
    <Text style={{ fontSize: 24 }}>{icon}</Text>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    marginRight: 15,
    padding: 5,
  },
});

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
