import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkouts } from '@/hooks/use-workouts';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { workouts } = useWorkouts();
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

  const userName = email ? email.split('@')[0] : 'João da Silva';
  const userInitials = userName.substring(0, 2).toUpperCase();
  const memberSince = 'Janeiro 2024';

  const stats = {
    workouts: workouts.length,
    streak: 7,
    goals: 3,
  };

  const achievements = [
    { icon: 'trophy', label: '10 Treinos', color: colors.orange, locked: false },
    { icon: 'trophy', label: '7 Dias', color: colors.orange, locked: false },
    { icon: 'trophy', label: '30 Treinos', color: colors.pink, locked: false },
    { icon: 'trophy', label: '50 Treinos', color: colors.icon, locked: true },
  ];

  const goals = [
    { icon: 'target', label: 'Treinar 3x por semana', progress: 3, total: 5, color: colors.orange },
    { icon: 'chart.bar.fill', label: 'Supino 100kg', progress: 75, total: 100, color: colors.blue },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: colors.backgroundCard }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <ThemedText style={styles.avatarText}>{userInitials}</ThemedText>
          </View>
          <ThemedText style={styles.userName}>{userName}</ThemedText>
          <ThemedText style={[styles.memberSince, { color: colors.textSecondary }]}>
            Membro desde {memberSince}
          </ThemedText>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.workouts}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                Treinos
              </ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.streak}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                Sequência
              </ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.goals}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                Metas
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Conquistas</ThemedText>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View 
                key={index}
                style={[
                  styles.achievementCard,
                  { backgroundColor: achievement.locked ? colors.backgroundCardLight : colors.backgroundCard }
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.color + (achievement.locked ? '40' : '20') }
                ]}>
                  <IconSymbol
                    size={24}
                    name={achievement.icon as any}
                    color={achievement.locked ? colors.icon : achievement.color}
                  />
                </View>
                <ThemedText style={[
                  styles.achievementLabel,
                  achievement.locked && { opacity: 0.5 }
                ]}>
                  {achievement.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Metas Atuais</ThemedText>
          {goals.map((goal, index) => (
            <View key={index} style={[styles.goalCard, { backgroundColor: colors.backgroundCard }]}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                  <IconSymbol size={20} name={goal.icon as any} color={goal.color} />
                </View>
                <ThemedText style={styles.goalLabel}>{goal.label}</ThemedText>
              </View>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.backgroundCardLight }]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        backgroundColor: goal.color,
                        width: `${(goal.progress / goal.total) * 100}%`
                      }
                    ]}
                  />
                </View>
                <ThemedText style={[styles.progressText, { color: colors.textSecondary }]}>
                  {goal.progress}/{goal.total}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error },
            loading && styles.buttonDisabled
          ]}
          onPress={handleSignOut}
          disabled={loading}
        >
          <IconSymbol size={24} name="arrow.right.square" color="#fff" />
          <ThemedText style={styles.logoutButtonText}>
            {loading ? 'Saindo...' : 'Sair da Conta'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    opacity: 0.2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  achievementLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  goalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
  },
  logoutButton: {
    borderRadius: 12,
    padding: 16,
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
