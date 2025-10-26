import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const OnboardingScreen = ({ navigation, onComplete }) => {
  const [step, setStep] = useState(1);
  const [regimeType, setRegimeType] = useState('Dipendente');
  
  // Dipendente
  const [irpefAliquota, setIrpefAliquota] = useState('23');
  const [detrazioni, setDetrazioni] = useState('0');
  
  // P.IVA Forfettario
  const [coefficienteRedditivita, setCoefficienteRedditivita] = useState('78');
  const [aliquotaSostitutiva, setAliquotaSostitutiva] = useState('15');
  
  // P.IVA Ordinario
  const [addizionaleRegionale, setAddizionaleRegionale] = useState('1.23');
  const [addizionaleComunale, setAddizionaleComunale] = useState('0.8');
  const [contributiInps, setContributiInps] = useState('26.23');

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const settings = {
      regime_type: regimeType
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
        
      default:
        break;
    }

    onComplete(settings);
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Benvenuto!</Text>
      <Text style={styles.subtitle}>Configura il tuo regime fiscale</Text>
      
      <Text style={styles.label}>Seleziona il tuo regime:</Text>
      <View style={styles.pickerContainer}>
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
    </View>
  );

  const renderStep2 = () => {
    switch (regimeType) {
      case 'Dipendente':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Configurazione Dipendente</Text>
            
            <Text style={styles.label}>Aliquota IRPEF stimata (%):</Text>
            <TextInput
              style={styles.input}
              value={irpefAliquota}
              onChangeText={setIrpefAliquota}
              keyboardType="numeric"
              placeholder="23"
            />
            
            <Text style={styles.label}>Detrazioni annuali (€):</Text>
            <TextInput
              style={styles.input}
              value={detrazioni}
              onChangeText={setDetrazioni}
              keyboardType="numeric"
              placeholder="0"
            />
            
            <Text style={styles.hint}>
              💡 L'aliquota IRPEF media dipende dal tuo reddito. Le detrazioni includono quelle da lavoro dipendente.
            </Text>
          </View>
        );
        
      case 'P.IVA Forfettario':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Configurazione P.IVA Forfettario</Text>
            
            <Text style={styles.label}>Coefficiente di redditività (%):</Text>
            <TextInput
              style={styles.input}
              value={coefficienteRedditivita}
              onChangeText={setCoefficienteRedditivita}
              keyboardType="numeric"
              placeholder="78"
            />
            
            <Text style={styles.label}>Aliquota sostitutiva (%):</Text>
            <TextInput
              style={styles.input}
              value={aliquotaSostitutiva}
              onChangeText={setAliquotaSostitutiva}
              keyboardType="numeric"
              placeholder="15"
            />
            
            <Text style={styles.label}>Contributi INPS (%):</Text>
            <TextInput
              style={styles.input}
              value={contributiInps}
              onChangeText={setContributiInps}
              keyboardType="numeric"
              placeholder="26.23"
            />
            
            <Text style={styles.hint}>
              💡 Il coefficiente varia per settore (78% servizi, 67% commercio, 86% professionisti). Aliquota: 5% primi 5 anni, 15% successivi.
            </Text>
          </View>
        );
        
      case 'P.IVA Ordinario':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Configurazione P.IVA Ordinario</Text>
            
            <Text style={styles.label}>Addizionale regionale (%):</Text>
            <TextInput
              style={styles.input}
              value={addizionaleRegionale}
              onChangeText={setAddizionaleRegionale}
              keyboardType="numeric"
              placeholder="1.23"
            />
            
            <Text style={styles.label}>Addizionale comunale (%):</Text>
            <TextInput
              style={styles.input}
              value={addizionaleComunale}
              onChangeText={setAddizionaleComunale}
              keyboardType="numeric"
              placeholder="0.8"
            />
            
            <Text style={styles.label}>Contributi INPS (%):</Text>
            <TextInput
              style={styles.input}
              value={contributiInps}
              onChangeText={setContributiInps}
              keyboardType="numeric"
              placeholder="26.23"
            />
            
            <Text style={styles.hint}>
              💡 Le addizionali variano per regione/comune. Gli scaglioni IRPEF 2024 sono già configurati.
            </Text>
          </View>
        );
        
      default:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Configurazione Altro</Text>
            <Text style={styles.subtitle}>
              Hai selezionato "Altro". Potrai comunque registrare entrate e spese.
              I calcoli fiscali automatici non saranno applicati.
            </Text>
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {step === 1 ? renderStep1() : renderStep2()}
        
        <View style={styles.buttonContainer}>
          {step === 2 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setStep(1)}
            >
              <Text style={styles.buttonTextSecondary}>Indietro</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {step === 1 ? 'Continua' : 'Completa'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  stepContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  hint: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
    backgroundColor: '#fff9e6',
    padding: 12,
    borderRadius: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
