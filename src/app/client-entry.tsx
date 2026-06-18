// src/app/client-entry.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '../store/appStore';
import { theme } from '../theme/theme';
import { MeasurementInput } from '../components/MeasurementInput';
import { MeasurementKeyboard } from '../components/MeasurementKeyboard';

type MeasurementKeys = 'length' | 'chest' | 'waist';

export default function ClientEntry() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { addClient, credits } = useAppStore();

  // Standard Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Measurements State
  const [measurements, setMeasurements] = useState({
    length: '',
    chest: '',
    waist: ''
  });

  // Tracks which custom input is active to route keyboard presses
  const [focusedField, setFocusedField] = useState<MeasurementKeys | null>(null);

  const handleFocusStandardInput = () => {
    // Hide our custom keyboard if they tap standard inputs
    setFocusedField(null); 
  };

  const handleFocusMeasurement = (field: MeasurementKeys) => {
    // Hide system keyboard, show our custom one
    Keyboard.dismiss(); 
    setFocusedField(field);
  };

  const handleKeyboardPress = (key: string) => {
    if (!focusedField) return;
    setMeasurements(prev => ({
      ...prev,
      [focusedField]: prev[focusedField] + key
    }));
  };

  const handleKeyboardDelete = () => {
    if (!focusedField) return;
    setMeasurements(prev => ({
      ...prev,
      [focusedField]: prev[focusedField].slice(0, -1)
    }));
  };

  const handleKeyboardNext = () => {
    if (focusedField === 'length') setFocusedField('chest');
    else if (focusedField === 'chest') setFocusedField('waist');
    else setFocusedField(null); // Close keyboard on last field
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a client name.");
      return;
    }

    const payload = JSON.stringify(measurements);
    const success = await addClient(db, name, phone, payload);
    
    if (success) {
      router.back(); // Return to dashboard instantly
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Client</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.headerButton}
          disabled={credits <= 0 || !name.trim()}
        >
          <Text style={[styles.saveText, (!name.trim() || credits <= 0) && styles.disabledText]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Standard Inputs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Details</Text>
          <TextInput
            style={styles.standardInput}
            placeholder="Client Name *"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            onFocus={handleFocusStandardInput}
          />
          <TextInput
            style={styles.standardInput}
            placeholder="Phone Number (Optional)"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            onFocus={handleFocusStandardInput}
          />
        </View>

        {/* Measurements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurements</Text>
          <View style={styles.measurementGrid}>
            <MeasurementInput
              label="Length"
              value={measurements.length}
              isFocused={focusedField === 'length'}
              onFocus={() => handleFocusMeasurement('length')}
            />
            <View style={{ width: theme.spacing.md }} />
            <MeasurementInput
              label="Chest"
              value={measurements.chest}
              isFocused={focusedField === 'chest'}
              onFocus={() => handleFocusMeasurement('chest')}
            />
          </View>
          <View style={styles.measurementGrid}>
            <MeasurementInput
              label="Waist"
              value={measurements.waist}
              isFocused={focusedField === 'waist'}
              onFocus={() => handleFocusMeasurement('waist')}
            />
             <View style={{ width: theme.spacing.md, flex: 1 }} />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Custom Keyboard Overlay */}
      {focusedField && (
        <View style={styles.keyboardWrapper}>
          <View style={styles.keyboardHeader}>
            <Text style={styles.keyboardHeaderText}>Entering: {focusedField.toUpperCase()}</Text>
            <TouchableOpacity onPress={() => setFocusedField(null)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          <MeasurementKeyboard
            onKeyPress={handleKeyboardPress}
            onDelete={handleKeyboardDelete}
            onNext={handleKeyboardNext}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60, // Safe area
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    minWidth: 60,
  },
  cancelText: {
    ...theme.typography.body,
    color: theme.colors.danger,
  },
  saveText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  disabledText: {
    opacity: 0.5,
  },
  headerTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 300, // Space for the custom keyboard
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    paddingLeft: theme.spacing.xs,
  },
  standardInput: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.typography.body,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  measurementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyboardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#D1D5DB',
    borderTopWidth: 1,
    borderTopColor: '#A3B1C6',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  keyboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
    backgroundColor: '#E5E5EA',
  },
  keyboardHeaderText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  doneText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '700',
  }
});