import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { addEntrata, getAllEntrate, deleteEntrata, updateEntrata, getUserSettings } from '../database/database';
import { calcolaNettoEntrata } from '../utils/fiscalCalculations';
import { useApp } from '../context/AppContext';

const EntrateScreen = () => {
  const { colors, t } = useApp();
  const [entrate, setEntrate] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [tipo, setTipo] = useState('Stipendio');
  const [importoLordo, setImportoLordo] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntrata, setEditingEntrata] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const settings = await getUserSettings();
      setUserSettings(settings);
      const data = await getAllEntrate();
      setEntrate(data);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare le entrate');
    }
  };

  const handleAddOrUpdateEntrata = async () => {
    if (!importoLordo.trim()) {
      Alert.alert('Attenzione', 'Inserisci l\'importo lordo');
      return;
    }

    const importoLordoNum = parseFloat(importoLordo);
    if (isNaN(importoLordoNum) || importoLordoNum <= 0) {
      Alert.alert('Attenzione', 'Inserisci un importo valido');
      return;
    }

    try {
      const importoNetto = calcolaNettoEntrata(importoLordoNum, tipo, userSettings);
      
      const entrataData = {
        tipo,
        importo_lordo: importoLordoNum,
        importo_netto: importoNetto,
        descrizione: descrizione.trim(),
        data: new Date().toISOString().split('T')[0],
      };

      if (editingEntrata) {
        await updateEntrata(editingEntrata.id, entrataData);
        Alert.alert('Successo', 'Entrata aggiornata con successo');
      } else {
        await addEntrata(entrataData);
        Alert.alert('Successo', 'Entrata aggiunta con successo');
      }

      setTipo('Stipendio');
      setImportoLordo('');
      setDescrizione('');
      setModalVisible(false);
      setEditingEntrata(null);
      loadData();
    } catch (error) {
      Alert.alert('Errore', 'Impossibile salvare l\'entrata');
    }
  };

  const handleDeleteEntrata = (id) => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questa entrata?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntrata(id);
              loadData();
              Alert.alert('Successo', 'Entrata eliminata');
            } catch (error) {
              Alert.alert('Errore', 'Impossibile eliminare l\'entrata');
            }
          },
        },
      ]
    );
  };

  const handleEditEntrata = (entrata) => {
    setEditingEntrata(entrata);
    setTipo(entrata.tipo);
    setImportoLordo(entrata.importo_lordo.toString());
    setDescrizione(entrata.descrizione || '');
    setModalVisible(true);
  };

  const openModal = () => {
    setEditingEntrata(null);
    setTipo('Stipendio');
    setImportoLordo('');
    setDescrizione('');
    setModalVisible(true);
  };

  const renderEntrataItem = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }]}>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTipo, { color: colors.success, backgroundColor: colors.success + '20' }]}>{item.tipo}</Text>
          <Text style={[styles.itemData, { color: colors.textSecondary }]}>{formatDate(item.data)}</Text>
        </View>
        {item.descrizione ? (
          <Text style={[styles.itemDescrizione, { color: colors.text }]}>{item.descrizione}</Text>
        ) : null}
        <View style={styles.itemAmounts}>
          <Text style={[styles.itemLordo, { color: colors.textSecondary }]}>Lordo: €{item.importo_lordo.toFixed(2)}</Text>
          <Text style={[styles.itemNetto, { color: colors.success }]}>Netto: €{item.importo_netto.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditEntrata(item)}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteEntrata(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Entrate</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.success }]} onPress={openModal}>
          <Text style={styles.addButtonText}>+ Nuova Entrata</Text>
        </TouchableOpacity>
      </View>

      {entrate.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nessuna entrata registrata</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Tocca "Nuova Entrata" per iniziare
          </Text>
        </View>
      ) : (
        <FlatList
          data={entrate}
          renderItem={renderEntrataItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingEntrata ? 'Modifica Entrata' : 'Nuova Entrata'}
            </Text>

            <Text style={[styles.label, { color: colors.text }]}>Tipo:</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <Picker
                selectedValue={tipo}
                onValueChange={(value) => setTipo(value)}
                style={styles.picker}
              >
                <Picker.Item label="Stipendio" value="Stipendio" />
                <Picker.Item label="Altro" value="Altro" />
              </Picker>
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Importo Lordo (€):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={importoLordo}
              onChangeText={setImportoLordo}
              keyboardType="numeric"
              placeholder="0.00"
            />

            <Text style={[styles.label, { color: colors.text }]}>Descrizione (opzionale):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={descrizione}
              onChangeText={setDescrizione}
              placeholder="Es. Stipendio gennaio"
            />

            {tipo === 'Stipendio' && userSettings && (
              <View style={[styles.infoBox, { backgroundColor: colors.infoBackground }]}>
                <Text style={[styles.infoText, { color: colors.text }]}>
                  💡 Il netto sarà calcolato automaticamente in base al tuo regime fiscale ({userSettings.regime_type})
                </Text>
              </View>
            )}

            {tipo === 'Altro' && (
              <View style={[styles.infoBox, { backgroundColor: colors.infoBackground }]}>
                <Text style={[styles.infoText, { color: colors.text }]}>
                  💡 Per "Altro" non vengono applicati calcoli fiscali. Il netto sarà uguale al lordo.
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, { borderColor: colors.success }]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingEntrata(null);
                  setTipo('Stipendio');
                  setImportoLordo('');
                  setDescrizione('');
                }}
              >
                <Text style={[styles.buttonTextSecondary, { color: colors.success }]}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { backgroundColor: colors.success }]}
                onPress={handleAddOrUpdateEntrata}
              >
                <Text style={styles.buttonText}>
                  {editingEntrata ? 'Aggiorna' : 'Aggiungi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  list: {
    padding: 15,
  },
  itemCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTipo: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemData: {
    fontSize: 14,
  },
  itemDescrizione: {
    fontSize: 16,
    marginBottom: 8,
  },
  itemAmounts: {
    marginTop: 8,
  },
  itemLordo: {
    fontSize: 14,
    marginBottom: 2,
  },
  itemNetto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemActions: {
    justifyContent: 'center',
  },
  editButton: {
    padding: 5,
    marginBottom: 10,
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalButtons: {
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
});

export default EntrateScreen;
