import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Usar Constants.expoConfig.extra para ler do app.config.js
// Fallback para valores hardcoded caso extra não esteja disponível (OTA updates)
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://taslpepzarwlsivawmfb.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc2xwZXB6YXJ3bHNpdmF3bWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzU5NDgsImV4cCI6MjA3Njc1MTk0OH0.CrFAXNnL-2bMvhIQu_pTtvohJC4a5w6DI4iFoOvnzUM';

console.log('🔧 Inicializando Supabase...');
console.log('URL:', supabaseUrl ? '✅' : '❌');
console.log('Key:', supabaseAnonKey ? '✅' : '❌');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase inicializado com sucesso');