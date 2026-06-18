// src/store/appStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { SQLiteDatabase } from 'expo-sqlite';

export interface Client {
  id: number;
  name: string;
  phone: string;
  measurements: string;
  created_at: number;
}

interface AppState {
  appId: string | null;
  credits: number;
  isReady: boolean;
  recentClients: Client[];
  initializeStore: () => Promise<void>;
  deductCredit: () => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  loadClients: (db: SQLiteDatabase) => Promise<void>;
  addClient: (db: SQLiteDatabase, name: string, phone: string, measurements: string) => Promise<boolean>;
  redeemCode: (db: SQLiteDatabase, code: string) => Promise<{ success: boolean; message: string }>;
}

export const useAppStore = create<AppState>((set, get) => ({
  appId: null,
  credits: 0,
  isReady: false,
  recentClients: [],

  initializeStore: async () => {
    try {
      let storedAppId = await SecureStore.getItemAsync('APP_ID');
      let storedCredits = await SecureStore.getItemAsync('CREDITS');

      // First app launch sequence
      if (!storedAppId) {
        // Generate exactly 6 random uppercase alphanumeric characters (e.g., A8F2K9)
        storedAppId = Math.random().toString(36).substring(2, 15).toUpperCase().substring(0, 6);
        await SecureStore.setItemAsync('APP_ID', storedAppId);
      }

      if (!storedCredits) {
        storedCredits = '10'; // 10 Free credits on install
        await SecureStore.setItemAsync('CREDITS', storedCredits);
      }

      set({ 
        appId: storedAppId, 
        credits: parseInt(storedCredits, 10),
        isReady: true 
      });
    } catch (error) {
      console.error('Failed to initialize secure store:', error);
      set({ isReady: true, credits: 0 }); 
    }
  },

  deductCredit: async () => {
    const currentCredits = get().credits;
    if (currentCredits <= 0) return false;
    
    const newCredits = currentCredits - 1;
    await SecureStore.setItemAsync('CREDITS', newCredits.toString());
    set({ credits: newCredits });
    return true;
  },

  addCredits: async (amount: number) => {
    const newCredits = get().credits + amount;
    await SecureStore.setItemAsync('CREDITS', newCredits.toString());
    set({ credits: newCredits });
  },

  loadClients: async (db: SQLiteDatabase) => {
    try {
      // We only fetch the 5 most recent for the dashboard to keep it fast
      const clients = await db.getAllAsync<Client>(
        'SELECT * FROM clients ORDER BY created_at DESC LIMIT 5'
      );
      set({ recentClients: clients });
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  },

  addClient: async (db: SQLiteDatabase, name: string, phone: string, measurements: string) => {
    const { deductCredit, loadClients } = get();
    
    // 1. Verify and deduct credit FIRST
    const success = await deductCredit();
    if (!success) {
      alert("Not enough credits!");
      return false;
    }

    try {
      // 2. Insert into local SQLite
      await db.runAsync(
        'INSERT INTO clients (name, phone, measurements) VALUES (?, ?, ?)',
        [name, phone, measurements]
      );
      
      // 3. Refresh the UI state
      await loadClients(db);
      return true;
    } catch (error) {
      console.error('Failed to insert client:', error);
      return false;
    }
  },

  redeemCode: async (db: SQLiteDatabase, code: string) => {
    const { appId, addCredits } = get();
    if (!appId) return { success: false, message: 'System error: App ID missing' };

    const cleanCode = code.trim().toUpperCase();
    
    // 1. Math Verification
    // Dynamically import the crypto logic to keep store lightweight
    const { validateRechargeCode } = require('../lib/crypto');
    const validation = validateRechargeCode(appId, cleanCode);

    if (!validation.isValid || !validation.credits) {
      return { success: false, message: validation.error || 'Invalid code' };
    }

    try {
      // 2. Database Replay Check (Has it been used?)
      const existing = await db.getFirstAsync('SELECT code FROM used_codes WHERE code = ?', [cleanCode]);
      if (existing) {
        return { success: false, message: 'This code has already been used.' };
      }

      // 3. Mark as used
      await db.runAsync('INSERT INTO used_codes (code) VALUES (?)', [cleanCode]);

      // 4. Award Credits
      await addCredits(validation.credits);

      return { success: true, message: `Successfully added ${validation.credits} credits!` };
    } catch (error) {
      console.error('Database error during redemption:', error);
      return { success: false, message: 'Database error occurred.' };
    }
  }
}));