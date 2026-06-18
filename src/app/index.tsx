// src/app/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { BentoCard } from '../components/BentoCard';
import { useAppStore } from '../store/appStore';
import { useSQLiteContext } from 'expo-sqlite';

export default function Home() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { credits, isReady, recentClients, loadClients, appId, redeemCode } = useAppStore();

  // Load clients immediately when the dashboard mounts
  useEffect(() => {
    loadClients(db);
  }, [db, loadClients]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.header}>Master Tailor</Text>
      </View>

      <View style={styles.bentoGrid}>
        
        {/* Top Row: System Status (Credits & Backup) */}
        <View style={styles.row}>
          <BentoCard style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Credits</Text>
            <Text style={styles.cardValue}>{isReady ? credits : '...'}</Text>
          </BentoCard>

          <BentoCard style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Cloud Backup</Text>
            <Text style={styles.cardSubtitle}>Not Synced</Text>
          </BentoCard>
        </View>

        {/* Middle Row: Primary Call to Action */}
        <TouchableOpacity 
          style={styles.fullWidthTouchable} 
          activeOpacity={0.8}
          onPress={() => router.push('/client-entry')}
        >
          <BentoCard style={[styles.card, styles.primaryCard]}>
            <Text style={styles.primaryCardTitle}>+ New Client</Text>
            <Text style={styles.primaryCardSubtitle}>Uses 1 Credit</Text>
          </BentoCard>
        </TouchableOpacity>

        {/* Bottom Row: Database Overview */}
        <BentoCard style={[styles.card, styles.fullCard]}>
          <Text style={styles.cardTitle}>Recent Clients</Text>
          {recentClients.length === 0 ? (
            <View style={styles.placeholderList}>
              <Text style={styles.placeholderText}>No clients yet. Add your first!</Text>
            </View>
          ) : (
            <View style={styles.clientList}>
              {recentClients.map((client) => (
                <View key={client.id} style={styles.clientRow}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientPhone}>{client.phone}</Text>
                </View>
              ))}
            </View>
          )}
        </BentoCard>

        {/* Settings/Recharge Tile */}
        <TouchableOpacity 
          style={styles.fullWidthTouchable} 
          activeOpacity={0.8}
          onPress={() => router.push('/add-credits')}
        >
          <BentoCard style={[styles.card, styles.fullCard, styles.rechargeCard]}>
            <Text style={styles.cardTitle}>Add Credits</Text>
            <Text style={styles.placeholderText}>Tap to enter recharge code...</Text>
          </BentoCard>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingTop: 80, // Safe area simulation
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  greeting: {
    ...theme.typography.title,
    color: theme.colors.textSecondary,
  },
  header: {
    ...theme.typography.header,
    color: theme.colors.text,
  },
  bentoGrid: {
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  card: {
    // Shared structural boundaries
  },
  halfCard: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  fullCard: {
    width: '100%',
    minHeight: 140,
  },
  fullWidthTouchable: {
    width: '100%',
  },
  primaryCard: {
    width: '100%',
    minHeight: 120,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rechargeCard: {
    minHeight: 100,
    justifyContent: 'center',
  },
  cardTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  cardValue: {
    ...theme.typography.header,
    color: theme.colors.text,
  },
  cardSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  primaryCardTitle: {
    ...theme.typography.header,
    color: '#FFFFFF',
  },
  primaryCardSubtitle: {
    ...theme.typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: theme.spacing.xs,
  },
  placeholderList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  clientList: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  clientName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  clientPhone: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  }
});