// src/components/MeasurementInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

interface MeasurementInputProps {
  label: string;
  value: string;
  isFocused: boolean;
  onFocus: () => void;
}

export function MeasurementInput({ label, value, isFocused, onFocus }: MeasurementInputProps) {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onFocus} style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, isFocused && styles.focusedContainer]}>
        {/* We use a TextInput but disable the soft keyboard to use our custom one */}
        <TextInput
          style={styles.input}
          value={value}
          showSoftInputOnFocus={false}
          editable={false} // Prevents native cursor selection issues on some Androids
          placeholder="0"
          placeholderTextColor={theme.colors.textSecondary}
        />
        {/* Blinking cursor simulation when focused */}
        {isFocused && <View style={styles.cursor} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    flex: 1,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
  },
  focusedContainer: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFFFFF', // Brighter white when focused
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontSize: 18,
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.primary,
    marginLeft: 2,
  }
});