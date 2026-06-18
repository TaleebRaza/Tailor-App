// src/components/BentoCard.tsx
import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';

interface BentoCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function BentoCard({ children, style }: BentoCardProps) {
  // Graceful degradation: budget Androids struggle with live blurs.
  // We return a solid, slightly elevated card for maximum performance.
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.androidCard, style]}>
        {children}
      </View>
    );
  }

  // iOS handles blurs flawlessly at the hardware level.
  return (
    <BlurView intensity={80} tint="light" style={[styles.iosCard, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  androidCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    elevation: 2, // Soft native Android shadow
  },
  iosCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  }
});