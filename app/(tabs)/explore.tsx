import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setEmail(user.email);
    }
  }

  async function handleSignOut() {
    Alert.alert(
      'Sair da Conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert('Erro', error.message);
              setLoading(false);
            } else {
              router.replace('/login');
            }
          }
        }
      ]
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Perfil</ThemedText>
      </View>

      <View style={styles.content}>
        {/* Card de Informações do Usuário */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.icon }]}>
          <View style={styles.iconContainer}>
            <IconSymbol size={60} name="person.fill" color={colors.tint} />
          </View>
          <ThemedText style={styles.email}>{email || 'Carregando...'}</ThemedText>
        </View>

        {/* Card de Estatísticas */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.icon }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Informações</ThemedText>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Versão do App</ThemedText>
            <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <IconSymbol 
                size={20} 
                name={colorScheme === 'dark' ? 'moon.fill' : 'sun.max.fill'} 
                color={colors.text} 
              />
              <ThemedText style={styles.infoLabel}>Tema</ThemedText>
            </View>
            <ThemedText style={styles.infoValue}>
              {colorScheme === 'dark' ? 'Escuro' : 'Claro'}
            </ThemedText>
          </View>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity 
          style={[styles.logoutButton, loading && styles.buttonDisabled]}
          onPress={handleSignOut}
          disabled={loading}
        >
          <IconSymbol size={24} name="arrow.right.square" color="#fff" />
          <ThemedText style={styles.logoutButtonText}>
            {loading ? 'Saindo...' : 'Sair da Conta'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
