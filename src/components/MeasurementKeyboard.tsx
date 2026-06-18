// src/components/MeasurementKeyboard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme/theme';

interface MeasurementKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onNext: () => void;
}

const KEYS = [
  ['1', '2', '3', '¼'],
  ['4', '5', '6', '½'],
  ['7', '8', '9', '¾'],
  ['.', '0', '⌫', 'NEXT']
];

export function MeasurementKeyboard({ onKeyPress, onDelete, onNext }: MeasurementKeyboardProps) {
  
  const handlePress = (key: string) => {
    if (key === '⌫') {
      onDelete();
    } else if (key === 'NEXT') {
      onNext();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <View style={styles.keyboardContainer}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            const isActionKey = key === '⌫' || key === 'NEXT';
            const isFraction = key === '¼' || key === '½' || key === '¾';
            
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  isActionKey && styles.actionKey,
                  key === 'NEXT' && styles.nextKey
                ]}
                activeOpacity={0.7}
                onPress={() => handlePress(key)}
              >
                <Text style={[
                  styles.keyText,
                  isFraction && styles.fractionText,
                  key === 'NEXT' && styles.nextKeyText
                ]}>
                  {key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    backgroundColor: '#D1D5DB', // Standard iOS keyboard background color
    paddingBottom: 20, // Bottom padding for device bezels
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  key: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 4,
    height: 55,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1, // Soft shadow for Android
    shadowColor: '#000', // Apple style shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  actionKey: {
    backgroundColor: '#A3B1C6',
  },
  nextKey: {
    backgroundColor: theme.colors.primary,
  },
  keyText: {
    ...theme.typography.title,
    fontSize: 24,
    color: theme.colors.text,
  },
  fractionText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  nextKeyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});