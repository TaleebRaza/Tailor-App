// src/app/add-credits.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useAppStore } from '../store/appStore';
import { theme } from '../theme/theme';
import { BentoCard } from '../components/BentoCard';

export default function AddCredits() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { redeemCode, appId } = useAppStore();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  
  // Secret admin state
  const [showAdminId, setShowAdminId] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setMessage(null);

    const result = await redeemCode(db, code);

    setLoading(false);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setCode('');
      // Auto-return to dashboard after a short delay on success
      setTimeout(() => router.back(), 2000);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Secret Admin Trigger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.cancelText}>Back</Text>
        </TouchableOpacity>
        
        {/* Long pressing the title for 2 seconds reveals the App ID */}
        <TouchableOpacity 
          activeOpacity={1} 
          delayLongPress={2000} 
          onLongPress={() => setShowAdminId(!showAdminId)}
        >
          <Text style={styles.headerTitle}>Add Credits</Text>
        </TouchableOpacity>
        
        <View style={styles.headerButton} /> 
      </View>

      <View style={styles.content}>
        <BentoCard style={styles.card}>
          <Text style={styles.instructions}>
            Enter the recharge code provided by your system administrator.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 50-X9AA4B2"
            placeholderTextColor={theme.colors.textSecondary}
            value={code}
            onChangeText={(text) => setCode(text.toUpperCase())}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={20}
          />

          {message && (
            <Text style={[styles.message, message.type === 'error' ? styles.errorText : styles.successText]}>
              {message.text}
            </Text>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, (!code.trim() || loading) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!code.trim() || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Redeem Code</Text>
            )}
          </TouchableOpacity>
        </BentoCard>

        {/* Hidden Admin Data */}
        {showAdminId && (
          <View style={styles.adminBox}>
            <Text style={styles.adminLabel}>ADMIN DIAGNOSTICS</Text>
            <Text style={styles.adminId}>{appId}</Text>
          </View>
        )}
      </View>
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
    paddingTop: 60,
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
    color: theme.colors.textSecondary,
  },
  headerTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  card: {
    width: '100%',
  },
  instructions: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.title,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: theme.spacing.lg,
  },
  message: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontWeight: '600',
  },
  errorText: {
    color: theme.colors.danger,
  },
  successText: {
    color: '#34C759', // Apple Success Green
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  adminBox: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: '#FFE5E5',
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  adminLabel: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  adminId: {
    ...theme.typography.code,
    color: theme.colors.text,
    fontSize: 16,
  }
});