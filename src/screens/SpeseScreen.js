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
import { useFocusEffect } from '@react-navigation/native';
import { addSpesa, getAllSpese, deleteSpesa, updateSpesa } from '../database/database';
import { useApp } from '../context/AppContext';

const SpeseScreen = () => {
  const { colors } = useApp();
  const [spese, setSpese] = useState([]);
  const [descrizione, setDescrizione] = useState('');
  const [importo, setImporto] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSpesa, setEditingSpesa] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadSpese();
    }, [])
  );

  const loadSpese = async () => {
    try {
      const data = await getAllSpese();
      setSpese(data);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare le spese');
    }
  };

  const handleAddOrUpdateSpesa = async () => {
    if (!descrizione.trim() || !importo.trim()) {
      Alert.alert('Attenzione', 'Inserisci descrizione e importo');
      return;
    }

    const importoNum = parseFloat(importo);
    if (isNaN(importoNum) || importoNum <= 0) {
      Alert.alert('Attenzione', 'Inserisci un importo valido');
      return;
    }

    try {
      const spesaData = {
        descrizione: descrizione.trim(),
        importo: importoNum,
        data: new Date().toISOString().split('T')[0],
      };

      if (editingSpesa) {
        await updateSpesa(editingSpesa.id, spesaData);
        Alert.alert('Successo', 'Spesa aggiornata con successo');
      } else {
        await addSpesa(spesaData);
        Alert.alert('Successo', 'Spesa aggiunta con successo');
      }

      setDescrizione('');
      setImporto('');
      setModalVisible(false);
      setEditingSpesa(null);
      loadSpese();
    } catch (error) {
      Alert.alert('Errore', 'Impossibile salvare la spesa');
    }
  };

  const handleDeleteSpesa = (id) => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questa spesa?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSpesa(id);
              loadSpese();
              Alert.alert('Successo', 'Spesa eliminata');
            } catch (error) {
              Alert.alert('Errore', 'Impossibile eliminare la spesa');
            }
          },
        },
      ]
    );
  };

  const handleEditSpesa = (spesa) => {
    setEditingSpesa(spesa);
    setDescrizione(spesa.descrizione);
    setImporto(spesa.importo.toString());
    setModalVisible(true);
  };

  const openModal = () => {
    setEditingSpesa(null);
    setDescrizione('');
    setImporto('');
    setModalVisible(true);
  };

  const renderSpesaItem = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }]}>
      <View style={styles.itemContent}>
        <Text style={[styles.itemDescrizione, { color: colors.text }]}>{item.descrizione}</Text>
        <Text style={[styles.itemData, { color: colors.textSecondary }]}>{formatDate(item.data)}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemImporto, { color: colors.error }]}>-€{item.importo.toFixed(2)}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditSpesa(item)}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteSpesa(item.id)}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Spese</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.error }]} onPress={openModal}>
          <Text style={styles.addButtonText}>+ Nuova Spesa</Text>
        </TouchableOpacity>
      </View>

      {spese.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nessuna spesa registrata</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Tocca "Nuova Spesa" per iniziare
          </Text>
        </View>
      ) : (
        <FlatList
          data={spese}
          renderItem={renderSpesaItem}
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
              {editingSpesa ? 'Modifica Spesa' : 'Nuova Spesa'}
            </Text>

            <Text style={[styles.label, { color: colors.text }]}>Descrizione:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={descrizione}
              onChangeText={setDescrizione}
              placeholder="Es. Spesa supermercato"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.label, { color: colors.text }]}>Importo (€):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={importo}
              onChangeText={setImporto}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, { borderColor: colors.error }]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingSpesa(null);
                  setDescrizione('');
                  setImporto('');
                }}
              >
                <Text style={[styles.buttonTextSecondary, { color: colors.error }]}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { backgroundColor: colors.error }]}
                onPress={handleAddOrUpdateSpesa}
              >
                <Text style={styles.buttonText}>
                  {editingSpesa ? 'Aggiorna' : 'Aggiungi'}
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemDescrizione: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemData: {
    fontSize: 14,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemImporto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
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

export default SpeseScreen;
