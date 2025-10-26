import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { getUserSettings, saveUserSettings, getAllEntrate } from '../database/database';
import { calcolaStimeFiscaliAnnuali } from '../utils/fiscalCalculations';
import { useApp } from '../context/AppContext';

const FiscaleScreen = () => {
  const { colors } = useApp();
  const [userSettings, setUserSettings] = useState(null);
  const [ralPrevista, setRalPrevista] = useState('');
  const [entrate, setEntrate] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Form fields for editing
  const [regimeType, setRegimeType] = useState('Dipendente');
  const [irpefAliquota, setIrpefAliquota] = useState('23');
  const [detrazioni, setDetrazioni] = useState('0');
  const [coefficienteRedditivita, setCoefficienteRedditivita] = useState('78');
  const [aliquotaSostitutiva, setAliquotaSostitutiva] = useState('15');
  const [addizionaleRegionale, setAddizionaleRegionale] = useState('1.23');
  const [addizionaleComunale, setAddizionaleComunale] = useState('0.8');
  const [contributiInps, setContributiInps] = useState('26.23');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const settings = await getUserSettings();
      setUserSettings(settings);
      
      if (settings) {
        setRalPrevista(settings.ral_prevista ? settings.ral_prevista.toString() : '');
        setRegimeType(settings.regime_type);
        
        // Load settings into form
        if (settings.irpef_aliquota) setIrpefAliquota(settings.irpef_aliquota.toString());
        if (settings.detrazioni) setDetrazioni(settings.detrazioni.toString());
        if (settings.coefficiente_redditivita) setCoefficienteRedditivita(settings.coefficiente_redditivita.toString());
        if (settings.aliquota_sostitutiva) setAliquotaSostitutiva(settings.aliquota_sostitutiva.toString());
        if (settings.addizionale_regionale) setAddizionaleRegionale(settings.addizionale_regionale.toString());
        if (settings.addizionale_comunale) setAddizionaleComunale(settings.addizionale_comunale.toString());
        if (settings.contributi_inps) setContributiInps(settings.contributi_inps.toString());
      }
      
      const entrateData = await getAllEntrate();
      setEntrate(entrateData);
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    }
  };

  const handleSaveRal = async () => {
    const ralNum = parseFloat(ralPrevista);
    if (isNaN(ralNum) || ralNum <= 0) {
      Alert.alert('Attenzione', 'Inserisci una RAL valida');
      return;
    }

    try {
      const updatedSettings = {
        ...userSettings,
        ral_prevista: ralNum,
      };
      await saveUserSettings(updatedSettings);
      setUserSettings(updatedSettings);
      Alert.alert('Successo', 'RAL prevista salvata');
    } catch (error) {
      Alert.alert('Errore', 'Impossibile salvare la RAL');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const settings = {
        regime_type: regimeType,
        ral_prevista: userSettings?.ral_prevista || null,
      };

      switch (regimeType) {
        case 'Dipendente':
          settings.irpef_aliquota = parseFloat(irpefAliquota) || 23;
          settings.detrazioni = parseFloat(detrazioni) || 0;
          break;
          
        case 'P.IVA Forfettario':
          settings.coefficiente_redditivita = parseFloat(coefficienteRedditivita) || 78;
          settings.aliquota_sostitutiva = parseFloat(aliquotaSostitutiva) || 15;
          settings.contributi_inps = parseFloat(contributiInps) || 26.23;
          break;
          
        case 'P.IVA Ordinario':
          settings.aliquote_irpef = [
            { limite: 15000, aliquota: 23 },
            { limite: 28000, aliquota: 25 },
            { limite: 50000, aliquota: 35 },
            { limite: Infinity, aliquota: 43 }
          ];
          settings.addizionale_regionale = parseFloat(addizionaleRegionale) || 1.23;
          settings.addizionale_comunale = parseFloat(addizionaleComunale) || 0.8;
          settings.contributi_inps = parseFloat(contributiInps) || 26.23;
          break;
      }

      await saveUserSettings(settings);
      setUserSettings(settings);
      setEditMode(false);
      Alert.alert('Successo', 'Impostazioni fiscali aggiornate');
    } catch (error) {
      Alert.alert('Errore', 'Impossibile salvare le impostazioni');
    }
  };

  const calculateAccantonato = () => {
    const currentYear = new Date().getFullYear();
    const entrateAnnoCorrente = entrate.filter((item) => {
      const itemYear = new Date(item.data).getFullYear();
      return itemYear === currentYear;
    });

    const totaleNetto = entrateAnnoCorrente.reduce(
      (sum, item) => sum + item.importo_netto,
      0
    );
    const totaleLordo = entrateAnnoCorrente.reduce(
      (sum, item) => sum + item.importo_lordo,
      0
    );

    const accantonato = totaleLordo - totaleNetto;
    return accantonato;
  };

  const stime = userSettings && ralPrevista
    ? calcolaStimeFiscaliAnnuali(parseFloat(ralPrevista), userSettings)
    : null;

  const accantonato = calculateAccantonato();

  const renderSettingsForm = () => {
    switch (regimeType) {
      case 'Dipendente':
        return (
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Aliquota IRPEF stimata (%):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={irpefAliquota}
              onChangeText={setIrpefAliquota}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Detrazioni annuali (€):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={detrazioni}
              onChangeText={setDetrazioni}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        );
        
      case 'P.IVA Forfettario':
        return (
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Coefficiente di redditività (%):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={coefficienteRedditivita}
              onChangeText={setCoefficienteRedditivita}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Aliquota sostitutiva (%):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={aliquotaSostitutiva}
              onChangeText={setAliquotaSostitutiva}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Contributi INPS (%):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={contributiInps}
              onChangeText={setContributiInps}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        );
        
      case 'P.IVA Ordinario':
        return (
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Addizionale regionale (%):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={addizionaleRegionale}
              onChangeText={setAddizionaleRegionale}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Addizionale comunale (%):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={addizionaleComunale}
              onChangeText={setAddizionaleComunale}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Contributi INPS (%):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={contributiInps}
              onChangeText={setContributiInps}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        );
        
      default:
        return (
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Nessuna configurazione aggiuntiva richiesta per questo regime.
          </Text>
        );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Regime Fiscale */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Regime Fiscale</Text>
          {!editMode && (
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <Text style={[styles.editLink, { color: colors.primary }]}>Modifica</Text>
            </TouchableOpacity>
          )}
        </View>

        {editMode ? (
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Seleziona regime:</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <Picker
                selectedValue={regimeType}
                onValueChange={(value) => setRegimeType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Dipendente" value="Dipendente" />
                <Picker.Item label="P.IVA Forfettario" value="P.IVA Forfettario" />
                <Picker.Item label="P.IVA Ordinario" value="P.IVA Ordinario" />
                <Picker.Item label="Altro" value="Altro" />
              </Picker>
            </View>

            {renderSettingsForm()}

            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, { borderColor: colors.primary }]}
                onPress={() => setEditMode(false)}
              >
                <Text style={[styles.buttonTextSecondary, { color: colors.primary }]}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { backgroundColor: colors.primary }]}
                onPress={handleSaveSettings}
              >
                <Text style={styles.buttonText}>Salva</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.infoBox, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Regime attuale:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {userSettings?.regime_type || 'Non configurato'}
            </Text>
          </View>
        )}
      </View>

      {/* RAL Prevista */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>RAL Prevista Annuale</Text>
        
        <Text style={[styles.label, { color: colors.text }]}>Importo lordo annuale (€):</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={ralPrevista}
          onChangeText={setRalPrevista}
          keyboardType="numeric"
          placeholder="Es. 30000"
          placeholderTextColor={colors.textSecondary}
        />
        
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, styles.fullWidthButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveRal}
        >
          <Text style={styles.buttonText}>Salva RAL</Text>
        </TouchableOpacity>
      </View>

      {/* Stime Fiscali */}
      {stime && (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Stime Annuali</Text>
          
          <View style={[styles.statCard, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Imposte Totali</Text>
            <Text style={[styles.statValue, { color: colors.error }]}>
              €{stime.imposte.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Contributi INPS</Text>
            <Text style={[styles.statValue, { color: colors.error }]}>
              €{stime.contributiInps.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Netto Annuo Previsto</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              €{stime.netto.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* Accantonato */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Accantonato Anno Corrente</Text>
        
        <View style={[styles.accantonatoCard, { backgroundColor: colors.infoBackground }]}>
          <Text style={[styles.accantonatoLabel, { color: colors.text }]}>
            Importo già accantonato per tasse/contributi:
          </Text>
          <Text style={[styles.accantonatoValue, { color: colors.primary }]}>
            €{accantonato.toFixed(2)}
          </Text>
          <Text style={[styles.accantonatoHint, { color: colors.textSecondary }]}>
            💡 Calcolato dalla differenza tra entrate lorde e nette dell'anno corrente
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  editLink: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  infoBox: {
    padding: 15,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  fullWidthButton: {
    marginTop: 15,
  },
  buttonPrimary: {
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
  },
  statCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  accantonatoCard: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  accantonatoLabel: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  accantonatoValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accantonatoHint: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default FiscaleScreen;
