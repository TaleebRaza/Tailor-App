// src/app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '../database';
import { useAppStore } from '../store/appStore';

export default function RootLayout() {
  const initializeStore = useAppStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    // This provider creates "tailordb.db" locally and runs our initialization script
    <SQLiteProvider databaseName="tailordb.db" onInit={initializeDatabase}>
      <Stack 
        screenOptions={{ 
          headerShown: false, // We hide the native header to keep our Apple Bento UI clean
          animation: 'fade',
        }} 
      />
    </SQLiteProvider>
  );
}